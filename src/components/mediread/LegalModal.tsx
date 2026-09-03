"use client";

import { useState } from "react";
import { FileText, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LegalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "terms" | "privacy";
  lang?: string;
}

// UI labels for the legal modal (Hinglish/English/Hindi).
// The detailed legal text itself stays in English (standard for legal docs
// in India), but the modal chrome (title, tab labels, close button, intro)
// is translated so non-English speakers can navigate it.
function getLegalUiLabels(lang: string = "hinglish") {
  const map: Record<string, {
    title: string;
    termsTab: string;
    privacyTab: string;
    close: string;
    termsHeading: string;
    privacyHeading: string;
    termsIntro: string;
    privacyIntro: string;
    lastUpdated: string;
  }> = {
    hinglish: {
      title: "Kanooni Documents",
      termsTab: "Use ke Niyam",
      privacyTab: "Privacy Policy",
      close: "Band Karein",
      termsHeading: "Use ke Niyam (Terms of Use)",
      privacyHeading: "Privacy Policy",
      termsIntro: "Neeche is app ke use ke niyam diye gaye hain. Ye English me hain (kanooni documents standard).",
      privacyIntro: "Neeche privacy policy di gayi hai. Ye DPDP Act 2023 (India) ke hisaab se hai. Detailed text English me hai.",
      lastUpdated: "Last updated:",
    },
    english: {
      title: "Legal Documents",
      termsTab: "Terms of Use",
      privacyTab: "Privacy Policy",
      close: "Close",
      termsHeading: "Terms of Use",
      privacyHeading: "Privacy Policy",
      termsIntro: "",
      privacyIntro: "Compliant with DPDP Act, 2023 (India).",
      lastUpdated: "Last updated:",
    },
    hindi: {
      title: "कानूनी दस्तावेज़",
      termsTab: "उपयोग की शर्तें",
      privacyTab: "गोपनीयता नीति",
      close: "बंद करें",
      termsHeading: "उपयोग की शर्तें (Terms of Use)",
      privacyHeading: "गोपनीयता नीति (Privacy Policy)",
      termsIntro: "नीचे इस ऐप के उपयोग की शर्तें दी गई हैं। यह अंग्रेज़ी में हैं (कानूनी दस्तावेज़ों का मानक)।",
      privacyIntro: "नीचे गोपनीयता नीति दी गई है। यह DPDP अधिनियम 2023 (भारत) के अनुसार है। विस्तृत पाठ अंग्रेज़ी में है।",
      lastUpdated: "अंतिम अपडेट:",
    },
    bengali: {
      title: "আইনি নথিপত্র",
      termsTab: "ব্যবহারের শর্তাবলী",
      privacyTab: "গোপনীয়তা নীতি",
      close: "বন্ধ করুন",
      termsHeading: "ব্যবহারের শর্তাবলী (Terms of Use)",
      privacyHeading: "গোপনীয়তা নীতি (Privacy Policy)",
      termsIntro: "নিচে এই অ্যাপের ব্যবহারের শর্তাবলী দেওয়া হলো। এগুলি ইংরেজিতে রয়েছে (আইনি নথিপত্রের মানক)।",
      privacyIntro: "নিচে গোপনীয়তা নীতি দেওয়া হলো। এটি DPDP Act 2023 (ভারত) অনুসারে রয়েছে। বিস্তারিত পাঠ ইংরেজিতে রয়েছে।",
      lastUpdated: "সর্বশেষ আপডেট:",
    },
    tamil: {
      title: "சட்ட ஆவணங்கள்",
      termsTab: "பயன்பாட்டு விதிமுறைகள்",
      privacyTab: "தனியுரிமைக் கொள்கை",
      close: "மூடு",
      termsHeading: "பயன்பாட்டு விதிமுறைகள் (Terms of Use)",
      privacyHeading: "தனியுரிமைக் கொள்கை (Privacy Policy)",
      termsIntro: "கீழே இந்த செயலியின் பயன்பாட்டு விதிமுறைகள் கொடுக்கப்பட்டுள்ளன. இவை ஆங்கிலத்தில் உள்ளன (சட்ட ஆவணங்களின் தரநிலை).",
      privacyIntro: "கீழே தனியுரிமைக் கொள்கை கொடுக்கப்பட்டுள்ளது. இது DPDP Act 2023 (இந்தியா) படி உள்ளது. விரிவான உரை ஆங்கிலத்தில் உள்ளது.",
      lastUpdated: "கடைசியாக புதுப்பிக்கப்பட்டது:",
    },
    telugu: {
      title: "న్యాయ పత్రాలు",
      termsTab: "వాడుక నిబంధనలు",
      privacyTab: "గోప్యతా విధానం",
      close: "మూసివేయి",
      termsHeading: "వాడుక నిబంధనలు (Terms of Use)",
      privacyHeading: "గోప్యతా విధానం (Privacy Policy)",
      termsIntro: "కింద ఈ యాప్ యొక్క వాడుక నిబంధనలు ఇవ్వబడ్డాయి. ఇవి ఇంగ్లీషులో ఉన్నాయి (న్యాయ పత్రాల ప్రామాణికం).",
      privacyIntro: "కింద గోప్యతా విధానం ఇవ్వబడింది. ఇది DPDP Act 2023 (భారతదేశం) ప్రకారం ఉంది. వివరణాత్మక వచనం ఇంగ్లీషులో ఉంది.",
      lastUpdated: "చివరిగా నవీకరించబడింది:",
    },
    marathi: {
      title: "कायदेशीर दस्तऐवज",
      termsTab: "वापराच्या अटी",
      privacyTab: "गोपनीयता धोरण",
      close: "बंद करा",
      termsHeading: "वापराच्या अटी (Terms of Use)",
      privacyHeading: "गोपनीयता धोरण (Privacy Policy)",
      termsIntro: "खाली या अॅपच्या वापराच्या अटी दिल्या आहेत. या इंग्रजीमध्ये आहेत (कायदेशीर दस्तऐवजांचा मानक).",
      privacyIntro: "खाली गोपनीयता धोरण दिले आहे. हे DPDP Act 2023 (भारत) नुसार आहे. तपशीलवार मजकूर इंग्रजीमध्ये आहे.",
      lastUpdated: "शेवटचे अपडेट:",
    },
    gujarati: {
      title: "કાયદાકીય દસ્તાવેજો",
      termsTab: "વપરાશની શરતો",
      privacyTab: "ગોપનીયતા નીતિ",
      close: "બંધ કરો",
      termsHeading: "વપરાશની શરતો (Terms of Use)",
      privacyHeading: "ગોપનીયતા નીતિ (Privacy Policy)",
      termsIntro: "નીચે આ એપની વપરાશની શરતો આપી છે. તે અંગ્રેજીમાં છે (કાયદાકીય દસ્તાવેજોનું ધોરણ).",
      privacyIntro: "નીચે ગોપનીયતા નીતિ આપી છે. તે DPDP Act 2023 (ભારત) મુજબ છે. વિગતવાર લખાણ અંગ્રેજીમાં છે.",
      lastUpdated: "છેલ્લું અપડેટ:",
    },
    kannada: {
      title: "ಕಾನೂನು ದಾಖಲೆಗಳು",
      termsTab: "ಬಳಕೆಯ ನಿಯಮಗಳು",
      privacyTab: "ಗೌಪ್ಯತಾ ನೀತಿ",
      close: "ಮುಚ್ಚಿ",
      termsHeading: "ಬಳಕೆಯ ನಿಯಮಗಳು (Terms of Use)",
      privacyHeading: "ಗೌಪ್ಯತಾ ನೀತಿ (Privacy Policy)",
      termsIntro: "ಕೆಳಗೆ ಈ ಆ್ಯಪ್‌ನ ಬಳಕೆಯ ನಿಯಮಗಳನ್ನು ನೀಡಲಾಗಿದೆ. ಇವು ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿವೆ (ಕಾನೂನು ದಾಖಲೆಗಳ ಮಾನಕ).",
      privacyIntro: "ಕೆಳಗೆ ಗೌಪ್ಯತಾ ನೀತಿಯನ್ನು ನೀಡಲಾಗಿದೆ. ಇದು DPDP Act 2023 (ಭಾರತ) ಪ್ರಕಾರ ಇದೆ. ವಿವರವಾದ ಪಠ್ಯ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿದೆ.",
      lastUpdated: "ಕೊನೆಯದಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ:",
    },
    malayalam: {
      title: "നിയമ രേഖകൾ",
      termsTab: "ഉപയോഗ നിബന്ധനകൾ",
      privacyTab: "സ്വകാര്യതാ നയം",
      close: "അടയ്ക്കുക",
      termsHeading: "ഉപയോഗ നിബന്ധനകൾ (Terms of Use)",
      privacyHeading: "സ്വകാര്യതാ നയം (Privacy Policy)",
      termsIntro: "താഴെ ഈ ആപ്പിന്റെ ഉപയോഗ നിബന്ധനകൾ നൽകിയിരിക്കുന്നു. ഇവ ഇംഗ്ലീഷിലാണ് (നിയമ രേഖകളുടെ മാനദണ്ഡം).",
      privacyIntro: "താഴെ സ്വകാര്യതാ നയം നൽകിയിരിക്കുന്നു. ഇത് DPDP Act 2023 (ഇന്ത്യ) പ്രകാരമാണ്. വിശദമായ വാചകം ഇംഗ്ലീഷിലാണ്.",
      lastUpdated: "അവസാനമായി അപ്ഡേറ്റ് ചെയ്തത്:",
    },
    punjabi: {
      title: "ਕਾਨੂੰਨੀ ਦਸਤਾਵੇਜ਼",
      termsTab: "ਵਰਤੋਂ ਦੀਆਂ ਸ਼ਰਤਾਂ",
      privacyTab: "ਗੁਪਤਤਾ ਨੀਤੀ",
      close: "ਬੰਦ ਕਰੋ",
      termsHeading: "ਵਰਤੋਂ ਦੀਆਂ ਸ਼ਰਤਾਂ (Terms of Use)",
      privacyHeading: "ਗੁਪਤਤਾ ਨੀਤੀ (Privacy Policy)",
      termsIntro: "ਹੇਠਾਂ ਇਸ ਐਪ ਦੀਆਂ ਵਰਤੋਂ ਦੀਆਂ ਸ਼ਰਤਾਂ ਦਿੱਤੀਆਂ ਗਈਆਂ ਹਨ। ਇਹ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਹਨ (ਕਾਨੂੰਨੀ ਦਸਤਾਵੇਜ਼ਾਂ ਦਾ ਮਾਨਕ)।",
      privacyIntro: "ਹੇਠਾਂ ਗੁਪਤਤਾ ਨੀਤੀ ਦਿੱਤੀ ਗਈ ਹੈ। ਇਹ DPDP Act 2023 (ਭਾਰਤ) ਅਨੁਸਾਰ ਹੈ। ਵਿਸਤ੍ਰਿਤ ਪਾਠ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਹੈ।",
      lastUpdated: "ਆਖਰੀ ਅੱਪਡੇਟ:",
    },
    urdu: {
      title: "قانونی دستاویزات",
      termsTab: "استعمال کی شرائط",
      privacyTab: "رازداری پالیسی",
      close: "بند کریں",
      termsHeading: "استعمال کی شرائط (Terms of Use)",
      privacyHeading: "رازداری پالیسی (Privacy Policy)",
      termsIntro: "نیچے اس ایپ کے استعمال کی شرائط دیے گئے ہیں۔ یہ انگریزی میں ہیں (قانونی دستاویزات کا معیار)۔",
      privacyIntro: "نیچے رازداری پالیسی دی گئی ہے۔ یہ DPDP Act 2023 (بھارت) کے مطابق ہے۔ تفصیلی متن انگریزی میں ہے۔",
      lastUpdated: "آخری بار اپ ڈیٹ:",
    },
    odia: {
      title: "ଆଇନଗତ ଦଲିଲ",
      termsTab: "ବ୍ୟବହାର ସର୍ତ୍ତାବଳୀ",
      privacyTab: "ଗୋପନୀୟତା ନୀତି",
      close: "ବନ୍ଦ କରନ୍ତୁ",
      termsHeading: "ବ୍ୟବହାର ସର୍ତ୍ତାବଳୀ (Terms of Use)",
      privacyHeading: "ଗୋପନୀୟତା ନୀତି (Privacy Policy)",
      termsIntro: "ନିମ୍ନରେ ଏହି ଆପ୍‌ର ବ୍ୟବହାର ସର୍ତ୍ତାବଳୀ ଦିଆଯାଇଛି। ଏଗୁଡ଼ିକ ଇଂରାଜୀରେ ଅଛି (ଆଇନଗତ ଦଲିଲର ମାନକ)।",
      privacyIntro: "ନିମ୍ନରେ ଗୋପନୀୟତା ନୀତି ଦିଆଯାଇଛି। ଏହା DPDP Act 2023 (ଭାରତ) ଅନୁଯାୟୀ ଅଛି। ବିସ୍ତୃତ ପାଠ୍ୟ ଇଂରାଜୀରେ ଅଛି।",
      lastUpdated: "ଶେଷ ଅପଡେଟ୍:",
    },
    assamese: {
      title: "আইনগত দস্তাবেজ",
      termsTab: "ব্যৱহাৰৰ চৰ্তাৱলী",
      privacyTab: "গোপনীয়তা নীতি",
      close: "বন্ধ কৰক",
      termsHeading: "ব্যৱহাৰৰ চৰ্তাৱলী (Terms of Use)",
      privacyHeading: "গোপনীয়তা নীতি (Privacy Policy)",
      termsIntro: "তলত এই এপ্ৰ ব্যৱহাৰৰ চৰ্তাৱলী দিয়া হৈছে। এইবোৰ ইংৰাজীত আছে (আইনগত দস্তাবেজৰ মানক)।",
      privacyIntro: "তলত গোপনীয়তা নীতি দিয়া হৈছে। এইটো DPDP Act 2023 (ভাৰত) অনুসৰি আছে। বিস্তৃত পাঠ ইংৰাজীত আছে।",
      lastUpdated: "শেহতীয়া আপডেট:",
    },
  };
  return map[lang] ?? map.hinglish;
}

export function LegalModal({
  open,
  onOpenChange,
  defaultTab = "terms",
  lang = "hinglish",
}: LegalModalProps) {
  const [tab, setTab] = useState<"terms" | "privacy">(defaultTab);
  const U = getLegalUiLabels(lang);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b bg-muted/30 p-4">
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <FileText className="h-5 w-5 text-emerald-600" />
            {U.title}
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as "terms" | "privacy")}
          className="flex h-[60vh] flex-col"
        >
          <TabsList className="m-3 grid w-auto grid-cols-2">
            <TabsTrigger value="terms" className="gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              {U.termsTab}
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              {U.privacyTab}
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="terms"
            className="flex-1 overflow-y-auto px-5 pb-5 text-sm leading-relaxed text-foreground/90"
          >
            <h3 className="mb-2 text-base font-bold text-foreground">
              {U.termsHeading}
            </h3>
            <p className="mb-2 text-xs text-muted-foreground">
              {U.lastUpdated} {new Date().getFullYear()}
            </p>
            {U.termsIntro && (
              <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50/60 p-2 text-xs leading-relaxed text-amber-800/90">
                {U.termsIntro}
              </p>
            )}

            <div className="space-y-4">
              <section>
                <h4 className="mb-1 font-semibold text-foreground">
                  1. Not Medical Advice
                </h4>
                <p>
                  MediRead is an <strong>informational tool</strong> that helps
                  you read and understand your medical reports in simple
                  language. It does <strong>NOT</strong> provide medical
                  advice, diagnosis, or treatment recommendations. The
                  information provided by this app is for general informational
                  purposes only.
                </p>
              </section>

              <section>
                <h4 className="mb-1 font-semibold text-foreground">
                  2. Always Consult a Doctor
                </h4>
                <p>
                  You must <strong>always consult a qualified, licensed medical
                  practitioner</strong> before making any health-related
                  decisions. Never disregard professional medical advice or
                  delay seeking it because of something you read in this app.
                </p>
              </section>

              <section>
                <h4 className="mb-1 font-semibold text-foreground">
                  3. No Doctor-Patient Relationship
                </h4>
                <p>
                  Use of this app does <strong>not</strong> create any
                  doctor-patient relationship between you and the app
                  developers, operators, or any associated party.
                </p>
              </section>

              <section>
                <h4 className="mb-1 font-semibold text-foreground">
                  4. Accuracy Not Guaranteed
                </h4>
                <p>
                  The app uses AI to read and interpret reports. AI can make
                  errors — it may misread values, misinterpret ranges, or
                  produce incorrect output. We do not guarantee the accuracy,
                  completeness, or reliability of any information provided by
                  the app.
                </p>
              </section>

              <section>
                <h4 className="mb-1 font-semibold text-foreground">
                  5. Emergency Situations
                </h4>
                <p>
                  If you are experiencing a medical emergency (chest pain,
                  difficulty breathing, loss of consciousness, severe bleeding,
                  stroke symptoms), <strong>call 108 (India emergency)
                  immediately</strong> or go to the nearest hospital. Do not
                  rely on this app during emergencies.
                </p>
              </section>

              <section>
                <h4 className="mb-1 font-semibold text-foreground">
                  6. No Liability
                </h4>
                <p>
                  You use this app at your own risk. The developers, operators,
                  and affiliates of MediRead shall <strong>not be liable</strong>{" "}
                  for any damages, harm, or losses arising from the use of, or
                  reliance on, the information provided by this app.
                </p>
              </section>

              <section>
                <h4 className="mb-1 font-semibold text-foreground">
                  7. Not a Substitute for Professional Care
                </h4>
                <p>
                  This app is <strong>not a substitute</strong> for
                  professional medical evaluation, diagnosis, or treatment. It
                  is a reading/translation aid only.
                </p>
              </section>

              <section>
                <h4 className="mb-1 font-semibold text-foreground">
                  8. User Responsibility
                </h4>
                <p>
                  You are solely responsible for any decisions you make based on
                  the information provided by this app. You agree to verify all
                  information with a qualified medical professional before
                  taking any action.
                </p>
              </section>

              <section>
                <h4 className="mb-1 font-semibold text-foreground">
                  9. Regulatory Notice
                </h4>
                <p>
                  This app is not a medical device as classified by CDSCO
                  (Central Drugs Standard Control Organisation) because it does
                  not diagnose, treat, or prevent disease. It is a
                  reading/translation aid. It is not registered or licensed as
                  a medical device.
                </p>
              </section>

              <section>
                <h4 className="mb-1 font-semibold text-foreground">
                  10. Changes to Terms
                </h4>
                <p>
                  We reserve the right to modify these terms at any time.
                  Continued use of the app after changes constitutes acceptance
                  of the new terms.
                </p>
              </section>
            </div>
          </TabsContent>

          <TabsContent
            value="privacy"
            className="flex-1 overflow-y-auto px-5 pb-5 text-sm leading-relaxed text-foreground/90"
          >
            <h3 className="mb-2 text-base font-bold text-foreground">
              {U.privacyHeading}
            </h3>
            <p className="mb-2 text-xs text-muted-foreground">
              {U.lastUpdated} {new Date().getFullYear()}
            </p>
            {U.privacyIntro && (
              <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50/60 p-2 text-xs leading-relaxed text-amber-800/90">
                {U.privacyIntro}
              </p>
            )}

            <div className="space-y-4">
              <section>
                <h4 className="mb-1 font-semibold text-foreground">
                  1. What Data We Process
                </h4>
                <p>
                  When you use MediRead, you upload medical reports (images,
                  PDFs, or text). This data is processed to extract and
                  explain the values in your report.
                </p>
              </section>

              <section>
                <h4 className="mb-1 font-semibold text-foreground">
                  2. Data is NOT Stored
                </h4>
                <p>
                  Your uploaded reports and the analysis results are{" "}
                  <strong>processed in memory and are NOT permanently stored
                  on our servers</strong>. Once the analysis is complete and
                  the result is returned to you, the data is discarded. We do
                  not maintain a database of your medical reports.
                </p>
                <p className="mt-1">
                  Background analysis jobs are held in server memory only for
                  the duration of processing (max 10 minutes) and are then
                  automatically deleted.
                </p>
              </section>

              <section>
                <h4 className="mb-1 font-semibold text-foreground">
                  3. Third-Party AI Processing
                </h4>
                <p>
                  Your report text/images are sent to a third-party AI service
                  (the model provider) for processing. This AI service may
                  process your data on their servers. We do not control the
                  AI provider's data retention policies. By using this app,
                  you consent to your report data being processed by this
                  third-party AI service.
                </p>
              </section>

              <section>
                <h4 className="mb-1 font-semibold text-foreground">
                  4. No Account Required
                </h4>
                <p>
                  MediRead does not require you to create an account or provide
                  personal information (name, email, phone). We do not collect
                  personally identifiable information.
                </p>
              </section>

              <section>
                <h4 className="mb-1 font-semibold text-foreground">
                  5. Cookies & Local Storage
                </h4>
                <p>
                  We use <strong>local storage</strong> on your device to
                  remember your language preference and that you have accepted
                  the terms of use. This data stays on your device and is not
                  sent to our servers.
                </p>
              </section>

              <section>
                <h4 className="mb-1 font-semibold text-foreground">
                  6. Your Rights (DPDP Act, 2023)
                </h4>
                <p>
                  Under the Digital Personal Data Protection Act, 2023, you
                  have the right to:
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Access the personal data we process about you</li>
                  <li>Request correction or erasure of your data</li>
                  <li>Grievance redressal</li>
                </ul>
                <p className="mt-1">
                  Since we do not store your data, most of these rights are
                  automatically fulfilled. For grievances, contact us at the
                  email below.
                </p>
              </section>

              <section>
                <h4 className="mb-1 font-semibold text-foreground">
                  7. Data Security
                </h4>
                <p>
                  We use HTTPS encryption for all data transmission. Internal
                  processing uses localhost connections. However, no method of
                  internet transmission is 100% secure.
                </p>
              </section>

              <section>
                <h4 className="mb-1 font-semibold text-foreground">
                  8. Children&apos;s Privacy
                </h4>
                <p>
                  This app is not directed to children under 18. If you are
                  under 18, please use this app only under the guidance of a
                  parent or guardian.
                </p>
              </section>

              <section>
                <h4 className="mb-1 font-semibold text-foreground">
                  9. Grievance Officer
                </h4>
                <p>
                  For privacy concerns or grievances, contact:{" "}
                  <strong>grievance@mediread.app</strong> (placeholder —
                  replace with actual contact before launch).
                </p>
              </section>

              <section>
                <h4 className="mb-1 font-semibold text-foreground">
                  10. Changes to This Policy
                </h4>
                <p>
                  We may update this Privacy Policy from time to time. Changes
                  will be posted on this page.
                </p>
              </section>
            </div>
          </TabsContent>
        </Tabs>

        <div className="border-t bg-muted/20 p-3">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full gap-2"
            variant="outline"
          >
            <X className="h-4 w-4" />
            {U.close}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
