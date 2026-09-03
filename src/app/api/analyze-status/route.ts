import { NextRequest, NextResponse } from "next/server";
import { getJob, cleanupOldJobs } from "@/lib/job-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Returns the status of a background analysis job.
 * Query param: ?jobId=xxx
 *
 * Response: { status: "processing" | "done" | "error", result?, error? }
 * The client polls this every few seconds until status is "done" or "error".
 */
export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get("jobId");
  if (!jobId) {
    return NextResponse.json(
      { error: "jobId parameter zaroori hai." },
      { status: 400 }
    );
  }

  cleanupOldJobs();
  const job = getJob(jobId);
  if (!job) {
    return NextResponse.json(
      {
        status: "error",
        error:
          "Job nahi mila. Ho sakta server restart hua ho ya time-out ho gaya ho. Dobara try karo.",
      },
      { status: 404 }
    );
  }

  // Return the job state. For "processing", include elapsed time so the
  // client can show how long it's been running.
  const elapsed =
    (job.finishedAt ?? Date.now()) - job.startedAt;

  return NextResponse.json({
    status: job.status,
    result: job.result,
    error: job.error,
    elapsedMs: elapsed,
  });
}
