"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartPulse,
  FlaskConical,
  Pill,
  Type,
  Sparkles,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Languages,
  FileText,
  Files,
  BookOpen,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadZone, FileMeta } from "@/components/mediread/UploadZone";
import { ResultsView } from "@/components/mediread/ResultsView";
import { ConsentModal } from "@/components/mediread/ConsentModal";
import { LegalModal } from "@/components/mediread/LegalModal";
import {
  AnalysisMode,
  AnalysisResult,
  LANGUAGES,
  getUiLabels,
  getDisclaimer,
} from "@/lib/medical";
import {
  getExtraLabels,
  getModeLabels,
} from "@/lib/ui-translations";
import { cn } from "@/lib/utils";

// Per-tab upload state. Each upload tab stores a data URL + file metadata.
type UploadKey = "test-report" | "doctor-slip" | "xray" | "document";
interface UploadState {
  dataUrl: string;
  meta: FileMeta;
}
type UploadStore = Partial<Record<UploadKey, UploadState>>;

interface ModeMeta {
  id: AnalysisMode;
  icon: React.ElementType;
  accent: "emerald" | "amber" | "violet" | "sky" | "rose";
  // What file types this tab's upload zone accepts.
  accept: "image" | "image+pdf" | "image+pdf+doc";
}

const MODES: ModeMeta[] = [
  { id: "test-report", icon: FlaskConical, accent: "emerald", accept: "image+pdf" },
  { id: "doctor-slip", icon: Pill, accent: "violet", accept: "image+pdf+doc" },
  { id: "document", icon: Files, accent: "rose", accept: "image+pdf+doc" },
  { id: "text", icon: Type, accent: "amber", accept: "image" },
];

const accentText: Record<ModeMeta["accent"], string> = {
  emerald: "text-emerald-600",
  amber: "text-amber-600",
  violet: "text-violet-600",
  sky: "text-sky-600",
  rose: "text-rose-600",
};
const accentBg: Record<ModeMeta["accent"], string> = {
  emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  violet: "bg-violet-100 text-violet-700",
  sky: "bg-sky-100 text-sky-700",
  rose: "bg-rose-100 text-rose-700",
};
const accentBtn: Record<ModeMeta["accent"], string> = {
  emerald: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20",
  amber: "bg-amber-600 text-white hover:bg-amber-700 shadow-amber-600/20",
  violet: "bg-violet-600 text-white hover:bg-violet-700 shadow-violet-600/20",
  sky: "bg-sky-600 text-white hover:bg-sky-700 shadow-sky-600/20",
  rose: "bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/20",
};

export default function Home() {
  const [mode, setMode] = useState<AnalysisMode>("test-report");
  const [uploads, setUploads] = useState<UploadStore>({});
  const [text, setText] = useState("");
  // Always start with "hinglish" on both server and client to avoid hydration
  // mismatch. The saved preference is applied in a useEffect after mount.
  const [lang, setLang] = useState<string>("hinglish");

  // Apply saved language preference after mount (client-only) to avoid SSR
  // hydration mismatch.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mediread-lang");
      if (saved) {
        setLang(saved);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Persist language preference.
  useEffect(() => {
    try {
      localStorage.setItem("mediread-lang", lang);
    } catch {
      /* ignore */
    }
  }, [lang]);
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [resultMode, setResultMode] = useState<AnalysisMode | null>(null);
  const [legalOpen, setLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<"terms" | "privacy">("terms");
  const resultsRef = useRef<HTMLDivElement>(null);

  const current = useMemo(() => MODES.find((m) => m.id === mode)!, [mode]);
  const currentUpload = uploads[mode as UploadKey];
  const L = useMemo(() => getUiLabels(lang), [lang]);
  const E = useMemo(() => getExtraLabels(lang), [lang]);
  const ML = useMemo(() => getModeLabels(lang), [lang]);

  const canAnalyze =
    !loading &&
    (mode === "text"
      ? text.trim().length >= 10
      : Boolean(currentUpload?.dataUrl));

  function scrollToResults() {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  }

  async function handleAnalyze() {
    if (!canAnalyze) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setProgressMsg(null);

    const payload: {
      mode: AnalysisMode;
      image?: string;
      text?: string;
      file?: string;
      fileName?: string;
      language?: string;
    } = { mode, language: lang };

    if (mode === "text") {
      payload.text = text;
    } else {
      const up = currentUpload!;
      if (up.meta.kind === "image") {
        payload.image = up.dataUrl;
      } else {
        payload.file = up.dataUrl;
        payload.fileName = up.meta.name;
      }
    }

    try {
      // Step 1: Start the analysis as a background job. This returns
      // immediately with a jobId — no long-lived connection through the ALB.
      setProgressMsg(
        lang === "english"
          ? "Starting analysis..."
          : "Vishleshan shuru ho raha hai..."
      );
      const startRes = await fetch("/api/analyze-start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!startRes.ok) {
        const errData = await startRes.json().catch(() => ({}));
        throw new Error(
          (errData as { error?: string })?.error ||
            "Analysis start nahi ho paya. Dobara try karo."
        );
      }

      const { jobId } = (await startRes.json()) as { jobId: string };
      if (!jobId) {
        throw new Error("Job ID nahi mila. Dobara try karo.");
      }

      // Step 2: Poll for status every 4 seconds until done or error.
      // Each poll is a quick request (< 1s) so the ALB never times out.
      const isDocMode =
        mode === "document" ||
        (currentUpload && currentUpload.meta.kind !== "image");
      const baseProgressMsg = isDocMode ? E.loadingDoc : E.loadingImage;
      const pollInterval = 4000; // 4 seconds
      const maxPollTime = 10 * 60 * 1000; // 10 minutes max — large PDFs can take 5-8 min
      const startTime = Date.now();

      while (true) {
        if (Date.now() - startTime > maxPollTime) {
          throw new Error(
            "Analysis bahut der le raha hai (5 minute). Dobara try karo ya chhoti report upload karo."
          );
        }

        // Wait before polling.
        await new Promise((r) => setTimeout(r, pollInterval));

        // Update progress message with elapsed time.
        const elapsedSec = Math.round((Date.now() - startTime) / 1000);
        setProgressMsg(
          lang === "english"
            ? `Analyzing... (${elapsedSec}s)`
            : `${baseProgressMsg} (${elapsedSec} sec)`
        );

        const statusRes = await fetch(
          `/api/analyze-status?jobId=${jobId}`,
          { method: "GET" }
        );

        if (!statusRes.ok && statusRes.status !== 404) {
          // Transient error — keep polling.
          console.warn("Status poll failed:", statusRes.status);
          continue;
        }

        const statusData = (await statusRes.json()) as {
          status: "processing" | "done" | "error";
          result?: AnalysisResult;
          error?: string;
        };

        if (statusData.status === "done" && statusData.result) {
          setResult(statusData.result);
          setResultMode(mode);
          setProgressMsg(null);
          scrollToResults();
          break;
        } else if (statusData.status === "error") {
          throw new Error(
            statusData.error ||
              "Analysis me dikkat aayi. Dobara try karo."
          );
        }
        // status === "processing" → keep polling.
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Network error";
      if (msg.includes("429") || msg.toLowerCase().includes("rate")) {
        setError(
          "AI service par bahut zyada load hai. 1-2 minute ruk kar dobara try karo."
        );
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
      setProgressMsg(null);
    }
  }

  function handleReset() {
    setResult(null);
    setResultMode(null);
    setError(null);
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/40 via-background to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-emerald-100/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-3 px-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-600/30">
            <HeartPulse className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold leading-tight text-foreground">
              MediRead
            </h1>
            <p className="truncate text-[11px] leading-tight text-muted-foreground">
              {E.headerSubtitle}
            </p>
          </div>
          {/* Language selector */}
          <div className="ml-auto flex items-center gap-2">
            <Select value={lang} onValueChange={setLang}>
              <SelectTrigger
                className="h-9 w-[130px] gap-1.5 rounded-full border-emerald-200 bg-emerald-50/60 px-3 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 sm:w-[150px]"
                aria-label="Bhasha choose karein"
              >
                <Languages className="h-3.5 w-3.5 shrink-0" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {LANGUAGES.map((lng) => (
                  <SelectItem
                    key={lng.code}
                    value={lng.code}
                    className="text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-medium">{lng.native}</span>
                      <span className="text-xs text-muted-foreground">
                        {lng.english}
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:py-8">
        {/* Hero */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white shadow-sm sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <h2 className="text-xl font-bold sm:text-2xl">
                {L.heroTitle}
              </h2>
              <p className="mt-1.5 text-sm text-emerald-50/90">
                {L.heroSubtitle}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:flex-nowrap">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur">
                <Languages className="h-3.5 w-3.5" />
                {LANGUAGES.find((l) => l.code === lang)?.native ?? "Hinglish"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur">
                <ShieldCheck className="h-3.5 w-3.5" /> {E.privateLabel}
              </span>
            </div>
          </div>
        </section>

        {/* Persistent reader-mode disclaimer banner — always visible so users
            never mistake this app for a diagnostic tool. (Option A compliance.) */}
        <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-amber-300 bg-amber-50/80 px-4 py-2.5 shadow-sm">
          <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-xs leading-relaxed text-amber-900/90">
            <span className="font-semibold">{L.disclaimerBanner}</span>
          </p>
        </div>

        {/* Tabs / input */}
        <Tabs
          value={mode}
          onValueChange={(v) => setMode(v as AnalysisMode)}
          className="w-full"
        >
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-xl bg-muted/60 p-1.5 sm:grid-cols-4">
            {MODES.map((m) => {
              const Icon = m.icon;
              const active = mode === m.id;
              return (
                <TabsTrigger
                  key={m.id}
                  value={m.id}
                  className={cn(
                    "flex h-auto flex-col items-center gap-1 rounded-lg border border-transparent py-2.5 text-xs font-medium data-[state=active]:shadow-sm sm:flex-row sm:gap-2 sm:py-2",
                    active && "bg-background"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      active ? accentText[m.accent] : "text-muted-foreground"
                    )}
                  />
                  <span>{ML[m.id].label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {MODES.map((m) => {
            const Icon = m.icon;
            return (
              <TabsContent key={m.id} value={m.id} className="mt-4">
                <Card className="overflow-hidden">
                  <CardHeader className="border-b bg-muted/30 py-4">
                    <div className="flex items-start gap-3">
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                          accentBg[m.accent]
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <CardTitle className="flex flex-wrap items-center gap-2 text-base">
                          {ML[m.id].label}
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                              accentBg[m.accent]
                            )}
                          >
                            {ML[m.id].badge}
                          </span>
                        </CardTitle>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {ML[m.id].description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-5">
                    {m.id === "text" ? (
                      <div className="space-y-2">
                        <label
                          htmlFor="report-text"
                          className="text-sm font-medium text-foreground"
                        >
                          {E.textLabel}
                        </label>
                        <Textarea
                          id="report-text"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          placeholder={E.textPlaceholder}
                          className="min-h-[180px] resize-y font-mono text-xs leading-relaxed"
                        />
                        <p className="text-xs text-muted-foreground">
                          {E.textCounter.replace("{n}", String(text.trim().length))}
                        </p>
                      </div>
                    ) : (
                      <UploadZone
                        value={currentUpload?.dataUrl ?? null}
                        fileMeta={currentUpload?.meta ?? null}
                        onChange={(url, meta) =>
                          setUploads((prev) => {
                            const next = { ...prev };
                            const key = m.id as UploadKey;
                            if (url && meta) {
                              next[key] = { dataUrl: url, meta };
                            } else {
                              delete next[key];
                            }
                            return next;
                          })
                        }
                        label={ML[m.id].uploadLabel}
                        hint={ML[m.id].uploadHint}
                        accent={m.accent === "rose" ? "emerald" : m.accent}
                        accept={m.accept}
                        lang={lang}
                      />
                    )}
                    {/* Data handling notice — reassures user their data is not
                        stored. Important for DPDP Act compliance perception. */}
                    {m.id !== "text" && (
                      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <ShieldCheck className="h-3 w-3 shrink-0 text-emerald-600" />
                        {L.dataNotice}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Action bar */}
        <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-center text-xs text-muted-foreground sm:text-left">
            {mode === "text"
              ? E.hintText
              : mode === "document" ||
                  (currentUpload && currentUpload.meta.kind !== "image")
                ? E.hintFile
                : E.hintImage}
          </p>
          <div className="flex w-full gap-2 sm:w-auto">
            {result && (
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={loading}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                {L.reset}
              </Button>
            )}
            <Button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className={cn(
                "flex-1 gap-2 shadow-sm sm:flex-none sm:px-8",
                accentBtn[current.accent]
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {L.analyzing}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {L.analyzeButton}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <Alert variant="destructive" className="mt-5">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        <div ref={resultsRef} className="mt-6 scroll-mt-20">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                  <Loader2 className="h-5 w-5 shrink-0 animate-spin text-emerald-600" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {progressMsg
                        ? progressMsg
                        : mode === "document" ||
                            (currentUpload &&
                              currentUpload.meta.kind !== "image")
                          ? E.loadingDoc
                          : E.loadingImage}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {mode === "document" ||
                      (currentUpload && currentUpload.meta.kind !== "image")
                        ? E.loadingHintDoc
                        : E.loadingHintImage}
                    </p>
                  </div>
                </div>
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
              </motion.div>
            )}

            {!loading && result && resultMode && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  {L.resultFor}{" "}
                  <span className="font-semibold text-foreground">
                    {MODES.find((m) => m.id === resultMode)?.label}
                  </span>
                </div>
                <ResultsView result={result} lang={lang} />
              </motion.div>
            )}

            {!loading && !result && !error && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-dashed border-emerald-200/70 bg-emerald-50/30 p-8 text-center"
              >
                <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <HeartPulse className="h-7 w-7" />
                </span>
                <p className="text-sm font-semibold text-foreground">
                  {L.emptyTitle}
                </p>
                <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
                  {L.emptySubtitle}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-emerald-100/70 bg-background/80 backdrop-blur">
        <div className="mx-auto w-full max-w-5xl px-4 py-5">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <HeartPulse className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-semibold text-foreground">
                MediRead
              </span>
            </div>
            <p className="max-w-xl text-[11px] leading-relaxed text-muted-foreground">
              {getDisclaimer(lang)}
            </p>
          </div>
          {/* Legal links */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-border/50 pt-3">
            <button
              onClick={() => {
                setLegalTab("terms");
                setLegalOpen(true);
              }}
              className="text-[11px] font-medium text-emerald-700 underline-offset-2 hover:underline"
            >
              Terms of Use
            </button>
            <button
              onClick={() => {
                setLegalTab("privacy");
                setLegalOpen(true);
              }}
              className="text-[11px] font-medium text-emerald-700 underline-offset-2 hover:underline"
            >
              Privacy Policy
            </button>
            <span className="text-[11px] text-muted-foreground">
              🇮🇳 Made in India · DPDP Act compliant
            </span>
          </div>
        </div>
      </footer>

      {/* Consent modal — shows on first visit */}
      <ConsentModal lang={lang} />

      {/* Legal documents modal */}
      <LegalModal
        open={legalOpen}
        onOpenChange={setLegalOpen}
        defaultTab={legalTab}
        lang={lang}
      />
    </div>
  );
}
