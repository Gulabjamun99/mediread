import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import {
  AnalysisMode,
  AnalysisResult,
  buildPrompt,
  buildChunkPrompt,
  buildSummaryPrompt,
  buildSingleDocPrompt,
  extractJson,
  recoverFromTruncated,
  chunkText,
  getDisclaimer,
  isLanguageCode,
  detectCriticalValues,
} from "@/lib/medical";
import { extractDocument, parseDataUrl } from "@/lib/file-extract";

export const runtime = "nodejs";
// Document analysis does multiple LLM calls (chunk + merge); allow up to ~5 min.
export const maxDuration = 300;

interface ParsedBody {
  mode: AnalysisMode;
  image?: string; // data URL (data:image/...;base64,...)
  text?: string;
  file?: string; // data URL (data:application/pdf;base64,... or ...wordprocessingml...;base64,...)
  fileName?: string;
  language?: string;
}

const VALID_MODES: AnalysisMode[] = [
  "test-report",
  "doctor-slip",
  "xray",
  "text",
  "document",
];

// Chars of extracted text below which we treat a DOC as "single call".
// Single-call is PREFERRED — it's 1 LLM call vs many chunk calls, so it
// triggers rate limits far less. With the recovery parser (salvages findings
// from truncated output) + smart summary call, single-call handles most
// reports reliably. Only very large reports (40+ pages) go through chunking.
const DOC_SINGLE_CALL_THRESHOLD = 20000;

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

  const { mode, image, text, file } = body;
  const lang = isLanguageCode(body.language) ? body.language : "hinglish";

  if (!mode || !VALID_MODES.includes(mode)) {
    return NextResponse.json(
      { error: "Mode galat hai. Valid modes: " + VALID_MODES.join(", ") },
      { status: 400 }
    );
  }

  // Document mode = PDF/DOCX upload.
  if (mode === "document") {
    return handleDocument(body);
  }

  // Image mode (test-report / doctor-slip / xray with an image) vs text mode.
  const hasFile = Boolean(file && file.startsWith("data:"));
  const isImageMode = mode !== "text";

  if (isImageMode && hasFile) {
    // A PDF/DOCX was uploaded under test-report or doctor-slip tab -> treat as
    // a document analysis but keep the mode for the right prompt shape.
    return handleDocument(body, mode);
  }

  if (isImageMode) {
    if (!image || !image.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Image upload zaroori hai is mode ke liye." },
        { status: 400 }
      );
    }
    if (image.length > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image bahut badi hai. Chhoti image upload karo." },
        { status: 413 }
      );
    }
  } else {
    if (!text || text.trim().length < 10) {
      return NextResponse.json(
        { error: "Kuch text daalo (kam se kam 10 akshar)." },
        { status: 400 }
      );
    }
  }

  let zai;
  try {
    zai = await ZAI.create();
  } catch (e) {
    console.error("SDK init fail", e);
    return NextResponse.json(
      { error: "AI service abhi available nahi hai. Thodi der baad try karo." },
      { status: 503 }
    );
  }

  const systemPrompt = buildPrompt(mode, { lang });

  try {
    let rawContent: string | undefined;

    if (isImageMode) {
      const userContent: object[] = [
        { type: "text", text: systemPrompt },
        { type: "image_url", image_url: { url: image } },
      ];

      const response = await withRetry(
        () =>
          zai.chat.completions.createVision({
            messages: [{ role: "user", content: userContent }],
            thinking: { type: "disabled" },
          }),
        "Image VLM"
      );
      rawContent = response.choices[0]?.message?.content;
    } else {
      const completion = await withRetry(
        () =>
          zai.chat.completions.create({
            messages: [
              { role: "assistant", content: systemPrompt },
              { role: "user", content: text as string },
            ],
            thinking: { type: "disabled" },
          }),
        "Text LLM"
      );
      rawContent = completion.choices[0]?.message?.content;
    }

    if (!rawContent) {
      return NextResponse.json(
        { error: "AI se koi jawab nahi mila. Dobara try karo." },
        { status: 502 }
      );
    }

    return finishResult(rawContent, mode, lang);
  } catch (e) {
    console.error("Analysis error", e);
    const errMsg = (e as Error)?.message ?? "";
    const isRateLimit =
      errMsg.includes("429") || errMsg.toLowerCase().includes("too many requests");
    return NextResponse.json(
      {
        error: isRateLimit
          ? "AI service par bahut zyada load hai (rate limit). 1-2 minute ruk kar dobara try karo."
          : "Analysis me dikkat aayi. Thodi der baad try karo ya chhoti image upload karo.",
      },
      { status: isRateLimit ? 429 : 500 }
    );
  }
}

// ---- Document (PDF/DOCX) analysis handler ----
// Strategy:
//  1. Extract text server-side (unpdf for PDF, mammoth for DOCX) — reads ALL
//     pages, no truncation, so 30-40 page reports are fully parsed.
//  2. If substantial text is found (text-based PDF/DOCX):
//       - small enough -> single LLM call with the full text
//       - large       -> chunk + parallel LLM calls + merge  (so no test is
//                        lost to output-token limits on very long reports)
//  3. If the PDF is scanned (almost no text), fall back to VLM file_url so the
//     model reads the image-based pages directly.
async function handleDocument(body: ParsedBody, mode: AnalysisMode = "document") {
  const { file } = body;
  const lang = isLanguageCode(body.language) ? body.language : "hinglish";
  if (!file || !file.startsWith("data:")) {
    return NextResponse.json(
      { error: "PDF/DOC file upload zaroori hai is mode ke liye." },
      { status: 400 }
    );
  }
  // ~80MB data URL guard (covers ~60MB raw file — large multi-page PDFs).
  if (file.length > 80 * 1024 * 1024) {
    return NextResponse.json(
      { error: "File bahut badi hai (60MB se kam rakho)." },
      { status: 413 }
    );
  }

  let mime: string;
  let buffer: Buffer;
  try {
    const parsed = parseDataUrl(file);
    mime = parsed.mime.toLowerCase();
    buffer = parsed.buffer;
  } catch {
    return NextResponse.json(
      { error: "File format galat hai. Dobara upload karo." },
      { status: 400 }
    );
  }

  const lowerName = (body.fileName ?? "").toLowerCase();
  const looksPdf =
    mime === "application/pdf" || lowerName.endsWith(".pdf");
  const looksDocx =
    mime.includes("wordprocessingml") ||
    mime.includes("msword") ||
    lowerName.endsWith(".docx") ||
    lowerName.endsWith(".doc");

  if (!looksPdf && !looksDocx) {
    return NextResponse.json(
      {
        error:
          "Sirf PDF aur DOCX files support hain. Image wale tab se photo upload karo.",
      },
      { status: 415 }
    );
  }

  let zai;
  try {
    zai = await ZAI.create();
  } catch (e) {
    console.error("SDK init fail", e);
    return NextResponse.json(
      { error: "AI service abhi available nahi hai. Thodi der baad try karo." },
      { status: 503 }
    );
  }

  try {
    // Extract text from the document (all pages).
    let doc;
    try {
      doc = await extractDocument(mime, buffer);
    } catch (e) {
      console.error("Document extract fail", e);
      return NextResponse.json(
        {
          error:
            "File padhi nahi ja payi. Ho sakta file damaged ya password-locked ho. Doosri file try karo.",
        },
        { status: 422 }
      );
    }

    // Scanned PDF: almost no machine text -> let the VLM read the file directly.
    if (doc.scanned && looksPdf) {
      return await analyzeScannedPdf(zai, file, doc.pages, mode, lang);
    }

    if (!doc.text || doc.text.trim().length < 30) {
      if (looksPdf) {
        // Last resort: try VLM on the original PDF.
        return await analyzeScannedPdf(zai, file, doc.pages, mode, lang);
      }
      return NextResponse.json(
        {
          error:
            "DOCX file me text nahi mila. Ho sakta file me sirf images hain. PDF format me convert karke dobara try karo.",
        },
        { status: 422 }
      );
    }

    // Text-based document. Small -> single call (with recovery fallback);
    // large -> chunk + smart merge.
    if (doc.text.length <= DOC_SINGLE_CALL_THRESHOLD) {
      const prompt = buildSingleDocPrompt(lang);
      const completion = await withRetry(
        () =>
          zai.chat.completions.create({
            messages: [
              { role: "assistant", content: prompt },
              {
                role: "user",
                content:
                  `--- EXTRACTED DOCUMENT TEXT (${doc.pages} pages, ${doc.kind.toUpperCase()}) ---\n\n` +
                  doc.text,
              },
            ],
            thinking: { type: "disabled" },
          }),
        "Single-doc LLM"
      );
      const raw = completion.choices[0]?.message?.content ?? "";
      // Try a clean parse first.
      try {
        extractJson(raw);
        return finishResult(raw, mode, lang);
      } catch {
        // Truncated output. Try to RECOVER complete findings/conditions from
        // the partial JSON before falling back to chunking.
        const recovered = recoverFromTruncated(raw);
        if (
          recovered.findings.length > 0 ||
          recovered.medicines.length > 0 ||
          recovered.observations.length > 0
        ) {
          console.warn(
            `Single-call truncated; recovered ${recovered.findings.length} findings, ${recovered.medicines.length} medicines from partial JSON`
          );
          return await finishRecovered(zai, recovered, mode, doc, lang);
        }
        console.warn(
          "Single-call recovery found nothing -> falling back to chunk + smart merge"
        );
      }
    }

    // Large document (or single-call fallback): chunk -> throttled partial
    // analysis -> smart merge. Chunks ~5000 chars = ~20-25 tests each
    // (fewer chunks = fewer LLM calls = less rate-limit pressure). Runs
    // SEQUENTIALLY (concurrency 1) with rate-limit bail-out: if 3 consecutive
    // chunks fail with 429, we stop and return a clear error instead of
    // churning for minutes.
    const chunks = chunkText(doc.text, 5000, 400);
    const chunkPrompt = buildChunkPrompt(lang);
    let totalFindings = 0;
    let consecutiveFailures = 0;
    let bailedForRateLimit = false;
    const partials = await mapWithConcurrencyLimit(
      chunks,
      1, // sequential — parallel chunks were causing 429 rate-limit storms
      async (chunk, i) => {
        // If we've already bailed due to rate-limit, skip remaining chunks.
        if (bailedForRateLimit) {
          return { findings: [], testsSuggested: [] } as Record<string, unknown>;
        }
        try {
          const completion = await withRetry(
            () =>
              zai.chat.completions.create({
                messages: [
                  { role: "assistant", content: chunkPrompt },
                  {
                    role: "user",
                    content: `--- CHUNK ${i + 1}/${chunks.length} ---\n\n${chunk}`,
                  },
                ],
                thinking: { type: "disabled" },
              }),
            `Chunk ${i + 1}/${chunks.length}`,
            3
          );
          consecutiveFailures = 0; // reset on success
          const raw = completion.choices[0]?.message?.content ?? "";
          try {
            const parsed = extractJson(raw) as Record<string, unknown>;
            const fc = arr(parsed.findings).length;
            totalFindings += fc;
            console.log(
              `Chunk ${i + 1}/${chunks.length}: OK (${fc} findings)`
            );
            return parsed;
          } catch {
            console.warn(
              `Chunk ${i + 1}/${chunks.length}: JSON parse fail`
            );
            return {
              findings: [],
              testsSuggested: [],
            } as Record<string, unknown>;
          }
        } catch (e) {
          const msg = (e as Error)?.message ?? "";
          const isRateLimit =
            msg.includes("429") || msg.toLowerCase().includes("too many requests");
          if (isRateLimit) {
            consecutiveFailures++;
            console.error(
              `Chunk ${i + 1}/${chunks.length} failed (429). Consecutive failures: ${consecutiveFailures}`
            );
            if (consecutiveFailures >= 3) {
              // Bail out — the API is overwhelmed. Don't churn for minutes.
              bailedForRateLimit = true;
              console.error(
                `Bailing out of chunk processing after ${consecutiveFailures} consecutive 429 failures.`
              );
            }
          } else {
            console.error(
              `Chunk ${i + 1}/${chunks.length} failed after retries:`,
              msg.slice(0, 120)
            );
          }
          return {
            findings: [],
            testsSuggested: [],
          } as Record<string, unknown>;
        }
      }
    );
    console.log(
      `Doc chunking done: ${chunks.length} chunks, ${totalFindings} total findings extracted${bailedForRateLimit ? " (BAILED for rate-limit)" : ""}`
    );

    // If we bailed due to rate-limit and got no findings, return a clear error.
    if (bailedForRateLimit && totalFindings === 0) {
      return NextResponse.json(
        {
          error:
            "AI service par bahut zyada load hai (rate limit). 2-3 minute ruk kar dobara try karo. Badi PDF me thodi der lag sakti hai.",
        },
        { status: 429 }
      );
    }

    // Merge strategy for large documents:
    //  1. Code-based dedupe of all findings/conditions/tests (no output-token
    //     limit, so NO test is ever lost to truncation).
    //  2. One SMALL LLM "summary" call that receives only compact finding
    //     names+statuses (not full explanations) -> generates reportType,
    //     summary, overallStatus, nextSteps, warning. Small output = no
    //     truncation. If this call fails, fall back to a code-generated summary.
    return await smartMerge(zai, partials, mode, doc, lang);
  } catch (e) {
    console.error("Document analysis error", e);
    const msg = (e as Error)?.message ?? "";
    const isRateLimit =
      msg.includes("429") || msg.toLowerCase().includes("too many requests");
    return NextResponse.json(
      {
        error: isRateLimit
          ? "AI service par bahut zyada load hai (rate limit). 1-2 minute ruk kar dobara try karo."
          : "Document analyze nahi ho paya. Thodi der baad try karo ya doosri file upload karo.",
      },
      { status: isRateLimit ? 429 : 500 }
    );
  }
}

// Scanned/image PDF: pass the original file to the VLM via file_url.
async function analyzeScannedPdf(
  zai: Awaited<ReturnType<typeof ZAI.create>>,
  dataUrl: string,
  pages: number,
  mode: AnalysisMode,
  lang: string = "hinglish"
) {
  let raw = "";
  let lastErr: unknown = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await withRetry(
        () =>
          zai.chat.completions.createVision({
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text:
                      buildPrompt(mode, {
                        isFile: true,
                        fileType: "pdf",
                        pages,
                        lang,
                      }) +
                      `\n\nYe ek SCANNED PDF hai jisme ${pages} pages hain. HAR ek test/parameter ko pakdo - koi na chhoote. Value, unit aur range EXACT uthao jaisa PDF me likha hai.`,
                  },
                  { type: "file_url", file_url: { url: dataUrl } },
                ],
              },
            ],
            thinking: { type: "disabled" },
          }),
        `Scanned PDF VLM`,
        3
      );
      raw = response.choices[0]?.message?.content ?? "";
      if (raw) break;
    } catch (e) {
      lastErr = e;
      console.error(`Scanned PDF VLM attempt ${attempt} fail`, e);
      if (attempt < 2) await new Promise((r) => setTimeout(r, 1500));
    }
  }

  if (!raw) {
    console.error("Scanned PDF VLM all attempts failed", lastErr);
    return NextResponse.json(
      {
        error:
          "Scanned PDF analyze nahi ho payi. AI service me transient dikkat aayi. Thodi der baad try karo.",
      },
      { status: 502 }
    );
  }
  return finishResult(raw, mode, lang);
}

// Build the final result from recovered (salvaged) findings + a small summary
// LLM call. Used when the single-call output truncated but still contains
// many complete finding objects.
async function finishRecovered(
  zai: Awaited<ReturnType<typeof ZAI.create>>,
  recovered: ReturnType<typeof recoverFromTruncated>,
  mode: AnalysisMode,
  doc: { pages: number; kind: string },
  lang: string = "hinglish"
) {
  const findings = recovered.findings.map(normalizeFinding);
  const medicines = recovered.medicines.map(normalizeMedicine);
  const observations = recovered.observations.map(normalizeObservation);

  // Detect critical values (dangerous thresholds) for the emergency banner.
  const criticalAlert = detectCriticalValues(findings);

  // Build a compact report for the summary call.
  const compactLines: string[] = [];
  compactLines.push(
    `Report: ${doc.pages}-page ${doc.kind.toUpperCase()}, ${findings.length} tests extracted.`
  );
  compactLines.push("FINDINGS (name | value | status):");
  for (const f of findings) {
    compactLines.push(`- ${f.name} | ${f.value} | ${f.status}`);
  }
  const compactReport = compactLines.join("\n").slice(0, 12000);

  let reportType =
    recovered.reportType || `${doc.kind.toUpperCase()} Medical Report`;
  let summary =
    recovered.summary ||
    `Aapki ${doc.pages}-page ki report me ${findings.length} tests padhe gaye. ${
      (() => {
        const low = findings.filter(f => f.status === "low");
        const high = findings.filter(f => f.status === "high");
        const normal = findings.filter(f => f.status === "normal");
        const parts: string[] = [];
        parts.push(`${normal.length} tests normal range me hain.`);
        if (low.length > 0) parts.push(`${low.length} tests LOW hain${low.slice(0,5).map(f => f.name).join(", ")}${low.length > 5 ? " aadi" : ""}.`);
        if (high.length > 0) parts.push(`${high.length} tests HIGH hain${high.slice(0,5).map(f => f.name).join(", ")}${high.length > 5 ? " aadi" : ""}.`);
        if (criticalAlert.hasCritical) parts.push(`Kuch values CRITICAL hain - jaldi doctor ko dikhayein.`);
        return parts.join(" ");
      })()
    } Har test ki detail neeche dekho.`;
  let overallStatus: AnalysisResult["overallStatus"] = "unknown";
  let nextSteps = [
    "Report ke abnormal values ko doctor ko dikhayein.",
    "Doctor aapse symptoms poochenge aur zaroorat padne par aur test kara sakte hain.",
  ];
  let warning = "";

  try {
    const summaryPrompt = buildSummaryPrompt(compactReport, lang);
    const completion = await withRetry(
      () =>
        zai.chat.completions.create({
          messages: [
            { role: "assistant", content: summaryPrompt },
            {
              role: "user",
              content: "Compact report upar diya hai. Ab summary JSON do.",
            },
          ],
          thinking: { type: "disabled" },
        }),
      "Recovered summary",
      3
    );
    const raw = completion.choices[0]?.message?.content ?? "";
    if (raw) {
      const parsed = extractJson(raw) as Record<string, unknown>;
      reportType = str(parsed.reportType, reportType);
      summary = str(parsed.summary, summary);
      overallStatus = pickStatus(parsed.overallStatus);
      const ns = arr(parsed.nextSteps).map((x) => String(x));
      if (ns.length > 0) nextSteps = ns;
      warning = str(parsed.warning, "");
    }
  } catch (e) {
    console.error("Recovered summary call failed, using code summary", e);
    const hasAbnormal = findings.some(
      (f) => f.status === "high" || f.status === "low"
    );
    overallStatus = criticalAlert.hasCritical
      ? "serious"
      : hasAbnormal
        ? "attention_needed"
        : "normal";
    if (criticalAlert.hasCritical) warning = "Kuch values critical hain - jaldi doctor se milein.";
  }

  const result: AnalysisResult = {
    mode,
    reportType,
    summary,
    findings,
    medicines,
    observations,
    advice: recovered.advice,
    testsSuggested: recovered.testsSuggested,
    criticalAlert,
    overallStatus: criticalAlert.hasCritical ? "serious" : overallStatus,
    nextSteps,
    warning,
    disclaimer: getDisclaimer(lang),
  };
  return NextResponse.json(result);
}

// Smart merge for large documents: code-based dedupe (no output-token limit)
// + one small LLM "summary" call for reportType/summary/status/steps/warning.
async function smartMerge(
  zai: Awaited<ReturnType<typeof ZAI.create>>,
  partials: unknown[],
  mode: AnalysisMode,
  doc: { pages: number; kind: string },
  lang: string = "hinglish"
) {
  // 1. Code-based dedupe of findings and suggested tests (NO conditions —
  //    this app does not diagnose).
  const allFindings: Record<string, unknown>[] = [];
  const allTests: string[] = [];
  const seenFind = new Set<string>();

  for (const p of partials) {
    const o = (p ?? {}) as Record<string, unknown>;
    for (const f of arr(o.findings)) {
      const name = str((f as Record<string, unknown>).name).toLowerCase();
      if (name && !seenFind.has(name)) {
        seenFind.add(name);
        allFindings.push(f as Record<string, unknown>);
      }
    }
    for (const t of arr(o.testsSuggested)) {
      const ts = String(t);
      if (!allTests.includes(ts)) allTests.push(ts);
    }
  }

  const findings = allFindings.map(normalizeFinding);

  // Detect critical values for the emergency banner.
  const criticalAlert = detectCriticalValues(findings);

  // If we got ZERO findings (all chunks failed), return a clear error
  // instead of an empty result — the user needs to know it failed.
  if (findings.length === 0) {
    return NextResponse.json(
      {
        error:
          "Report ka text to padha gaya par koi test extract nahi ho paya. Ho sakta AI service busy ho. 2-3 minute ruk kar dobara try karo.",
      },
      { status: 502 }
    );
  }

  // 2. Build a COMPACT report (names + values + statuses only — no long
  //    explanations) for the summary LLM call. This keeps both input and
  //    output tiny so nothing truncates.
  const compactLines: string[] = [];
  compactLines.push(`Report: ${doc.pages}-page ${doc.kind.toUpperCase()}, ${findings.length} tests extracted.`);
  compactLines.push("FINDINGS (name | value | status):");
  for (const f of findings) {
    compactLines.push(`- ${f.name} | ${f.value} | ${f.status}`);
  }
  const compactReport = compactLines.join("\n").slice(0, 12000);

  // 3. Small LLM summary call. Falls back to a code-generated summary if it
  //    fails (content filter / network).
  let reportType = `${doc.kind.toUpperCase()} Medical Report`;
  let summary = `Aapki ${doc.pages}-page ki report me ${findings.length} tests padhe gaye. ${
      (() => {
        const low = findings.filter(f => f.status === "low");
        const high = findings.filter(f => f.status === "high");
        const normal = findings.filter(f => f.status === "normal");
        const parts: string[] = [];
        parts.push(`${normal.length} tests normal range me hain.`);
        if (low.length > 0) parts.push(`${low.length} tests LOW hain${low.slice(0,5).map(f => f.name).join(", ")}${low.length > 5 ? " aadi" : ""}.`);
        if (high.length > 0) parts.push(`${high.length} tests HIGH hain${high.slice(0,5).map(f => f.name).join(", ")}${high.length > 5 ? " aadi" : ""}.`);
        if (criticalAlert.hasCritical) parts.push(`Kuch values CRITICAL hain - jaldi doctor ko dikhayein.`);
        return parts.join(" ");
      })()
    } Har test ki detail neeche dekho.`;
  let overallStatus: AnalysisResult["overallStatus"] = "unknown";
  let nextSteps = [
    "Report ke abnormal values ko doctor ko dikhayein.",
    "Doctor aapse symptoms poochenge aur zaroorat padne par aur test kara sakte hain.",
  ];
  let warning = "";

  try {
    const summaryPrompt = buildSummaryPrompt(compactReport, lang);
    const completion = await withRetry(
      () =>
        zai.chat.completions.create({
          messages: [
            { role: "assistant", content: summaryPrompt },
            { role: "user", content: "Compact report upar diya hai. Ab summary JSON do." },
          ],
          thinking: { type: "disabled" },
        }),
      "Smart-merge summary",
      3
    );
    const raw = completion.choices[0]?.message?.content ?? "";
    if (raw) {
      const parsed = extractJson(raw) as Record<string, unknown>;
      reportType = str(parsed.reportType, reportType);
      summary = str(parsed.summary, summary);
      overallStatus = pickStatus(parsed.overallStatus);
      const ns = arr(parsed.nextSteps).map((x) => String(x));
      if (ns.length > 0) nextSteps = ns;
      warning = str(parsed.warning, "");
    }
  } catch (e) {
    console.error("Summary LLM call failed, using code-generated summary", e);
    // Fallback status from findings.
    const hasAbnormal = findings.some(
      (f) => f.status === "high" || f.status === "low"
    );
    overallStatus = criticalAlert.hasCritical
      ? "serious"
      : hasAbnormal
        ? "attention_needed"
        : "normal";
    if (criticalAlert.hasCritical) warning = "Kuch values critical hain - jaldi doctor se milein.";
  }

  const result: AnalysisResult = {
    mode,
    reportType,
    summary,
    findings,
    testsSuggested: allTests,
    criticalAlert,
    overallStatus: criticalAlert.hasCritical ? "serious" : overallStatus,
    nextSteps,
    warning,
    disclaimer: getDisclaimer(lang),
  };
  return NextResponse.json(result);
}

// Parse the raw LLM JSON and return the final normalized response.
function finishResult(raw: string, mode: AnalysisMode, lang: string = "hinglish") {
  let parsed: Record<string, unknown>;
  try {
    parsed = extractJson(raw) as Record<string, unknown>;
  } catch {
    console.error("JSON parse fail. Raw:", raw.slice(0, 500));
    return NextResponse.json({
      mode,
      summary:
        "Report padh li gayi par structured format me nahi aa paayi. Niche raw jawab dekho:",
      rawText: raw,
      criticalAlert: { hasCritical: false, values: [] },
      overallStatus: "unknown",
      nextSteps: ["Apne doctor se milein aur ye report dikhayein."],
      warning: "",
      disclaimer: getDisclaimer(lang),
    } satisfies AnalysisResult & { rawText: string });
  }

  const findings = arr(parsed.findings).map(normalizeFinding);
  const criticalAlert = detectCriticalValues(findings);

  const result: AnalysisResult = {
    mode,
    reportType: str(parsed.reportType),
    bodyPart: str(parsed.bodyPart),
    diagnosis: str(parsed.diagnosis),
    summary: str(parsed.summary, "Report padh li gayi."),
    findings,
    medicines: arr(parsed.medicines).map(normalizeMedicine),
    observations: arr(parsed.observations).map(normalizeObservation),
    advice: arr(parsed.advice).map((x) => String(x)),
    testsSuggested: arr(parsed.testsSuggested).map((x) => String(x)),
    criticalAlert,
    overallStatus: criticalAlert.hasCritical
      ? "serious"
      : pickStatus(parsed.overallStatus),
    nextSteps: arr(parsed.nextSteps).map((x) => String(x)),
    warning: str(parsed.warning, ""),
    disclaimer: getDisclaimer(lang),
  };
  return NextResponse.json(result);
}

// ---- helpers ----

/**
 * Retries an async operation on rate-limit (429) and transient (5xx/timeout)
 * errors with exponential backoff. Works for both LLM `create` and
 * `createVision` calls since it accepts a thunk.
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  label = "LLM",
  maxRetries = 3
): Promise<T> {
  let lastErr: unknown = null;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      const msg = (e as Error)?.message ?? "";
      const isRateLimit =
        msg.includes("429") || msg.toLowerCase().includes("too many requests");
      const isTransient =
        msg.includes("500") ||
        msg.includes("502") ||
        msg.includes("503") ||
        msg.includes("timeout") ||
        msg.toLowerCase().includes("internal");
      if ((isRateLimit || isTransient) && attempt < maxRetries) {
        // Backoff: 4s, 12s, 36s for rate limits; shorter for transient.
        const wait = isRateLimit ? 4000 * Math.pow(3, attempt - 1) : 2000 * attempt;
        console.warn(
          `${label} attempt ${attempt}/${maxRetries} failed (${isRateLimit ? "429" : "transient"}), retrying in ${wait}ms: ${msg.slice(0, 120)}`
        );
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }
      throw e;
    }
  }
  throw lastErr;
}

/**
 * Runs async tasks with a concurrency limit (default 2) so we don't fire
 * all chunk LLM calls in parallel and trip the rate limiter.
 */
async function mapWithConcurrencyLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;
  async function worker() {
    while (true) {
      const i = nextIndex++;
      if (i >= items.length) break;
      results[i] = await fn(items[i], i);
    }
  }
  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

function str(v: unknown, fallback = ""): string {
  if (typeof v === "string") return v.trim();
  if (v == null) return fallback;
  return String(v);
}
function arr(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}
function pickStatus(v: unknown): AnalysisResult["overallStatus"] {
  const s = String(v).toLowerCase();
  if (s.includes("normal")) return "normal";
  if (s.includes("serious")) return "serious";
  if (s.includes("attention") || s.includes("needed")) return "attention_needed";
  return "unknown";
}
function pickEnum<T extends string>(v: unknown, allowed: T[], fallback: T): T {
  const s = String(v).toLowerCase();
  return (allowed.find((a) => s.includes(a)) as T) ?? fallback;
}
function normalizeFinding(f: unknown) {
  const o = (f ?? {}) as Record<string, unknown>;
  return {
    name: str(o.name, "Unknown test"),
    value: str(o.value, "-"),
    normalRange: str(o.normalRange, "-"),
    status: pickEnum(
      o.status,
      ["low", "high", "normal", "unknown"],
      "unknown" as const
    ),
    explanation: str(o.explanation, "-"),
  };
}
// NOTE: normalizeCondition removed — this app no longer surfaces "suspected
// conditions" (Option A legal-risk audit: repositioned as a Report READER).
function normalizeMedicine(f: unknown) {
  const o = (f ?? {}) as Record<string, unknown>;
  return {
    name: str(o.name, "Unknown dawa"),
    timing: str(o.timing, "-"),
    dosage: str(o.dosage, "-"),
    duration: str(o.duration, "-"),
    howToTake: str(o.howToTake, "-"),
    purpose: str(o.purpose, "-"),
  };
}
function normalizeObservation(f: unknown) {
  const o = (f ?? {}) as Record<string, unknown>;
  return {
    finding: str(o.finding, "-"),
    explanation: str(o.explanation, "-"),
  };
}
