"use client";

import { useState, useSyncExternalStore } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  HeartPulse,
  X,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getUiLabels, LANGUAGES } from "@/lib/medical";

const CONSENT_KEY = "mediread-consent-v1";

interface ConsentTexts {
  title: string;
  subtitle: string;
  points: { icon: "shield" | "alert" | "heart"; text: string }[];
  emergency: string;
  accept: string;
  decline: string;
}

function getConsentTexts(lang: string): ConsentTexts {
  const map: Record<string, ConsentTexts> = {
    hinglish: {
      title: "MediRead — Pehle Ye Zaroor Padhein",
      subtitle:
        "Ye app aapki medical report ko asaan bhasha me padh kar samjhata hai. Lekin kuch baatein zaroor samajh lein:",
      points: [
        {
          icon: "shield",
          text: "Ye app DIAGNOSIS nahi karta. Ye sirf report ke values, units aur ranges ko asaan bhasha me padh kar dikhata hai. Bimari pata lagana sirf ek licensed doctor ka kaam hai.",
        },
        {
          icon: "alert",
          text: "AI kabhi-kabhi galat value padh sakta hai ya galat samajh sakta hai. Is jawab par bharosa karke koi dawa mat lena — hamesha apne doctor se confirm karein.",
        },
        {
          icon: "heart",
          text: "Agar aapko lagta hai ki aapki halat serious hai (chest pain, saans phulna, behoshi, etc.) to turant emergency (108) ya nearest hospital jayein — is app ka wait na karein.",
        },
      ],
      emergency:
        "🚨 Emergency number: 108 (India). Chest pain, stroke symptoms, ya life-threatening situation me turant call karein.",
      accept: "✅ Maine padha aur samjha — App Use Karein",
      decline: "Cancel",
    },
    english: {
      title: "MediRead — Please Read This First",
      subtitle:
        "This app reads your medical report in simple language. But please understand these important points:",
      points: [
        {
          icon: "shield",
          text: "This app does NOT diagnose. It only reads report values, units, and ranges in simple language. Diagnosing a disease is the job of a licensed doctor only.",
        },
        {
          icon: "alert",
          text: "AI can sometimes read values incorrectly or misunderstand them. Do not take any medication based on this output — always confirm with your doctor.",
        },
        {
          icon: "heart",
          text: "If you feel your condition is serious (chest pain, shortness of breath, fainting, etc.) go to emergency (108) or nearest hospital immediately — do not wait for this app.",
        },
      ],
      emergency:
        "🚨 Emergency number: 108 (India). For chest pain, stroke symptoms, or life-threatening situations, call immediately.",
      accept: "✅ I have read and understood — Use App",
      decline: "Cancel",
    },
    hindi: {
      title: "MediRead — पहले ये ज़रूर पढ़ें",
      subtitle:
        "यह ऐप आपकी मेडिकल रिपोर्ट को आसान भाषा में पढ़कर समझाता है। लेकिन कुछ बातें ज़रूर समझ लें:",
      points: [
        {
          icon: "shield",
          text: "यह ऐप निदान (diagnosis) नहीं करता। यह सिर्फ रिपोर्ट के मान, इकाई और सीमा को आसान भाषा में पढ़कर दिखाता है। बीमारी पता लगाना सिर्फ एक लाइसेंस्ड डॉक्टर का काम है।",
        },
        {
          icon: "alert",
          text: "AI कभी-कभी गलत मान पढ़ सकता है या गलत समझ सकता है। इस जवाब पर भरोसा करके कोई दवा न लें — हमेशा अपने डॉक्टर से पुष्टि करें।",
        },
        {
          icon: "heart",
          text: "अगर आपको लगता है कि आपकी हालत गंभीर है (छाती में दर्द, सांस फूलना, बेहोशी, आदि) तो तुरंत आपातकालीन (108) या नज़दीकी अस्पताल जाएं — इस ऐप का इंतज़ार न करें।",
        },
      ],
      emergency:
        "🚨 आपातकालीन नंबर: 108 (भारत)। छाती में दर्द, स्ट्रोक लक्षण, या जानलेवा स्थिति में तुरंत कॉल करें।",
      accept: "✅ मैंने पढ़ा और समझा — ऐप उपयोग करें",
      decline: "रद्द करें",
    },
    bengali: {
      title: "MediRead — প্রথমে এটি পড়ুন",
      subtitle:
        "এই অ্যাপটি আপনার মেডিকেল রিপোর্ট সহজ ভাষায় পড়ে বোঝায়। তবে কিছু গুরুত্বপূর্ণ কথা অবশ্যই বুঝে নিন:",
      points: [
        {
          icon: "shield",
          text: "এই অ্যাপটি রোগ নির্ণয় (diagnosis) করে না। এটি শুধুমাত্র রিপোর্টের মান, একক এবং সীমা সহজ ভাষায় পড়ে দেখায়। রোগ নির্ণয় কেবল একজন নিবন্ধিত ডাক্তারের কাজ।",
        },
        {
          icon: "alert",
          text: "AI মাঝে মাঝে ভুল মান পড়তে পারে বা ভুল বুঝতে পারে। এই উত্তরের ওপর নির্ভর করে কোনো ওষুধ খাবেন না — সবসময় আপনার ডাক্তারের সাথে নিশ্চিত করুন।",
        },
        {
          icon: "heart",
          text: "আপনি যদি মনে করেন আপনার অবস্থা গুরুতর (বুকে ব্যথা, শ্বাসকষ্ট, অজ্ঞান হয়ে যাওয়া ইত্যাদি) তাহলে অবিলম্বে জরুরি বিভাগে (108) বা নিকটস্থ হাসপাতালে যান — এই অ্যাপের জন্য অপেক্ষা করবেন না।",
        },
      ],
      emergency:
        "🚨 জরুরি নম্বর: 108 (ভারত)। বুকে ব্যথা, স্ট্রোকের লক্ষণ, বা জীবন-বিপন্ন পরিস্থিতিতে অবিলম্বে কল করুন।",
      accept: "✅ আমি পড়েছি এবং বুঝেছি — অ্যাপ ব্যবহার করুন",
      decline: "বাতিল",
    },
    tamil: {
      title: "MediRead — முதலில் இதைப் படிக்கவும்",
      subtitle:
        "இந்த ஆப் உங்கள் மருத்துவ அறிக்கையை எளிய மொழியில் படித்து விளக்குகிறது. ஆனால் சில முக்கிய விஷயங்களை கட்டாயம் புரிந்துகொள்ளவும்:",
      points: [
        {
          icon: "shield",
          text: "இந்த ஆப் நோய் கண்டறிதல் (diagnosis) செய்யாது. இது அறிக்கையின் மதிப்புகள், அலகுகள் மற்றும் வரம்புகளை மட்டும் எளிய மொழியில் படித்துக் காட்டுகிறது. நோய் கண்டறிதல் என்பது உரிமம் பெற்ற மருத்துவரின் வேலை மட்டுமே.",
        },
        {
          icon: "alert",
          text: "AI சில நேரங்களில் மதிப்புகளைத் தவறாகப் படிக்கலாம் அல்லது தவறாகப் புரிந்துகொள்ளலாம். இந்தப் பதிலை நம்பி எந்த மருந்தையும் எடுக்க வேண்டாம் — எப்போதும் உங்கள் மருத்துவரிடம் உறுதி செய்துகொள்ளுங்கள்.",
        },
        {
          icon: "heart",
          text: "உங்கள் நிலை ஆபத்தானது என்று தோன்றினால் (நெஞ்சு வலி, மூச்சுத் திணறல், மயக்கம் போன்றவை) உடனே அவசர சிகிச்சைக்கு (108) அல்லது அருகிலுள்ள மருத்துவமனைக்குச் செல்லுங்கள் — இந்த ஆப்பைக் காத்திருக்க வேண்டாம்.",
        },
      ],
      emergency:
        "🚨 அவசர எண்: 108 (இந்தியா). நெஞ்சு வலி, பக்கவாத அறிகுறிகள், அல்லது உயிருக்கு ஆபத்தான சூழ்நிலைகளில் உடனே அழைக்கவும்.",
      accept: "✅ படித்து புரிந்துகொண்டேன் — ஆப்பைப் பயன்படுத்து",
      decline: "ரத்து",
    },
    telugu: {
      title: "MediRead — ముందుగా దీన్ని చదవండి",
      subtitle:
        "ఈ యాప్ మీ వైద్య నివేదికను సులభమైన భాషలో చదివి అర్థం చేస్తుంది. కానీ కొన్ని ముఖ్యమైన విషయాలను తప్పనిసరిగా అర్థం చేసుకోండి:",
      points: [
        {
          icon: "shield",
          text: "ఈ యాప్ వ్యాధి నిర్ధారణ (diagnosis) చేయదు. ఇది నివేదికలోని విలువలు, ప్రమాణాలు, పరిధులను మాత్రమే సులభ భాషలో చదివి చూపిస్తుంది. వ్యాధి నిర్ధారణ అనేది లైసెన్స్ పొందిన డాక్టర్ పని మాత్రమే.",
        },
        {
          icon: "alert",
          text: "AI కొన్నిసార్లు విలువలను తప్పుగా చదవవచ్చు లేదా తప్పుగా అర్థం చేసుకోవచ్చు. ఈ సమాధానంపై ఆధారపడి ఏ మందు తీసుకోవద్దు — ఎల్లప్పుడూ మీ డాక్టర్‌తో నిర్ధారించుకోండి.",
        },
        {
          icon: "heart",
          text: "మీ పరిస్థితి విషమంగా ఉందనిపిస్తే (ఛాతీ నొప్పి, శ్వాస తీసుకోలేకపోవడం, మూర్ఛ మొదలైనవి) వెంటనే అత్యవసర సేవలకు (108) లేదా దగ్గరలోని ఆసుపత్రికి వెళ్లండి — ఈ యాప్ కోసం వేచి ఉండకండి.",
        },
      ],
      emergency:
        "🚨 అత్యవసర నంబర్: 108 (భారతదేశం). ఛాతీ నొప్పి, స్ట్రోక్ లక్షణాలు, లేదా ప్రాణాపాయ పరిస్థితుల్లో వెంటనే కాల్ చేయండి.",
      accept: "✅ చదివాను మరియు అర్థం చేసుకున్నాను — యాప్ ఉపయోగించండి",
      decline: "రద్దు",
    },
    marathi: {
      title: "MediRead — आधी हे नक्की वाचा",
      subtitle:
        "हे अॅप तुमचा वैद्यकीय अहवाल सोप्या भाषेत वाचून सांगते. पण काही महत्त्वाच्या गोष्टी नक्की समजून घ्या:",
      points: [
        {
          icon: "shield",
          text: "हे अॅप निदान (diagnosis) करत नाही. हे फक्त अहवालातील मूल्ये, एकके आणि मर्यादा सोप्या भाषेत वाचून दाखवते. आजाराचे निदान करणे हे केवळ लायसन्सधारक डॉक्टरचेच काम आहे.",
        },
        {
          icon: "alert",
          text: "AI कधीकधी मूल्ये चुकीच्या वाचू शकते किंवा चुकीचे समजू शकते. या उत्तरावर विश्वास ठेवून कोणतेही औषध घेऊ नका — नेहमी तुमच्या डॉक्टरकडून खात्री करून घ्या.",
        },
        {
          icon: "heart",
          text: "तुम्हाला वाटत असेल की तुमची स्थिती गंभीर आहे (छातीत दुखणे, श्वास घेण्यास त्रास, बेशुद्ध होणे इ.) तर लगेच आपत्कालीन सेवेत (108) किंवा जवळच्या रुग्णालयात जा — या अॅपची वाट पाहू नका.",
        },
      ],
      emergency:
        "🚨 आपत्कालीन नंबर: 108 (भारत). छातीत दुखणे, स्ट्रोकची लक्षणे किंवा जीवघेण्या स्थितीत लगेच कॉल करा.",
      accept: "✅ मी वाचले आणि समजले — अॅप वापरा",
      decline: "रद्द करा",
    },
    gujarati: {
      title: "MediRead — પહેલા આને જરૂર વાંચો",
      subtitle:
        "આ એપ તમારી મેડિકલ રિપોર્ટને સરળ ભાષામાં વાંચીને સમજાવે છે. પણ કેટલીક મહત્વપૂર્ણ વાતો જરૂર સમજી લો:",
      points: [
        {
          icon: "shield",
          text: "આ એપ નિદાન (diagnosis) કરતું નથી. તે માત્ર રિપોર્ટની કિંમતો, એકમો અને મર્યાદાઓને સરળ ભાષામાં વાંચીને બતાવે છે. રોગનું નિદાન કરવું એ ફક્ત લાયસન્સધારક ડોક્ટરનું કામ છે.",
        },
        {
          icon: "alert",
          text: "AI ક્યારેક કિંમતો ખોટી વાંચી શકે છે અથવા ખોટું સમજી શકે છે. આ જવાબ પર વિશ્વાસ કરીને કોઈ દવા ન લો — હંમેશા તમારા ડોક્ટર પાસેથી ખાતરી કરાવો.",
        },
        {
          icon: "heart",
          text: "જો તમને લાગે કે તમારી સ્થિતિ ગંભીર છે (છાતીમાં દુખાવો, શ્વાસ લેવામાં તકલીફ, મૂર્છા વગેરે) તો તરત જ ઈમર્જન્સી (108) અથવા નજીકની હોસ્પિટલમાં જાઓ — આ એપની રાહ જોશો નહીં.",
        },
      ],
      emergency:
        "🚨 ઈમર્જન્સી નંબર: 108 (ભારત). છાતીમાં દુખાવો, સ્ટ્રોકના લક્ષણો, અથવા જીવલેણ સ્થિતિમાં તરત જ કૉલ કરો.",
      accept: "✅ મેં વાંચ્યું અને સમજાયું — એપ વાપરો",
      decline: "રદ કરો",
    },
    kannada: {
      title: "MediRead — ಮೊದಲು ಇದನ್ನು ಖಂಡಿತ ಓದಿ",
      subtitle:
        "ಈ ಆ್ಯಪ್ ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ವರದಿಯನ್ನು ಸರಳ ಭಾಷೆಯಲ್ಲಿ ಓದಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತದೆ. ಆದರೆ ಕೆಲವು ಮುಖ್ಯ ವಿಷಯಗಳನ್ನು ಖಂಡಿತ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ:",
      points: [
        {
          icon: "shield",
          text: "ಈ ಆ್ಯಪ್ ರೋಗದ ಪತ್ತೆ (diagnosis) ಮಾಡುವುದಿಲ್ಲ. ಇದು ಕೇವಲ ವರದಿಯ ಮೌಲ್ಯಗಳು, ಘಟಕಗಳು ಮತ್ತು ಮಿತಿಗಳನ್ನು ಸರಳ ಭಾಷೆಯಲ್ಲಿ ಓದಿ ತೋರಿಸುತ್ತದೆ. ರೋಗವನ್ನು ಪತ್ತೆ ಮಾಡುವುದು ಕೇವಲ ಪರವಾನಗಿ ಪಡೆದ ವೈದ್ಯರ ಕೆಲಸ.",
        },
        {
          icon: "alert",
          text: "AI ಕೆಲವೊಮ್ಮೆ ಮೌಲ್ಯಗಳನ್ನು ತಪ್ಪಾಗಿ ಓದಬಹುದು ಅಥವಾ ತಪ್ಪಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಬಹುದು. ಈ ಉತ್ತರವನ್ನು ನಂಬಿ ಯಾವುದೇ ಔಷಧ ತೆಗೆದುಕೊಳ್ಳಬೇಡಿ — ಯಾವಾಗಲೂ ನಿಮ್ಮ ವೈದ್ಯರೊಂದಿಗೆ ಖಚಿತಗೊಳಿಸಿಕೊಳ್ಳಿ.",
        },
        {
          icon: "heart",
          text: "ನಿಮ್ಮ ಸ್ಥಿತಿ ಗಂಭೀರ ಎಂದು ಅನ್ನಿಸಿದರೆ (ಎದೆ ನೋವು, ಉಸಿರಾಟದ ತೊಂದರೆ, ಪ್ರಜ್ಞೆ ತಪ್ಪುವುದು ಇತ್ಯಾದಿ) ತಕ್ಷಣ ತುರ್ತು ಸೇವೆಗೆ (108) ಅಥವಾ ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗೆ ಹೋಗಿ — ಈ ಆ್ಯಪ್‌ಗಾಗಿ ಕಾಯಬೇಡಿ.",
        },
      ],
      emergency:
        "🚨 ತುರ್ತು ಸಂಖ್ಯೆ: 108 (ಭಾರತ). ಎದೆ ನೋವು, ಸ್ಟ್ರೋಕ್ ಲಕ್ಷಣಗಳು, ಅಥವಾ ಪ್ರಾಣಾಪಾಯದ ಸ್ಥಿತಿಗಳಲ್ಲಿ ತಕ್ಷಣ ಕರೆ ಮಾಡಿ.",
      accept: "✅ ಓದಿದ್ದೇನೆ ಮತ್ತು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ — ಆ್ಯಪ್ ಬಳಸಿ",
      decline: "ರದ್ದುಮಾಡಿ",
    },
    malayalam: {
      title: "MediRead — ആദ്യം ഇത് നിർബന്ധമായും വായിക്കുക",
      subtitle:
        "ഈ ആപ്പ് നിങ്ങളുടെ മെഡിക്കൽ റിപ്പോർട്ട് ലളിതമായ ഭാഷയിൽ വായിച്ച് മനസ്സിലാക്കുന്നു. എന്നാൽ ചില പ്രധാന കാര്യങ്ങൾ നിർബന്ധമായും മനസ്സിലാക്കുക:",
      points: [
        {
          icon: "shield",
          text: "ഈ ആപ്പ് രോഗനിർണയം (diagnosis) നടത്തുന്നില്ല. ഇത് റിപ്പോർട്ടിലെ മൂല്യങ്ങൾ, യൂണിറ്റുകൾ, പരിധികൾ എന്നിവ മാത്രം ലളിതമായ ഭാഷയിൽ വായിച്ചു കാണിക്കുന്നു. രോഗം കണ്ടെത്തുന്നത് ലൈസൻസുള്ള ഡോക്ടറുടെ മാത്രം ജോലിയാണ്.",
        },
        {
          icon: "alert",
          text: "AI ചിലപ്പോൾ മൂല്യങ്ങൾ തെറ്റായി വായിച്ചേക്കാം അല്ലെങ്കിൽ തെറ്റായി മനസ്സിലാക്കിയേക്കാം. ഈ ഉത്തരത്തെ ആശ്രയിച്ച് ഒരു മരുന്നും കഴിക്കരുത് — എപ്പോഴും നിങ്ങളുടെ ഡോക്ടറോട് ഉറപ്പിച്ചു ചോദിക്കുക.",
        },
        {
          icon: "heart",
          text: "നിങ്ങളുടെ അവസ്ഥ ഗുരുതരമാണെന്ന് തോന്നുന്നെങ്കിൽ (നെഞ്ചുവേദന, ശ്വാസതടസ്സം, ബോധക്ഷയം തുടങ്ങിയവ) ഉടൻ തന്നെ അടിയന്തര സേവനത്തിലേക്ക് (108) അല്ലെങ്കിൽ അടുത്തുള്ള ആശുപത്രിയിലേക്ക് പോവുക — ഈ ആപ്പിനായി കാത്തിരിക്കരുത്.",
        },
      ],
      emergency:
        "🚨 അടിയന്തര നമ്പർ: 108 (ഇന്ത്യ). നെഞ്ചുവേദന, സ്ട്രോക്ക് ലക്ഷണങ്ങൾ, അല്ലെങ്കിൽ ജീവൻ അപകടത്തിലാകുന്ന അവസ്ഥകളിൽ ഉടൻ വിളിക്കുക.",
      accept: "✅ ഞാൻ വായിച്ചു മനസ്സിലാക്കി — ആപ്പ് ഉപയോഗിക്കുക",
      decline: "റദ്ദാക്കുക",
    },
    punjabi: {
      title: "MediRead — ਪਹਿਲਾਂ ਇਹ ਜ਼ਰੂਰ ਪੜ੍ਹੋ",
      subtitle:
        "ਇਹ ਐਪ ਤੁਹਾਡੀ ਮੈਡੀਕਲ ਰਿਪੋਰਟ ਨੂੰ ਸੌਖੀ ਭਾਸ਼ਾ ਵਿੱਚ ਪੜ੍ਹ ਕੇ ਸਮਝਾਉਂਦੀ ਹੈ। ਪਰ ਕੁਝ ਜ਼ਰੂਰੀ ਗੱਲਾਂ ਜ਼ਰੂਰ ਸਮਝ ਲਓ:",
      points: [
        {
          icon: "shield",
          text: "ਇਹ ਐਪ ਬੀਮਾਰੀ ਦੀ ਪਛਾਣ (diagnosis) ਨਹੀਂ ਕਰਦੀ। ਇਹ ਸਿਰਫ਼ ਰਿਪੋਰਟ ਦੇ ਮੁੱਲ, ਇਕਾਈਆਂ ਅਤੇ ਹੱਦਾਂ ਨੂੰ ਸੌਖੀ ਭਾਸ਼ਾ ਵਿੱਚ ਪੜ੍ਹ ਕੇ ਵਿਖਾਉਂਦੀ ਹੈ। ਬੀਮਾਰੀ ਦੀ ਪਛਾਣ ਕਰਨਾ ਸਿਰਫ਼ ਲਾਇਸੈਂਸਧਾਰਕ ਡਾਕਟਰ ਦਾ ਕੰਮ ਹੈ।",
        },
        {
          icon: "alert",
          text: "AI ਕਈ ਵਾਰ ਮੁੱਲ ਗਲਤ ਪੜ੍ਹ ਸਕਦਾ ਹੈ ਜਾਂ ਗਲਤ ਸਮਝ ਸਕਦਾ ਹੈ। ਇਸ ਜਵਾਬ ਤੇ ਭਰੋਸਾ ਕਰਕੇ ਕੋਈ ਦਵਾ ਨਾ ਲਓ — ਹਮੇਸ਼ਾ ਆਪਣੇ ਡਾਕਟਰ ਤੋਂ ਪੁਸ਼ਟੀ ਕਰਵਾਓ।",
        },
        {
          icon: "heart",
          text: "ਜੇ ਤੁਹਾਨੂੰ ਲੱਗਦਾ ਹੈ ਕਿ ਤੁਹਾਡੀ ਹਾਲਤ ਗੰਭੀਰ ਹੈ (ਛਾਤੀ ਵਿੱਚ ਦਰਦ, ਸਾਹ ਫੁੱਲਣਾ, ਬੇਹੋਸ਼ੀ ਆਦਿ) ਤਾਂ ਤੁਰੰਤ ਐਮਰਜੈਂਸੀ (108) ਜਾਂ ਨੇੜਲੇ ਹਸਪਤਾਲ ਜਾਓ — ਇਸ ਐਪ ਦਾ ਇੰਤਜ਼ਾਰ ਨਾ ਕਰੋ।",
        },
      ],
      emergency:
        "🚨 ਐਮਰਜੈਂਸੀ ਨੰਬਰ: 108 (ਭਾਰਤ)। ਛਾਤੀ ਵਿੱਚ ਦਰਦ, ਸਟ੍ਰੋਕ ਦੇ ਲੱਛਣ, ਜਾਂ ਜਾਨਲੇਵਾ ਸਥਿਤੀ ਵਿੱਚ ਤੁਰੰਤ ਕਾਲ ਕਰੋ।",
      accept: "✅ ਮੈਂ ਪੜ੍ਹਿਆ ਅਤੇ ਸਮਝਿਆ — ਐਪ ਵਰਤੋ",
      decline: "ਰੱਦ ਕਰੋ",
    },
    urdu: {
      title: "MediRead — پہلے یہ ضرور پڑھیں",
      subtitle:
        "یہ ایپ آپ کی میڈیکل رپورٹ کو آسان زبان میں پڑھ کر سمجھاتی ہے۔ مگر کچھ اہم باتیں ضرور سمجھ لیں:",
      points: [
        {
          icon: "shield",
          text: "یہ ایپ تشخیص (diagnosis) نہیں کرتی۔ یہ صرف رپورٹ کی قدریں، اکائیاں اور حدیں آسان زبان میں پڑھ کر دکھاتی ہے۔ بیماری کی تشخیص صرف ایک لائسنس یافتہ ڈاکٹر کا کام ہے۔",
        },
        {
          icon: "alert",
          text: "AI کبھی کبھار قدریں غلط پڑھ سکتا ہے یا غلط سمجھ سکتا ہے۔ اس جواب پر بھروسہ کر کوئی دوا نہ لیں — ہمیشہ اپنے ڈاکٹر سے تصدیق کریں۔",
        },
        {
          icon: "heart",
          text: "اگر آپ کو لگتا ہے کہ آپ کی حالت سنگین ہے (چھاتی میں درد، سانس پھولنا، بےہوشی وغیرہ) تو فوراً ایمرجنسی (108) یا قریب کے ہسپتال جائیں — اس ایپ کا انتظار نہ کریں۔",
        },
      ],
      emergency:
        "🚨 ایمرجنسی نمبر: 108 (بھارت)۔ چھاتی میں درد، فالج کی علامات، یا جان لیوا صورتحال میں فوراً کال کریں۔",
      accept: "✅ میں نے پڑھا اور سمجھا — ایپ استعمال کریں",
      decline: "منسوخ",
    },
    odia: {
      title: "MediRead — ପ୍ରଥମେ ଏହା ନିଶ୍ଚୟ ପଢ଼ନ୍ତୁ",
      subtitle:
        "ଏହି ଆପ୍ ଆପଣଙ୍କର ମେଡିକାଲ ରିପୋର୍ଟକୁ ସରଳ ଭାଷାରେ ପଢ଼ି ବୁଝାଏ। କିନ୍ତୁ କିଛି ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ କଥା ନିଶ୍ଚୟ ବୁଝନ୍ତୁ:",
      points: [
        {
          icon: "shield",
          text: "ଏହି ଆପ୍ ରୋଗ ନିର୍ଣ୍ଣୟ (diagnosis) କରେ ନାହିଁ। ଏହା କେବଳ ରିପୋର୍ଟର ମୂଲ୍ୟ, ଏକକ ଏବଂ ସୀମାକୁ ସରଳ ଭାଷାରେ ପଢ଼ି ଦେଖାଏ। ରୋଗ ନିର୍ଣ୍ଣୟ କରିବା କେବଳ ଲାଇସେନ୍ସଧାରୀ ଡାକ୍ତରଙ୍କ କାର୍ଯ୍ୟ।",
        },
        {
          icon: "alert",
          text: "AI କେବେ କେବେ ମୂଲ୍ୟ ଭୁଲ ପଢ଼ିପାରେ କିମ୍ବା ଭୁଲ ବୁଝିପାରେ। ଏହି ଉତ୍ତର ଉପରେ ନିର୍ଭର କରି କୌଣସି ଔଷଧ ନଦିଅନ୍ତୁ — ସବୁବେଳେ ଆପଣଙ୍କ ଡାକ୍ତରଙ୍କ ସହ ନିଶ୍ଚିତ କରନ୍ତୁ।",
        },
        {
          icon: "heart",
          text: "ଆପଣଙ୍କ ଅବସ୍ଥା ଗୁରୁତର ବୋଲି ମନେ ହେଲେ (ଛାତିରେ ଯନ୍ତ୍ରଣା, ଶ୍ୱାସକ୍ରିୟା କଷ୍ଟ, ମୂର୍ଚ୍ଛା ଇତ୍ୟାଦି) ସାଙ୍ଗେ ସାଙ୍ଗେ ଜରୁରୀକାଳୀନ (108) କିମ୍ବା ନିକଟସ୍ଥ ଡାକ୍ତରଖାନାକୁ ଯାଆନ୍ତୁ — ଏହି ଆପ୍ ପାଇଁ ଅପେକ୍ଷା କରନ୍ତୁ ନାହିଁ।",
        },
      ],
      emergency:
        "🚨 ଜରୁରୀକାଳୀନ ନମ୍ବର: 108 (ଭାରତ)। ଛାତିରେ ଯନ୍ତ୍ରଣା, ଷ୍ଟ୍ରୋକ୍ ଲକ୍ଷଣ, କିମ୍ବା ପ୍ରାଣଘାତୀ ଅବସ୍ଥାରେ ସାଙ୍ଗେ ସାଙ୍ଗେ କଲ୍ କରନ୍ତୁ।",
      accept: "✅ ମୁଁ ପଢ଼ିଲି ଏବଂ ବୁଝିଲି — ଆପ୍ ବ୍ୟବହାର କରନ୍ତୁ",
      decline: "ବାତିଲ୍",
    },
    assamese: {
      title: "MediRead — প্ৰথমে এইটো নিশ্চয় পঢ়ক",
      subtitle:
        "এই এপ্‌টোৱে আপোনাৰ চিকিৎসা প্ৰতিবেদন সহজ ভাষাত পঢ়ি বুজায়। কিন্তু কিছু গুৰুত্বপূৰ্ণ কথা নিশ্চয় বুজি লওক:",
      points: [
        {
          icon: "shield",
          text: "এই এপ্‌টোৱে ৰোগ নিৰ্ণয় (diagnosis) নকৰে। ই কেৱল প্ৰতিবেদনৰ মান, একক আৰু সীমা সহজ ভাষাত পঢ়ি দেখুৱায়। ৰোগ নিৰ্ণয় কৰা কেৱল এজন অনুজ্ঞাপত্ৰ প্ৰাপ্ত ডাক্তৰৰ কাম।",
        },
        {
          icon: "alert",
          text: "AI কেতিয়াবা মান ভুলকৈ পঢ়িব পাৰে বা ভুলকৈ বুজিব পাৰে। এই উত্তৰৰ ওপৰত ভৰসা কৰি কোনো ঔষধ নলব — সদায় আপোনাৰ ডাক্তৰৰ সৈতে নিশ্চিত কৰক।",
        },
        {
          icon: "heart",
          text: "আপোনাৰ অৱস্থা গুৰুতৰ বুলি অনুভৱ কৰিলে (বুকুৰ বিষ, উশাহ-নিশাহত কষ্ট, অজ্ঞান হোৱা ইত্যাদি) তৎক্ষণাৎ জৰুৰীকালীন (108) বা ওচৰৰ চিকিৎসালয়লৈ যাওক — এই এপ্‌ৰ বাবে অপেক্ষা নকৰিব।",
        },
      ],
      emergency:
        "🚨 জৰুৰীকালীন নম্বৰ: 108 (ভাৰত)। বুকুৰ বিষ, ষ্ট্ৰোকৰ লক্ষণ, বা জীৱন-বিপন্ন অৱস্থাত তৎক্ষণাৎ কল কৰক।",
      accept: "✅ মই পঢ়িলো আৰু বুজিলো — এপ্ ব্যৱহাৰ কৰক",
      decline: "বাতিল কৰক",
    },
  };
  return map[lang] ?? map.hinglish;
}

const iconMap = {
  shield: ShieldCheck,
  alert: AlertTriangle,
  heart: HeartPulse,
};

// Client-only subscription to localStorage consent state. Uses
// useSyncExternalStore to avoid hydration mismatch (server returns false,
// client returns true only after mount) AND to avoid setState-in-effect lint.
function subscribeConsent(callback: () => void) {
  // No external subscription needed — consent is checked once on mount.
  return () => {};
}
function getConsentMissingClient(): boolean {
  try {
    return !localStorage.getItem(CONSENT_KEY);
  } catch {
    return true;
  }
}
function getConsentMissingServer(): boolean {
  // Server always returns false (modal closed) to match initial HTML.
  return false;
}

export function ConsentModal({ lang }: { lang: string }) {
  // useSyncExternalStore: server snapshot = false (closed), client snapshot =
  // true if consent missing. This avoids hydration mismatch because both
  // server and client render the same initial value (false/closed).
  const shouldOpen = useSyncExternalStore(
    subscribeConsent,
    getConsentMissingClient,
    getConsentMissingServer
  );
  const [manuallyClosed, setManuallyClosed] = useState(false);
  const open = shouldOpen && !manuallyClosed;
  const texts = getConsentTexts(lang);

  const handleAccept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, Date.now().toString());
    } catch {
      /* ignore */
    }
    setManuallyClosed(true);
  };

  const handleDecline = () => {
    // If user declines, redirect away from the app.
    setManuallyClosed(true);
    window.location.href = "about:blank";
  };

  return (
    <Dialog open={open} onOpenChange={() => { /* don't close on overlay click */ }}>
      <DialogContent
        className="max-w-lg gap-0 p-0"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader className="border-b bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <ShieldCheck className="h-5 w-5" />
            {texts.title}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto p-5">
          <p className="mb-4 text-sm text-muted-foreground">
            {texts.subtitle}
          </p>

          <div className="space-y-3">
            {texts.points.map((point, i) => {
              const Icon = iconMap[point.icon];
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      point.icon === "shield"
                        ? "bg-emerald-100 text-emerald-700"
                        : point.icon === "alert"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {point.text}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-xs font-semibold leading-relaxed text-red-800">
              {texts.emergency}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t bg-muted/20 p-4 sm:flex-row">
          <Button
            onClick={handleAccept}
            className="flex-1 gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <CheckCircle2 className="h-4 w-4" />
            {texts.accept}
          </Button>
          <Button
            onClick={handleDecline}
            variant="outline"
            className="gap-2"
          >
            <X className="h-4 w-4" />
            {texts.decline}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
