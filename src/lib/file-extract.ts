// Server-side text extraction from PDF and DOCX files.
// Used by /api/analyze to read multi-page medical reports (30-40 pages).
// z-ai-web-dev-sdk is backend-only, so this runs only on the server.

import "server-only";

export interface ExtractedDoc {
  text: string;
  pages: number;
  kind: "pdf" | "docx" | "unknown";
  /** True when the file appears to be a scanned/image-only document
   *  (very little machine-readable text). Caller should fall back to VLM. */
  scanned: boolean;
}

/** Parse a data URL like "data:application/pdf;base64,..." into bytes + mime. */
export function parseDataUrl(dataUrl: string): {
  mime: string;
  buffer: Buffer;
} {
  const match = dataUrl.match(/^data:([^;]+);base64,(.*)$/s);
  if (!match) {
    throw new Error("Galat data URL format");
  }
  const mime = match[1];
  const buffer = Buffer.from(match[2], "base64");
  return { mime, buffer };
}

/** Heuristic: a real text PDF should yield at least ~30 chars per page on
 *  average. Below that it's almost certainly a scan. */
function isLikelyScanned(text: string, pages: number): boolean {
  if (pages <= 0) return text.trim().length < 30;
  const perPage = text.trim().length / pages;
  return perPage < 30;
}

/** Extract text from a PDF using unpdf (pdfjs-dist under the hood).
 *  Reads ALL pages — no truncation — so 30-40 page reports are fully read. */
async function extractPdf(buffer: Buffer): Promise<ExtractedDoc> {
  // unpdf is ESM-only; dynamic import keeps it out of the client bundle.
  const { extractText, getDocumentProxy } = await import("unpdf");

  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const totalPages = pdf.numPages ?? 0;

  const result = await extractText(pdf, { mergePages: true, max: 0 });
  const text = (result?.text ?? "").trim();

  return {
    text,
    pages: totalPages,
    kind: "pdf",
    scanned: isLikelyScanned(text, totalPages),
  };
}

/** Extract raw text from a .docx file using mammoth. */
async function extractDocx(buffer: Buffer): Promise<ExtractedDoc> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ arrayBuffer: buffer.buffer });
  const text = (result?.value ?? "").trim();
  // mammoth doesn't report page count; estimate ~500 chars/page.
  const pages = Math.max(1, Math.ceil(text.length / 500));
  return {
    text,
    pages,
    kind: "docx",
    scanned: text.trim().length < 30,
  };
}

/** Route the buffer to the right extractor based on mime type. */
export async function extractDocument(
  mime: string,
  buffer: Buffer
): Promise<ExtractedDoc> {
  if (mime === "application/pdf" || mime.endsWith("/pdf")) {
    return extractPdf(buffer);
  }
  if (
    mime ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mime === "application/msword" ||
    mime.endsWith("wordprocessingml.document") ||
    mime.endsWith("msword")
  ) {
    return extractDocx(buffer);
  }
  return { text: "", pages: 0, kind: "unknown", scanned: false };
}
