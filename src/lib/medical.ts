// Medical analysis prompts and response parsing helpers.
// Used by the /api/analyze backend route. z-ai-web-dev-sdk is backend-only.

export type AnalysisMode =
  | "test-report"
  | "doctor-slip"
  | "xray"
  | "text"
  | "document";

// ---- Language support ----
// India has many languages; users can pick the one they're most comfortable
// with and the AI explains the report in that language.

export interface LanguageOption {
  code: string;
  /** Native name (shown in the dropdown). */
  native: string;
  /** English name (for the prompt directive). */
  english: string;
  /** Script/writing system note for the model. */
  script: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "hinglish", native: "Hinglish", english: "Hinglish (Roman Hindi)", script: "Roman letters" },
  { code: "english", native: "English", english: "English", script: "Latin letters" },
  { code: "hindi", native: "हिंदी", english: "Hindi", script: "Devanagari script" },
  { code: "bengali", native: "বাংলা", english: "Bengali", script: "Bengali script" },
  { code: "tamil", native: "தமிழ்", english: "Tamil", script: "Tamil script" },
  { code: "telugu", native: "తెలుగు", english: "Telugu", script: "Telugu script" },
  { code: "marathi", native: "मराठी", english: "Marathi", script: "Devanagari script" },
  { code: "gujarati", native: "ગુજરાતી", english: "Gujarati", script: "Gujarati script" },
  { code: "kannada", native: "ಕನ್ನಡ", english: "Kannada", script: "Kannada script" },
  { code: "malayalam", native: "മലയാളം", english: "Malayalam", script: "Malayalam script" },
  { code: "punjabi", native: "ਪੰਜਾਬੀ", english: "Punjabi", script: "Gurmukhi script" },
  { code: "urdu", native: "اردو", english: "Urdu", script: "Urdu script" },
  { code: "odia", native: "ଓଡ଼ିଆ", english: "Odia", script: "Odia script" },
  { code: "assamese", native: "অসমীয়া", english: "Assamese", script: "Assamese script" },
];

export function isLanguageCode(code: unknown): code is string {
  return typeof code === "string" && LANGUAGES.some((l) => l.code === code);
}

/** Returns the model directive that forces output in the chosen language. */
function languageDirective(lang: string): string {
  const opt = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];
  // For regional Indian languages, include a sample sentence in the target
  // script so the model anchors to that writing system (not Hinglish).
  const samples: Record<string, string> = {
    hindi: "उदाहरण: आपकी रिपोर्ट में हीमोग्लोबिन कम है, जिसका मतलब खून में ऑक्सीजन कम हो सकता है।",
    bengali: "উদাহরণ: আপনার রিপোর্টে হিমোগ্লোবিন কম আছে, যার মানে রক্তে অক্সিজেন কম হতে পারে।",
    tamil: "உதாரணம்: உங்கள் அறிக்கையில் ஹிமோக்ளோபின் குறைவாக உள்ளது, அதாவது ரத்தத்தில் ஆக்ஸிஜன் குறைவாக இருக்கலாம்.",
    telugu: "ఉదాహరణ: మీ నివేదికలో హిమోగ్లోబిన్ తక్కువగా ఉంది, అంటే రక్తంలో ఆక్సిజన్ తక్కువగా ఉండవచ్చు.",
    marathi: "उदाहरण: तुमच्या अहवालात हिमोग्लोबिन कमी आहे, याचा अर्थ रक्तात ऑक्सिजन कमी असू शकतो.",
    gujarati: "ઉદાહરણ: તમારા રિપોર્ટમાં હિમોગ્લોબિન ઓછું છે, એટલે કે લોહીમાં ઑક્સિજન ઓછું હોઈ શકે છે.",
    kannada: "ಉದಾಹರಣೆ: ನಿಮ್ಮ ವರದಿಯಲ್ಲಿ ಹಿಮೋಗ್ಲೋಬಿನ್ ಕಡಿಮೆ ಇದೆ, ಅಂದರೆ ರಕ್ತದಲ್ಲಿ ಆಮ್ಲಜನಕ ಕಡಿಮೆ ಇರಬಹುದು.",
    malayalam: "ഉദാഹരണം: നിങ്ങളുടെ റിപ്പോർട്ടിൽ ഹിമോഗ്ലോബിൻ കുറവാണ്, അതായത് രക്തത്തിൽ ഓക്സിജൻ കുറവായിരിക്കാം.",
    punjabi: "ਉਦਾਹਰਨ: ਤੁਹਾਡੀ ਰਿਪੋਰਟ ਵਿੱਚ ਹੀਮੋਗਲੋਬਿਨ ਘੱਟ ਹੈ, ਜਿਸਦਾ ਮਤਲਬ ਖੂਨ ਵਿੱਚ ਆਕਸੀਜਨ ਘੱਟ ਹੋ ਸਕਦਾ ਹੈ।",
    urdu: "مثال: آپ کی رپورٹ میں ہیموگلوبن کم ہے، جس کا مطلب خون میں آکسیجن کم ہو سکتی ہے۔",
    odia: "ଉଦାହରଣ: ଆପଣଙ୍କ ରିପୋର୍ଟରେ ହେମୋଗ୍ଲୋବିନ୍ କମ୍ ଅଛି, ଯାହାର ଅର୍ଥ ରକ୍ତରେ ଅକ୍ସିଜେନ୍ କମ୍ ହୋଇପାରେ।",
    assamese: "উদাহৰণ: আপোনাৰ প্ৰতিৱেদনত হিমোগ্লোবিন কম, যাৰ অৰ্থ তেজত অক্সিজেন কম হ'ব পাৰে।",
  };
  const sample = samples[opt.code];
  const sampleLine = sample
    ? `\n\nइस भाषा में एक उदाहरण वाक्य (use this script/style):\n${sample}`
    : "";
  return `\n\nLANGUAGE (SABSE ZAROORI): Apna POORA jawab ${opt.english} (${opt.script}) me do. Test/parameter ke naam English me rakh sakte ho (e.g. "Hemoglobin", "Glucose"), lekin summary, explanation, reasons, next steps, warning, advice, diagnosis sab kuch STRICTLY ${opt.english} me likho. Hinglish ya English me ${opt.english} ke bajaye mat likho. Aam logon ko ${opt.english} me samajh aana chahiye.${sampleLine}`;
}

export interface Finding {
  name: string;
  value: string;
  normalRange?: string;
  status: "low" | "high" | "normal" | "unknown";
  explanation: string;
}

// NOTE: "SuspectedCondition" has been intentionally REMOVED from the app.
// Per Option A (legal-risk audit), the app is repositioned as a Report
// READER/TRANSLATOR — it does NOT diagnose or suspect diseases. It only
// reads values, shows ranges, and flags values out of range for the user
// to discuss with their doctor. This keeps the app out of CDSCO's SaMD
// (Software as Medical Device) classification and NMC telemedicine scope.

export interface Medicine {
  name: string;
  timing: string;
  dosage: string;
  duration: string;
  howToTake: string;
  purpose: string;
}

export interface Observation {
  finding: string;
  explanation: string;
}

// A critical (potentially dangerous) value detected in the report. These
// are flagged with a prominent emergency banner urging the user to seek
// immediate medical attention. This is data comparison, NOT diagnosis.
export interface CriticalValue {
  name: string;
  value: string;
  reason: string; // why this is critical (e.g. "very low", "dangerously high")
}

export interface CriticalAlert {
  hasCritical: boolean;
  values: CriticalValue[];
}

export interface AnalysisResult {
  mode: AnalysisMode;
  reportType?: string;
  bodyPart?: string;
  diagnosis?: string;
  summary: string;
  findings?: Finding[];
  medicines?: Medicine[];
  observations?: Observation[];
  advice?: string[];
  testsSuggested?: string[];
  criticalAlert: CriticalAlert;
  overallStatus: "normal" | "attention_needed" | "serious" | "unknown";
  nextSteps: string[];
  warning: string;
  disclaimer: string;
  rawText?: string;
}

// ---- Critical value thresholds ----
// Common dangerous thresholds seen in lab reports. When a finding's numeric
// value crosses these, we surface a prominent emergency alert. This is pure
// numeric comparison against published clinical thresholds — NOT diagnosis.
interface Threshold {
  // case-insensitive substring(s) to match the test name
  matchers: string[];
  // dangerous-when comparator; "lt" = critical if value < limit, "gt" = critical if value > limit
  mode: "lt" | "gt";
  limit: number;
  reasonKey: "very_low" | "very_high";
}

const CRITICAL_THRESHOLDS: Threshold[] = [
  { matchers: ["hemoglobin", "hb)", "hb ", "haemoglobin"], mode: "lt", limit: 7, reasonKey: "very_low" },
  { matchers: ["hemoglobin", "hb)", "hb ", "haemoglobin"], mode: "gt", limit: 20, reasonKey: "very_high" },
  { matchers: ["platelet", "platelets"], mode: "lt", limit: 50000, reasonKey: "very_low" },
  { matchers: ["wbc", "white blood", "leucocyte", "leukocyte"], mode: "gt", limit: 30000, reasonKey: "very_high" },
  { matchers: ["wbc", "white blood", "leucocyte", "leukocyte"], mode: "lt", limit: 2000, reasonKey: "very_low" },
  { matchers: ["glucose", "sugar", "blood sugar"], mode: "gt", limit: 400, reasonKey: "very_high" },
  { matchers: ["glucose", "sugar", "blood sugar"], mode: "lt", limit: 50, reasonKey: "very_low" },
  { matchers: ["hba1c", "glycated"], mode: "gt", limit: 10, reasonKey: "very_high" },
  { matchers: ["creatinine"], mode: "gt", limit: 5, reasonKey: "very_high" },
  { matchers: ["urea"], mode: "gt", limit: 150, reasonKey: "very_high" },
  { matchers: ["potassium", "k+"], mode: "gt", limit: 6.2, reasonKey: "very_high" },
  { matchers: ["potassium", "k+"], mode: "lt", limit: 2.5, reasonKey: "very_low" },
  { matchers: ["sodium", "na+"], mode: "lt", limit: 120, reasonKey: "very_low" },
  { matchers: ["sodium", "na+"], mode: "gt", limit: 160, reasonKey: "very_high" },
  { matchers: ["troponin"], mode: "gt", limit: 0.04, reasonKey: "very_high" },
  { matchers: ["bilirubin"], mode: "gt", limit: 5, reasonKey: "very_high" },
  { matchers: ["calcium"], mode: "lt", limit: 6, reasonKey: "very_low" },
  { matchers: ["calcium"], mode: "gt", limit: 13, reasonKey: "very_high" },
  { matchers: ["hematocrit", "pcv", "packed cell"], mode: "lt", limit: 20, reasonKey: "very_low" },
  { matchers: ["esr"], mode: "gt", limit: 80, reasonKey: "very_high" },
  { matchers: ["crp", "c-reactive"], mode: "gt", limit: 50, reasonKey: "very_high" },
  { matchers: ["ferritin"], mode: "lt", limit: 10, reasonKey: "very_low" },
  { matchers: ["tsh"], mode: "gt", limit: 15, reasonKey: "very_high" },
  { matchers: ["d-dimer", "ddimer"], mode: "gt", limit: 2, reasonKey: "very_high" },
];

// Extract the first numeric value from a string like "9.2 g/dL" or "14,200 /cmm" -> 9.2 / 14200
function extractNumber(s: string): number | null {
  if (!s) return null;
  const cleaned = s.replace(/[, ]/g, "");
  const m = cleaned.match(/-?\d+(\.\d+)?/);
  if (!m) return null;
  const n = parseFloat(m[0]);
  return Number.isFinite(n) ? n : null;
}

const CRITICAL_REASON: Record<"very_low" | "very_high", string> = {
  very_low: "Bahut kam (critical low)",
  very_high: "Bahut zyada (critical high)",
};

/** Scan findings for values crossing dangerous clinical thresholds. */
export function detectCriticalValues(findings: Finding[]): CriticalAlert {
  const out: CriticalValue[] = [];
  for (const f of findings) {
    const num = extractNumber(f.value);
    if (num == null) continue;
    const lowerName = f.name.toLowerCase();
    for (const t of CRITICAL_THRESHOLDS) {
      if (!t.matchers.some((m) => lowerName.includes(m))) continue;
      const isCritical =
        (t.mode === "lt" && num < t.limit) ||
        (t.mode === "gt" && num > t.limit);
      if (isCritical) {
        out.push({
          name: f.name,
          value: f.value,
          reason: CRITICAL_REASON[t.reasonKey],
        });
        break; // one threshold per finding
      }
    }
  }
  return { hasCritical: out.length > 0, values: out };
}

// Refuse message for non-medical queries, translated per language.
// Used when user inputs non-medical content (jokes, coding, general questions).
function getRefuseMessages(lang: string): { summary: string; nextStep: string } {
  const map: Record<string, { summary: string; nextStep: string }> = {
    hinglish: {
      summary: "Yeh app sirf medical reports, lab tests, ya doctor ki prescription samjhane ke liye hai. Isme aap apni report ki photo/PDF upload karein ya report ka text type karein. Dusre topics ka jawab yahan nahi milta.",
      nextStep: "Apni medical report upload karein ya text paste karein.",
    },
    english: {
      summary: "This app is only for understanding medical reports, lab tests, or doctor's prescriptions. Please upload your report photo/PDF or type the report text. Other topics are not answered here.",
      nextStep: "Upload your medical report or paste the text.",
    },
    hindi: {
      summary: "यह ऐप केवल मेडिकल रिपोर्ट, लैब टेस्ट, या डॉक्टर की प्रिस्क्रिप्शन समझने के लिए है। कृपया अपनी रिपोर्ट की फ़ोटो/PDF अपलोड करें या रिपोर्ट का टेक्स्ट टाइप करें। अन्य विषयों का उत्तर यहाँ नहीं मिलता।",
      nextStep: "अपनी मेडिकल रिपोर्ट अपलोड करें या टेक्स्ट पेस्ट करें।",
    },
    bengali: {
      summary: "এই অ্যাপটি কেবল মেডিকেল রিপোর্ট, ল্যাব টেস্ট, বা ডাক্তারের প্রেসক্রিপশন বোঝার জন্য। অনুগ্রহ করে আপনার রিপোর্টের ছবি/PDF আপলোড করুন বা রিপোর্টের টেক্সট টাইপ করুন। অন্যান্য বিষয়ের উত্তর এখানে পাওয়া যায় না।",
      nextStep: "আপনার মেডিকেল রিপোর্ট আপলোড করুন বা টেক্সট পেস্ট করুন।",
    },
    tamil: {
      summary: "இந்த ஆப் மருத்துவ அறிக்கைகள், லேப் டெஸ்ட், அல்லது மருத்துவரின் பரிந்துரையை புரிந்துகொள்ள மட்டுமே. உங்கள் அறிக்கையின் புகைப்படம்/PDF-ஐ பதிவேற்றவும் அல்லது டெக்ஸ்ட் தட்டச்சு செய்யவும். மற்ற தலைப்புகளுக்கு இங்கே பதில் கிடைக்காது.",
      nextStep: "உங்கள் மருத்துவ அறிக்கையை பதிவேற்றவும் அல்லது டெக்ஸ்ட் ஒட்டவும்.",
    },
    telugu: {
      summary: "ఈ యాప్ వైద్య నివేదికలు, ల్యాబ్ టెస్ట్‌లు, లేదా డాక్టర్ ప్రిస్క్రిప్షన్‌ను అర్థం చేసుకోవడానికి మాత్రమే. దయచేసి మీ నివేదిక ఫోటో/PDF అప్‌లోడ్ చేయండి లేదా టెక్స్ట్ టైప్ చేయండి. ఇతర అంశాలకు సమాధానం ఇక్కడ లేదు.",
      nextStep: "మీ వైద్య నివేదికను అప్‌లోడ్ చేయండి లేదా టెక్స్ట్ అతికించండి.",
    },
    marathi: {
      summary: "हा अॅप फक्त वैद्यकीय अहवाल, लॅब चाचण्या, किंवा डॉक्टरांच्या प्रिस्क्रिप्शन समजण्यासाठी आहे. कृपया आपला अहवाल फोटो/PDF अपलोड करा किंवा अहवालाचा मजकूर टाईप करा. इतर विषयांचे उत्तर येथे मिळत नाही.",
      nextStep: "आपला वैद्यकीय अहवाल अपलोड करा किंवा मजकूर पेस्ट करा.",
    },
    gujarati: {
      summary: "આ એપ ફક્ત મેડિકલ રિપોર્ટ, લેબ ટેસ્ટ, અથવા ડૉક્ટરની પ્રિસ્ક્રિપ્શન સમજવા માટે છે. કૃપા કરીને તમારો રિપોર્ટ ફોટો/PDF અપલોડ કરો અથવા ટેક્સ્ટ ટાઇપ કરો. અન્ય વિષયોનો જવાબ અહીં મળતો નથી.",
      nextStep: "તમારો મેડિકલ રિપોર્ટ અપલોડ કરો અથવા ટેક્સ્ટ પેસ્ટ કરો.",
    },
    kannada: {
      summary: "ಈ ಆಪ್ ಕೇವಲ ವೈದ್ಯಕೀಯ ವರದಿಗಳು, ಲ್ಯಾಬ್ ಟೆಸ್ಟ್‌ಗಳು, ಅಥವಾ ವೈದ್ಯರ ಪ್ರಿಸ್ಕ್ರಿಪ್ಶನ್ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಮಾತ್ರ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ವರದಿಯ ಫೋಟೋ/PDF ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಟೆಕ್ಸ್ಟ್ ಟೈಪ್ ಮಾಡಿ. ಇತರ ವಿಷಯಗಳಿಗೆ ಉತ್ತರ ಇಲ್ಲಿ ಸಿಗುವುದಿಲ್ಲ.",
      nextStep: "ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ವರದಿಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಟೆಕ್ಸ್ಟ್ ಅಂಟಿಸಿ.",
    },
    malayalam: {
      summary: "ഈ ആപ്പ് മെഡിക്കൽ റിപ്പോർട്ടുകൾ, ലാബ് ടെസ്റ്റുകൾ, അല്ലെങ്കിൽ ഡോക്ടറുടെ പ്രിസ്ക്രിപ്ഷൻ മനസ്സിലാക്കാൻ മാത്രമാണ്. ദയവായി നിങ്ങളുടെ റിപ്പോർട്ടിന്റെ ഫോട്ടോ/PDF അപ്ലോഡ് ചെയ്യുക അല്ലെങ്കിൽ ടെക്സ്റ്റ് ടൈപ്പ് ചെയ്യുക. മറ്റ് വിഷയങ്ങൾക്ക് ഇവിടെ ഉത്തരം ലഭിക്കില്ല.",
      nextStep: "നിങ്ങളുടെ മെഡിക്കൽ റിപ്പോർട്ട് അപ്ലോഡ് ചെയ്യുക അല്ലെങ്കിൽ ടെക്സ്റ്റ് പേസ്റ്റ് ചെയ്യുക.",
    },
    punjabi: {
      summary: "ਇਹ ਐਪ ਸਿਰਫ਼ ਮੈਡੀਕਲ ਰਿਪੋਰਟਾਂ, ਲੈਬ ਟੈਸਟ, ਜਾਂ ਡਾਕਟਰ ਦੀ ਪ੍ਰਿਸਕ੍ਰਿਪਸ਼ਨ ਸਮਝਣ ਲਈ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਰਿਪੋਰਟ ਦੀ ਫ਼ੋਟੋ/PDF ਅੱਪਲੋਡ ਕਰੋ ਜਾਂ ਟੈਕਸਟ ਟਾਈਪ ਕਰੋ। ਹੋਰ ਵਿਸ਼ਿਆਂ ਦਾ ਜਵਾਬ ਇੱਥੇ ਨਹੀਂ ਮਿਲਦਾ।",
      nextStep: "ਆਪਣੀ ਮੈਡੀਕਲ ਰਿਪੋਰਟ ਅੱਪਲੋਡ ਕਰੋ ਜਾਂ ਟੈਕਸਟ ਪੇਸਟ ਕਰੋ।",
    },
    urdu: {
      summary: "یہ ایپ صرف میڈیکل رپورٹس، لیب ٹیسٹ، یا ڈاکٹر کی پریسکرپشن سمجھنے کے لیے ہے۔ براہ کرم اپنی رپورٹ کی تصویر/PDF اپ لوڈ کریں یا ٹیکسٹ ٹائپ کریں۔ دیگر موضوعات کا جواب یہاں نہیں ملتا۔",
      nextStep: "اپنی میڈیکل رپورٹ اپ لوڈ کریں یا ٹیکسٹ پیسٹ کریں۔",
    },
    odia: {
      summary: "ଏହି ଆପ୍ କେବଳ ମେଡିକାଲ ରିପୋର୍ଟ, ଲ୍ୟାବ୍ ଟେଷ୍ଟ, ବା ଡାକ୍ତରଙ୍କ ପ୍ରେସକ୍ରିପସନ୍ ବୁଝିବା ପାଇଁ। ଦୟାକରି ଆପଣଙ୍କ ରିପୋର୍ଟର ଫଟୋ/PDF ଅପଲୋଡ୍ କରନ୍ତୁ ବା ଟେକ୍ସଟ୍ ଟାଇପ୍ କରନ୍ତୁ। ଅନ୍ୟ ବିଷୟର ଉତ୍ତର ଏଠାରେ ମିଳେନାହିଁ।",
      nextStep: "ଆପଣଙ୍କ ମେଡିକାଲ ରିପୋର୍ଟ ଅପଲୋଡ୍ କରନ୍ତୁ ବା ଟେକ୍ସଟ୍ ପେଷ୍ଟ କରନ୍ତୁ।",
    },
    assamese: {
      summary: "এই এপটো কেৱল চিকিৎসা প্ৰতিৱেদন, লেব টেষ্ট, বা ডাক্তৰৰ প্ৰেস্ক্ৰিপচন বুজাৰ বাবে। অনুগ্ৰহ কৰি আপোনাৰ প্ৰতিৱেদনৰ ফটো/PDF আপলোড কৰক বা টেক্সট টাইপ কৰক। অন্য বিষয়ৰ উত্তৰ ইয়াত নাপায়।",
      nextStep: "আপোনাৰ চিকিৎসা প্ৰতিৱেদন আপলোড কৰক বা টেক্সট পেষ্ট কৰক।",
    },
  };
  return map[lang] ?? map.hinglish;
}

function getCommonInstructions(lang: string): string {
  const refuse = getRefuseMessages(lang);
  return `Tu ek medical report READER/TRANSLATOR assistant hai. Tera kaam SIRF report/prescription ke text ya image ko padh kar aam logon ko asaan bhasha me samjhana hai — diagnose KARNA NAHI hai.

🚫 TOPIC RESTRICTION (SABSE ZAROORI):
- Yeh app SIRF medical reports, lab tests, doctor ki prescriptions, aur X-rays ke baare me jawab deta hai.
- Agar user ka input koi medical report/test/prescription NAHI hai (jaise general questions, jokes, coding, recipes, news, math, random text, ya koi bhi non-medical topic), toh TUKA jawab mat dena.
- Aise case me JSON me sirf ye do (NEECHE diye gaye text ko EXACTLY use karo, mat badlo):
  {
    "summary": ${JSON.stringify(refuse.summary)},
    "findings": [],
    "overallStatus": "unknown",
    "nextSteps": [${JSON.stringify(refuse.nextStep)}],
    "warning": "",
    "reportType": "",
    "diagnosis": "",
    "bodyPart": "",
    "medicines": [],
    "observations": [],
    "advice": [],
    "testsSuggested": []
  }
- KABHI bhi non-medical content par elaborate jawab mat do. Sirf upar wala polite refuse message do, EXACTLY jaisa likha hai.

STRICT RULES (kabhi nahi todo):
- KABHI bhi koi bimari/condition "suspect" mat karo, "diagnosis" mat bana, "aapko ye bimari ho sakti hai" mat bolo. Yeh app diagnosis nahi karta.
- Sirf values, units, aur normal range padho. Value ko range se compare karke status (low/high/normal) batao — bas.
- explanation me sirf itna bolo ki ye value kya cheez measure karti hai (e.g. "Khoon me oxygen le jaane wala protein"), BIMARI ka naam mat lo.

🚫 BIMARI KE NAAM KI STRICT PABANDI (kabhi mat todo):
- KABHI bhi koi bimari/condition ka naam mat lo — chahe directly (jaise "anemia", "diabetes", "thyroid", "kidney problem", "infection", "heart damage", "liver problem") YA indirectly (jaise "khoon ki kami ka sign", "diabetes ka sign", "sugar ka ishaara", "kidney se related", "liver function se judi", "infection ka sign", "heart damage ka sign").
- "sign", "ishaara", "lakshan", "related", "indication", "marker", "ho sakta hai" jaise shabd use karke bhi bimari ka naam MAT batao.
- summary me SIRF bolo: kaunsi values low hain, kaunsi high hain, aur unke exact values. Bimari ka naam KABHI nahi.
- Example CORRECT summary: "Hemoglobin 6.2 g/dL (bahut kam), Glucose 445 mg/dL (bahut zyada), Creatinine 6.1 mg/dL (bahut zyada), Troponin 0.15 ng/mL (zyada). 12 me se 12 values abnormal hain."
- Example GALAT summary: "Hemoglobin kam hai jo anemia ka sign hai" YA "Glucose zyada hai jo diabetes ho sakta hai" YA "WBC zyada hai jo infection ka sign hai" YA "Troponin zyada hai jo heart damage ka sign hai" — YE SAB MAT LIKHO.
- explanation me bhi bimari ka naam MAT lo. Sirf bolo ye value kya measure karti hai (jaise "Khoon me oxygen le jaane wala protein"). "Infection ka sign", "heart damage ka sign", "kidney problem ka ishaara" — YE SAB GALAT HAI.

- nextSteps me hamesha "doctor ko dikhayein" type salah do, khud ilaaj/treatment mat batao.
- Bade medical terms ko simple shabdon me samjha, par diagnosis language avoid kar.
- Hamesha doctor se milne ki salah de.

BOHOT ZAROORI (multi-page reports ke liye): Agar report bahut badi hai (kai pages, 30-40 page bhi ho sakti hai), toh PHIR BHI HAR EK EK TEST ko padhna hai. Koi bhi test miss mat karo. Chahe 50, 100 ya 200 tests hon - sab list karo. Isliye explanation ko short rakhna (1 line, max 12-15 shabd) taaki saare tests fit ho jayein. Sirf values aur status par focus karo.${languageDirective(lang)}`;
}

function jsonInstruction(shape: string) {
  return `\n\nSTRICT INSTRUCTION: Apna jawab SIRF ek valid JSON object ke roop me do. JSON ke bahar koi text, koi markdown, koi explanation nahi. Json koi code fence (\`\`\`) me mat daal. Sirf shuddh JSON.\n\nJSON ka shape:\n${shape}`;
}

const TEST_REPORT_SHAPE = `{
  "reportType": "Report ka type (e.g. Blood Test, CBC, Urine Test, Lipid Profile)",
  "summary": "5-8 line me asaan shabdon me - kaunsi values range se bahar hain, kitni values abnormal hain, overall kya situation hai. Detail me batao taaki user ko clear ho. (BIMARI ka naam mat lo)",
  "findings": [
    {
      "name": "Test parameter naam (e.g. Hemoglobin)",
      "value": "Value + unit (image me jo likha hai)",
      "normalRange": "Normal range agar image me likha hai, warna empty string",
      "status": "low | high | normal | unknown",
      "explanation": "Asaan shabdon me ye value kya measure karti hai (BIMARI mat batao)"
    }
  ],
  "overallStatus": "normal | attention_needed | serious | unknown",
  "nextSteps": ["Asaan steps - sabse pehle doctor ko ye report dikhayein"],
  "warning": "Koi value bahut critical ho to doctor ko jaldi dikhaye, warna empty string"
}`;

const DOCTOR_SLIP_SHAPE = `{
  "diagnosis": "Doctor ne jo likha hai wahi yahan batao (jaisa likha hai, mat badlo), agar kuch nahi likha to empty string",
  "summary": "5-8 line me asaan shabdon me slip me kya likha hai - kaunsi dawaayein hain, kya bimari doctor ne likhi, kya salah di. Detail me batao.",
  "medicines": [
    {
      "name": "Dawa ka naam (jaisa likha hai)",
      "timing": "Kab lena hai - Subah/Shaam/Raat, khane ke pehle/baad (Hinglish me)",
      "dosage": "Kitni maatra leni hai (e.g. 1 tablet)",
      "duration": "Kitne din tak lena hai",
      "howToTake": "Kaise lena hai - pani se, etc.",
      "purpose": "Ye dawa kis liye di gayi hai (jaisa doctor ne likha)"
    }
  ],
  "advice": ["Doctor ki salah - diet, aaram, etc. (jaisa likha hai)"],
  "testsSuggested": ["Doctor ne jo test likhe ho"],
  "overallStatus": "normal | attention_needed | serious | unknown",
  "nextSteps": ["Asaan steps - dawa doctor ki salah se lo, kuch khud mat karo"],
  "warning": "Koi baat dhyan rakhni ho to asaan shabdon me, warna empty string"
}`;

const XRAY_SHAPE = `{
  "bodyPart": "X-ray kaunse body part ka hai (e.g. Chest, Knee, Hand)",
  "summary": "5-8 line me asaan shabdon me - ye X-ray kis body part ka hai, image saaf hai ya nahi, kya-kya visible hai. Detail me batao. BIMARI diagnose mat karo.",
  "observations": [
    {
      "finding": "Image me jo visible hai (e.g. 'haddiyan dikh rahi hain', 'image saaf hai')",
      "explanation": "Sirf description - diagnosis mat karo"
    }
  ],
  "overallStatus": "normal | attention_needed | serious | unknown",
  "nextSteps": ["X-ray ki interpretation sirf ek licensed radiologist kar sakta hai - unhe dikhayein"],
  "warning": "Empty string (diagnosis mat karo)"
}`;

const TEXT_SHAPE = `{
  "reportType": "Report ka type agar pata chale, warna empty string",
  "summary": "5-8 line me asaan shabdon me - kaunsi values range se bahar hain, kitni values abnormal hain, overall kya situation hai. Detail me batao taaki user ko clear ho. (BIMARI ka naam mat lo)",
  "findings": [
    {
      "name": "Parameter/test naam",
      "value": "Value + unit",
      "normalRange": "Normal range agar likha hai, warna empty string",
      "status": "low | high | normal | unknown",
      "explanation": "Asaan shabdon me ye value kya measure karti hai (BIMARI mat batao)"
    }
  ],
  "overallStatus": "normal | attention_needed | serious | unknown",
  "nextSteps": ["Asaan steps - sabse pehle doctor ko ye report dikhayein"],
  "warning": "Asaan shabdon me, warna empty string"
}`;

export function buildPrompt(
  mode: AnalysisMode,
  opts?: { isFile?: boolean; fileType?: "pdf" | "docx" | "image"; pages?: number; lang?: string }
): string {
  const lang = opts?.lang ?? "hinglish";
  const base = getCommonInstructions(lang);
  const fileNote =
    opts?.isFile && opts.fileType !== "image"
      ? ` Ye report ek ${opts.fileType?.toUpperCase()} file hai${
          opts.pages ? ` jisme lagbhag ${opts.pages} pages hain` : ""
        }. Poora document padha gaya hai - niche text me se HAR test/section uthao.`
      : "";

  if (mode === "test-report") {
    return (
      base +
      fileNote +
      "\n\nUser ne apni MEDICAL TEST REPORT upload ki hai. Ise dhyan se padh. Har value aur normal range ko exact padh. Sabhi tests/parameters list karo - koi miss nahi. Phir JSON do." +
      jsonInstruction(TEST_REPORT_SHAPE)
    );
  }
  if (mode === "doctor-slip") {
    return (
      base +
      fileNote +
      "\n\nUser ne DOCTOR KI PRESCRIPTION / SLIP upload ki hai. Ise dhyan se padh. Har dawa ka naam, timing, maatra, duration samajh. Doctor ki salah bhi padh. Phir JSON do." +
      jsonInstruction(DOCTOR_SLIP_SHAPE)
    );
  }
  if (mode === "xray") {
    return (
      base +
      "\n\nUser ne apne X-RAY ki image upload ki hai. X-ray dhyan se dekh. Body part pata kar. Kya normal dikh raha hai aur kya abnormal, dono bata. Yaad rakh - tu radiologist nahi hai, sirf madadgar hai. Phir JSON do." +
      jsonInstruction(XRAY_SHAPE)
    );
  }
  if (mode === "document") {
    return (
      base +
      fileNote +
      "\n\nUser ne apna MEDICAL REPORT (PDF/DOC) upload kiya hai jiska text neeche diya gaya hai. Ye report bahut badi ho sakti hai (kai pages). Ise DHYAN se padh. HAR EK test/parameter ko pakdo - koi na chhoote. Har value, unit aur normal range ko exact uthao. Phir JSON do." +
      jsonInstruction(TEXT_SHAPE)
    );
  }
  // text
  return (
    base +
    "\n\nUser ne apne medical report ka TEXT neeche diya hai. Ise dhyan se padh aur samjha. Phir JSON do." +
    jsonInstruction(TEXT_SHAPE)
  );
}

// ----- Document (multi-page) chunk analysis -----

const CHUNK_SHAPE = `{
  "findings": [
    {
      "name": "Test/parameter naam (exact jaisa report me hai)",
      "value": "Value + unit (exact)",
      "normalRange": "Normal range agar likha hai, warna empty string",
      "status": "low | high | normal | unknown",
      "explanation": "1 short line - ye value kya measure karti hai (BIMARI mat batao)"
    }
  ],
  "testsSuggested": ["Agar is chunk me koi suggested test likha ho"]
}`;

/**
 * Prompt for extracting data from ONE chunk of a large medical document.
 * DELIBERATELY clinical and data-only: no diagnosis, no "bimari" language.
 * This keeps the content focused on structured data extraction, which (a)
 * avoids the model's content filter on dense medical text and (b) keeps
 * output small per chunk so nothing truncates. Interpretation is deferred
 * to the summary call which receives compact data.
 */
export function buildChunkPrompt(lang: string = "hinglish"): string {
  return (
    `Tu ek lab data extraction assistant hai. Neeche ek medical lab report ka ek HISSA (chunk) diya gaya hai. Tera kaam SIRF data extract karna hai - diagnosis BILKUL nahi karna.

INSTRUCTIONS:
- Is chunk me jo bhi TESTS / parameters hain, HAR ek ko extract karo. Koi na chhoote.
- Har test ke liye: name (exact jaisa likha hai), value (exact number + unit), normalRange (jaisa report me hai), status (value ko range se compare karke: low / high / normal / unknown).
- explanation me 1 short line (max 10 shabd) me sirf bata ki ye value kya measure karti hai (e.g. "Khoon me oxygen carry karne wala protein"). BIMARI ka naam KABHI mat lo.
- KABHI bhi suspectedConditions mat banao - yeh app diagnosis nahi karta.
- Agar koi test suggest kiya gaya ho to testsSuggested me daalo.
- Bahar ka kuch mat banao. Sirf is chunk ka data do.${languageDirective(lang)}` +
    jsonInstruction(CHUNK_SHAPE)
  );
}

const MERGE_SHAPE = `{
  "reportType": "Report ka type (e.g. CBC, Lipid Profile, Thyroid Panel, Full Body Checkup)",
  "summary": "6-10 line me asaan shabdon me - kaunsi values range se bahar hain, kitni abnormal hain, overall report kya keh rahi hai. Detail me batao taaki user ko poora context mile. (BIMARI ka naam mat lo)",
  "findings": [
    {
      "name": "Test/parameter naam",
      "value": "Value + unit",
      "normalRange": "Normal range agar pata hai warna empty string",
      "status": "low | high | normal | unknown",
      "explanation": "Asaan shabdon me ye value kya measure karti hai (BIMARI mat batao)"
    }
  ],
  "testsSuggested": ["Sujhe gaye test agar koi"],
  "overallStatus": "normal | attention_needed | serious | unknown",
  "nextSteps": ["Asaan steps - sabse pehle doctor ko ye report dikhayein"],
  "warning": "Koi value bahut critical ho to doctor ko jaldi dikhaye, warna empty string"
}`;

/**
 * Prompt for merging partial chunk results into one final analysis.
 * `serializedPartials` is a JSON string of the partial results array.
 */
export function buildMergePrompt(serializedPartials: string, lang: string = "hinglish"): string {
  return (
    getCommonInstructions(lang) +
    "\n\nNeeche ek BADE medical report ke alag-alag CHUNKS se nikle PARTIAL results diye gaye hain (JSON array). Tera kaam: in sab ko MERGE karke EK final poora result banana hai.\n\nKaaray:\n1. Findings me DUPLICATE tests hatao (same test alag chunk me ho sakti hai - ek hi rakho, value wahi jo zyada clear/me complete ho).\n2. testsSuggested me duplicates hatao.\n3. Poore report ka summary banao (6-10 line) - DETAIL me batao: total kitne tests the, kitne abnormal (low/high), kaun-kaun se main values range se bahar hain, overall situation kya hai. Aam insaan ko poora context samajh aana chahiye. (BIMARI suspect mat karo).\n4. overallStatus decide karo - agar koi bhi value bahut critical hai to 'serious', warna 'attention_needed' ya 'normal'.\n5. nextSteps banao - sabse pehle doctor ko ye report dikhayein.\n6. warning me agar koi value bahut critical ho to asaan shabdon me batao.\n7. reportType pata karo (e.g. 'Complete Health Checkup', 'CBC + Lipid + Thyroid').\n\nIMPORTANT: suspectedConditions KABHI mat banao - yeh app diagnosis nahi karta. Sirf values, range, status do.\n\nPARTIAL RESULTS JSON:\n" +
    serializedPartials +
    jsonInstruction(MERGE_SHAPE)
  );
}

/** Single-call prompt for a small document that fits in one chunk. */
export function buildSingleDocPrompt(lang: string = "hinglish"): string {
  return buildPrompt("document", { lang });
}

const SUMMARY_SHAPE = `{
  "reportType": "Report ka type (e.g. Full Body Checkup, CBC + LFT + KFT)",
  "summary": "6-10 line me asaan shabdon me - kaunsi values range se bahar hain, kitni abnormal hain, overall report kya keh rahi hai. Detail me batao taaki user ko poora context mile. (BIMARI ka naam mat lo)",
  "overallStatus": "normal | attention_needed | serious | unknown",
  "nextSteps": ["Asaan steps - sabse pehle doctor ko ye report dikhayein (3-5 points)"],
  "warning": "Koi value bahut critical ho to asaan shabdon me, warna empty string"
}`;

/**
 * Prompt for the final "summary" call over a large document. Receives only a
 * COMPACT list of finding names + statuses + condition names (not the full
 * explanations), so the output stays small and never truncates. The actual
 * findings (with values + explanations) are assembled in code, not by this
 * call.
 */
export function buildSummaryPrompt(compactReport: string, lang: string = "hinglish"): string {
  return (
    getCommonInstructions(lang) +
    "\n\nNeeche ek BADE medical report se nikale saare TESTS (name + value + status) di gayi hain. Tera kaam sirf itna hai:\n1. reportType pata karo (e.g. 'Full Body Checkup', 'CBC + LFT + Thyroid')\n2. summary banao (6-10 line, asaan bhasha me - DETAIL me batao: total kitne tests the, kitne abnormal (low/high), kaun-kaun se main values range se bahar hain, overall situation kya hai. User ko poora context milna chahiye. BIMARI ka naam KABHI mat lo)\n3. overallStatus decide karo (normal / attention_needed / serious)\n4. nextSteps banao (3-5 asaan steps - sabse pehle doctor ko dikhayein)\n5. warning me agar koi value bahut critical ho to asaan shabdon me likho, warna empty string\n\nFindings ko DOBARA list mat karo - woh alag se handle ho jayenge. Sirf upar ke 5 field do.\n\nCOMPACT REPORT:\n" +
    compactReport +
    jsonInstruction(SUMMARY_SHAPE)
  );
}

/** Disclaimer text in the user's chosen language (falls back to English). */
export function getDisclaimer(lang: string = "hinglish"): string {
  const map: Record<string, string> = {
    hinglish:
      "Ye AI se banaya gaya samajh hai sirf jaankari ke liye. Ye kisi doctor ki salah ya diagnosis ka vibhajan (replacement) nahi hai. Faisla karne se pehle hamesha apne doctor se milein.",
    english:
      "This AI-generated explanation is for information only. It is NOT a replacement for a doctor's advice or diagnosis. Always consult your doctor before making any decision.",
    hindi:
      "यह AI द्वारा बनाई गई समझ केवल जानकारी के लिए है। यह किसी डॉक्टर की सलाह या निदान का विकल्प नहीं है। कोई भी निर्णय लेने से पहले हमेशा अपने डॉक्टर से मिलें।",
    bengali:
      "এই AI-তৈরি ব্যাখ্যাটি কেবল তথ্যের জন্য। এটি ডাক্তারের পরামর্শ বা রোগ নির্ণয়ের বিকল্প নয়। কোনো সিদ্ধান্ত নেওয়ার আগে অবশ্যই ডাক্তারের সাথে দেখা করুন।",
    tamil:
      "இந்த AI உருவாக்கிய விளக்கம் தகவலுக்காக மட்டுமே. இது மருத்துவரின் ஆலோசனை அல்லது நோய் கண்டறிதலுக்கு மாற்று அல்ல. எந்த முடிவெடுப்பதற்கு முன்பும் கட்டாயம் மருத்துவரை சந்திக்கவும்.",
    telugu:
      "ఈ AI ద్వారా తయారైన వివరణ కేవలం సమాచారం కోసం. ఇది డాక్టర్ సలహా లేదా నిర్ధారణకు ప్రత్యామ్నాయం కాదు. ఏ నిర్ణయం తీసుకునే ముందు తప్పనిసరిగా మీ డాక్టర్‌ను కలవండి.",
    marathi:
      "ही AI ने बनवलेली समज फक्त माहितीसाठी आहे. हे डॉक्टरांच्या सल्ल्याचे किंवा निदानाचे पर्याय नाही. कोणताही निर्णय घेण्यापूर्वी नेहमी तुमच्या डॉक्टरांना भेटा.",
    gujarati:
      "આ AI દ્વારા બનાવેલી સમજ માત્ર માહિતી માટે છે. તે ડૉક્ટરની સલાહ કે નિદાનનું વિકલ્પ નથી. કોઈપણ નિર્ણય લેતા પહેલા હંમેશા તમારા ડૉક્ટરને મળો.",
    kannada:
      "ಈ AI ರಚಿಸಿದ ವಿವರಣೆ ಕೇವಲ ಮಾಹಿತಿಗಾಗಿ. ಇದು ವೈದ್ಯರ ಸಲಹೆ ಅಥವಾ ರೋಗ ನಿರ್ಣಯಕ್ಕೆ ಪರ್ಯಾಯವಲ್ಲ. ಯಾವುದೇ ನಿರ್ಧಾರ ತೆಗೆದುಕೊಳ್ಳುವ ಮೊದಲು ಯಾವಾಗಲೂ ನಿಮ್ಮ ವೈದ್ಯರನ್ನು ಭೇಟಿಯಾಗಿ.",
    malayalam:
      "ഈ AI നിർമ്മിച്ച വിശദീകരണം വിവരങ്ങൾക്കായി മാത്രം. ഇത് ഡോക്ടറുടെ ഉപദേശത്തിനോ രോഗനിർണ്ണയത്തിനോ പകരമല്ല. എന്ത് തീരുമാനമെടുക്കുന്നതിനും മുൻപ് എപ്പോഴും നിങ്ങളുടെ ഡോക്ടറെ കാണുക.",
    punjabi:
      "ਇਹ AI ਵਲੋਂ ਬਣਾਈ ਸਮਝ ਸਿਰਫ਼ ਜਾਣਕਾਰੀ ਲਈ ਹੈ। ਇਹ ਕਿਸੇ ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਜਾਂ ਨਿਦਾਨ ਦਾ ਬਦਲ ਨਹੀਂ ਹੈ। ਕੋਈ ਵੀ ਫੈਸਲਾ ਲੈਣ ਤੋਂ ਪਹਿਲਾਂ ਹਮੇਸ਼ਾ ਆਪਣੇ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।",
    urdu:
      "یہ AI کی بنائی ہوئی سمجھ صرف معلومات کے لیے ہے۔ یہ کسی ڈاکٹر کے مشورے یا تشخیص کا متبادل نہیں ہے۔ کوئی بھی فیصلہ کرنے سے پہلے ہمیشہ اپنے ڈاکٹر سے ملیں۔",
    odia:
      "ଏହି AI ଦ୍ୱାରା ନିର୍ମିତ ବ୍ୟାଖ୍ୟା କେବଳ ସୂଚନା ପାଇଁ। ଏହା ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ବା ରୋଗ ନିର୍ଣ୍ଣୟର ବିକଳ୍ପ ନୁହେଁ। ଯେକୌଣସି ସିଦ୍ଧାନ୍ତ ନେବା ପୂର୍ବରୁ ସର୍ବଦା ଡାକ୍ତରଙ୍କୁ ଭେଟନ୍ତୁ।",
    assamese:
      "এই AI-দ্বাৰা নিৰ্মিত ব্যাখ্যাটো কেৱল তথ্যৰ বাবে। এইটো ডাক্তৰৰ পৰামৰ্শ বা ৰোগ নিৰ্ণয়ৰ বিকল্প নহয়। যিকোনো সিদ্ধান্ত লোৱাৰ আগতে সদায় আপোনাৰ ডাক্তৰক লগ কৰক।",
  };
  return map[lang] ?? map.hinglish;
}

// Robustly extract a JSON object from a model response that may contain
// surrounding text or markdown fences.
export function extractJson(raw: string): unknown {
  if (!raw) throw new Error("Khali response");
  let text = raw.trim();

  // Strip markdown code fences if present.
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) text = fence[1].trim();

  // Find the first '{' and the matching last '}'.
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("JSON object nahi mila");
  }
  const slice = text.slice(start, end + 1);
  return JSON.parse(slice);
}

/**
 * Recover findings/conditions/tests from a TRUNCATED JSON response. When the
 * model's output hits the token limit mid-array, `extractJson` fails. This
 * function scans the raw text for complete `{...}` objects inside the
 * "findings", "suspectedConditions", "medicines", "observations", and
 * "testsSuggested" arrays and returns whatever it can salvage.
 */
export function recoverFromTruncated(raw: string): {
  findings: unknown[];
  suspectedConditions: unknown[];
  medicines: unknown[];
  observations: unknown[];
  testsSuggested: string[];
  advice: string[];
  reportType?: string;
  summary?: string;
  bodyPart?: string;
  diagnosis?: string;
} {
  const result = {
    findings: [] as unknown[],
    suspectedConditions: [] as unknown[],
    medicines: [] as unknown[],
    observations: [] as unknown[],
    testsSuggested: [] as string[],
    advice: [] as string[],
  };

  if (!raw) return result;
  let text = raw.trim();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) text = fence[1].trim();

  // Extract a scalar string field (reportType, summary, bodyPart, diagnosis).
  const scalarFields = ["reportType", "summary", "bodyPart", "diagnosis"] as const;
  const scalars: Record<string, string | undefined> = {};
  for (const field of scalarFields) {
    const re = new RegExp(`"${field}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)`, "i");
    const m = text.match(re);
    if (m) scalars[field] = m[1].replace(/\\"/g, '"').replace(/\\n/g, "\n");
  }

  // Extract complete objects from a named array.
  const extractArray = (name: string): unknown[] => {
    const out: unknown[] = [];
    const idx = text.indexOf(`"${name}"`);
    if (idx === -1) return out;
    // Start scanning after the array opening bracket.
    const arrStart = text.indexOf("[", idx);
    if (arrStart === -1) return out;
    let i = arrStart + 1;
    while (i < text.length) {
      const objStart = text.indexOf("{", i);
      if (objStart === -1) break;
      // Walk to the matching close brace, respecting nesting & strings.
      let depth = 0;
      let j = objStart;
      let inStr = false;
      let escape = false;
      while (j < text.length) {
        const ch = text[j];
        if (escape) {
          escape = false;
        } else if (ch === "\\") {
          escape = true;
        } else if (ch === '"') {
          inStr = !inStr;
        } else if (!inStr) {
          if (ch === "{") depth++;
          else if (ch === "}") {
            depth--;
            if (depth === 0) break;
          }
        }
        j++;
      }
      if (depth !== 0) break; // incomplete object — truncated
      const objText = text.slice(objStart, j + 1);
      try {
        out.push(JSON.parse(objText));
      } catch {
        // skip malformed
      }
      i = j + 1;
      // Stop if we hit the array close.
      const next = text.indexOf("[", i);
      const close = text.indexOf("]", i);
      if (close !== -1 && (next === -1 || close < next)) break;
    }
    return out;
  };

  result.findings = extractArray("findings");
  result.suspectedConditions = extractArray("suspectedConditions");
  result.medicines = extractArray("medicines");
  result.observations = extractArray("observations");

  // Extract string arrays (testsSuggested, advice, nextSteps).
  const extractStringArray = (name: string): string[] => {
    const out: string[] = [];
    const re = new RegExp(`"${name}"\\s*:\\s*\\[([\\s\\S]*?)\\]`, "i");
    const m = text.match(re);
    if (!m) return out;
    const itemRe = /"((?:[^"\\\\]|\\\\.)*)"/g;
    let im;
    while ((im = itemRe.exec(m[1])) !== null) {
      out.push(im[1].replace(/\\"/g, '"').replace(/\\n/g, "\n"));
    }
    return out;
  };
  result.testsSuggested = extractStringArray("testsSuggested");
  result.advice = extractStringArray("advice");

  return { ...result, ...scalars };
}

/**
 * Split a long document text into overlapping chunks so that tests spanning
 * a page boundary are not lost. Each chunk targets ~`targetSize` characters
 * with `overlap` characters of overlap between consecutive chunks.
 */
export function chunkText(
  text: string,
  targetSize = 9000,
  overlap = 600
): string[] {
  const clean = text.replace(/\r/g, "").trim();
  if (clean.length <= targetSize) return [clean];
  const chunks: string[] = [];
  let i = 0;
  while (i < clean.length) {
    let end = i + targetSize;
    if (end >= clean.length) {
      chunks.push(clean.slice(i));
      break;
    }
    // Try to break at a newline near the target for cleaner chunks.
    const breakAt = clean.lastIndexOf("\n", end);
    if (breakAt > i + targetSize * 0.5) end = breakAt;
    chunks.push(clean.slice(i, end));
    i = end - overlap;
    if (i < 0) i = 0;
  }
  return chunks.filter((c) => c.trim().length > 0);
}

// ---- UI labels (for translating key interface strings) ----
export interface UiLabels {
  heroTitle: string;
  heroSubtitle: string;
  analyzeButton: string;
  analyzing: string;
  reset: string;
  resultFor: string;
  reportKhulasa: string;
  summaryTitle: string;
  findingsTitle: string;
  medicinesTitle: string;
  observationsTitle: string;
  // NOTE: conditionsTitle removed — this app no longer shows "suspected conditions".
  adviceTitle: string;
  testsTitle: string;
  nextStepsTitle: string;
  warningTitle: string;
  emptyTitle: string;
  emptySubtitle: string;
  // New: prominent disclaimer banner (shown on every screen) + critical alert.
  disclaimerBanner: string;
  criticalAlertTitle: string;
  criticalAlertBody: string;
  readerModeNote: string;
  // Doctor CTA + data notice (shown on results + upload zone).
  doctorCtaTitle: string;
  doctorCtaBody: string;
  dataNotice: string;
}

export function getUiLabels(lang: string = "hinglish"): UiLabels {
  const map: Record<string, UiLabels> = {
    hinglish: {
      heroTitle: "Apni medical report aasan bhasha me padho",
      heroSubtitle: "Test report, doctor ki slip, ya badi PDF upload karo — AI use asaan bhasha me padh kar bata dega kaunsi values range me hain aur kaunsi bahar. Ye diagnosis nahi karta.",
      analyzeButton: "Padh Kar Batao",
      analyzing: "Report padh raha hai...",
      reset: "Reset",
      resultFor: "Result for:",
      reportKhulasa: "Aapki Report Ka Khulasa",
      summaryTitle: "Asaan Shabdon Me Summary",
      findingsTitle: "Test Findings (Values)",
      medicinesTitle: "Dawaayein (Kaise Leni Hai)",
      observationsTitle: "X-Ray Me Kya Dikh Raha Hai",
      adviceTitle: "Doctor Ki Salah",
      testsTitle: "Sujhe Gaye Test",
      nextStepsTitle: "Aage Kya Kare",
      warningTitle: "Dhyan Rakhein",
      emptyTitle: "Upar tab choose karo aur report upload ya type karo",
      emptySubtitle: "Padhne ke baad yahan aasan bhasha me poora khulasa dikhega.",
      disclaimerBanner: "Ye app sirf report PADHNE me madad karta hai — ye DIAGNOSIS nahi karta. Hamesha doctor se milein.",
      criticalAlertTitle: "\u26a0\ufe0f Critical Value Mili — Jaldi Doctor Ko Dikhayein",
      criticalAlertBody: "Aapki report me kuch values aisi hain jo bahut critical hain. Ye emergency ho sakti hai — kripya jaldi kisi doctor ya hospital se sampark karein. Ye AI ka jawab hai, galat bhi ho sakta hai — verify zaroor karayein.",
      readerModeNote: "Ye app values aur range padh kar dikhata hai. Bimari diagnose nahi karta.",
      doctorCtaTitle: 'Is report ko apne doctor ko zaroor dikhayein',
      doctorCtaBody: 'Ye AI jawab diagnosis nahi hai. Sahi diagnosis aur ilaaj ke liye licensed doctor se report zaroor dikhayein.',
      dataNotice: 'Aapki report memory me process hoti hai aur server pe save nahi hoti.',
    },
    english: {
      heroTitle: "Read your medical report in simple language",
      heroSubtitle: "Upload your test report, doctor's prescription, or a large PDF — the AI reads it and tells you which values are in range and which are out. This does NOT diagnose.",
      analyzeButton: "Read & Explain",
      analyzing: "Reading your report...",
      reset: "Reset",
      resultFor: "Result for:",
      reportKhulasa: "Your Report Summary",
      summaryTitle: "Summary in Simple Words",
      findingsTitle: "Test Findings (Values)",
      medicinesTitle: "Medicines (How to Take)",
      observationsTitle: "What the X-Ray Shows",
      adviceTitle: "Doctor's Advice",
      testsTitle: "Suggested Tests",
      nextStepsTitle: "What to Do Next",
      warningTitle: "Take Care",
      emptyTitle: "Choose a tab above and upload or type your report",
      emptySubtitle: "After reading, a full explanation will appear here in simple language.",
      disclaimerBanner: "This app only helps you READ your report — it does NOT diagnose. Always consult a doctor.",
      criticalAlertTitle: "\u26a0\ufe0f Critical Value Found — See a Doctor Immediately",
      criticalAlertBody: "Some values in your report are critically out of range. This could be an emergency — please contact a doctor or hospital right away. This is AI output and may be wrong — please verify.",
      readerModeNote: "This app reads values and ranges. It does not diagnose diseases.",
      doctorCtaTitle: 'Show this to your doctor',
      doctorCtaBody: 'This AI reading is not a diagnosis. A licensed doctor must review your report for proper diagnosis and treatment.',
      dataNotice: 'Your report is processed in memory and is NOT stored on our servers.',
    },
    hindi: {
      heroTitle: "अपनी मेडिकल रिपोर्ट आसान भाषा में पढ़ें",
      heroSubtitle: "टेस्ट रिपोर्ट, डॉक्टर की स्लिप, या बड़ी PDF अपलोड करें — AI इसे पढ़कर बताएगा कौन-सी वैल्यूज़ रेंज में हैं और कौन-सी बाहर। यह बीमारी का निदान नहीं करता।",
      analyzeButton: "पढ़कर समझाएं",
      analyzing: "रिपोर्ट पढ़ रहा है...",
      reset: "रीसेट",
      resultFor: "परिणाम:",
      reportKhulasa: "आपकी रिपोर्ट का खुलासा",
      summaryTitle: "आसान शब्दों में सारांश",
      findingsTitle: "टेस्ट परिणाम (मान)",
      medicinesTitle: "दवाएं (कैसे लें)",
      observationsTitle: "एक्स-रे में क्या दिख रहा है",
      adviceTitle: "डॉक्टर की सलाह",
      testsTitle: "सुझाए गए टेस्ट",
      nextStepsTitle: "आगे क्या करें",
      warningTitle: "ध्यान रखें",
      emptyTitle: "ऊपर टैब चुनें और रिपोर्ट अपलोड या टाइप करें",
      emptySubtitle: "पढ़ने के बाद यहाँ आसान भाषा में पूरा खुलासा दिखेगा।",
      disclaimerBanner: "यह ऐप सिर्फ़ आपकी रिपोर्ट पढ़ने में मदद करता है — यह निदान (डायग्नोसिस) नहीं करता। हमेशा डॉक्टर से मिलें।",
      criticalAlertTitle: "⚠️ खतरनाक वैल्यू मिली — तुरंत डॉक्टर को दिखाएं",
      criticalAlertBody: "आपकी रिपोर्ट में कुछ वैल्यूज़ बहुत खतरनाक रूप से रेंज से बाहर हैं। यह इमरजेंसी हो सकती है — कृपया तुरंत किसी डॉक्टर या अस्पताल से संपर्क करें। यह AI का जवाब है, ग़लत भी हो सकता है — कृपया जाँच कराएं।",
      readerModeNote: "यह ऐप वैल्यूज़ और रेंज पढ़कर दिखाता है। यह बीमारियों का निदान नहीं करता।",
      doctorCtaTitle: 'इसे अपने डॉक्टर को ज़रूर दिखाएं',
      doctorCtaBody: 'यह AI जवाब निदान नहीं है। सही निदान और इलाज के लिए लाइसेंस्ड डॉक्टर से रिपोर्ट ज़रूर दिखाएं।',
      dataNotice: 'आपकी रिपोर्ट मेमोरी में प्रोसेस होती है और सर्वर पर सेव नहीं होती।',
    },
    bengali: {
      heroTitle: "আপনার মেডিকেল রিপোর্ট সহজ ভাষায় পড়ুন",
      heroSubtitle: "টেস্ট রিপোর্ট, ডাক্তারের স্লিপ, বা বড় PDF আপলোড করুন — AI সেটি পড়ে বলবে কোন মানগুলি রেঞ্জের মধ্যে আর কোনগুলি বাইরে। এটি রোগ নির্ণয় করে না।",
      analyzeButton: "পড়ুন ও বুঝিয়ে বলুন",
      analyzing: "রিপোর্ট পড়ছে...",
      reset: "রিসেট",
      resultFor: "ফলাফল:",
      reportKhulasa: "আপনার রিপোর্টের সারাংশ",
      summaryTitle: "সহজ শব্দে সারাংশ",
      findingsTitle: "টেস্ট ফলাফল",
      medicinesTitle: "ওষুধ (কীভাবে খাবেন)",
      observationsTitle: "এক্স-রে-তে কী দেখা যাচ্ছে",
      adviceTitle: "ডাক্তারের পরামর্শ",
      testsTitle: "প্রস্তাবিত টেস্ট",
      nextStepsTitle: "এরপর কী করবেন",
      warningTitle: "সতর্কতা",
      emptyTitle: "উপরের ট্যাব বেছে নিন এবং রিপোর্ট আপলোড বা টাইপ করুন",
      emptySubtitle: "পড়ার পরে সহজ ভাষায় পুরো ব্যাখ্যা এখানে দেখা যাবে।",
      disclaimerBanner: "এই অ্যাপ শুধু আপনার রিপোর্ট পড়তে সাহায্য করে — এটি রোগ নির্ণয় (ডায়াগনোসিস) করে না। সবসময় ডাক্তারের সাথে দেখা করুন।",
      criticalAlertTitle: "⚠️ বিপজ্জনক মান পাওয়া গেছে — দ্রুত ডাক্তারকে দেখান",
      criticalAlertBody: "আপনার রিপোর্টে কিছু মান বিপজ্জনকভাবে রেঞ্জের বাইরে। এটি একটি ইমার্জেন্সি হতে পারে — দয়া করে দ্রুত কোনো ডাক্তার বা হাসপাতালের সাথে যোগাযোগ করুন। এটি AI-এর উত্তর, ভুলও হতে পারে — দয়া করে যাচাই করুন।",
      readerModeNote: "এই অ্যাপ মান ও রেঞ্জ পড়ে দেখায়। এটি রোগ নির্ণয় করে না।",
      doctorCtaTitle: 'এটি আপনার ডাক্তারকে অবশ্যই দেখান',
      doctorCtaBody: 'এই AI উত্তর রোগ নির্ণয় নয়। সঠিক নির্ণয় ও চিকিৎসার জন্য লাইসেন্সপ্রাপ্ত ডাক্তারকে রিপোর্ট দেখান।',
      dataNotice: 'আপনার রিপোর্ট মেমোরিতে প্রসেস হয় এবং সার্ভারে সংরক্ষিত হয় না।',
    },
    tamil: {
      heroTitle: "உங்கள் மருத்துவ அறிக்கையை எளிய மொழியில் படியுங்கள்",
      heroSubtitle: "டெஸ்ட் அறிக்கை, மருத்துவரின் ஸ்லிப், அல்லது பெரிய PDF ஐப் பதிவேற்றவும் — AI அதைப் படித்து எந்த மதிப்புகள் ரேஞ்சிற்குள் உள்ளன மற்றும் எவை வெளியே உள்ளன என்று கூறும். இது நோய் கண்டறியவில்லை.",
      analyzeButton: "படித்து விளக்குங்கள்",
      analyzing: "அறிக்கையைப் படிக்கிறது...",
      reset: "மீட்டமை",
      resultFor: "முடிவு:",
      reportKhulasa: "உங்கள் அறிக்கைச் சுருக்கம்",
      summaryTitle: "எளிய சொற்களில் சுருக்கம்",
      findingsTitle: "பரிசோதனை முடிவுகள்",
      medicinesTitle: "மருந்துகள் (எப்படி எடுப்பது)",
      observationsTitle: "எக்ஸ்-ரே-யில் என்ன தெரிகிறது",
      adviceTitle: "மருத்துவரின் அறிவுரை",
      testsTitle: "பரிந்துரைக்கப்பட்ட பரிசோதனைகள்",
      nextStepsTitle: "அடுத்து என்ன செய்வது",
      warningTitle: "கவனம்",
      emptyTitle: "மேலே உள்ள டேப்பைத் தேர்ந்தெடுத்து அறிக்கையைப் பதிவேற்றவும்",
      emptySubtitle: "படித்த பிறகு எளிய மொழியில் முழு விளக்கம் இங்கே தெரியும்.",
      disclaimerBanner: "இந்த ஆப் உங்கள் அறிக்கையைப் படிக்க மட்டுமே உதவுகிறது — இது நோய் கண்டறியவில்லை. எப்போதும் மருத்துவரை அணுகவும்.",
      criticalAlertTitle: "⚠️ ஆபத்தான மதிப்பு கிடைத்தது — உடனே மருத்துவரைப் பார்க்கவும்",
      criticalAlertBody: "உங்கள் அறிக்கையில் சில மதிப்புகள் மிகவும் ஆபத்தாக ரேஞ்சிற்கு வெளியே உள்ளன. இது ஒரு அவசரமாக இருக்கலாம் — தயவுசெய்து உடனே மருத்துவர் அல்லது மருத்துவமனையைத் தொடர்பு கொள்ளவும். இது AI-ன் பதில், தவறாகவும் இருக்கலாம் — தயவுசெய்து சரிபார்க்கவும்.",
      readerModeNote: "இந்த ஆப் மதிப்புகள் மற்றும் ரேஞ்சைப் படித்துக் காட்டுகிறது. இது நோய்களைக் கண்டறியவில்லை.",
      doctorCtaTitle: 'இதை உங்கள் மருத்துவருக்கு கட்டாயம் காட்டுங்கள்',
      doctorCtaBody: 'இந்த AI பதில் நோய் கண்டறிதல் அல்ல. சரியான கண்டறிதலுக்கும் சிகிச்சைக்கும் உரிமம் பெற்ற மருத்துவரிடம் காட்டுங்கள்.',
      dataNotice: 'உங்கள் அறிக்கை நினைவகத்தில் செயல்படுத்தப்படுகிறது, சர்வரில் சேமிக்கப்படவில்லை.',
    },
    telugu: {
      heroTitle: "మీ వైద్య నివేదికను సులభమైన భాషలో చదవండి",
      heroSubtitle: "టెస్ట్ నివేదిక, డాక్టర్ స్లిప్, లేదా పెద్ద PDF అప్‌లోడ్ చేయండి — AI దానిని చదివి ఏ విలువలు రేంజ్‌లో ఉన్నాయో, ఏవి బయట ఉన్నాయో చెబుతుంది. ఇది వ్యాధిని నిర్ధారించదు.",
      analyzeButton: "చదవండి మరియు వివరించండి",
      analyzing: "నివేదికను చదువుతోంది...",
      reset: "రీసెట్",
      resultFor: "ఫలితం:",
      reportKhulasa: "మీ నివేదిక సారాంశం",
      summaryTitle: "సులభమైన మాటల్లో సారాంశం",
      findingsTitle: "పరీక్ష ఫలితాలు",
      medicinesTitle: "మందులు (ఎలా తీసుకోవాలి)",
      observationsTitle: "ఎక్స్-రేలో ఏమి కనిపిస్తుంది",
      adviceTitle: "డాక్టర్ సలహా",
      testsTitle: "సూచించిన పరీక్షలు",
      nextStepsTitle: "తరువాత ఏమి చేయాలి",
      warningTitle: "జాగ్రత్త",
      emptyTitle: "పైన ఉన్న ట్యాబ్‌ను ఎంచుకుని నివేదికను అప్‌లోడ్ చేయండి",
      emptySubtitle: "చదివిన తర్వాత సులభమైన భాషలో పూర్తి వివరణ ఇక్కడ కనిపిస్తుంది.",
      disclaimerBanner: "ఈ యాప్ మీ నివేదికను చదవడానికి మాత్రమే సహాయపడుతుంది — ఇది వ్యాధిని నిర్ధారించదు. ఎల్లప్పుడూ డాక్టర్‌ను సంప్రదించండి.",
      criticalAlertTitle: "⚠️ ప్రమాదకరమైన విలువ కనుగొనబడింది — వెంటనే డాక్టర్‌ను చూడండి",
      criticalAlertBody: "మీ నివేదికలో కొన్ని విలువలు ప్రమాదకరంగా రేంజ్‌కు బయట ఉన్నాయి. ఇది అత్యవసర పరిస్థితి కావచ్చు — దయచేసి వెంటనే డాక్టర్ లేదా ఆసుపత్రిని సంప్రదించండి. ఇది AI సమాధానం, తప్పు కూడా అయ్యి ఉండవచ్చు — దయచేసి నిర్ధారించుకోండి.",
      readerModeNote: "ఈ యాప్ విలువలు మరియు రేంజ్‌ను చదివి చూపిస్తుంది. ఇది వ్యాధులను నిర్ధారించదు.",
      doctorCtaTitle: 'దీనిని మీ డాక్టర్\u200cకు తప్పనిసరిగా చూపించండి',
      doctorCtaBody: 'ఈ AI సమాధానం నిర్ధారణ కాదు. సరైన నిర్ధారణ మరియు చికిత్స కోసం లైసెన్స్ పొందిన డాక్టర్\u200cకు చూపించండి.',
      dataNotice: 'మీ నివేదిక మెమరీలో ప్రాసెస్ అవుతుంది, సర్వర్\u200cలో నిల్వ చేయబడదు.',
    },
    marathi: {
      heroTitle: "तुमचा वैद्यकीय अहवाल सोप्या भाषेत वाचा",
      heroSubtitle: "टेस्ट रिपोर्ट, डॉक्टरांची स्लिप, किंवा मोठी PDF अपलोड करा — AI ते वाचून सांगेल कोणत्या व्हॅल्यूज रेंजमध्ये आहेत आणि कोणत्या बाहेर. हे आजाराचे निदान करत नाही.",
      analyzeButton: "वाचा आणि समजावा",
      analyzing: "अहवाल वाचत आहे...",
      reset: "रीसेट",
      resultFor: "निकाल:",
      reportKhulasa: "तुमचा अहवाल सारांश",
      summaryTitle: "सोप्या शब्दात सारांश",
      findingsTitle: "चाचणी निकाल",
      medicinesTitle: "औषधे (कशी घ्यावीत)",
      observationsTitle: "एक्स-रे मध्ये काय दिसते",
      adviceTitle: "डॉक्टरांचा सल्ला",
      testsTitle: "सुचवलेल्या चाचण्या",
      nextStepsTitle: "पुढे काय करावे",
      warningTitle: "काळजी घ्या",
      emptyTitle: "वरील टॅब निवडा आणि अहवाल अपलोड किंवा टाईप करा",
      emptySubtitle: "वाचल्यानंतर इथे सोप्या भाषेत संपूर्ण स्पष्टीकरण दिसेल.",
      disclaimerBanner: "हे ॲप फक्त तुमचा अहवाल वाचण्यास मदत करते — हे निदान करत नाही. नेहमी डॉक्टरांना भेटा.",
      criticalAlertTitle: "⚠️ धोकादायक व्हॅल्यू सापडली — लगेच डॉक्टरांना दाखवा",
      criticalAlertBody: "तुमच्या अहवालात काही व्हॅल्यूज धोकादायकरित्या रेंजच्या बाहेर आहेत. ही इमर्जन्सी असू शकते — कृपया लगेच कोणत्याही डॉक्टर किंवा रुग्णालयाशी संपर्क साधा. हे AI चे उत्तर आहे, चुकूही शकते — कृपया तपासा.",
      readerModeNote: "हे ॲप व्हॅल्यूज आणि रेंज वाचून दाखवते. हे आजारांचे निदान करत नाही.",
      doctorCtaTitle: 'हे तुमच्या डॉक्टरांना नक्की दाखवा',
      doctorCtaBody: 'हे AI उत्तर निदान नाही. योग्य निदान आणि उपचारासाठी लायसन्स्ड डॉक्टरांना रिपोर्ट दाखवा.',
      dataNotice: 'तुमचा अहवाल मेमरीमध्ये प्रक्रिया होतो आणि सर्व्हरवर साठवला जात नाही.',
    },
    gujarati: {
      heroTitle: "તમારો મેડિકલ રિપોર્ટ સરળ ભાષામાં વાંચો",
      heroSubtitle: "ટેસ્ટ રિપોર્ટ, ડૉક્ટરની સ્લિપ, અથવા મોટો PDF અપલોડ કરો — AI તેને વાંચીને કહેશે કઈ વેલ્યુઝ રેન્જમાં છે અને કઈ બહાર છે. તે નિદાન કરતું નથી.",
      analyzeButton: "વાંચીને સમજાવો",
      analyzing: "રિપોર્ટ વાંચી રહ્યું છે...",
      reset: "રીસેટ",
      resultFor: "પરિણામ:",
      reportKhulasa: "તમારા રિપોર્ટનો સારાંશ",
      summaryTitle: "સરળ શબ્દોમાં સારાંશ",
      findingsTitle: "ટેસ્ટ પરિણામો",
      medicinesTitle: "દવાઓ (કેવી રીતે લેવી)",
      observationsTitle: "એક્સ-રેમાં શું દેખાય છે",
      adviceTitle: "ડૉક્ટરની સલાહ",
      testsTitle: "સૂચવેલા ટેસ્ટ",
      nextStepsTitle: "આગળ શું કરવું",
      warningTitle: "ધ્યાન રાખો",
      emptyTitle: "ઉપરની ટેબ પસંદ કરો અને રિપોર્ટ અપલોડ કરો",
      emptySubtitle: "વાંચ્યા પછી અહીં સરળ ભાષામાં સંપૂર્ણ સમજૂતી દેખાશે.",
      disclaimerBanner: "આ એપ ફક્ત તમારો રિપોર્ટ વાંચવામાં મદદ કરે છે — તે નિદાન કરતું નથી. હંમેશા ડૉક્ટરને મળો.",
      criticalAlertTitle: "⚠️ જોખમી વેલ્યુ મળી — તરત ડૉક્ટરને બતાવો",
      criticalAlertBody: "તમારા રિપોર્ટમાં કેટલીક વેલ્યુઝ જોખમી રીતે રેન્જથી બહાર છે. આ ઇમર્જન્સી હોઈ શકે છે — કૃપા કરીને તરત જ કોઈ ડૉક્ટર અથવા હોસ્પિટલનો સંપર્ક કરો. આ AI નો જવાબ છે, ખોટો પણ હોઈ શકે છે — કૃપા કરીને ચકાસો.",
      readerModeNote: "આ એપ વેલ્યુઝ અને રેન્જ વાંચીને બતાવે છે. તે રોગોનું નિદાન કરતું નથી.",
      doctorCtaTitle: 'આને તમારા ડૉક્ટરને ચોક્કસ બતાવો',
      doctorCtaBody: 'આ AI જવાબ નિદાન નથી. યોગ્ય નિદાન અને સારવાર માટે લાયસન્સ્ડ ડૉક્ટરને રિપોર્ટ બતાવો.',
      dataNotice: 'તમારો રિપોર્ટ મેમરીમાં પ્રોસેસ થાય છે અને સર્વર પર સેવ થતો નથી.',
    },
    kannada: {
      heroTitle: "ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ವರದಿಯನ್ನು ಸರಳ ಭಾಷೆಯಲ್ಲಿ ಓದಿ",
      heroSubtitle: "ಟೆಸ್ಟ್ ವರದಿ, ವೈದ್ಯರ ಸ್ಲಿಪ್, ಅಥವಾ ದೊಡ್ಡ PDF ಅಪ್‌ಲೋಡ್ ಮಾಡಿ — AI ಅದನ್ನು ಓದಿ ಯಾವ ಮೌಲ್ಯಗಳು ಶ್ರೇಣಿಯಲ್ಲಿವೆ ಮತ್ತು ಯಾವುದು ಹೊರಗಿವೆ ಎಂದು ಹೇಳುತ್ತದೆ. ಇದು ರೋಗವನ್ನು ನಿರ್ಣಯಿಸುವುದಿಲ್ಲ.",
      analyzeButton: "ಓದಿ ಮತ್ತು ವಿವರಿಸಿ",
      analyzing: "ವರದಿಯನ್ನು ಓದುತ್ತಿದೆ...",
      reset: "ಮರುಹೊಂದಿಸಿ",
      resultFor: "ಫಲಿತಾಂಶ:",
      reportKhulasa: "ನಿಮ್ಮ ವರದಿಯ ಸಾರಾಂಶ",
      summaryTitle: "ಸರಳ ಪದಗಳಲ್ಲಿ ಸಾರಾಂಶ",
      findingsTitle: "ಪರೀಕ್ಷಾ ಫಲಿತಾಂಶಗಳು",
      medicinesTitle: "ಔಷಧಗಳು (ಹೇಗೆ ತೆಗೆದುಕೊಳ್ಳಬೇಕು)",
      observationsTitle: "ಎಕ್ಸ್-ರೇನಲ್ಲಿ ಏನು ಕಾಣುತ್ತಿದೆ",
      adviceTitle: "ವೈದ್ಯರ ಸಲಹೆ",
      testsTitle: "ಸೂಚಿಸಲಾದ ಪರೀಕ್ಷೆಗಳು",
      nextStepsTitle: "ಮುಂದೆ ಏನು ಮಾಡಬೇಕು",
      warningTitle: "ಎಚ್ಚರಿಕೆ",
      emptyTitle: "ಮೇಲಿನ ಟ್ಯಾಬ್ ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ವರದಿಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
      emptySubtitle: "ಓದಿದ ನಂತರ ಸರಳ ಭಾಷೆಯಲ್ಲಿ ಸಂಪೂರ್ಣ ವಿವರಣೆ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ.",
      disclaimerBanner: "ಈ ಆ್ಯಪ್ ನಿಮ್ಮ ವರದಿಯನ್ನು ಓದಲು ಮಾತ್ರ ಸಹಾಯ ಮಾಡುತ್ತದೆ — ಇದು ರೋಗವನ್ನು ನಿರ್ಣಯಿಸುವುದಿಲ್ಲ. ಯಾವಾಗಲೂ ವೈದ್ಯರನ್ನು ಭೇಟಿಯಾಗಿ.",
      criticalAlertTitle: "⚠️ ಅಪಾಯಕಾರಿ ಮೌಲ್ಯ ಸಿಕ್ಕಿದೆ — ತಕ್ಷಣ ವೈದ್ಯರಿಗೆ ತೋರಿಸಿ",
      criticalAlertBody: "ನಿಮ್ಮ ವರದಿಯಲ್ಲಿ ಕೆಲವು ಮೌಲ್ಯಗಳು ಅಪಾಯಕಾರಿಯಾಗಿ ಶ್ರೇಣಿಯ ಹೊರಗಿವೆ. ಇದು ತುರ್ತು ಸ್ಥಿತಿಯಾಗಿರಬಹುದು — ದಯವಿಟ್ಟು ತಕ್ಷಣ ವೈದ್ಯರು ಅಥವಾ ಆಸ್ಪತ್ರೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ. ಇದು AI ಉತ್ತರ, ತಪ್ಪಾಗಿರಬಹುದು — ದಯವಿಟ್ಟು ಪರಿಶೀಲಿಸಿ.",
      readerModeNote: "ಈ ಆ್ಯಪ್ ಮೌಲ್ಯಗಳು ಮತ್ತು ಶ್ರೇಣಿಯನ್ನು ಓದಿ ತೋರಿಸುತ್ತದೆ. ಇದು ರೋಗಗಳನ್ನು ನಿರ್ಣಯಿಸುವುದಿಲ್ಲ.",
      doctorCtaTitle: 'ಇದನ್ನು ನಿಮ್ಮ ವೈದ್ಯರಿಗೆ ಖಂಡಿತ ತೋರಿಸಿ',
      doctorCtaBody: 'ಈ AI ಉತ್ತರ ರೋಗ ನಿರ್ಣಯವಲ್ಲ. ಸರಿಯಾದ ನಿರ್ಣಯ ಮತ್ತು ಚಿಕಿತ್ಸೆಗಾಗಿ ಪರವಾನಗಿ ಪಡೆದ ವೈದ್ಯರಿಗೆ ತೋರಿಸಿ.',
      dataNotice: 'ನಿಮ್ಮ ವರದಿ ಮೆಮೊರಿಯಲ್ಲಿ ಪ್ರಕ್ರಿಯೆಗೊಳ್ಳುತ್ತದೆ, ಸರ್ವರ್\u200cನಲ್ಲಿ ಉಳಿಸಲಾಗುವುದಿಲ್ಲ.',
    },
    malayalam: {
      heroTitle: "നിങ്ങളുടെ മെഡിക്കൽ റിപ്പോർട്ട് ലളിതമായ ഭാഷയിൽ വായിക്കുക",
      heroSubtitle: "ടെസ്റ്റ് റിപ്പോർട്ട്, ഡോക്ടറുടെ സ്ലിപ്പ്, അല്ലെങ്കിൽ വലിയ PDF അപ്‌ലോഡ് ചെയ്യുക — AI അത് വായിച്ച് ഏത് മൂല്യങ്ങളാണ് റേഞ്ചിൽ ഉള്ളത്, ഏതൊക്കെയാണ് പുറത്തുള്ളത് എന്ന് പറയും. ഇത് രോഗനിർണ്ണയം നടത്തുന്നില്ല.",
      analyzeButton: "വായിച്ച് വിശദീകരിക്കുക",
      analyzing: "റിപ്പോർട്ട് വായിക്കുന്നു...",
      reset: "പുനഃസജ്ജമാക്കുക",
      resultFor: "ഫലം:",
      reportKhulasa: "നിങ്ങളുടെ റിപ്പോർട്ടിന്റെ സംഗ്രഹം",
      summaryTitle: "ലളിതമായ വാക്കുകളിൽ സംഗ്രഹം",
      findingsTitle: "പരിശോധന ഫലങ്ങൾ",
      medicinesTitle: "മരുന്നുകൾ (എങ്ങനെ കഴിക്കാം)",
      observationsTitle: "എക്സ്-റേയിൽ എന്ത് കാണാം",
      adviceTitle: "ഡോക്ടറുടെ ഉപദേശം",
      testsTitle: "നിർദ്ദേശിച്ച പരിശോധനകൾ",
      nextStepsTitle: "തുടർന്ന് എന്ത് ചെയ്യണം",
      warningTitle: "ശ്രദ്ധിക്കുക",
      emptyTitle: "മുകളിലെ ടാബ് തിരഞ്ഞെടുത്ത് റിപ്പോർട്ട് അപ്‌ലോഡ് ചെയ്യുക",
      emptySubtitle: "വായിച്ചതിന് ശേഷം ലളിതമായ ഭാഷയിൽ പൂർണ്ണ വിശദീകരണം ഇവിടെ കാണാം.",
      disclaimerBanner: "ഈ ആപ്പ് നിങ്ങളുടെ റിപ്പോർട്ട് വായിക്കാൻ മാത്രം സഹായിക്കുന്നു — ഇത് രോഗനിർണ്ണയം നടത്തുന്നില്ല. എപ്പോഴും ഡോക്ടറെ കാണുക.",
      criticalAlertTitle: "⚠️ അപകടകരമായ മൂല്യം കണ്ടെത്തി — ഉടൻ ഡോക്ടറെ കാണുക",
      criticalAlertBody: "നിങ്ങളുടെ റിപ്പോർട്ടിൽ ചില മൂല്യങ്ങൾ അപകടകരമായി റേഞ്ചിന് പുറത്താണ്. ഇതൊരു അടിയന്തരാവസ്ഥ ആയിരിക്കാം — ദയവായി ഉടൻ ഡോക്ടറോ ആശുപത്രിയോ ബന്ധപ്പെടുക. ഇത് AI-യുടെ മറുപടിയാണ്, തെറ്റായെന്നും വരാം — ദയവായി പരിശോധിക്കുക.",
      readerModeNote: "ഈ ആപ്പ് മൂല്യങ്ങളും റേഞ്ചും വായിച്ച് കാണിക്കുന്നു. ഇത് രോഗങ്ങൾ നിർണ്ണയിക്കുന്നില്ല.",
      doctorCtaTitle: 'ഇത് നിങ്ങളുടെ ഡോക്ടറെ കണ്ടിരിക്കണം കാണിക്കുക',
      doctorCtaBody: 'ഈ AI ഉത്തരം രോഗനിർണ്ണയമല്ല. ശരിയായ നിർണ്ണയത്തിനും ചികിത്സയ്ക്കുമായി ലൈസൻസുള്ള ഡോക്ടറെ കാണിക്കുക.',
      dataNotice: 'നിങ്ങളുടെ റിപ്പോർട്ട് മെമ്മറിയിൽ പ്രോസസ് ചെയ്യുന്നു, സെർവറിൽ സംരക്ഷിക്കുന്നില്ല.',
    },
    punjabi: {
      heroTitle: "ਆਪਣੀ ਮੈਡੀਕਲ ਰਿਪੋਰਟ ਸੌਖੀ ਭਾਸ਼ਾ ਵਿੱਚ ਪੜ੍ਹੋ",
      heroSubtitle: "ਟੈਸਟ ਰਿਪੋਰਟ, ਡਾਕਟਰ ਦੀ ਸਲਿਪ, ਜਾਂ ਵੱਡੀ PDF ਅੱਪਲੋਡ ਕਰੋ — AI ਇਸਨੂੰ ਪੜ੍ਹ ਕੇ ਦੱਸੇਗਾ ਕਿਹੜੀਆਂ ਵੈਲਿਊਜ਼ ਰੇਂਜ ਵਿੱਚ ਹਨ ਅਤੇ ਕਿਹੜੀਆਂ ਬਾਹਰ। ਇਹ ਬੀਮਾਰੀ ਦੀ ਪਛਾਣ ਨਹੀਂ ਕਰਦਾ।",
      analyzeButton: "ਪੜ੍ਹ ਕੇ ਸਮਝਾਓ",
      analyzing: "ਰਿਪੋਰਟ ਪੜ੍ਹ ਰਿਹਾ ਹੈ...",
      reset: "ਰੀਸੈੱਟ",
      resultFor: "ਨਤੀਜਾ:",
      reportKhulasa: "ਤੁਹਾਡੀ ਰਿਪੋਰਟ ਦਾ ਸਾਰ",
      summaryTitle: "ਸੌਖੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਸਾਰ",
      findingsTitle: "ਟੈਸਟ ਨਤੀਜੇ",
      medicinesTitle: "ਦਵਾਈਆਂ (ਕਿਵੇਂ ਲੈਣੀਆਂ ਹਨ)",
      observationsTitle: "ਐਕਸ-ਰੇ ਵਿੱਚ ਕੀ ਦਿਖ ਰਿਹਾ ਹੈ",
      adviceTitle: "ਡਾਕਟਰ ਦੀ ਸਲਾਹ",
      testsTitle: "ਸੁਝਾਏ ਗਏ ਟੈਸਟ",
      nextStepsTitle: "ਅੱਗੇ ਕੀ ਕਰੀਏ",
      warningTitle: "ਧਿਆਨ ਰੱਖੋ",
      emptyTitle: "ਉੱਤੇ ਟੈਬ ਚੁਣੋ ਅਤੇ ਰਿਪੋਰਟ ਅੱਪਲੋਡ ਕਰੋ",
      emptySubtitle: "ਪੜ੍ਹਨ ਤੋਂ ਬਾਅਦ ਸੌਖੀ ਭਾਸ਼ਾ ਵਿੱਚ ਪੂਰਾ ਖੁਲਾਸਾ ਇੱਥੇ ਦਿਖੇਗਾ।",
      disclaimerBanner: "ਇਹ ਐਪ ਸਿਰਫ਼ ਤੁਹਾਡੀ ਰਿਪੋਰਟ ਪੜ੍ਹਨ ਵਿੱਚ ਮਦਦ ਕਰਦੀ ਹੈ — ਇਹ ਬੀਮਾਰੀ ਦੀ ਪਛਾਣ ਨਹੀਂ ਕਰਦੀ। ਹਮੇਸ਼ਾ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।",
      criticalAlertTitle: "⚠️ ਖ਼ਤਰਨਾਕ ਵੈਲਿਊ ਮਿਲੀ — ਤੁਰੰਤ ਡਾਕਟਰ ਨੂੰ ਵਿਖਾਓ",
      criticalAlertBody: "ਤੁਹਾਡੀ ਰਿਪੋਰਟ ਵਿੱਚ ਕੁਝ ਵੈਲਿਊਜ਼ ਖ਼ਤਰਨਾਕ ਢੰਗ ਨਾਲ ਰੇਂਜ ਤੋਂ ਬਾਹਰ ਹਨ। ਇਹ ਐਮਰਜੈਂਸੀ ਹੋ ਸਕਦੀ ਹੈ — ਕਿਰਪਾ ਕਰਕੇ ਤੁਰੰਤ ਕਿਸੇ ਡਾਕਟਰ ਜਾਂ ਹਸਪਤਾਲ ਨਾਲ ਸੰਪਰਕ ਕਰੋ। ਇਹ AI ਦਾ ਜਵਾਬ ਹੈ, ਗਲਤ ਵੀ ਹੋ ਸਕਦਾ ਹੈ — ਕਿਰਪਾ ਕਰਕੇ ਜਾਂਚ ਕਰਾਓ।",
      readerModeNote: "ਇਹ ਐਪ ਵੈਲਿਊਜ਼ ਅਤੇ ਰੇਂਜ ਪੜ੍ਹ ਕੇ ਵਿਖਾਉਂਦੀ ਹੈ। ਇਹ ਬੀਮਾਰੀਆਂ ਦੀ ਪਛਾਣ ਨਹੀਂ ਕਰਦੀ।",
      doctorCtaTitle: 'ਇਸ ਨੂੰ ਆਪਣੇ ਡਾਕਟਰ ਨੂੰ ਜ਼ਰੂਰ ਵਿਖਾਓ',
      doctorCtaBody: 'ਇਹ AI ਜਵਾਬ ਨਿਦਾਨ ਨਹੀਂ ਹੈ। ਸਹੀ ਨਿਦਾਨ ਅਤੇ ਇਲਾਜ ਲਈ ਲਾਇਸੈਂਸਡ ਡਾਕਟਰ ਨੂੰ ਰਿਪੋਰਟ ਜ਼ਰੂਰ ਵਿਖਾਓ।',
      dataNotice: "ਤੁਹਾਡੀ ਰਿਪੋਰਟ ਮੈਮੋਰੀ ਵਿੱਚ ਪ੍ਰੋਸੈਸ ਹੁੰਦੀ ਹੈ ਅਤੇ ਸਰਵਰ 'ਤੇ ਸੰਭਾਲੀ ਨਹੀਂ ਜਾਂਦੀ।",
    },
    urdu: {
      heroTitle: "اپنی میڈیکل رپورٹ آسان زبان میں پڑھیں",
      heroSubtitle: "ٹیسٹ رپورٹ، ڈاکٹر کی سلپ، یا بڑی PDF اپ لوڈ کریں — AI اسے پڑھ کر بتائے گا کہ کون سی ویلیوز رینج میں ہیں اور کون سی باہر۔ یہ تشخیص نہیں کرتا۔",
      analyzeButton: "پڑھ کر سمجھائیں",
      analyzing: "رپورٹ پڑھ رہا ہے...",
      reset: "ری سیٹ",
      resultFor: "نتیجہ:",
      reportKhulasa: "آپ کی رپورٹ کا خلاصہ",
      summaryTitle: "آسان الفاظ میں خلاصہ",
      findingsTitle: "ٹیسٹ نتائج",
      medicinesTitle: "ادویات (کیسے لیں)",
      observationsTitle: "ایکس رے میں کیا نظر آ رہا ہے",
      adviceTitle: "ڈاکٹر کا مشورہ",
      testsTitle: "تجویز کردہ ٹیسٹ",
      nextStepsTitle: "آگے کیا کریں",
      warningTitle: "احتیاط",
      emptyTitle: "اوپر ٹیب منتخب کریں اور رپورٹ اپ لوڈ کریں",
      emptySubtitle: "پڑھنے کے بعد یہاں آسان زبان میں مکمل وضاحت نظر آئے گی۔",
      disclaimerBanner: "یہ ایپ صرف آپ کی رپورٹ پڑھنے میں مدد کرتی ہے — یہ تشخیص نہیں کرتی۔ ہمیشہ ڈاکٹر سے ملیں۔",
      criticalAlertTitle: "⚠️ خطرناک ویلیوز مل گئیں — فوراً ڈاکٹر کو دکھائیں",
      criticalAlertBody: "آپ کی رپورٹ میں کچھ ویلیوز خطرناک طور پر رینج سے باہر ہیں۔ یہ ایمرجنسی ہو سکتی ہے — براہِ کرم فوراً کسی ڈاکٹر یا ہسپتال سے رابطہ کریں۔ یہ AI کا جواب ہے، غلط بھی ہو سکتا ہے — براہِ کرم تصدیق کریں۔",
      readerModeNote: "یہ ایپ ویلیوز اور رینج پڑھ کر دکھاتی ہے۔ یہ بیماریوں کی تشخیص نہیں کرتی۔",
      doctorCtaTitle: 'اسے اپنے ڈاکٹر کو ضرور دکھائیں',
      doctorCtaBody: 'یہ AI جواب تشخیص نہیں ہے۔ صحیح تشخیص اور علاج کے لیے لائسنس یافتہ ڈاکٹر کو رپورٹ دکھائیں۔',
      dataNotice: 'آپ کی رپورٹ میموری میں پروسیس ہوتی ہے اور سرور پر محفوظ نہیں ہوتی۔',
    },
    odia: {
      heroTitle: "ଆପଣଙ୍କର ମେଡିକାଲ ରିପୋର୍ଟ ସହଜ ଭାଷାରେ ପଢନ୍ତୁ",
      heroSubtitle: "ଟେଷ୍ଟ ରିପୋର୍ଟ, ଡାକ୍ତରଙ୍କ ସ୍ଲିପ୍, ବା ବଡ଼ PDF ଅପଲୋଡ୍ କରନ୍ତୁ — AI ଏହାକୁ ପଢି କହିବ କେଉଁ ଭ୍ୟାଲୁଜ୍ ରେଞ୍ଜ୍ ଭିତରେ ଅଛନ୍ତି ଏବଂ କେଉଁଗୁଡ଼ିକ ବାହାରେ। ଏହା ରୋଗ ନିର୍ଣ୍ଣୟ କରେ ନାହିଁ।",
      analyzeButton: "ପଢନ୍ତୁ ଓ ବୁଝାନ୍ତୁ",
      analyzing: "ରିପୋର୍ଟ ପଢୁଛି...",
      reset: "ରିସେଟ୍",
      resultFor: "ଫଳାଫଳ:",
      reportKhulasa: "ଆପଣଙ୍କ ରିପୋର୍ଟର ସାରାଂଶ",
      summaryTitle: "ସହଜ ଶବ୍ଦରେ ସାରାଂଶ",
      findingsTitle: "ଟେଷ୍ଟ ଫଳାଫଳ",
      medicinesTitle: "ଔଷଧ (କିପରି ଖାଇବେ)",
      observationsTitle: "ଏକ୍ସ-ରେରେ କଣ ଦେଖାଯାଉଛି",
      adviceTitle: "ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ",
      testsTitle: "ପରାମର୍ଶିତ ଟେଷ୍ଟ",
      nextStepsTitle: "ପରେ କଣ କରିବେ",
      warningTitle: "ଧ୍ୟାନ ଦିଅନ୍ତୁ",
      emptyTitle: "ଉପରେ ଥିବା ଟ୍ୟାବ୍ ବାଛନ୍ତୁ ଏବଂ ରିପୋର୍ଟ ଅପଲୋଡ୍ କରନ୍ତୁ",
      emptySubtitle: "ପଢିବା ପରେ ସହଜ ଭାଷାରେ ସମ୍ପୂର୍ଣ୍ଣ ବ୍ୟାଖ୍ୟା ଏଠାରେ ଦେଖାଯିବ।",
      disclaimerBanner: "ଏହି ଆପ୍ କେବଳ ଆପଣଙ୍କ ରିପୋର୍ଟ ପଢିବାରେ ସାହାଯ୍ୟ କରେ — ଏହା ରୋଗ ନିର୍ଣ୍ଣୟ କରେ ନାହିଁ। ସବୁବେଳେ ଡାକ୍ତରଙ୍କୁ ଭେଟନ୍ତୁ।",
      criticalAlertTitle: "⚠️ ବିପଜ୍ଜନକ ଭ୍ୟାଲୁ ମିଳିଲା — ତୁରନ୍ତ ଡାକ୍ତରଙ୍କୁ ଦେଖାନ୍ତୁ",
      criticalAlertBody: "ଆପଣଙ୍କ ରିପୋର୍ଟରେ କିଛି ଭ୍ୟାଲୁଜ୍ ବିପଜ୍ଜନକ ଭାବରେ ରେଞ୍ଜ୍ ବାହାରେ ଅଛନ୍ତି। ଏହା ଏକ ଇମର୍ଜେନ୍ସି ହୋଇପାରେ — ଦୟାକରି ତୁରନ୍ତ କୌଣସି ଡାକ୍ତର ବା ଡାକ୍ତରଖାନା ସହ ସମ୍ପର୍କ କରନ୍ତୁ। ଏହା AI ର ଉତ୍ତର, ଭୁଲ ମଧ୍ୟ ହୋଇପାରେ — ଦୟାକରି ଯାଞ୍ଚ କରନ୍ତୁ।",
      readerModeNote: "ଏହି ଆପ୍ ଭ୍ୟାଲୁଜ୍ ଏବଂ ରେଞ୍ଜ୍ ପଢି ଦେଖାଏ। ଏହା ରୋଗ ନିର୍ଣ୍ଣୟ କରେ ନାହିଁ।",
      doctorCtaTitle: 'ଏହାକୁ ଆପଣଙ୍କ ଡାକ୍ତରଙ୍କୁ ନିଶ୍ଚୟ ଦେଖାନ୍ତୁ',
      doctorCtaBody: 'ଏହି AI ଉତ୍ତର ରୋଗ ନିର୍ଣ୍ଣୟ ନୁହେଁ। ସଠିକ୍ ନିର୍ଣ୍ଣୟ ଏବଂ ଚିକିତ୍ସା ପାଇଁ ଲାଇସେନ୍ସପ୍ରାପ୍ତ ଡାକ୍ତରଙ୍କୁ ରିପୋର୍ଟ ଦେଖାନ୍ତୁ।',
      dataNotice: 'ଆପଣଙ୍କ ରିପୋର୍ଟ ମେମୋରୀରେ ପ୍ରୋସେସ୍ ହୁଏ ଏବଂ ସର୍ଭରରେ ସଞ୍ଚିତ ହୁଏ ନାହିଁ।',
    },
    assamese: {
      heroTitle: "আপোনাৰ চিকিৎসা প্ৰতিৱেদন সহজ ভাষাত পঢ়ক",
      heroSubtitle: "টেষ্ট ৰিপোৰ্ট, ডাক্তৰৰ স্লিপ, বা ডাঙৰ PDF আপলোড কৰক — AI ই ইয়াক পঢ়ি ক'ব কোনবোৰ ভেল্যু ৰেঞ্জৰ ভিতৰত আছে আৰু কোনবোৰ বাহিৰত। এইটোৱে ৰোগ নিৰ্ণয় নকৰে।",
      analyzeButton: "পঢ়ক আৰু বুজাওক",
      analyzing: "প্ৰতিৱেদন পঢ়িছে...",
      reset: "ৰিছেট",
      resultFor: "ফলাফল:",
      reportKhulasa: "আপোনাৰ প্ৰতিৱেদনৰ সাৰাংশ",
      summaryTitle: "সহজ শব্দত সাৰাংশ",
      findingsTitle: "পৰীক্ষা ফলাফল",
      medicinesTitle: "ঔষধ (কেনেকৈ খাব)",
      observationsTitle: "এক্স-ৰে'ত কি দেখা গৈছে",
      adviceTitle: "ডাক্তৰৰ পৰামৰ্শ",
      testsTitle: "পৰামৰ্শিত পৰীক্ষা",
      nextStepsTitle: "তাৰ পিছত কি কৰিব",
      warningTitle: "মন কৰক",
      emptyTitle: "ওপৰৰ টেব বাছনি কৰক আৰু প্ৰতিৱেদন আপলোড কৰক",
      emptySubtitle: "পঢ়াৰ পিছত ইয়াত সহজ ভাষাত সম্পূৰ্ণ ব্যাখ্যা দেখা যাব।",
      disclaimerBanner: "এই এপে কেৱল আপোনাৰ ৰিপোৰ্ট পঢ়োঁতে সহায় কৰে — এইটোৱে ৰোগ নিৰ্ণয় নকৰে। সদায় ডাক্তৰক লগ কৰক।",
      criticalAlertTitle: "⚠️ বিপজ্জনক ভেল্যু পোৱা গ'ল — তৎক্ষণাত ডাক্তৰক দেখুওৱক",
      criticalAlertBody: "আপোনাৰ ৰিপোৰ্টত কিছুমান ভেল্যু বিপজ্জনকভাৱে ৰেঞ্জৰ বাহিৰত। এইটো এটা ইমাৰ্জেন্সি হ'ব পাৰে — অনুগ্ৰহ কৰি তৎক্ষণাত কোনো ডাক্তৰ বা চিকিৎসালয়ৰ সৈতে যোগাযোগ কৰক। এইটো AI ৰ উত্তৰ, ভুলো হ'ব পাৰে — অনুগ্ৰহ কৰি পৰীক্ষা কৰক।",
      readerModeNote: "এই এপে ভেল্যু আৰু ৰেঞ্জ পঢ়ি দেখুৱায়। এইটোৱে ৰোগ নিৰ্ণয় নকৰে।",
      doctorCtaTitle: 'এইটো আপোনাৰ ডাক্তৰক নিশ্চয় দেখুৱাওক',
      doctorCtaBody: "এই AI উত্তৰ ৰোগ নিৰ্ণয় নহয়। সঠিক নিৰ্ণয় আৰু চিকিৎসাৰ বাবে লাইচেন্সপ্ৰাপ্ত ডাক্তৰক ৰিপ'ৰ্ট দেখুৱাওক।",
      dataNotice: 'আপোনাৰ প্ৰতিবেদন স্মৃতিত প্ৰক্ৰিয়া হয় আৰু চাৰ্ভাৰত সংৰক্ষিত নহয়।',
    },
  };
  return map[lang] ?? map.hinglish;
}
