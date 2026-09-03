"use client";

import {
  AlertTriangle,
  Stethoscope,
  Pill,
  ClipboardList,
  Activity,
  ListChecks,
  FlaskConical,
  Eye,
  ShieldAlert,
  Info,
  HeartPulse,
  Siren,
  BookOpen,
  Printer,
  UserRound,
} from "lucide-react";
import {
  AnalysisResult,
  Finding,
  Medicine,
  getUiLabels,
} from "@/lib/medical";
import { getResultsLabels } from "@/lib/ui-translations";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface ResultsViewProps {
  result: AnalysisResult;
  lang?: string;
}

const statusConfig: Record<
  AnalysisResult["overallStatus"],
  { labelKey: "normal" | "attention" | "serious" | "unknown"; cls: string; dot: string }
> = {
  normal: {
    labelKey: "normal",
    cls: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  attention_needed: {
    labelKey: "attention",
    cls: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  serious: {
    labelKey: "serious",
    cls: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  unknown: {
    labelKey: "unknown",
    cls: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
};

// Status label per language (short phrases).
const statusLabels: Record<string, Record<string, string>> = {
  hinglish: { normal: "Sab Normal", attention: "Dhyan Chahiye", serious: "Jaldi Doctor Se Milein", unknown: "Status Clear Nahi" },
  english: { normal: "All Normal", attention: "Needs Attention", serious: "See a Doctor Soon", unknown: "Status Unclear" },
  hindi: { normal: "सब नॉर्मल", attention: "ध्यान चाहिए", serious: "जल्दी डॉक्टर से मिलें", unknown: "स्थिति स्पष्ट नहीं" },
  bengali: { normal: "সব স্বাভাবিক", attention: "সতর্কতা দরকার", serious: "দ্রুত ডাক্তার দেখান", unknown: "স্থিতি স্পষ্ট নয়" },
  tamil: { normal: "அனைத்தும் இயல்பு", attention: "கவனம் தேவை", serious: "உடனே மருத்துவரைப் பார்க்கவும்", unknown: "நிலை தெளிவாக இல்லை" },
  telugu: { normal: "అన్నీ సాధారణం", attention: "జాగ్రత్త అవసరం", serious: "త్వరలో డాక్టర్‌ను చూడండి", unknown: "స్థితి స్పష్టం లేదు" },
  marathi: { normal: "सर्व सामान्य", attention: "काळजी घ्या", serious: "लवकर डॉक्टरांना भेटा", unknown: "स्थिती स्पष्ट नाही" },
  gujarati: { normal: "બધું સામાન્ય", attention: "ધ્યાન જોઈએ", serious: "ઝડપથી ડૉક્ટર પાસે જાઓ", unknown: "સ્થિતિ સ્પષ્ટ નથી" },
  kannada: { normal: "ಎಲ್ಲಾ ಸಾಮಾನ್ಯ", attention: "ಗಮನ ಅಗತ್ಯ", serious: "ಬೇಗ ವೈದ್ಯರನ್ನು ನೋಡಿ", unknown: "ಸ್ಥಿತಿ ಸ್ಪಷ್ಟವಾಗಿಲ್ಲ" },
  malayalam: { normal: "എല്ലാം സാധാരണം", attention: "ശ്രദ്ധ വേണം", serious: "പെട്ടെന്ന് ഡോക്ടറെ കാണുക", unknown: "അവസ്ഥ വ്യക്തമല്ല" },
  punjabi: { normal: "ਸਭ ਨੌਰਮਲ", attention: "ਧਿਆਨ ਚਾਹੀਦਾ", serious: "ਛੇਤੀ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ", unknown: "ਸਥਿਤੀ ਸਪਸ਼ਟ ਨਹੀਂ" },
  urdu: { normal: "سب نارمل", attention: "توجہ درکار", serious: "جلد ڈاکٹر کو دکھائیں", unknown: "حالت واضح نہیں" },
  odia: { normal: "ସବୁ ସ୍ୱାଭାବିକ", attention: "ଧ୍ୟାନ ଦରକାର", serious: "ଶୀଘ୍ର ଡାକ୍ତର ଦେଖନ୍ତୁ", unknown: "ସ୍ଥିତି ସ୍ପଷ୍ଟ ନୁହେଁ" },
  assamese: { normal: "সকলো স্বাভাৱিক", attention: "ধ্যান দিব লাগিব", serious: "সোনকালে ডাক্তৰ দেখুওৱাওক", unknown: "অৱস্থা স্পষ্ট নহয়" },
};
function getStatusLabel(lang: string, key: string): string {
  return (statusLabels[lang] ?? statusLabels.hinglish)[key] ?? key;
}

const severityStyle: Record<string, string> = {
  mild: "bg-emerald-100 text-emerald-700",
  moderate: "bg-amber-100 text-amber-700",
  serious: "bg-red-100 text-red-700",
  unknown: "bg-slate-100 text-slate-600",
};
const severityLabels: Record<string, Record<string, string>> = {
  hinglish: { mild: "Halka", moderate: "Madhyam", serious: "Gambhir", unknown: "Pata nahi" },
  english: { mild: "Mild", moderate: "Moderate", serious: "Serious", unknown: "Unknown" },
  hindi: { mild: "हल्का", moderate: "मध्यम", serious: "गंभीर", unknown: "पता नहीं" },
  bengali: { mild: "হালকা", moderate: "মাঝারি", serious: "গুরুতর", unknown: "অজানা" },
  tamil: { mild: "லேசான", moderate: "மிதமான", serious: "தீவிரம்", unknown: "தெரியவில்லை" },
  telugu: { mild: "తేలిక", moderate: "మధ్యమ", serious: "తీవ్రం", unknown: "తెలియదు" },
  marathi: { mild: "हलका", moderate: "मध्यम", serious: "गंभीर", unknown: "माहित नाही" },
  gujarati: { mild: "હળવું", moderate: "મધ્યમ", serious: "ગંભીર", unknown: "ખબર નથી" },
  kannada: { mild: "ಸೌಮ್ಯ", moderate: "ಮಧ್ಯಮ", serious: "ಗಂಭೀರ", unknown: "ಗೊತ್ತಿಲ್ಲ" },
  malayalam: { mild: "ലഘു", moderate: "മിതം", serious: "ഗുരുതരം", unknown: "അറിയില്ല" },
  punjabi: { mild: "ਹਲਕਾ", moderate: "ਮੱਧਮ", serious: "ਗੰਭੀਰ", unknown: "ਪਤਾ ਨਹੀਂ" },
  urdu: { mild: "ہلکا", moderate: "درمیانہ", serious: " سنگین", unknown: "معمولی" },
  odia: { mild: "ହାଲୁକା", moderate: "ମଧ୍ୟମ", serious: "ଗମ୍ଭୀର", unknown: "ଜଣା ନାହିଁ" },
  assamese: { mild: "লাঘৱ", moderate: "মধ্যম", serious: "গুৰুতৰ", unknown: "জানিব নোৱাৰি" },
};
function getSeverityLabel(lang: string, key: string): string {
  return (severityLabels[lang] ?? severityLabels.hinglish)[key] ?? key;
}

const findingStatusStyle: Record<string, string> = {
  low: "bg-amber-100 text-amber-700 border-amber-200",
  high: "bg-red-100 text-red-700 border-red-200",
  normal: "bg-emerald-100 text-emerald-700 border-emerald-200",
  unknown: "bg-slate-100 text-slate-600 border-slate-200",
};
const findingStatusLabels: Record<string, Record<string, string>> = {
  hinglish: { low: "Kam", high: "Zyada", normal: "Normal", unknown: "-" },
  english: { low: "Low", high: "High", normal: "Normal", unknown: "-" },
  hindi: { low: "कम", high: "अधिक", normal: "सामान्य", unknown: "-" },
  bengali: { low: "কম", high: "বেশি", normal: "স্বাভাবিক", unknown: "-" },
  tamil: { low: "குறைவு", high: "அதிகம்", normal: "இயல்பு", unknown: "-" },
  telugu: { low: "తక్కువ", high: "ఎక్కువ", normal: "సాధారణం", unknown: "-" },
  marathi: { low: "कमी", high: "जास्त", normal: "सामान्य", unknown: "-" },
  gujarati: { low: "ઓછું", high: "વધારે", normal: "સામાન્ય", unknown: "-" },
  kannada: { low: "ಕಡಿಮೆ", high: "ಹೆಚ್ಚು", normal: "ಸಾಮಾನ್ಯ", unknown: "-" },
  malayalam: { low: "കുറവ്", high: "കൂടുതൽ", normal: "സാധാരണം", unknown: "-" },
  punjabi: { low: "ਘੱਟ", high: "ਵੱਧ", normal: "ਸਧਾਰਨ", unknown: "-" },
  urdu: { low: "کم", high: "زیادہ", normal: "نارمل", unknown: "-" },
  odia: { low: "କମ୍", high: "ଅଧିକ", normal: "ସ୍ୱାଭାବିକ", unknown: "-" },
  assamese: { low: "কম", high: "বেছি", normal: "স্বাভাৱিক", unknown: "-" },
};
function getFindingStatusLabel(lang: string, key: string): string {
  return (findingStatusLabels[lang] ?? findingStatusLabels.hinglish)[key] ?? "-";
}

function Section({
  icon: Icon,
  title,
  accent = "text-emerald-600 bg-emerald-100",
  children,
}: {
  icon: React.ElementType;
  title: string;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3 border-b bg-muted/30 py-3">
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            accent
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <CardTitle className="text-sm font-semibold text-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
}

export function ResultsView({ result, lang = "hinglish" }: ResultsViewProps) {
  const status = statusConfig[result.overallStatus];
  const L = getUiLabels(lang);
  const R = getResultsLabels(lang);

  return (
    <div className="space-y-4">
      {/* CRITICAL VALUE EMERGENCY ALERT — shown prominently at the very top
          when any finding crosses a dangerous clinical threshold. This is
          pure numeric comparison, NOT diagnosis. */}
      {result.criticalAlert?.hasCritical &&
        result.criticalAlert.values.length > 0 && (
          <div
            role="alert"
            className="overflow-hidden rounded-xl border-2 border-red-400 bg-red-50 shadow-sm"
          >
            <div className="flex items-start gap-3 border-b border-red-200 bg-red-100/60 px-4 py-3">
              <Siren className="mt-0.5 h-6 w-6 shrink-0 animate-pulse text-red-600" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-red-800">
                  {L.criticalAlertTitle}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-red-700/90">
                  {L.criticalAlertBody}
                </p>
              </div>
            </div>
            <div className="space-y-1.5 p-3">
              {result.criticalAlert.values.map((cv, i) => (
                <div
                  key={i}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-red-200 bg-white/70 px-3 py-1.5"
                >
                  <span className="text-xs font-semibold text-red-800">
                    {cv.name}
                  </span>
                  <span className="text-xs text-red-700">
                    {cv.value} · {cv.reason}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Prominent reader-mode disclaimer — always shown at the top of
          results so the user never mistakes this for a diagnosis. */}
      <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50/70 px-3.5 py-2.5">
        <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <p className="text-xs leading-relaxed text-amber-800/90">
          <span className="font-semibold">{L.disclaimerBanner}</span>
        </p>
      </div>

      {/* Status header */}
      <Card className="border-l-4 border-l-emerald-500">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <HeartPulse className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {L.reportKhulasa}
              </p>
              <p className="text-base font-bold text-foreground">
                {result.reportType ||
                  result.bodyPart ||
                  result.diagnosis ||
                  R.reportSummary}
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "w-fit gap-1.5 px-3 py-1 text-xs font-semibold",
              status.cls
            )}
          >
            <span className={cn("h-2 w-2 rounded-full", status.dot)} />
            {getStatusLabel(lang, status.labelKey)}
          </Badge>
        </CardContent>
      </Card>

      {/* Summary */}
      <Section icon={Info} title={L.summaryTitle}>
        <p className="text-sm leading-relaxed text-foreground/90">
          {result.summary}
        </p>
      </Section>

      {/* Raw text fallback */}
      {result.rawText && (
        <Section
          icon={ClipboardList}
          title="AI Ka Jawab"
          accent="text-slate-600 bg-slate-100"
        >
          <div className="max-h-72 overflow-y-auto rounded-md bg-muted/40 p-3 text-xs leading-relaxed whitespace-pre-wrap text-foreground/80">
            {result.rawText}
          </div>
        </Section>
      )}

      {/* Findings table */}
      {result.findings && result.findings.length > 0 && (
        <Section icon={FlaskConical} title={L.findingsTitle}>
          <div className="space-y-2">
            {result.findings.map((f: Finding, i) => (
              <div
                key={i}
                className="rounded-lg border bg-background p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {f.name}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[11px] font-semibold",
                      findingStatusStyle[f.status]
                    )}
                  >
                    {getFindingStatusLabel(lang, f.status)}
                  </Badge>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                  <span>
                    <span className="font-medium text-foreground">
                      {R.value}
                    </span>{" "}
                    {f.value}
                  </span>
                  <span>
                    <span className="font-medium text-foreground">
                      {R.normalRange}
                    </span>{" "}
                    {f.normalRange}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-foreground/80">
                  {f.explanation}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Medicines */}
      {result.medicines && result.medicines.length > 0 && (
        <Section
          icon={Pill}
          title={L.medicinesTitle}
          accent="text-violet-600 bg-violet-100"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {result.medicines.map((m: Medicine, i) => (
              <div
                key={i}
                className="rounded-lg border bg-violet-50/40 p-3"
              >
                <p className="text-sm font-bold text-foreground">{m.name}</p>
                <dl className="mt-2 space-y-1 text-xs">
                  <div className="flex gap-1.5">
                    <dt className="font-medium text-violet-700">{R.dosage}</dt>
                    <dd className="text-foreground/80">{m.dosage}</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="font-medium text-violet-700">{R.timing}</dt>
                    <dd className="text-foreground/80">{m.timing}</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="font-medium text-violet-700">{R.duration}</dt>
                    <dd className="text-foreground/80">{m.duration}</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="font-medium text-violet-700">{R.howToTake}</dt>
                    <dd className="text-foreground/80">{m.howToTake}</dd>
                  </div>
                </dl>
                <p className="mt-2 border-t border-violet-100 pt-1.5 text-xs italic text-foreground/70">
                  {R.purpose} {m.purpose}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Observations (xray) */}
      {result.observations && result.observations.length > 0 && (
        <Section
          icon={Eye}
          title={L.observationsTitle}
          accent="text-sky-600 bg-sky-100"
        >
          <ul className="space-y-2">
            {result.observations.map((o, i) => (
              <li
                key={i}
                className="rounded-lg border bg-sky-50/40 p-3"
              >
                <p className="text-sm font-semibold text-foreground">
                  {o.finding}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-foreground/80">
                  {o.explanation}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* NOTE: "Suspected Conditions" section intentionally removed.
          Per Option A legal-risk audit, this app no longer diagnoses or
          suspects diseases — it only reads values and flags out-of-range. */}

      {/* Advice */}
      {result.advice && result.advice.length > 0 && (
        <Section
          icon={ListChecks}
          title={L.adviceTitle}
          accent="text-teal-600 bg-teal-100"
        >
          <ul className="space-y-1.5">
            {result.advice.map((a, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm text-foreground/90"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                {a}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Tests suggested */}
      {result.testsSuggested && result.testsSuggested.length > 0 && (
        <Section
          icon={FlaskConical}
          title={L.testsTitle}
          accent="text-cyan-600 bg-cyan-100"
        >
          <div className="flex flex-wrap gap-2">
            {result.testsSuggested.map((t, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="bg-cyan-50 text-cyan-700"
              >
                {t}
              </Badge>
            ))}
          </div>
        </Section>
      )}

      {/* Next steps */}
      {result.nextSteps.length > 0 && (
        <Section icon={Activity} title={L.nextStepsTitle}>
          <ol className="space-y-2">
            {result.nextSteps.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-foreground/90">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-700">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* Warning */}
      {result.warning && result.warning.trim() && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle className="text-sm font-bold">
            {L.warningTitle}
          </AlertTitle>
          <AlertDescription className="text-sm text-red-700/90">
            {result.warning}
          </AlertDescription>
        </Alert>
      )}

      {/* Doctor CTA — prominent action button urging user to consult a doctor.
          This is a key legal safety feature: the app actively directs users
          to professional medical care. */}
      <div className="overflow-hidden rounded-xl border-2 border-emerald-300 bg-emerald-50">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <UserRound className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">
                {L.doctorCtaTitle}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {L.doctorCtaBody}
              </p>
            </div>
          </div>
          <Button
            onClick={() => window.print()}
            className="shrink-0 gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
            size="sm"
          >
            <Printer className="h-4 w-4" />
            {lang === "english" ? "Print / Save" : "Print / Save"}
          </Button>
        </div>
      </div>

      {/* Disclaimer */}
      <Alert className="border-amber-200 bg-amber-50/60">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-xs leading-relaxed text-amber-800/90">
          {result.disclaimer}
        </AlertDescription>
      </Alert>
    </div>
  );
}
