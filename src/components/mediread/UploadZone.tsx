"use client";

import { useCallback, useRef, useState } from "react";
import {
  UploadCloud,
  X,
  ImageIcon,
  Loader2,
  FileText,
  FileType2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getUploadLabels } from "@/lib/ui-translations";

export interface FileMeta {
  name: string;
  size: number;
  kind: "image" | "pdf" | "docx";
}

interface UploadZoneProps {
  value: string | null; // data URL
  onChange: (dataUrl: string | null, meta?: FileMeta) => void;
  label: string;
  hint: string;
  accent?: "emerald" | "amber" | "violet" | "sky";
  /** Which file types this zone accepts. */
  accept?: "image" | "image+pdf" | "image+pdf+doc";
  fileMeta?: FileMeta | null;
  lang?: string;
}

const accentMap = {
  emerald: {
    ring: "border-emerald-400/60 bg-emerald-50/50",
    icon: "text-emerald-600 bg-emerald-100",
    active: "border-emerald-500 bg-emerald-50",
  },
  amber: {
    ring: "border-amber-400/60 bg-amber-50/50",
    icon: "text-amber-600 bg-amber-100",
    active: "border-amber-500 bg-amber-50",
  },
  violet: {
    ring: "border-violet-400/60 bg-violet-50/50",
    icon: "text-violet-600 bg-violet-100",
    active: "border-violet-500 bg-violet-50",
  },
  sky: {
    ring: "border-sky-400/60 bg-sky-50/50",
    icon: "text-sky-600 bg-sky-100",
    active: "border-sky-500 bg-sky-50",
  },
} as const;

const acceptAttr: Record<NonNullable<UploadZoneProps["accept"]>, string> = {
  image: "image/*",
  "image+pdf": "image/*,.pdf,application/pdf",
  "image+pdf+doc":
    "image/*,.pdf,application/pdf,.docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword",
};

/** Returns the localized "drag & drop or click to choose" hint for an accept mode. */
function hintForAccept(
  accept: NonNullable<UploadZoneProps["accept"]>,
  U: ReturnType<typeof getUploadLabels>
): string {
  if (accept === "image") return U.hintImage;
  if (accept === "image+pdf") return U.hintImagePdf;
  return U.hintAll;
}

/** Reads an image File and downscales it (max 1600px) to a JPEG/PNG data URL. */
function imageToScaledDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("File read error"));
    reader.onload = () => {
      const src = reader.result as string;
      const img = new Image();
      img.onerror = () => reject(new Error("Image load error"));
      img.onload = () => {
        const MAX = 1600;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          const scale = Math.min(MAX / width, MAX / height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(src);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const out =
          file.type === "image/png"
            ? canvas.toDataURL("image/png")
            : canvas.toDataURL("image/jpeg", 0.85);
        resolve(out);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

/** Reads any File into a base64 data URL (no resizing — used for PDF/DOCX). */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("File read error"));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

function detectKind(file: File): FileMeta["kind"] | null {
  const name = file.name.toLowerCase();
  if (file.type.startsWith("image/")) return "image";
  if (file.type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (
    file.type.includes("wordprocessingml") ||
    file.type.includes("msword") ||
    name.endsWith(".docx") ||
    name.endsWith(".doc")
  )
    return "docx";
  return null;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadZone({
  value,
  onChange,
  label,
  hint,
  accent = "emerald",
  accept = "image",
  fileMeta,
  lang = "hinglish",
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const colors = accentMap[accent];
  const U = getUploadLabels(lang);

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      setError(null);
      const kind = detectKind(file);

      // Validate against what this zone accepts.
      if (!kind) {
        setError(U.errorType);
        return;
      }
      if (kind === "pdf" && accept === "image") {
        setError(U.errorImageOnly);
        return;
      }
      if (kind === "docx" && accept !== "image+pdf+doc") {
        setError(U.errorDocxNotAllowed);
        return;
      }

      // Size guard: allow up to 60MB for large multi-page PDFs.
      const maxBytes = 60 * 1024 * 1024;
      if (file.size > maxBytes) {
        setError(U.errorTooLarge);
        return;
      }

      setProcessing(true);
      try {
        let dataUrl: string;
        if (kind === "image") {
          dataUrl = await imageToScaledDataUrl(file);
        } else {
          dataUrl = await fileToDataUrl(file);
        }
        onChange(dataUrl, { name: file.name, size: file.size, kind });
      } catch (e) {
        setError(U.processing);
      } finally {
        setProcessing(false);
      }
    },
    [onChange, accept, U]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFile(e.dataTransfer.files?.[0]);
    },
    [handleFile]
  );

  const clear = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const showFilePreview = value && fileMeta && fileMeta.kind !== "image";

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept={acceptAttr[accept]}
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0] ?? undefined)}
      />

      {!value ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          disabled={processing}
          className={cn(
            "group relative flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
            dragOver ? colors.active : colors.ring,
            processing && "opacity-70"
          )}
          aria-label={label}
        >
          {processing ? (
            <Loader2 className="h-9 w-9 animate-spin text-emerald-600" />
          ) : (
            <span
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-full transition-transform group-hover:scale-105",
                colors.icon
              )}
            >
              <UploadCloud className="h-7 w-7" />
            </span>
          )}
          <span className="text-sm font-semibold text-foreground">
            {processing ? U.processing : label}
          </span>
          <span className="max-w-md text-xs text-muted-foreground">{hint}</span>
          <span className="mt-1 text-xs text-muted-foreground/70">
            {hintForAccept(accept, U)}
          </span>
        </button>
      ) : showFilePreview ? (
        <div className="relative overflow-hidden rounded-xl border bg-muted/30">
          <div className="flex items-center gap-3 border-b bg-background/80 px-3 py-2">
            {fileMeta!.kind === "pdf" ? (
              <FileText className="h-4 w-4 text-red-600" />
            ) : (
              <FileType2 className="h-4 w-4 text-sky-700" />
            )}
            <span className="truncate text-xs font-medium text-foreground">
              {fileMeta!.name}
            </span>
            <button
              type="button"
              onClick={clear}
              className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label={U.removeFile}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-4 p-5">
            <span
              className={cn(
                "flex h-16 w-16 shrink-0 items-center justify-center rounded-xl",
                fileMeta!.kind === "pdf"
                  ? "bg-red-100 text-red-700"
                  : "bg-sky-100 text-sky-700"
              )}
            >
              {fileMeta!.kind === "pdf" ? (
                <FileText className="h-8 w-8" />
              ) : (
                <FileType2 className="h-8 w-8" />
              )}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {fileMeta!.name}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {fileMeta!.kind.toUpperCase()} · {formatSize(fileMeta!.size)}
              </p>
              <p className="mt-1 text-[11px] text-emerald-700">{U.fileReady}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-xl border bg-muted/30">
          <div className="flex items-center gap-3 border-b bg-background/80 px-3 py-2">
            <ImageIcon className="h-4 w-4 text-emerald-600" />
            <span className="truncate text-xs font-medium text-foreground">
              {U.imageAttached}
            </span>
            <button
              type="button"
              onClick={clear}
              className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label={U.removeImage}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <img
            src={value}
            alt="Uploaded preview"
            className="max-h-80 w-full object-contain bg-black/5"
          />
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs font-medium text-destructive">{error}</p>
      )}
    </div>
  );
}
