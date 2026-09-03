import { NextRequest, NextResponse } from "next/server";
import { createJob } from "@/lib/job-store";

export const runtime = "nodejs";
export const maxDuration = 300;

interface ParsedBody {
  mode: string;
  image?: string;
  text?: string;
  file?: string;
  fileName?: string;
  language?: string;
}

/**
 * Starts a background analysis job. Returns { jobId } immediately so the
 * client can poll /api/analyze-status for the result.
 *
 * WHY: The ALB (Application Load Balancer) kills connections after ~60-120s
 * regardless of keep-alive events. Large PDF analyses take 1-3 min. By
 * returning immediately and running the analysis in the background, we avoid
 * any long-lived HTTP connection through the ALB.
 */
export async function POST(req: NextRequest) {
  let body: ParsedBody;
  try {
    body = (await req.json()) as ParsedBody;
  } catch {
    return NextResponse.json(
      { error: "Galat request format. JSON bhejo." },
      { status: 400 }
    );
  }

  // Generate a unique job ID.
  const jobId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  createJob(jobId);

  // Fire the analysis in the background (don't await). The result/error will
  // be stored in the job store when it completes. The promise runs as long as
  // the server process is alive (Node.js keeps unref'd promises running).
  void runAnalysis(jobId, body).catch((e) => {
    console.error(`Job ${jobId} unhandled error:`, e);
  });

  return NextResponse.json({ jobId });
}

// The actual analysis runs here in the background, calling the existing
// /api/analyze route internally (localhost, no ALB timeout).
async function runAnalysis(jobId: string, body: ParsedBody): Promise<void> {
  const { jobStore } = await import("@/lib/job-store");
  const job = jobStore.get(jobId);
  if (!job) return;

  try {
    // Use AbortSignal.timeout to allow up to 10 minutes for the analysis.
    // Node's default Undici headers timeout (~300s) was killing long analyses.
    const internalRes = await fetch("http://localhost:3000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // 10 minutes — large PDFs with retries can take 5-8 min.
      signal: AbortSignal.timeout(10 * 60 * 1000),
    });

    const contentType = internalRes.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await internalRes.json();
      if (!internalRes.ok) {
        job.status = "error";
        job.error =
          (data as { error?: string })?.error ||
          "Analysis me dikkat aayi. Dobara try karo.";
      } else {
        job.status = "done";
        job.result = data;
      }
    } else {
      const text = await internalRes.text();
      console.error(
        `Job ${jobId} internal call non-JSON:`,
        internalRes.status,
        text.slice(0, 200)
      );
      job.status = "error";
      job.error =
        internalRes.status === 429
          ? "AI service par bahut zyada load hai. 1-2 minute ruk kar dobara try karo."
          : "Server se sahi response nahi aaya. Thodi der baad dobara try karo.";
    }
  } catch (e) {
    console.error(`Job ${jobId} analysis error:`, e);
    const msg = (e as Error)?.message ?? "";
    const cause = (e as { cause?: { message?: string } })?.cause?.message ?? "";
    const fullMsg = `${msg} ${cause}`.toLowerCase();
    const isRateLimit =
      msg.includes("429") || fullMsg.includes("too many requests");
    const isTimeout =
      fullMsg.includes("timeout") ||
      fullMsg.includes("aborted") ||
      fullMsg.includes("headers timeout");
    job.status = "error";
    job.error = isRateLimit
      ? "AI service par bahut zyada load hai. 1-2 minute ruk kar dobara try karo."
      : isTimeout
        ? "Analysis bahut der le gayi (timeout). Badi PDF me 5-10 minute lag sakte hain. Dobara try karo ya chhoti file upload karo."
        : "Network error. Thodi der baad dobara try karo.";
  } finally {
    job.finishedAt = Date.now();
  }
}
