// UI translation strings for MediRead.
// General UI strings, per-tab mode labels, and UploadZone strings in all
// 14 supported languages. Kept separate from medical.ts (AI logic) for
// clarity.

export interface ExtraLabels {
  headerSubtitle: string;
  aiPowered: string;
  privateLabel: string;
  hintText: string;
  hintFile: string;
  hintImage: string;
  loadingDoc: string;
  loadingImage: string;
  loadingHintDoc: string;
  loadingHintImage: string;
  textLabel: string;
  textPlaceholder: string;
  textCounter: string; // use {n} as placeholder for char count
}

export interface ModeLabel {
  label: string;
  badge: string;
  description: string;
  uploadLabel: string;
  uploadHint: string;
}

export interface ModeLabels {
  "test-report": ModeLabel;
  "doctor-slip": ModeLabel;
  xray: ModeLabel;
  document: ModeLabel;
  text: ModeLabel;
}

export interface UploadLabels {
  processing: string;
  hintImage: string;
  hintImagePdf: string;
  hintAll: string;
  imageAttached: string;
  fileReady: string;
  removeImage: string;
  removeFile: string;
  errorType: string;
  errorImageOnly: string;
  errorDocxNotAllowed: string;
  errorTooLarge: string;
}

// ---- Hinglish (default) ----
const HINGLISH = {
  extra: {
    headerSubtitle: "Apni Report Apni Bhasha Me Samjhein",
    aiPowered: "AI-Powered",
    privateLabel: "Private",
    hintText: "Text daal kar 'Analyze Karein' dabao.",
    hintFile: "PDF/DOCX upload karo — badi report me 1-2 minute lag sakte hain.",
    hintImage: "Saaf photo upload karo — jaldi samajh aayegi.",
    loadingDoc: "AI aapki badi report ko page-by-page padh raha hai...",
    loadingImage: "AI aapki report padh raha hai...",
    loadingHintDoc: "Badi PDF me text nikal kar har test analyze hota hai. 1-2 minute lag sakte hain. Ruko.",
    loadingHintImage: "Image analyze hone me 15-40 second lag sakte hain. Ruko.",
    textLabel: "Apni report ka text yahan likho ya paste karo",
    textPlaceholder: "Example:\nHemoglobin: 10.5 g/dL (Normal: 12-15)\nWBC: 6200 /cmm\nRBC: 4.1 million/cmm\nPlatelets: 1.5 lakh\nGlucose Fasting: 145 mg/dL",
    textCounter: "{n} akshar · kam se kam 10 chahiye",
  } satisfies ExtraLabels,
  modes: {
    "test-report": {
      label: "Test Report", badge: "Photo / PDF",
      description: "Lab report padh kar bata dega - kaunsi value normal, kaunsi kam/zyada, aur kya suspect hota hai. Photo ya PDF dono chalengi.",
      uploadLabel: "Medical Test Report ki photo ya PDF daalo",
      uploadHint: "Apni lab test report (blood test, urine, sugar, thyroid, etc.) ki saaf photo YA PDF upload karo. AI padh kar bata dega kya normal hai aur kya dhyan chahiye.",
    },
    "doctor-slip": {
      label: "Dr. ki Slip", badge: "Photo / PDF / DOC",
      description: "Prescription padh kar samjha dega - bimari, dawaayein, kab leni, kitni maatra, aur doctor ki salah.",
      uploadLabel: "Doctor ki prescription/slip ki photo, PDF ya DOCX daalo",
      uploadHint: "Doctor ki likhi hui slip ki saaf photo, PDF ya Word file upload karo. AI bata dega kya bimari hai, kaunsi dawa hai, kab aur kaise leni hai.",
    },
    xray: {
      label: "X-Ray", badge: "Scan Image",
      description: "X-ray image dekh kar bata dega kya normal dikh raha hai aur kya abnormal - sirf madad ke liye, radiologist nahi.",
      uploadLabel: "X-Ray ki photo daalo",
      uploadHint: "Apne X-ray ki saaf photo upload karo (chest, knee, hand, etc.). AI dekh kar bata dega kya dikh raha hai aur kya dhyan chahiye.",
    },
    document: {
      label: "PDF / DOC", badge: "Multi-page",
      description: "Badi multi-page PDF/DOCX report ko page-by-page padh kar har test alag-alag samjha dega - value, range, status, sab.",
      uploadLabel: "Apni PDF ya DOCX report upload karo",
      uploadHint: "Apni medical report ka PDF ya Word file upload karo (30-40 page ki bhi ho sakti hai). AI har page padh kar HAR ek test nikalega aur uska result asaan bhasha me samjhayega.",
    },
    text: {
      label: "Likha Hua", badge: "Type karo",
      description: "Agar photo nahi hai, to report ka text yahan type ya paste kar do - AI samjha dega.",
      uploadLabel: "", uploadHint: "",
    },
  } satisfies ModeLabels,
  upload: {
    processing: "File process ho rahi hai...",
    hintImage: "JPG / PNG · drag & drop ya click karke choose karo",
    hintImagePdf: "JPG / PNG / PDF · drag & drop ya click karke choose karo",
    hintAll: "JPG / PNG / PDF / DOCX · drag & drop ya click karke choose karo",
    imageAttached: "Image attached",
    fileReady: "File ready hai. \u201cAnalyze Karein\u201d dabao.",
    removeImage: "Image hatao",
    removeFile: "File hatao",
    errorType: "Ye file type support nahi hai. JPG, PNG, PDF ya DOCX upload karo.",
    errorImageOnly: "Is tab me sirf image upload ho sakti hai.",
    errorDocxNotAllowed: "Is tab me DOCX upload nahi ho sakta.",
    errorTooLarge: "File bahut badi hai. 60MB se kam rakho.",
  } satisfies UploadLabels,
};

// ---- English ----
const ENGLISH = {
  extra: {
    headerSubtitle: "Understand Your Report In Your Language",
    aiPowered: "AI-Powered",
    privateLabel: "Private",
    hintText: "Enter the text and press 'Analyze'.",
    hintFile: "Upload a PDF/DOCX — large reports may take 1-2 minutes.",
    hintImage: "Upload a clear photo — it's faster to understand.",
    loadingDoc: "AI is reading your large report page by page...",
    loadingImage: "AI is reading your report...",
    loadingHintDoc: "Text is being extracted from the PDF and every test is analyzed. This may take 1-2 minutes. Please wait.",
    loadingHintImage: "Image analysis may take 15-40 seconds. Please wait.",
    textLabel: "Type or paste your report text here",
    textPlaceholder: "Example:\nHemoglobin: 10.5 g/dL (Normal: 12-15)\nWBC: 6200 /cmm\nRBC: 4.1 million/cmm\nPlatelets: 1.5 lakh\nGlucose Fasting: 145 mg/dL",
    textCounter: "{n} characters · at least 10 required",
  } satisfies ExtraLabels,
  modes: {
    "test-report": {
      label: "Test Report", badge: "Photo / PDF",
      description: "Reads your lab report and tells you which values are normal, which are low/high, and what might be suspected. Photo or PDF both work.",
      uploadLabel: "Upload a photo or PDF of your medical test report",
      uploadHint: "Upload a clear photo OR PDF of your lab test report (blood test, urine, sugar, thyroid, etc.). The AI will read it and tell you what's normal and what needs attention.",
    },
    "doctor-slip": {
      label: "Dr. Prescription", badge: "Photo / PDF / DOC",
      description: "Reads the prescription and explains the illness, medicines, when to take them, the dosage, and the doctor's advice.",
      uploadLabel: "Upload a photo, PDF, or DOCX of the doctor's prescription",
      uploadHint: "Upload a clear photo, PDF, or Word file of the doctor's written prescription. The AI will tell you the illness, medicines, and how to take them.",
    },
    xray: {
      label: "X-Ray", badge: "Scan Image",
      description: "Looks at the X-ray image and tells you what appears normal and what looks abnormal — for guidance only, not a radiologist.",
      uploadLabel: "Upload a photo of your X-Ray",
      uploadHint: "Upload a clear photo of your X-ray (chest, knee, hand, etc.). The AI will look at it and tell you what it sees and what needs attention.",
    },
    document: {
      label: "PDF / DOC", badge: "Multi-page",
      description: "Reads a large multi-page PDF/DOCX report page by page and explains every test separately — value, range, status, everything.",
      uploadLabel: "Upload your PDF or DOCX report",
      uploadHint: "Upload the PDF or Word file of your medical report (can be 30-40 pages). The AI will read every page, extract EVERY test, and explain the results in simple language.",
    },
    text: {
      label: "Typed Text", badge: "Type it",
      description: "If you don't have a photo, type or paste the report text here — the AI will explain it.",
      uploadLabel: "", uploadHint: "",
    },
  } satisfies ModeLabels,
  upload: {
    processing: "Processing file...",
    hintImage: "JPG / PNG · drag & drop or click to choose",
    hintImagePdf: "JPG / PNG / PDF · drag & drop or click to choose",
    hintAll: "JPG / PNG / PDF / DOCX · drag & drop or click to choose",
    imageAttached: "Image attached",
    fileReady: "File is ready. Press \u201cAnalyze\u201d.",
    removeImage: "Remove image",
    removeFile: "Remove file",
    errorType: "This file type is not supported. Upload JPG, PNG, PDF, or DOCX.",
    errorImageOnly: "Only images can be uploaded in this tab.",
    errorDocxNotAllowed: "DOCX cannot be uploaded in this tab.",
    errorTooLarge: "File is too large. Keep it under 60MB.",
  } satisfies UploadLabels,
};

// ---- Hindi ----
const HINDI = {
  extra: {
    headerSubtitle: "अपनी रिपोर्ट अपनी भाषा में समझें",
    aiPowered: "एआई-संचालित",
    privateLabel: "निजी",
    hintText: "टेक्स्ट डालकर 'विश्लेषण करें' दबाएं।",
    hintFile: "PDF/DOCX अपलोड करें — बड़ी रिपोर्ट में 1-2 मिनट लग सकते हैं।",
    hintImage: "साफ फोटो अपलोड करें — जल्दी समझ आएगी।",
    loadingDoc: "एआई आपकी बड़ी रिपोर्ट को पेज-दर-पेज पढ़ रहा है...",
    loadingImage: "एआई आपकी रिपोर्ट पढ़ रहा है...",
    loadingHintDoc: "बड़ी PDF में टेक्स्ट निकालकर हर टेस्ट का विश्लेषण होता है। 1-2 मिनट लग सकते हैं। रुकें।",
    loadingHintImage: "इमेज विश्लेषण में 15-40 सेकंड लग सकते हैं। रुकें।",
    textLabel: "अपनी रिपोर्ट का टेक्स्ट यहाँ लिखें या पेस्ट करें",
    textPlaceholder: "उदाहरण:\nHemoglobin: 10.5 g/dL (Normal: 12-15)\nWBC: 6200 /cmm\nRBC: 4.1 million/cmm\nPlatelets: 1.5 lakh\nGlucose Fasting: 145 mg/dL",
    textCounter: "{n} अक्षर · न्यूनतम 10 चाहिए",
  } satisfies ExtraLabels,
  modes: {
    "test-report": {
      label: "टेस्ट रिपोर्ट", badge: "फोटो / PDF",
      description: "लैब रिपोर्ट पढ़कर बताएगा — कौन-सी वैल्यू सामान्य, कौन-सी कम/ज्यादा, और क्या संदिग्ध है। फोटो या PDF दोनों चलेंगे।",
      uploadLabel: "अपनी मेडिकल टेस्ट रिपोर्ट की फोटो या PDF डालें",
      uploadHint: "अपनी लैब टेस्ट रिपोर्ट (ब्लड टेस्ट, यूरिन, शुगर, थायरॉइड आदि) की साफ फोटो या PDF अपलोड करें। एआई पढ़कर बताएगा क्या सामान्य है और क्या ध्यान चाहिए।",
    },
    "doctor-slip": {
      label: "डॉ. की स्लिप", badge: "फोटो / PDF / DOC",
      description: "प्रिस्क्रिप्शन पढ़कर समझाएगा — बीमारी, दवाएं, कब लेनी, कितनी मात्रा, और डॉक्टर की सलाह।",
      uploadLabel: "डॉक्टर की प्रिस्क्रिप्शन/स्लिप की फोटो, PDF या DOCX डालें",
      uploadHint: "डॉक्टर की लिखी हुई स्लिप की साफ फोटो, PDF या वर्ड फाइल अपलोड करें। एआई बताएगा क्या बीमारी है, कौन-सी दवा है, कब और कैसे लेनी है।",
    },
    xray: {
      label: "एक्स-रे", badge: "स्कैन इमेज",
      description: "एक्स-रे इमेज देखकर बताएगा क्या सामान्य दिख रहा है और क्या असामान्य — सिर्फ मदद के लिए, रेडियोलॉजिस्ट नहीं।",
      uploadLabel: "अपने एक्स-रे की फोटो डालें",
      uploadHint: "अपने एक्स-रे की साफ फोटो अपलोड करें (छाती, घुटना, हाथ आदि)। एआई देखकर बताएगा क्या दिख रहा है और क्या ध्यान चाहिए।",
    },
    document: {
      label: "PDF / DOC", badge: "मल्टी-पेज",
      description: "बड़ी मल्टी-पेज PDF/DOCX रिपोर्ट को पेज-दर-पेज पढ़कर हर टेस्ट अलग-अलग समझाएगा — वैल्यू, रेंज, स्टेटस, सब।",
      uploadLabel: "अपनी PDF या DOCX रिपोर्ट अपलोड करें",
      uploadHint: "अपनी मेडिकल रिपोर्ट की PDF या वर्ड फाइल अपलोड करें (30-40 पेज की भी हो सकती है)। एआई हर पेज पढ़कर हर एक टेस्ट निकालेगा और उसका रिजल्ट आसान भाषा में समझाएगा।",
    },
    text: {
      label: "लिखा हुआ", badge: "टाइप करें",
      description: "अगर फोटो नहीं है, तो रिपोर्ट का टेक्स्ट यहाँ टाइप या पेस्ट कर दें — एआई समझा देगा।",
      uploadLabel: "", uploadHint: "",
    },
  } satisfies ModeLabels,
  upload: {
    processing: "फाइल प्रोसेस हो रही है...",
    hintImage: "JPG / PNG · ड्रैग और ड्रॉप या क्लिक करके चुनें",
    hintImagePdf: "JPG / PNG / PDF · ड्रैग और ड्रॉप या क्लिक करके चुनें",
    hintAll: "JPG / PNG / PDF / DOCX · ड्रैग और ड्रॉप या क्लिक करके चुनें",
    imageAttached: "इमेज अटैच है",
    fileReady: "फाइल तैयार है। \u201cविश्लेषण करें\u201d दबाएं।",
    removeImage: "इमेज हटाएं",
    removeFile: "फाइल हटाएं",
    errorType: "यह फाइल टाइप सपोर्ट नहीं है। JPG, PNG, PDF या DOCX अपलोड करें।",
    errorImageOnly: "इस टैब में सिर्फ इमेज अपलोड हो सकती है।",
    errorDocxNotAllowed: "इस टैब में DOCX अपलोड नहीं हो सकता।",
    errorTooLarge: "फाइल बहुत बड़ी है। 60MB से कम रखें।",
  } satisfies UploadLabels,
};

// ---- Bengali ----
const BENGALI = {
  extra: {
    headerSubtitle: "আপনার রিপোর্ট আপনার ভাষায় বুঝুন",
    aiPowered: "এআই-চালিত",
    privateLabel: "ব্যক্তিগত",
    hintText: "টেক্সট দিন এবং 'বিশ্লেষণ করুন' চাপুন।",
    hintFile: "PDF/DOCX আপলোড করুন — বড় রিপোর্টে 1-2 মিনিট লাগতে পারে।",
    hintImage: "পরিষ্কার ছবি আপলোড করুন — দ্রুত বোঝা যাবে।",
    loadingDoc: "এআই আপনার বড় রিপোর্ট পাতা ধরে পাতা পড়ছে...",
    loadingImage: "এআই আপনার রিপোর্ট পড়ছে...",
    loadingHintDoc: "বড় PDF থেকে টেক্সট বের করে প্রতিটি টেস্ট বিশ্লেষণ করা হয়। 1-2 মিনিট লাগতে পারে। অপেক্ষা করুন।",
    loadingHintImage: "ছবি বিশ্লেষণে 15-40 সেকেন্ড লাগতে পারে। অপেক্ষা করুন।",
    textLabel: "আপনার রিপোর্টের টেক্সট এখানে লিখুন বা পেস্ট করুন",
    textPlaceholder: "উদাহরণ:\nHemoglobin: 10.5 g/dL (Normal: 12-15)\nWBC: 6200 /cmm\nRBC: 4.1 million/cmm\nPlatelets: 1.5 lakh\nGlucose Fasting: 145 mg/dL",
    textCounter: "{n} অক্ষর · অন্তত 10 প্রয়োজন",
  } satisfies ExtraLabels,
  modes: {
    "test-report": {
      label: "টেস্ট রিপোর্ট", badge: "ফোটো / PDF",
      description: "ল্যাব রিপোর্ট পড়ে বলবে — কোন ভ্যালু স্বাভাবিক, কোনটি কম/বেশি, এবং কী সন্দেহজনক। ফোটো বা PDF দুটোই চলবে।",
      uploadLabel: "আপনার মেডিকেল টেস্ট রিপোর্টের ফোটো বা PDF দিন",
      uploadHint: "আপনার ল্যাব টেস্ট রিপোর্ট (blood test, urine, sugar, thyroid ইত্যাদি) এর পরিষ্কার ফোটো বা PDF আপলোড করুন। এআই পড়ে বলবে কী স্বাভাবিক এবং কী খেয়াল দরকার।",
    },
    "doctor-slip": {
      label: "ডা. প্রেসক্রিপশন", badge: "ফোটো / PDF / DOC",
      description: "প্রেসক্রিপশন পড়ে বুঝিয়ে বলবে — রোগ, ওষুধ, কখন খাবেন, কতটা, এবং ডাক্তারের পরামর্শ।",
      uploadLabel: "ডাক্তারের প্রেসক্রিপশন/স্লিপের ফোটো, PDF বা DOCX দিন",
      uploadHint: "ডাক্তারের লেখা স্লিপের পরিষ্কার ফোটো, PDF বা ওয়ার্ড ফাইল আপলোড করুন। এআই বলবে কী রোগ, কোন ওষুধ, কখন এবং কীভাবে খাবেন।",
    },
    xray: {
      label: "এক্স-রে", badge: "স্ক্যান ইমেজ",
      description: "এক্স-রে ছবি দেখে বলবে কী স্বাভাবিক এবং কী অস্বাভাবিক — শুধুমাত্র পরামর্শের জন্য, রেডিওলজিস্ট নয়।",
      uploadLabel: "আপনার এক্স-রে-এর ফোটো দিন",
      uploadHint: "আপনার এক্স-রে-এর পরিষ্কার ফোটো আপলোড করুন (বুক, হাঁটু, হাত ইত্যাদি)। এআই দেখে বলবে কী দেখা যাচ্ছে এবং কী খেয়াল দরকার।",
    },
    document: {
      label: "PDF / DOC", badge: "মাল্টি-পেজ",
      description: "বড় মাল্টি-পেজ PDF/DOCX রিপোর্ট পাতা ধরে পড়ে প্রতিটি টেস্ট আলাদাভাবে বুঝিয়ে বলবে — ভ্যালু, রেঞ্জ, স্ট্যাটাস, সব।",
      uploadLabel: "আপনার PDF বা DOCX রিপোর্ট আপলোড করুন",
      uploadHint: "আপনার মেডিকেল রিপোর্টের PDF বা ওয়ার্ড ফাইল আপলোড করুন (30-40 পেজেরও হতে পারে)। এআই প্রতিটি পেজ পড়ে প্রতিটি টেস্ট বের করবে এবং ফলাফল সহজ ভাষায় বুঝিয়ে বলবে।",
    },
    text: {
      label: "লেখা", badge: "টাইপ করুন",
      description: "যদি ছবি না থাকে, তাহলে রিপোর্টের টেক্সট এখানে টাইপ বা পেস্ট করুন — এআই বুঝিয়ে দেবে।",
      uploadLabel: "", uploadHint: "",
    },
  } satisfies ModeLabels,
  upload: {
    processing: "ফাইল প্রসেস হচ্ছে...",
    hintImage: "JPG / PNG · ড্র্যাগ ও ড্রপ বা ক্লিক করে বেছে নিন",
    hintImagePdf: "JPG / PNG / PDF · ড্র্যাগ ও ড্রপ বা ক্লিক করে বেছে নিন",
    hintAll: "JPG / PNG / PDF / DOCX · ড্র্যাগ ও ড্রপ বা ক্লিক করে বেছে নিন",
    imageAttached: "ছবি যুক্ত হয়েছে",
    fileReady: "ফাইল তৈরি। \u201cবিশ্লেষণ করুন\u201d চাপুন।",
    removeImage: "ছবি সরান",
    removeFile: "ফাইল সরান",
    errorType: "এই ফাইল টাইপ সাপোর্ট করে না। JPG, PNG, PDF বা DOCX আপলোড করুন।",
    errorImageOnly: "এই ট্যাবে শুধু ছবি আপলোড করা যায়।",
    errorDocxNotAllowed: "এই ট্যাবে DOCX আপলোড করা যায় না।",
    errorTooLarge: "ফাইল অনেক বড়। 60MB-এর নিচে রাখুন।",
  } satisfies UploadLabels,
};

// ---- Tamil ----
const TAMIL = {
  extra: {
    headerSubtitle: "உங்கள் மொழியில் உங்கள் ரிபோர்ட்டைப் புரிந்துகொள்ளுங்கள்",
    aiPowered: "ஏஐ-இயக்கப்படும்",
    privateLabel: "தனிப்பட்டது",
    hintText: "டெக்ஸ்ட்டை உள்ளிட்டு 'பகுப்பாய்வு' அழுத்தவும்.",
    hintFile: "PDF/DOCX பதிவேற்றவும் — பெரிய ரிபோர்ட்களுக்கு 1-2 நிமிடம் ஆகலாம்.",
    hintImage: "தெளிவான புகைப்படம் பதிவேற்றவும் — விரைவாக புரிந்துகொள்ளலாம்.",
    loadingDoc: "ஏஐ உங்கள் பெரிய ரிபோர்ட்டை பக்கவாரியாக படிக்கிறது...",
    loadingImage: "ஏஐ உங்கள் ரிபோர்ட்டைப் படிக்கிறது...",
    loadingHintDoc: "பெரிய PDF-இலிருந்து டெக்ஸ்ட் எடுக்கப்பட்டு ஒவ்வொரு டெஸ்ட்டும் பகுப்பாய்வு செய்யப்படுகிறது. 1-2 நிமிடம் ஆகலாம். காத்திருக்கவும்.",
    loadingHintImage: "பட பகுப்பாய்வுக்கு 15-40 விநாடிகள் ஆகலாம். காத்திருக்கவும்.",
    textLabel: "உங்கள் ரிபோர்ட்டின் டெக்ஸ்ட்டை இங்கே தட்டச்சு செய்யவும் அல்லது பேஸ்ட் செய்யவும்",
    textPlaceholder: "உதாரணம்:\nHemoglobin: 10.5 g/dL (Normal: 12-15)\nWBC: 6200 /cmm\nRBC: 4.1 million/cmm\nPlatelets: 1.5 lakh\nGlucose Fasting: 145 mg/dL",
    textCounter: "{n} எழுத்துக்கள் · குறைந்தது 10 தேவை",
  } satisfies ExtraLabels,
  modes: {
    "test-report": {
      label: "டெஸ்ட் ரிபோர்ட்", badge: "புகைப்படம் / PDF",
      description: "லேப் ரிபோர்ட்டைப் படித்து சொல்லும் — எந்த வேல்யூ சாதாரண, எது குறைவு/அதிகம், மற்றும் எது சந்தேகத்திற்குரியது. புகைப்படம் அல்லது PDF இரண்டும் வேலை செய்யும்.",
      uploadLabel: "உங்கள் மருத்துவ டெஸ்ட் ரிபோர்ட்டின் புகைப்படம் அல்லது PDF பதிவேற்றவும்",
      uploadHint: "உங்கள் லேப் டெஸ்ட் ரிபோர்ட் (blood test, urine, sugar, thyroid போன்றவை) தெளிவான புகைப்படம் அல்லது PDF பதிவேற்றவும். ஏஐ படித்து எது சாதாரணம், எதில் கவனம் தேவை என்று சொல்லும்.",
    },
    "doctor-slip": {
      label: "டாக்டர் ப்ரெஸ்கிரிப்ஷன்", badge: "புகைப்படம் / PDF / DOC",
      description: "ப்ரெஸ்கிரிப்ஷனைப் படித்து விளக்கும் — நோய், மருந்துகள், எப்போது எடுப்பது, அளவு, மற்றும் டாக்டரின் ஆலோசனை.",
      uploadLabel: "டாக்டர் ப்ரெஸ்கிரிப்ஷன்/ஸ்லிப்பின் புகைப்படம், PDF அல்லது DOCX பதிவேற்றவும்",
      uploadHint: "டாக்டர் எழுதிய ஸ்லிப்பின் தெளிவான புகைப்படம், PDF அல்லது வேர்ட் கோப்பை பதிவேற்றவும். ஏஐ என்ன நோய், எந்த மருந்து, எப்போது மற்றும் எப்படி எடுப்பது என்று சொல்லும்.",
    },
    xray: {
      label: "எக்ஸ்-ரே", badge: "ஸ்கேன் படம்",
      description: "எக்ஸ்-ரே படத்தைப் பார்த்து எது சாதாரணமாகவும் எது அசாதாரணமாகவும் தெரிகிறது என்று சொல்லும் — வழிகாட்டுதலுக்கு மட்டுமே, ரேடியாலஜிஸ்ட் அல்ல.",
      uploadLabel: "உங்கள் எக்ஸ்-ரே-ன் புகைப்படத்தைப் பதிவேற்றவும்",
      uploadHint: "உங்கள் எக்ஸ்-ரே-ன் தெளிவான புகைப்படத்தை பதிவேற்றவும் (நெஞ்சு, முழங்கால், கை போன்றவை). ஏஐ பார்த்து என்ன தெரிகிறது மற்றும் எதில் கவனம் தேவை என்று சொல்லும்.",
    },
    document: {
      label: "PDF / DOC", badge: "மல்டி-பேஜ்",
      description: "பெரிய மல்டி-பேஜ் PDF/DOCX ரிபோர்ட்டை பக்கவாரியாக படித்து ஒவ்வொரு டெஸ்ட்டையும் தனித்தனியாக விளக்கும் — வேல்யூ, ரேஞ்ச், ஸ்டேட்டஸ், அனைத்தும்.",
      uploadLabel: "உங்கள் PDF அல்லது DOCX ரிபோர்ட்டை பதிவேற்றவும்",
      uploadHint: "உங்கள் மருத்துவ ரிபோர்ட்டின் PDF அல்லது வேர்ட் கோப்பை பதிவேற்றவும் (30-40 பக்கங்கள் இருக்கலாம்). ஏஐ ஒவ்வொரு பக்கமாக படித்து ஒவ்வொரு டெஸ்ட்டையும் எடுத்து முடிவை எளிய மொழியில் விளக்கும்.",
    },
    text: {
      label: "தட்டச்சு செய்தது", badge: "தட்டச்சு செய்யவும்",
      description: "புகைப்படம் இல்லையென்றால், ரிபோர்ட்டின் டெக்ஸ்ட்டை இங்கே தட்டச்சு செய்யவும் அல்லது பேஸ்ட் செய்யவும் — ஏஐ விளக்கும்.",
      uploadLabel: "", uploadHint: "",
    },
  } satisfies ModeLabels,
  upload: {
    processing: "கோப்பு செயலாக்கப்படுகிறது...",
    hintImage: "JPG / PNG · இழுத்து விடுங்கள் அல்லது கிளிக் செய்து தேர்ந்தெடுக்கவும்",
    hintImagePdf: "JPG / PNG / PDF · இழுத்து விடுங்கள் அல்லது கிளிக் செய்து தேர்ந்தெடுக்கவும்",
    hintAll: "JPG / PNG / PDF / DOCX · இழுத்து விடுங்கள் அல்லது கிளிக் செய்து தேர்ந்தெடுக்கவும்",
    imageAttached: "படம் இணைக்கப்பட்டது",
    fileReady: "கோப்பு தயார். \u201cபகுப்பாய்வு\u201d அழுத்தவும்.",
    removeImage: "படத்தை அகற்று",
    removeFile: "கோப்பை அகற்று",
    errorType: "இந்த கோப்பு வகை ஆதரிக்கப்படவில்லை. JPG, PNG, PDF அல்லது DOCX பதிவேற்றவும்.",
    errorImageOnly: "இந்த டேப்பில் படங்களை மட்டுமே பதிவேற்ற முடியும்.",
    errorDocxNotAllowed: "இந்த டேப்பில் DOCX பதிவேற்ற முடியாது.",
    errorTooLarge: "கோப்பு மிகப் பெரியது. 60MB-க்கு கீழ் வைக்கவும்.",
  } satisfies UploadLabels,
};

// ---- Telugu ----
const TELUGU = {
  extra: {
    headerSubtitle: "మీ భాషలో మీ రిపోర్ట్‌ను అర్థం చేసుకోండి",
    aiPowered: "ఏఐ-ఆధారిత",
    privateLabel: "వ్యక్తిగత",
    hintText: "టెక్స్ట్ నమోదు చేసి 'విశ్లేషణ' నొక్కండి.",
    hintFile: "PDF/DOCX అప్‌లోడ్ చేయండి — పెద్ద రిపోర్ట్‌లకు 1-2 నిమిషాలు పడవచ్చు.",
    hintImage: "స్పష్టమైన ఫోటో అప్‌లోడ్ చేయండి — త్వరగా అర్థమవుతుంది.",
    loadingDoc: "ఏఐ మీ పెద్ద రిపోర్ట్‌ను పేజీ వారీగా చదువుతోంది...",
    loadingImage: "ఏఐ మీ రిపోర్ట్‌ను చదువుతోంది...",
    loadingHintDoc: "పెద్ద PDF నుండి టెక్స్ట్ తీసి ప్రతి టెస్ట్ విశ్లేషణ చేయబడుతోంది. 1-2 నిమిషాలు పడవచ్చు. కాయండి.",
    loadingHintImage: "ఇమేజ్ విశ్లేషణకు 15-40 సెకన్లు పడవచ్చు. కాయండి.",
    textLabel: "మీ రిపోర్ట్ టెక్స్ట్‌ను ఇక్కడ టైప్ చేయండి లేదా పేస్ట్ చేయండి",
    textPlaceholder: "ఉదాహరణ:\nHemoglobin: 10.5 g/dL (Normal: 12-15)\nWBC: 6200 /cmm\nRBC: 4.1 million/cmm\nPlatelets: 1.5 lakh\nGlucose Fasting: 145 mg/dL",
    textCounter: "{n} అక్షరాలు · కనీసం 10 అవసరం",
  } satisfies ExtraLabels,
  modes: {
    "test-report": {
      label: "టెస్ట్ రిపోర్ట్", badge: "ఫోటో / PDF",
      description: "ల్యాబ్ రిపోర్ట్ చదివి చెబుతుంది — ఏ వాల్యూ సాధారణ, ఏది తక్కువ/ఎక్కువ, మరియు ఏమి అనుమానాస్పద. ఫోటో లేదా PDF రెండూ పని చేస్తాయి.",
      uploadLabel: "మీ మెడికల్ టెస్ట్ రిపోర్ట్ ఫోటో లేదా PDF అప్‌లోడ్ చేయండి",
      uploadHint: "మీ ల్యాబ్ టెస్ట్ రిపోర్ట్ (blood test, urine, sugar, thyroid మొదలైనవి) స్పష్టమైన ఫోటో లేదా PDF అప్‌లోడ్ చేయండి. ఏఐ చదివి ఏమి సాధారణ, దేనిపై శ్రద్ధ అవసరం చెబుతుంది.",
    },
    "doctor-slip": {
      label: "డా. ప్రిస్క్రిప్షన్", badge: "ఫోటో / PDF / DOC",
      description: "ప్రిస్క్రిప్షన్ చదివి వివరిస్తుంది — వ్యాధి, మందులు, ఎప్పుడు తీసుకోవాలి, మోతాదు, మరియు డాక్టర్ సలహా.",
      uploadLabel: "డాక్టర్ ప్రిస్క్రిప్షన్/స్లిప్ ఫోటో, PDF లేదా DOCX అప్‌లోడ్ చేయండి",
      uploadHint: "డాక్టర్ రాసిన స్లిప్ స్పష్టమైన ఫోటో, PDF లేదా వర్డ్ ఫైల్ అప్‌లోడ్ చేయండి. ఏఐ ఏ వ్యాధి, ఏ మందు, ఎప్పుడు మరియు ఎలా తీసుకోవాలో చెబుతుంది.",
    },
    xray: {
      label: "ఎక్స్-రే", badge: "స్కాన్ ఇమేజ్",
      description: "ఎక్స్-రే ఇమేజ్ చూసి ఏమి సాధారణంగా, ఏమి అసాధారణంగా కనిపిస్తుందో చెబుతుంది — మార్గదర్శకం మాత్రమే, రేడియాలజిస్ట్ కాదు.",
      uploadLabel: "మీ ఎక్స్-రే ఫోటో అప్‌లోడ్ చేయండి",
      uploadHint: "మీ ఎక్స్-రే స్పష్టమైన ఫోటో అప్‌లోడ్ చేయండి (ఛాతీ, మోకాలు, చేయి మొదలైనవి). ఏఐ చూసి ఏమి కనిపిస్తుందో మరియు దేనిపై శ్రద్ధ అవసరం చెబుతుంది.",
    },
    document: {
      label: "PDF / DOC", badge: "మల్టీ-పేజీ",
      description: "పెద్ద మల్టీ-పేజీ PDF/DOCX రిపోర్ట్‌ను పేజీ వారీగా చదివి ప్రతి టెస్ట్‌ను విడిగా వివరిస్తుంది — వాల్యూ, రేంజ్, స్టేటస్, అన్నీ.",
      uploadLabel: "మీ PDF లేదా DOCX రిపోర్ట్ అప్‌లోడ్ చేయండి",
      uploadHint: "మీ మెడికల్ రిపోర్ట్ PDF లేదా వర్డ్ ఫైల్ అప్‌లోడ్ చేయండి (30-40 పేజీలు ఉండవచ్చు). ఏఐ ప్రతి పేజీ చదివి ప్రతి టెస్ట్‌ను తీసి ఫలితాన్ని సులభ భాషలో వివరిస్తుంది.",
    },
    text: {
      label: "టైప్ చేసిన టెక్స్ట్", badge: "టైప్ చేయండి",
      description: "ఫోటో లేకపోతే, రిపోర్ట్ టెక్స్ట్‌ను ఇక్కడ టైప్ చేయండి లేదా పేస్ట్ చేయండి — ఏఐ వివరిస్తుంది.",
      uploadLabel: "", uploadHint: "",
    },
  } satisfies ModeLabels,
  upload: {
    processing: "ఫైల్ ప్రాసెస్ అవుతోంది...",
    hintImage: "JPG / PNG · డ్రాగ్ మరియు డ్రాప్ లేదా క్లిక్ చేసి ఎంచుకోండి",
    hintImagePdf: "JPG / PNG / PDF · డ్రాగ్ మరియు డ్రాప్ లేదా క్లిక్ చేసి ఎంచుకోండి",
    hintAll: "JPG / PNG / PDF / DOCX · డ్రాగ్ మరియు డ్రాప్ లేదా క్లిక్ చేసి ఎంచుకోండి",
    imageAttached: "ఇమేజ్ అటాచ్ అయింది",
    fileReady: "ఫైల్ సిద్ధంగా ఉంది. \u201cవిశ్లేషణ\u201d నొక్కండి.",
    removeImage: "ఇమేజ్ తొలగించు",
    removeFile: "ఫైల్ తొలగించు",
    errorType: "ఈ ఫైల్ రకం మద్దతు లేదు. JPG, PNG, PDF లేదా DOCX అప్‌లోడ్ చేయండి.",
    errorImageOnly: "ఈ ట్యాబ్‌లో ఇమేజ్‌లను మాత్రమే అప్‌లోడ్ చేయవచ్చు.",
    errorDocxNotAllowed: "ఈ ట్యాబ్‌లో DOCX అప్‌లోడ్ చేయబడదు.",
    errorTooLarge: "ఫైల్ చాలా పెద్డది. 60MB కంటే తక్కువగా ఉంచండి.",
  } satisfies UploadLabels,
};

// ---- Marathi ----
const MARATHI = {
  extra: {
    headerSubtitle: "तुमची रिपोर्ट तुमच्या भाषेत समजून घ्या",
    aiPowered: "एआय-संचालित",
    privateLabel: "खाजगी",
    hintText: "मजकूर टाकून 'विश्लेषण करा' दाबा.",
    hintFile: "PDF/DOCX अपलोड करा — मोठ्या रिपोर्टसाठी 1-2 मिनिटे लागू शकतात.",
    hintImage: "स्वच्छ फोटो अपलोड करा — लवकर समजेल.",
    loadingDoc: "एआय तुमची मोठी रिपोर्ट पानानपाने वाचत आहे...",
    loadingImage: "एआय तुमची रिपोर्ट वाचत आहे...",
    loadingHintDoc: "मोठ्या PDF मधून मजकूर काढून प्रत्येक टेस्टचे विश्लेषण केले जाते. 1-2 मिनिटे लागू शकतात. थांबा.",
    loadingHintImage: "इमेज विश्लेषणासाठी 15-40 सेकंद लागू शकतात. थांबा.",
    textLabel: "तुमच्या रिपोर्टचा मजकूर येथे टाईप करा किंवा पेस्ट करा",
    textPlaceholder: "उदाहरण:\nHemoglobin: 10.5 g/dL (Normal: 12-15)\nWBC: 6200 /cmm\nRBC: 4.1 million/cmm\nPlatelets: 1.5 lakh\nGlucose Fasting: 145 mg/dL",
    textCounter: "{n} अक्षरे · किमान 10 आवश्यक",
  } satisfies ExtraLabels,
  modes: {
    "test-report": {
      label: "टेस्ट रिपोर्ट", badge: "फोटो / PDF",
      description: "लॅब रिपोर्ट वाचून सांगेल — कोणती व्हॅल्यू सामान्य, कोणती कमी/जास्त, आणि काय संशयास्पद आहे. फोटो किंवा PDF दोन्ही चालतील.",
      uploadLabel: "तुमच्या मेडिकल टेस्ट रिपोर्टचा फोटो किंवा PDF टाका",
      uploadHint: "तुमच्या लॅब टेस्ट रिपोर्टचा (blood test, urine, sugar, thyroid इत्यादी) स्वच्छ फोटो किंवा PDF अपलोड करा. एआय वाचून सांगेल काय सामान्य आहे आणि काय लक्ष देण्याची गरज आहे.",
    },
    "doctor-slip": {
      label: "डॉ. प्रेस्क्रिप्शन", badge: "फोटो / PDF / DOC",
      description: "प्रेस्क्रिप्शन वाचून समजावून सांगेल — आजार, औषधे, कधी घ्यावीत, किती मात्रा, आणि डॉक्टरांचा सल्ला.",
      uploadLabel: "डॉक्टरांच्या प्रेस्क्रिप्शन/स्लिपचा फोटो, PDF किंवा DOCX टाका",
      uploadHint: "डॉक्टरांनी लिहिलेल्या स्लिपचा स्वच्छ फोटो, PDF किंवा वर्ड फाइल अपलोड करा. एआय सांगेल काय आजार आहे, कोणते औषध आहे, कधी आणि कसे घ्यावे.",
    },
    xray: {
      label: "एक्स-रे", badge: "स्कॅन इमेज",
      description: "एक्स-रे इमेज पाहून सांगेल काय सामान्य दिसते आणि काय असामान्य — फक्त मार्गदर्शनासाठी, रेडिऑलॉजिस्ट नाही.",
      uploadLabel: "तुमच्या एक्स-रेचा फोटो टाका",
      uploadHint: "तुमच्या एक्स-रेचा स्वच्छ फोटो अपलोड करा (छाती, गुडघा, हात इत्यादी). एआय पाहून सांगेल काय दिसते आणि काय लक्ष देण्याची गरज आहे.",
    },
    document: {
      label: "PDF / DOC", badge: "मल्टी-पेज",
      description: "मोठी मल्टी-पेज PDF/DOCX रिपोर्ट पानानपाने वाचून प्रत्येक टेस्ट वेगवेगळा समजावून सांगेल — व्हॅल्यू, रेंज, स्टेटस, सर्व.",
      uploadLabel: "तुमची PDF किंवा DOCX रिपोर्ट अपलोड करा",
      uploadHint: "तुमच्या मेडिकल रिपोर्टची PDF किंवा वर्ड फाइल अपलोड करा (30-40 पानांचीही असू शकते). एआय प्रत्येक पान वाचून प्रत्येक टेस्ट काढेल आणि निकाल सोप्या भाषेत समजावून सांगेल.",
    },
    text: {
      label: "लिहिलेले मजकूर", badge: "टाईप करा",
      description: "जर फोटो नसेल, तर रिपोर्टचा मजकूर येथे टाईप किंवा पेस्ट करा — एआय समजावून सांगेल.",
      uploadLabel: "", uploadHint: "",
    },
  } satisfies ModeLabels,
  upload: {
    processing: "फाइल प्रोसेस होत आहे...",
    hintImage: "JPG / PNG · ड्रॅग आणि ड्रॉप किंवा क्लिक करून निवडा",
    hintImagePdf: "JPG / PNG / PDF · ड्रॅग आणि ड्रॉप किंवा क्लिक करून निवडा",
    hintAll: "JPG / PNG / PDF / DOCX · ड्रॅग आणि ड्रॉप किंवा क्लिक करून निवडा",
    imageAttached: "इमेज जोडली आहे",
    fileReady: "फाइल तयार आहे. \u201cविश्लेषण करा\u201d दाबा.",
    removeImage: "इमेज काढा",
    removeFile: "फाइल काढा",
    errorType: "हा फाइल प्रकार सपोर्ट नाही. JPG, PNG, PDF किंवा DOCX अपलोड करा.",
    errorImageOnly: "या टॅबमध्ये फक्त इमेज अपलोड करता येते.",
    errorDocxNotAllowed: "या टॅबमध्ये DOCX अपलोड करता येत नाही.",
    errorTooLarge: "फाइल खूप मोठी आहे. 60MB पेक्षा कमी ठेवा.",
  } satisfies UploadLabels,
};

// ---- Gujarati ----
const GUJARATI = {
  extra: {
    headerSubtitle: "તમારી રિપોર્ટ તમારી ભાષામાં સમજો",
    aiPowered: "એઆઇ-સંચાલિત",
    privateLabel: "ખાનગી",
    hintText: "ટેક્સ્ટ નાખીને 'વિશ્લેષણ કરો' દબાવો.",
    hintFile: "PDF/DOCX અપલોડ કરો — મોટી રિપોર્ટમાં 1-2 મિનિટ લાગી શકે છે.",
    hintImage: "સ્પષ્ટ ફોટો અપલોડ કરો — જલ્દી સમજાશે.",
    loadingDoc: "એઆઇ તમારી મોટી રિપોર્ટ પાનાં દ્વારા વાંચી રહ્યું છે...",
    loadingImage: "એઆઇ તમારી રિપોર્ટ વાંચી રહ્યું છે...",
    loadingHintDoc: "મોટી PDF માંથી ટેક્સ્ટ કાઢીને દરેક ટેસ્ટનું વિશ્લેષણ થાય છે. 1-2 મિનિટ લાગી શકે છે. રાહ જુઓ.",
    loadingHintImage: "ઇમેજ વિશ્લેષણમાં 15-40 સેકન્ડ લાગી શકે છે. રાહ જુઓ.",
    textLabel: "તમારી રિપોર્ટનો ટેક્સ્ટ અહીં લખો અથવા પેસ્ટ કરો",
    textPlaceholder: "ઉદાહરણ:\nHemoglobin: 10.5 g/dL (Normal: 12-15)\nWBC: 6200 /cmm\nRBC: 4.1 million/cmm\nPlatelets: 1.5 lakh\nGlucose Fasting: 145 mg/dL",
    textCounter: "{n} અક્ષરો · ઓછામાં ઓછા 10 જોઈએ",
  } satisfies ExtraLabels,
  modes: {
    "test-report": {
      label: "ટેસ્ટ રિપોર્ટ", badge: "ફોટો / PDF",
      description: "લેબ રિપોર્ટ વાંચીને કહેશે — કઈ વેલ્યૂ સામાન્ય, કઈ ઓછી/વધારે, અને શું શંકાસ્પદ છે. ફોટો કે PDF બંને ચાલશે.",
      uploadLabel: "તમારી મેડિકલ ટેસ્ટ રિપોર્ટનો ફોટો કે PDF નાખો",
      uploadHint: "તમારી લેબ ટેસ્ટ રિપોર્ટ (blood test, urine, sugar, thyroid વગેરે) નો સ્પષ્ટ ફોટો કે PDF અપલોડ કરો. એઆઇ વાંચીને કહેશે શું સામાન્ય છે અને શું ધ્યાન જોઈએ.",
    },
    "doctor-slip": {
      label: "ડો. પ્રિસ્ક્રિપ્શન", badge: "ફોટો / PDF / DOC",
      description: "પ્રિસ્ક્રિપ્શન વાંચીને સમજાવશે — બીમારી, દવાઓ, ક્યારે લેવી, કેટલી માત્રા, અને ડોક્ટરની સલાહ.",
      uploadLabel: "ડોક્ટરના પ્રિસ્ક્રિપ્શન/સ્લિપનો ફોટો, PDF કે DOCX નાખો",
      uploadHint: "ડોક્ટરે લખેલી સ્લિપનો સ્પષ્ટ ફોટો, PDF કે વર્ડ ફાઇલ અપલોડ કરો. એઆઇ કહેશે શું બીમારી છે, કઈ દવા છે, ક્યારે અને કેવી રીતે લેવી.",
    },
    xray: {
      label: "એક્સ-રે", badge: "સ્કેન ઇમેજ",
      description: "એક્સ-રે ઇમેજ જોઈને કહેશે શું સામાન્ય દેખાય છે અને શું અસામાન્ય — ફક્ત માર્ગદર્શન માટે, રેડિયોલોજિસ્ટ નહીં.",
      uploadLabel: "તમારા એક્સ-રેનો ફોટો નાખો",
      uploadHint: "તમારા એક્સ-રેનો સ્પષ્ટ ફોટો અપલોડ કરો (છાતી, ઘૂંટણ, હાથ વગેરે). એઆઇ જોઈને કહેશે શું દેખાય છે અને શું ધ્યાન જોઈએ.",
    },
    document: {
      label: "PDF / DOC", badge: "મલ્ટી-પેજ",
      description: "મોટી મલ્ટી-પેજ PDF/DOCX રિપોર્ટ પાનાં દ્વારા વાંચીને દરેક ટેસ્ટ અલગ-અલગ સમજાવશે — વેલ્યૂ, રેન્જ, સ્ટેટસ, બધું.",
      uploadLabel: "તમારી PDF કે DOCX રિપોર્ટ અપલોડ કરો",
      uploadHint: "તમારી મેડિકલ રિપોર્ટની PDF કે વર્ડ ફાઇલ અપલોડ કરો (30-40 પાનાંની પણ હોય શકે). એઆઇ દરેક પાનું વાંચીને દરેક ટેસ્ટ કાઢશે અને પરિણામ સરળ ભાષામાં સમજાવશે.",
    },
    text: {
      label: "લખેલું ટેક્સ્ટ", badge: "ટાઇપ કરો",
      description: "જો ફોટો નથી, તો રિપોર્ટનો ટેક્સ્ટ અહીં ટાઇપ કે પેસ્ટ કરો — એઆઇ સમજાવશે.",
      uploadLabel: "", uploadHint: "",
    },
  } satisfies ModeLabels,
  upload: {
    processing: "ફાઇલ પ્રોસેસ થઈ રહી છે...",
    hintImage: "JPG / PNG · ડ્રેગ અને ડ્રોપ કે ક્લિક કરીને પસંદ કરો",
    hintImagePdf: "JPG / PNG / PDF · ડ્રેગ અને ડ્રોપ કે ક્લિક કરીને પસંદ કરો",
    hintAll: "JPG / PNG / PDF / DOCX · ડ્રેગ અને ડ્રોપ કે ક્લિક કરીને પસંદ કરો",
    imageAttached: "ઇમેજ જોડાયેલ છે",
    fileReady: "ફાઇલ તૈયાર છે. \u201cવિશ્લેષણ કરો\u201d દબાવો.",
    removeImage: "ઇમેજ દૂર કરો",
    removeFile: "ફાઇલ દૂર કરો",
    errorType: "આ ફાઇલ પ્રકાર સપોર્ટ નથી. JPG, PNG, PDF કે DOCX અપલોડ કરો.",
    errorImageOnly: "આ ટેબમાં ફક્ત ઇમેજ અપલોડ થઈ શકે છે.",
    errorDocxNotAllowed: "આ ટેબમાં DOCX અપલોડ થઈ શકતું નથી.",
    errorTooLarge: "ફાઇલ ઘણી મોટી છે. 60MB થી ઓછી રાખો.",
  } satisfies UploadLabels,
};

// ---- Kannada ----
const KANNADA = {
  extra: {
    headerSubtitle: "ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ನಿಮ್ಮ ವರದಿಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ",
    aiPowered: "ಎಐ-ಚಾಲಿತ",
    privateLabel: "ಖಾಸಗಿ",
    hintText: "ಪಠ್ಯ ಸೇರಿಸಿ 'ವಿಶ್ಲೇಷಿಸಿ' ಒತ್ತಿರಿ.",
    hintFile: "PDF/DOCX ಅಪ್‌ಲೋಡ್ ಮಾಡಿ — ದೊಡ್ಡ ವರದಿಗೆ 1-2 ನಿಮಿಷ ತೆಗೆದುಕೊಳ್ಳಬಹುದು.",
    hintImage: "ಸ್ಪಷ್ಟ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ — ಬೇಗ ಅರ್ಥವಾಗುತ್ತದೆ.",
    loadingDoc: "ಎಐ ನಿಮ್ಮ ದೊಡ್ಡ ವರದಿಯನ್ನು ಪುಟ ಪ್ರತಿ ಪುಟ ಓದುತ್ತಿದೆ...",
    loadingImage: "ಎಐ ನಿಮ್ಮ ವರದಿಯನ್ನು ಓದುತ್ತಿದೆ...",
    loadingHintDoc: "ದೊಡ್ಡ PDF ಯಿಂದ ಪಠ್ಯ ಹೊರತೆಗೆದು ಪ್ರತಿ ಟೆಸ್ಟ್ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ. 1-2 ನಿಮಿಷ ತೆಗೆದುಕೊಳ್ಳಬಹುದು. ಕಾಯಿರಿ.",
    loadingHintImage: "ಇಮೇಜ್ ವಿಶ್ಲೇಷಣೆಗೆ 15-40 ಸೆಕೆಂಡ್ ತೆಗೆದುಕೊಳ್ಳಬಹುದು. ಕಾಯಿರಿ.",
    textLabel: "ನಿಮ್ಮ ವರದಿಯ ಪಠ್ಯವನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಪೇಸ್ಟ್ ಮಾಡಿ",
    textPlaceholder: "ಉದಾಹರಣೆ:\nHemoglobin: 10.5 g/dL (Normal: 12-15)\nWBC: 6200 /cmm\nRBC: 4.1 million/cmm\nPlatelets: 1.5 lakh\nGlucose Fasting: 145 mg/dL",
    textCounter: "{n} ಅಕ್ಷರಗಳು · ಕನಿಷ್ಠ 10 ಬೇಕು",
  } satisfies ExtraLabels,
  modes: {
    "test-report": {
      label: "ಟೆಸ್ಟ್ ವರದಿ", badge: "ಫೋಟೋ / PDF",
      description: "ಲ್ಯಾಬ್ ವರದಿ ಓದಿ ಹೇಳುತ್ತದೆ — ಯಾವ ಮೌಲ್ಯ ಸಾಮಾನ್ಯ, ಯಾವುದು ಕಡಿಮೆ/ಹೆಚ್ಚು, ಮತ್ತು ಯಾವುದು ಸಂದೇಹಾಸ್ಪದ. ಫೋಟೋ ಅಥವಾ PDF ಎರಡೂ ಕೆಲಸ ಮಾಡುತ್ತವೆ.",
      uploadLabel: "ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ಟೆಸ್ಟ್ ವರದಿಯ ಫೋಟೋ ಅಥವಾ PDF ಸೇರಿಸಿ",
      uploadHint: "ನಿಮ್ಮ ಲ್ಯಾಬ್ ಟೆಸ್ಟ್ ವರದಿ (blood test, urine, sugar, thyroid ಇತ್ಯಾದಿ) ಸ್ಪಷ್ಟ ಫೋಟೋ ಅಥವಾ PDF ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. ಎಐ ಓದಿ ಏನು ಸಾಮಾನ್ಯ ಮತ್ತು ಏನಕ್ಕೆ ಗಮನ ಬೇಕು ಎಂದು ಹೇಳುತ್ತದೆ.",
    },
    "doctor-slip": {
      label: "ಡಾ. ಪ್ರಿಸ್ಕ್ರಿಪ್ಶನ್", badge: "ಫೋಟೋ / PDF / DOC",
      description: "ಪ್ರಿಸ್ಕ್ರಿಪ್ಶನ್ ಓದಿ ವಿವರಿಸುತ್ತದೆ — ರೋಗ, ಔಷಧಗಳು, ಯಾವಾಗ ತೆಗೆದುಕೊಳ್ಳಬೇಕು, ಪ್ರಮಾಣ, ಮತ್ತು ಡಾಕ್ಟರ್ ಸಲಹೆ.",
      uploadLabel: "ಡಾಕ್ಟರ್ ಪ್ರಿಸ್ಕ್ರಿಪ್ಶನ್/ಸ್ಲಿಪ್ ಫೋಟೋ, PDF ಅಥವಾ DOCX ಸೇರಿಸಿ",
      uploadHint: "ಡಾಕ್ಟರ್ ಬರೆದ ಸ್ಲಿಪ್ ಸ್ಪಷ್ಟ ಫೋಟೋ, PDF ಅಥವಾ ವರ್ಡ್ ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. ಎಐ ಯಾವ ರೋಗ, ಯಾವ ಔಷಧ, ಯಾವಾಗ ಮತ್ತು ಹೇಗೆ ತೆಗೆದುಕೊಳ್ಳಬೇಕು ಎಂದು ಹೇಳುತ್ತದೆ.",
    },
    xray: {
      label: "ಎಕ್ಸ್-ರೇ", badge: "ಸ್ಕ್ಯಾನ್ ಇಮೇಜ್",
      description: "ಎಕ್ಸ್-ರೇ ಇಮೇಜ್ ನೋಡಿ ಏನು ಸಾಮಾನ್ಯ ಮತ್ತು ಏನು ಅಸಾಮಾನ್ಯ ಕಾಣುತ್ತಿದೆ ಎಂದು ಹೇಳುತ್ತದೆ — ಮಾರ್ಗದರ್ಶನಕ್ಕಷ್ಟೇ, ರೇಡಿಯೋಲಜಿಸ್ಟ್ ಅಲ್ಲ.",
      uploadLabel: "ನಿಮ್ಮ ಎಕ್ಸ್-ರೇ ಫೋಟೋ ಸೇರಿಸಿ",
      uploadHint: "ನಿಮ್ಮ ಎಕ್ಸ್-ರೇ ಸ್ಪಷ್ಟ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ (ಎದೆ, ಮೊಣಕೈ, ಕೈ ಇತ್ಯಾದಿ). ಎಐ ನೋಡಿ ಏನು ಕಾಣುತ್ತಿದೆ ಮತ್ತು ಏನಕ್ಕೆ ಗಮನ ಬೇಕು ಎಂದು ಹೇಳುತ್ತದೆ.",
    },
    document: {
      label: "PDF / DOC", badge: "ಮಲ್ಟಿ-ಪೇಜ್",
      description: "ದೊಡ್ಡ ಮಲ್ಟಿ-ಪೇಜ್ PDF/DOCX ವರದಿಯನ್ನು ಪುಟ ಪ್ರತಿ ಪುಟ ಓದಿ ಪ್ರತಿ ಟೆಸ್ಟ್ ಪ್ರತ್ಯೇಕವಾಗಿ ವಿವರಿಸುತ್ತದೆ — ಮೌಲ್ಯ, ಶ್ರೇಣಿ, ಸ್ಥಿತಿ, ಎಲ್ಲಾ.",
      uploadLabel: "ನಿಮ್ಮ PDF ಅಥವಾ DOCX ವರದಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
      uploadHint: "ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ವರದಿಯ PDF ಅಥವಾ ವರ್ಡ್ ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ (30-40 ಪುಟಗಳದ್ದೂ ಆಗಿರಬಹುದು). ಎಐ ಪ್ರತಿ ಪುಟ ಓದಿ ಪ್ರತಿ ಟೆಸ್ಟ್ ತೆಗೆದು ಫಲಿತಾಂಶವನ್ನು ಸರಳ ಭಾಷೆಯಲ್ಲಿ ವಿವರಿಸುತ್ತದೆ.",
    },
    text: {
      label: "ಟೈಪ್ ಮಾಡಿದ ಪಠ್ಯ", badge: "ಟೈಪ್ ಮಾಡಿ",
      description: "ಫೋಟೋ ಇಲ್ಲದಿದ್ದರೆ, ವರದಿಯ ಪಠ್ಯವನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಅಥವಾ ಪೇಸ್ಟ್ ಮಾಡಿ — ಎಐ ವಿವರಿಸುತ್ತದೆ.",
      uploadLabel: "", uploadHint: "",
    },
  } satisfies ModeLabels,
  upload: {
    processing: "ಫೈಲ್ ಪ್ರಕ್ರಿಯೆಯಾಗುತ್ತಿದೆ...",
    hintImage: "JPG / PNG · ಡ್ರ್ಯಾಗ್ ಮತ್ತು ಡ್ರಾಪ್ ಅಥವಾ ಕ್ಲಿಕ್ ಮಾಡಿ ಆಯ್ಕೆಮಾಡಿ",
    hintImagePdf: "JPG / PNG / PDF · ಡ್ರ್ಯಾಗ್ ಮತ್ತು ಡ್ರಾಪ್ ಅಥವಾ ಕ್ಲಿಕ್ ಮಾಡಿ ಆಯ್ಕೆಮಾಡಿ",
    hintAll: "JPG / PNG / PDF / DOCX · ಡ್ರ್ಯಾಗ್ ಮತ್ತು ಡ್ರಾಪ್ ಅಥವಾ ಕ್ಲಿಕ್ ಮಾಡಿ ಆಯ್ಕೆಮಾಡಿ",
    imageAttached: "ಇಮೇಜ್ ಲಗತ್ತಿಸಲಾಗಿದೆ",
    fileReady: "ಫೈಲ್ ಸಿದ್ಧವಾಗಿದೆ. \u201cವಿಶ್ಲೇಷಿಸಿ\u201d ಒತ್ತಿರಿ.",
    removeImage: "ಇಮೇಜ್ ತೆಗೆದುಹಾಕಿ",
    removeFile: "ಫೈಲ್ ತೆಗೆದುಹಾಕಿ",
    errorType: "ಈ ಫೈಲ್ ಪ್ರಕಾರ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ. JPG, PNG, PDF ಅಥವಾ DOCX ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
    errorImageOnly: "ಈ ಟ್ಯಾಬ್‌ನಲ್ಲಿ ಇಮೇಜ್‌ಗಳನ್ನು ಮಾತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಬಹುದು.",
    errorDocxNotAllowed: "ಈ ಟ್ಯಾಬ್‌ನಲ್ಲಿ DOCX ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗುವುದಿಲ್ಲ.",
    errorTooLarge: "ಫೈಲ್ ಬಹಳ ದೊಡ್ಡದು. 60MB ಗಿಂತ ಕಡಿಮೆ ಇರಿಸಿ.",
  } satisfies UploadLabels,
};

// ---- Malayalam ----
const MALAYALAM = {
  extra: {
    headerSubtitle: "നിങ്ങളുടെ ഭാഷയിൽ നിങ്ങളുടെ റിപ്പോർട്ട് മനസ്സിലാക്കുക",
    aiPowered: "എഐ-പ്രവർത്തിത",
    privateLabel: "സ്വകാര്യം",
    hintText: "ടെക്സ്റ്റ് നൽകി 'വിശകലനം ചെയ്യുക' അമർത്തുക.",
    hintFile: "PDF/DOCX അപ്‌ലോഡ് ചെയ്യുക — വലിയ റിപ്പോർട്ടുകൾക്ക് 1-2 മിനിറ്റ് എടുത്തേക്കാം.",
    hintImage: "വ്യക്തമായ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക — വേഗത്തിൽ മനസ്സിലാക്കാം.",
    loadingDoc: "എഐ നിങ്ങളുടെ വലിയ റിപ്പോർട്ട് പേജ് പ്രകാരം വായിക്കുന്നു...",
    loadingImage: "എഐ നിങ്ങളുടെ റിപ്പോർട്ട് വായിക്കുന്നു...",
    loadingHintDoc: "വലിയ PDF-ൽ നിന്ന് ടെക്സ്റ്റ് എടുത്ത് ഓരോ ടെസ്റ്റും വിശകലനം ചെയ്യുന്നു. 1-2 മിനിറ്റ് എടുത്തേക്കാം. കാത്തിരിക്കുക.",
    loadingHintImage: "ഇമേജ് വിശകലനത്തിന് 15-40 സെക്കൻഡ് എടുത്തേക്കാം. കാത്തിരിക്കുക.",
    textLabel: "നിങ്ങളുടെ റിപ്പോർട്ടിന്റെ ടെക്സ്റ്റ് ഇവിടെ ടൈപ്പ് ചെയ്യുക അല്ലെങ്കിൽ പേസ്റ്റ് ചെയ്യുക",
    textPlaceholder: "ഉദാഹരണം:\nHemoglobin: 10.5 g/dL (Normal: 12-15)\nWBC: 6200 /cmm\nRBC: 4.1 million/cmm\nPlatelets: 1.5 lakh\nGlucose Fasting: 145 mg/dL",
    textCounter: "{n} പ്രതീകങ്ങൾ · കുറഞ്ഞത് 10 വേണം",
  } satisfies ExtraLabels,
  modes: {
    "test-report": {
      label: "ടെസ്റ്റ് റിപ്പോർട്ട്", badge: "ഫോട്ടോ / PDF",
      description: "ലാബ് റിപ്പോർട്ട് വായിച്ച് പറയും — ഏത് വാല്യൂ സാധാരണ, ഏത് കുറവ്/കൂടുതൽ, എന്താണ് സംശയാസ്പദം. ഫോട്ടോ അല്ലെങ്കിൽ PDF രണ്ടും പ്രവർത്തിക്കും.",
      uploadLabel: "നിങ്ങളുടെ മെഡിക്കൽ ടെസ്റ്റ് റിപ്പോർട്ടിന്റെ ഫോട്ടോ അല്ലെങ്കിൽ PDF നൽകുക",
      uploadHint: "നിങ്ങളുടെ ലാബ് ടെസ്റ്റ് റിപ്പോർട്ടിന്റെ (blood test, urine, sugar, thyroid തുടങ്ങിയവ) വ്യക്തമായ ഫോട്ടോ അല്ലെങ്കിൽ PDF അപ്‌ലോഡ് ചെയ്യുക. എഐ വായിച്ച് എന്താണ് സാധാരണ എന്നും എന്തിന് ശ്രദ്ധ വേണമെന്നും പറയും.",
    },
    "doctor-slip": {
      label: "ഡോ. പ്രിസ്ക്രിപ്ഷൻ", badge: "ഫോട്ടോ / PDF / DOC",
      description: "പ്രിസ്ക്രിപ്ഷൻ വായിച്ച് വിശദീകരിക്കും — രോഗം, മരുന്നുകൾ, എപ്പോൾ കഴിക്കണം, അളവ്, ഡോക്ടറുടെ ഉപദേശം.",
      uploadLabel: "ഡോക്ടറുടെ പ്രിസ്ക്രിപ്ഷൻ/സ്ലിപ്പിന്റെ ഫോട്ടോ, PDF അല്ലെങ്കിൽ DOCX നൽകുക",
      uploadHint: "ഡോക്ടർ എഴുതിയ സ്ലിപ്പിന്റെ വ്യക്തമായ ഫോട്ടോ, PDF അല്ലെങ്കിൽ വേഡ് ഫയൽ അപ്‌ലോഡ് ചെയ്യുക. എഐ എന്ത് രോഗം, ഏത് മരുന്ന്, എപ്പോൾ എങ്ങനെ കഴിക്കണം എന്ന് പറയും.",
    },
    xray: {
      label: "എക്സ്-റേ", badge: "സ്കാൻ ഇമേജ്",
      description: "എക്സ്-റേ ഇമേജ് കണ്ട് എന്താണ് സാധാരണയായും എന്താണ് അസാധാരണമായും കാണുന്നത് എന്ന് പറയും — മാർഗ്ഗനിർദ്ദേശത്തിന് മാത്രം, റേഡിയോളജിസ്റ്റ് അല്ല.",
      uploadLabel: "നിങ്ങളുടെ എക്സ്-റേയുടെ ഫോട്ടോ നൽകുക",
      uploadHint: "നിങ്ങളുടെ എക്സ്-റേയുടെ വ്യക്തമായ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക (നെഞ്ച്, കാൽമുട്ട്, കൈ തുടങ്ങിയവ). എഐ കണ്ട് എന്ത് കാണുന്നു എന്നും എന്തിന് ശ്രദ്ധ വേണം എന്നും പറയും.",
    },
    document: {
      label: "PDF / DOC", badge: "മൾട്ടി-പേജ്",
      description: "വലിയ മൾട്ടി-പേജ് PDF/DOCX റിപ്പോർട്ട് പേജ് പ്രകാരം വായിച്ച് ഓരോ ടെസ്റ്റും പ്രത്യേകം വിശദീകരിക്കും — വാല്യൂ, റേഞ്ച്, സ്റ്റാറ്റസ്, എല്ലാം.",
      uploadLabel: "നിങ്ങളുടെ PDF അല്ലെങ്കിൽ DOCX റിപ്പോർട്ട് അപ്‌ലോഡ് ചെയ്യുക",
      uploadHint: "നിങ്ങളുടെ മെഡിക്കൽ റിപ്പോർട്ടിന്റെ PDF അല്ലെങ്കിൽ വേഡ് ഫയൽ അപ്‌ലോഡ് ചെയ്യുക (30-40 പേജ് വരെ ആകാം). എഐ ഓരോ പേജ് വായിച്ച് ഓരോ ടെസ്റ്റ് എടുത്ത് ഫലം ലളിതമായ ഭാഷയിൽ വിശദീകരിക്കും.",
    },
    text: {
      label: "ടൈപ്പ് ചെയ്ത ടെക്സ്റ്റ്", badge: "ടൈപ്പ് ചെയ്യുക",
      description: "ഫോട്ടോ ഇല്ലെങ്കിൽ, റിപ്പോർട്ടിന്റെ ടെക്സ്റ്റ് ഇവിടെ ടൈപ്പ് അല്ലെങ്കിൽ പേസ്റ്റ് ചെയ്യുക — എഐ വിശദീകരിക്കും.",
      uploadLabel: "", uploadHint: "",
    },
  } satisfies ModeLabels,
  upload: {
    processing: "ഫയൽ പ്രോസസ്സ് ചെയ്യുന്നു...",
    hintImage: "JPG / PNG · ഡ്രാഗ് ചെയ്ത് വിടുക അല്ലെങ്കിൽ ക്ലിക്ക് ചെയ്ത് തിരഞ്ഞെടുക്കുക",
    hintImagePdf: "JPG / PNG / PDF · ഡ്രാഗ് ചെയ്ത് വിടുക അല്ലെങ്കിൽ ക്ലിക്ക് ചെയ്ത് തിരഞ്ഞെടുക്കുക",
    hintAll: "JPG / PNG / PDF / DOCX · ഡ്രാഗ് ചെയ്ത് വിടുക അല്ലെങ്കിൽ ക്ലിക്ക് ചെയ്ത് തിരഞ്ഞെടുക്കുക",
    imageAttached: "ഇമേജ് അറ്റാച്ച് ചെയ്തു",
    fileReady: "ഫയൽ തയ്യാറാണ്. \u201cവിശകലനം ചെയ്യുക\u201d അമർത്തുക.",
    removeImage: "ഇമേജ് നീക്കം ചെയ്യുക",
    removeFile: "ഫയൽ നീക്കം ചെയ്യുക",
    errorType: "ഈ ഫയൽ തരം പിന്തുണയ്ക്കുന്നില്ല. JPG, PNG, PDF അല്ലെങ്കിൽ DOCX അപ്‌ലോഡ് ചെയ്യുക.",
    errorImageOnly: "ഈ ടാബിൽ ഇമേജുകൾ മാത്രം അപ്‌ലോഡ് ചെയ്യാം.",
    errorDocxNotAllowed: "ഈ ടാബിൽ DOCX അപ്‌ലോഡ് ചെയ്യാൻ കഴിയില്ല.",
    errorTooLarge: "ഫയൽ വളരെ വലുതാണ്. 60MB-ൽ താഴെ സൂക്ഷിക്കുക.",
  } satisfies UploadLabels,
};

// ---- Punjabi ----
const PUNJABI = {
  extra: {
    headerSubtitle: "ਆਪਣੀ ਰਿਪੋਰਟ ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸਮਝੋ",
    aiPowered: "ਏਆਈ-ਚਲਾਇਆ",
    privateLabel: "ਨਿੱਜੀ",
    hintText: "ਟੈਕਸਟ ਪਾਓ ਅਤੇ 'ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ' ਦਬਾਓ।",
    hintFile: "PDF/DOCX ਅੱਪਲੋਡ ਕਰੋ — ਵੱਡੀ ਰਿਪੋਰਟ ਵਿੱਚ 1-2 ਮਿੰਟ ਲੱਗ ਸਕਦੇ ਹਨ।",
    hintImage: "ਸਾਫ਼ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ — ਜਲਦੀ ਸਮਝ ਆਵੇਗੀ।",
    loadingDoc: "ਏਆਈ ਤੁਹਾਡੀ ਵੱਡੀ ਰਿਪੋਰਟ ਨੂੰ ਪੰਨਾ-ਦਰ-ਪੰਨਾ ਪੜ੍ਹ ਰਿਹਾ ਹੈ...",
    loadingImage: "ਏਆਈ ਤੁਹਾਡੀ ਰਿਪੋਰਟ ਪੜ੍ਹ ਰਿਹਾ ਹੈ...",
    loadingHintDoc: "ਵੱਡੀ PDF ਵਿੱਚੋਂ ਟੈਕਸਟ ਕੱਢ ਕੇ ਹਰ ਟੈਸਟ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। 1-2 ਮਿੰਟ ਲੱਗ ਸਕਦੇ ਹਨ। ਉਡੀਕ ਕਰੋ।",
    loadingHintImage: "ਇਮੇਜ ਵਿਸ਼ਲੇਸ਼ਣ ਵਿੱਚ 15-40 ਸਕਿੰਟ ਲੱਗ ਸਕਦੇ ਹਨ। ਉਡੀਕ ਕਰੋ।",
    textLabel: "ਆਪਣੀ ਰਿਪੋਰਟ ਦਾ ਟੈਕਸਟ ਇੱਥੇ ਟਾਈਪ ਕਰੋ ਜਾਂ ਪੇਸਟ ਕਰੋ",
    textPlaceholder: "ਉਦਾਹਰਨ:\nHemoglobin: 10.5 g/dL (Normal: 12-15)\nWBC: 6200 /cmm\nRBC: 4.1 million/cmm\nPlatelets: 1.5 lakh\nGlucose Fasting: 145 mg/dL",
    textCounter: "{n} ਅੱਖਰ · ਘੱਟੋ-ਘੱਟ 10 ਚਾਹੀਦੇ ਹਨ",
  } satisfies ExtraLabels,
  modes: {
    "test-report": {
      label: "ਟੈਸਟ ਰਿਪੋਰਟ", badge: "ਫੋਟੋ / PDF",
      description: "ਲੈਬ ਰਿਪੋਰਟ ਪੜ੍ਹ ਕੇ ਦੱਸੇਗਾ — ਕਿਹੜੀ ਵੈਲਿਊ ਸਧਾਰਨ, ਕਿਹੜੀ ਘੱਟ/ਵੱਧ, ਅਤੇ ਕੀ ਸ਼ੱਕੀ ਹੈ। ਫੋਟੋ ਜਾਂ PDF ਦੋਵੇਂ ਚੱਲਣਗੇ।",
      uploadLabel: "ਆਪਣੀ ਮੈਡੀਕਲ ਟੈਸਟ ਰਿਪੋਰਟ ਦੀ ਫੋਟੋ ਜਾਂ PDF ਪਾਓ",
      uploadHint: "ਆਪਣੀ ਲੈਬ ਟੈਸਟ ਰਿਪੋਰਟ (blood test, urine, sugar, thyroid ਆਦਿ) ਦੀ ਸਾਫ਼ ਫੋਟੋ ਜਾਂ PDF ਅੱਪਲੋਡ ਕਰੋ। ਏਆਈ ਪੜ੍ਹ ਕੇ ਦੱਸੇਗਾ ਕੀ ਸਧਾਰਨ ਹੈ ਅਤੇ ਕੀ ਧਿਆਨ ਚਾਹੀਦਾ ਹੈ।",
    },
    "doctor-slip": {
      label: "ਡਾ. ਪ੍ਰੈਸਕ੍ਰਿਪਸ਼ਨ", badge: "ਫੋਟੋ / PDF / DOC",
      description: "ਪ੍ਰੈਸਕ੍ਰਿਪਸ਼ਨ ਪੜ੍ਹ ਕੇ ਸਮਝਾਏਗਾ — ਬੀਮਾਰੀ, ਦਵਾਈਆਂ, ਕਦੋਂ ਲੈਣੀਆਂ, ਕਿੰਨੀ ਮਾਤਰਾ, ਅਤੇ ਡਾਕਟਰ ਦੀ ਸਲਾਹ।",
      uploadLabel: "ਡਾਕਟਰ ਦੀ ਪ੍ਰੈਸਕ੍ਰਿਪਸ਼ਨ/ਸਲਿੱਪ ਦੀ ਫੋਟੋ, PDF ਜਾਂ DOCX ਪਾਓ",
      uploadHint: "ਡਾਕਟਰ ਵੱਲੋਂ ਲਿਖੀ ਸਲਿੱਪ ਦੀ ਸਾਫ਼ ਫੋਟੋ, PDF ਜਾਂ ਵਰਡ ਫਾਇਲ ਅੱਪਲੋਡ ਕਰੋ। ਏਆਈ ਦੱਸੇਗਾ ਕੀ ਬੀਮਾਰੀ ਹੈ, ਕਿਹੜੀ ਦਵਾਈ ਹੈ, ਕਦੋਂ ਅਤੇ ਕਿਵੇਂ ਲੈਣੀ ਹੈ।",
    },
    xray: {
      label: "ਐਕਸ-ਰੇ", badge: "ਸਕੈਨ ਇਮੇਜ",
      description: "ਐਕਸ-ਰੇ ਇਮੇਜ ਵੇਖ ਕੇ ਦੱਸੇਗਾ ਕੀ ਸਧਾਰਨ ਦਿਸਦਾ ਹੈ ਅਤੇ ਕੀ ਅਸਧਾਰਨ — ਸਿਰਫ਼ ਮਦਦ ਲਈ, ਰੇਡੀਓਲੋਜਿਸਟ ਨਹੀਂ।",
      uploadLabel: "ਆਪਣੀ ਐਕਸ-ਰੇ ਦੀ ਫੋਟੋ ਪਾਓ",
      uploadHint: "ਆਪਣੀ ਐਕਸ-ਰੇ ਦੀ ਸਾਫ਼ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ (ਛਾਤੀ, ਗੋਡਾ, ਹੱਥ ਆਦਿ)। ਏਆਈ ਵੇਖ ਕੇ ਦੱਸੇਗਾ ਕੀ ਦਿਸਦਾ ਹੈ ਅਤੇ ਕੀ ਧਿਆਨ ਚਾਹੀਦਾ ਹੈ।",
    },
    document: {
      label: "PDF / DOC", badge: "ਮਲਟੀ-ਪੇਜ",
      description: "ਵੱਡੀ ਮਲਟੀ-ਪੇਜ PDF/DOCX ਰਿਪੋਰਟ ਨੂੰ ਪੰਨਾ-ਦਰ-ਪੰਨਾ ਪੜ੍ਹ ਕੇ ਹਰ ਟੈਸਟ ਵੱਖਰੇ ਤੌਰ 'ਤੇ ਸਮਝਾਏਗਾ — ਵੈਲਿਊ, ਰੇਂਜ, ਸਟੇਟਸ, ਸਭ।",
      uploadLabel: "ਆਪਣੀ PDF ਜਾਂ DOCX ਰਿਪੋਰਟ ਅੱਪਲੋਡ ਕਰੋ",
      uploadHint: "ਆਪਣੀ ਮੈਡੀਕਲ ਰਿਪੋਰਟ ਦੀ PDF ਜਾਂ ਵਰਡ ਫਾਇਲ ਅੱਪਲੋਡ ਕਰੋ (30-40 ਪੰਨਿਆਂ ਦੀ ਵੀ ਹੋ ਸਕਦੀ ਹੈ)। ਏਆਈ ਹਰ ਪੰਨਾ ਪੜ੍ਹ ਕੇ ਹਰ ਟੈਸਟ ਕੱਢੇਗਾ ਅਤੇ ਨਤੀਜਾ ਸੌਖੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸਮਝਾਏਗਾ।",
    },
    text: {
      label: "ਲਿਖਿਆ ਹੋਇਆ", badge: "ਟਾਈਪ ਕਰੋ",
      description: "ਜੇ ਫੋਟੋ ਨਹੀਂ ਹੈ, ਤਾਂ ਰਿਪੋਰਟ ਦਾ ਟੈਕਸਟ ਇੱਥੇ ਟਾਈਪ ਜਾਂ ਪੇਸਟ ਕਰੋ — ਏਆਈ ਸਮਝਾ ਦੇਵੇਗਾ।",
      uploadLabel: "", uploadHint: "",
    },
  } satisfies ModeLabels,
  upload: {
    processing: "ਫਾਇਲ ਪ੍ਰੋਸੈਸ ਹੋ ਰਹੀ ਹੈ...",
    hintImage: "JPG / PNG · ਡਰੈਗ ਅਤੇ ਡਰੌਪ ਜਾਂ ਕਲਿੱਕ ਕਰਕੇ ਚੁਣੋ",
    hintImagePdf: "JPG / PNG / PDF · ਡਰੈਗ ਅਤੇ ਡਰੌਪ ਜਾਂ ਕਲਿੱਕ ਕਰਕੇ ਚੁਣੋ",
    hintAll: "JPG / PNG / PDF / DOCX · ਡਰੈਗ ਅਤੇ ਡਰੌਪ ਜਾਂ ਕਲਿੱਕ ਕਰਕੇ ਚੁਣੋ",
    imageAttached: "ਇਮੇਜ ਜੁੜੀ ਹੈ",
    fileReady: "ਫਾਇਲ ਤਿਆਰ ਹੈ। \u201cਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ\u201d ਦਬਾਓ।",
    removeImage: "ਇਮੇਜ ਹਟਾਓ",
    removeFile: "ਫਾਇਲ ਹਟਾਓ",
    errorType: "ਇਹ ਫਾਇਲ ਕਿਸਮ ਸਮਰਥਿਤ ਨਹੀਂ ਹੈ। JPG, PNG, PDF ਜਾਂ DOCX ਅੱਪਲੋਡ ਕਰੋ।",
    errorImageOnly: "ਇਸ ਟੈਬ ਵਿੱਚ ਸਿਰਫ਼ ਇਮੇਜ ਅੱਪਲੋਡ ਕੀਤੀ ਜਾ ਸਕਦੀ ਹੈ।",
    errorDocxNotAllowed: "ਇਸ ਟੈਬ ਵਿੱਚ DOCX ਅੱਪਲੋਡ ਨਹੀਂ ਕੀਤੀ ਜਾ ਸਕਦੀ।",
    errorTooLarge: "ਫਾਇਲ ਬਹੁਤ ਵੱਡੀ ਹੈ। 60MB ਤੋਂ ਘੱਟ ਰੱਖੋ।",
  } satisfies UploadLabels,
};

// ---- Urdu ----
const URDU = {
  extra: {
    headerSubtitle: "اپنی رپورٹ اپنی زبان میں سمجھیں",
    aiPowered: "اے آئی-چلایا ہوا",
    privateLabel: "ذاتی",
    hintText: "متن داخل کریں اور 'تجزیہ کریں' دبائیں۔",
    hintFile: "PDF/DOCX اپ لوڈ کریں — بڑی رپورٹ میں 1-2 منٹ لگ سکتے ہیں۔",
    hintImage: "صاف تصویر اپ لوڈ کریں — جلدی سمجھ آئے گی۔",
    loadingDoc: "اے آئی آپ کی بڑی رپورٹ صفحہ بہ صفحہ پڑھ رہا ہے...",
    loadingImage: "اے آئی آپ کی رپورٹ پڑھ رہا ہے...",
    loadingHintDoc: "بڑی PDF سے متن نکال کر ہر ٹیسٹ کا تجزیہ کیا جاتا ہے۔ 1-2 منٹ لگ سکتے ہیں۔ انتظار کریں۔",
    loadingHintImage: "امیج تجزیہ میں 15-40 سیکنڈ لگ سکتے ہیں۔ انتظار کریں۔",
    textLabel: "اپنی رپورٹ کا متن یہاں ٹائپ کریں یا پیسٹ کریں",
    textPlaceholder: "مثال:\nHemoglobin: 10.5 g/dL (Normal: 12-15)\nWBC: 6200 /cmm\nRBC: 4.1 million/cmm\nPlatelets: 1.5 lakh\nGlucose Fasting: 145 mg/dL",
    textCounter: "{n} حروف · کم از کم 10 درکار",
  } satisfies ExtraLabels,
  modes: {
    "test-report": {
      label: "ٹیسٹ رپورٹ", badge: "تصویر / PDF",
      description: "لیب رپورٹ پڑھ کر بتائے گا — کون سی ویلیو نارمل، کون سی کم/زیادہ، اور کیا مشکوک ہے۔ تصویر یا PDF دونوں چلیں گے۔",
      uploadLabel: "اپنی میڈیکل ٹیسٹ رپورٹ کی تصویر یا PDF ڈالیں",
      uploadHint: "اپنی لیب ٹیسٹ رپورٹ (blood test, urine, sugar, thyroid وغیرہ) کی صاف تصویر یا PDF اپ لوڈ کریں۔ اے آئی پڑھ کر بتائے گا کیا نارمل ہے اور کیا توجہ چاہیے۔",
    },
    "doctor-slip": {
      label: "ڈاکٹر کی پراسکرپشن", badge: "تصویر / PDF / DOC",
      description: "پراسکرپشن پڑھ کر سمجھائے گا — بیماری، ادویات، کب لینی ہیں، کتنی مقدار، اور ڈاکٹر کا مشورہ۔",
      uploadLabel: "ڈاکٹر کی پراسکرپشن/سلپ کی تصویر، PDF یا DOCX ڈالیں",
      uploadHint: "ڈاکٹر کی لکھی ہوئی سلپ کی صاف تصویر، PDF یا ورڈ فائل اپ لوڈ کریں۔ اے آئی بتائے گا کیا بیماری ہے، کون سی دوا ہے، کب اور کیسے لینی ہے۔",
    },
    xray: {
      label: "ایکس-رے", badge: "اسکین امیج",
      description: "ایکس-رے امیج دیکھ کر بتائے گا کیا نارمل نظر آتا ہے اور کیا غیر نارمل — صرف رہنمائی کے لیے، ریڈیولوجسٹ نہیں۔",
      uploadLabel: "اپنی ایکس-رے کی تصویر ڈالیں",
      uploadHint: "اپنی ایکس-رے کی صاف تصویر اپ لوڈ کریں (چھاتی، گھٹنا، ہاتھ وغیرہ)۔ اے آئی دیکھ کر بتائے گا کیا نظر آتا ہے اور کیا توجہ چاہیے۔",
    },
    document: {
      label: "PDF / DOC", badge: "ملٹی-پیج",
      description: "بڑی ملٹی-پیج PDF/DOCX رپورٹ کو صفحہ بہ صفحہ پڑھ کر ہر ٹیسٹ الگ الگ سمجھائے گا — ویلیو، رینج، اسٹیٹس، سب۔",
      uploadLabel: "اپنی PDF یا DOCX رپورٹ اپ لوڈ کریں",
      uploadHint: "اپنی میڈیکل رپورٹ کی PDF یا ورڈ فائل اپ لوڈ کریں (30-40 صفحات کی بھی ہو سکتی ہے)۔ اے آئی ہر صفحہ پڑھ کر ہر ٹیسٹ نکالے گا اور نتیجہ آسان زبان میں سمجھائے گا۔",
    },
    text: {
      label: "لکھا ہوا", badge: "ٹائپ کریں",
      description: "اگر تصویر نہیں ہے، تو رپورٹ کا متن یہاں ٹائپ یا پیسٹ کر دیں — اے آئی سمجھا دے گا۔",
      uploadLabel: "", uploadHint: "",
    },
  } satisfies ModeLabels,
  upload: {
    processing: "فائل پروسیس ہو رہی ہے...",
    hintImage: "JPG / PNG · ڈریگ اور ڈراپ یا کلک کر کے منتخب کریں",
    hintImagePdf: "JPG / PNG / PDF · ڈریگ اور ڈراپ یا کلک کر کے منتخب کریں",
    hintAll: "JPG / PNG / PDF / DOCX · ڈریگ اور ڈراپ یا کلک کر کے منتخب کریں",
    imageAttached: "امیج منسلک ہے",
    fileReady: "فائل تیار ہے۔ \u201cتجزیہ کریں\u201d دبائیں۔",
    removeImage: "امیج ہٹائیں",
    removeFile: "فائل ہٹائیں",
    errorType: "یہ فائل ٹائپ معاون نہیں ہے۔ JPG, PNG, PDF یا DOCX اپ لوڈ کریں۔",
    errorImageOnly: "اس ٹیب میں صرف امیج اپ لوڈ کی جا سکتی ہے۔",
    errorDocxNotAllowed: "اس ٹیب میں DOCX اپ لوڈ نہیں ہو سکتی۔",
    errorTooLarge: "فائل بہت بڑی ہے۔ 60MB سے کم رکھیں۔",
  } satisfies UploadLabels,
};

// ---- Odia ----
const ODIA = {
  extra: {
    headerSubtitle: "ଆପଣଙ୍କ ରିପୋର୍ଟ ଆପଣଙ୍କ ଭାଷାରେ ବୁଝନ୍ତୁ",
    aiPowered: "ଏଆଇ-ଚାଳିତ",
    privateLabel: "ବ୍ୟକ୍ତିଗତ",
    hintText: "ଟେକ୍ସଟ୍ ଦିଅନ୍ତୁ ଏବଂ 'ବିଶ୍ଳେଷଣ କରନ୍ତୁ' ଦବାନ୍ତୁ।",
    hintFile: "PDF/DOCX ଅପଲୋଡ୍ କରନ୍ତୁ — ବଡ଼ ରିପୋର୍ଟରେ 1-2 ମିନିଟ୍ ଲାଗିପାରେ।",
    hintImage: "ସ୍ପଷ୍ଟ ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ — ଶୀଘ୍ର ବୁଝାଯିବ।",
    loadingDoc: "ଏଆଇ ଆପଣଙ୍କ ବଡ଼ ରିପୋର୍ଟ ପୃଷ୍ଠା ପ୍ରତି ପଢୁଛି...",
    loadingImage: "ଏଆଇ ଆପଣଙ୍କ ରିପୋର୍ଟ ପଢୁଛି...",
    loadingHintDoc: "ବଡ଼ PDF ରୁ ଟେକ୍ସଟ୍ ବାହାର କରି ପ୍ରତ୍ୟେକ ଟେଷ୍ଟ୍ ବିଶ୍ଳେଷଣ କରାଯାଉଛି। 1-2 ମିନିଟ୍ ଲାଗିପାରେ। ଅପେକ୍ଷା କରନ୍ତୁ।",
    loadingHintImage: "ଇମେଜ୍ ବିଶ୍ଳେଷଣରେ 15-40 ସେକେଣ୍ଡ୍ ଲାଗିପାରେ। ଅପେକ୍ଷା କରନ୍ତୁ।",
    textLabel: "ଆପଣଙ୍କ ରିପୋର୍ଟର ଟେକ୍ସଟ୍ ଏଠାରେ ଟାଇପ୍ କରନ୍ତୁ କିମ୍ବା ପେଷ୍ଟ୍ କରନ୍ତୁ",
    textPlaceholder: "ଉଦାହରଣ:\nHemoglobin: 10.5 g/dL (Normal: 12-15)\nWBC: 6200 /cmm\nRBC: 4.1 million/cmm\nPlatelets: 1.5 lakh\nGlucose Fasting: 145 mg/dL",
    textCounter: "{n} ଅକ୍ଷର · ନ୍ୟୂନତମ 10 ଆବଶ୍ୟକ",
  } satisfies ExtraLabels,
  modes: {
    "test-report": {
      label: "ଟେଷ୍ଟ୍ ରିପୋର୍ଟ", badge: "ଫଟୋ / PDF",
      description: "ଲ୍ୟାବ୍ ରିପୋର୍ଟ ପଢି କହିବ — କେଉଁ ଭାଲ୍ୟୁ ସାଧାରଣ, କେଉଁଟି କମ୍/ଅଧିକ, ଏବଂ କଣ ସନ୍ଦେହଜନକ। ଫଟୋ କିମ୍ବା PDF ଉଭୟ ଚାଲିବ।",
      uploadLabel: "ଆପଣଙ୍କ ମେଡିକାଲ୍ ଟେଷ୍ଟ୍ ରିପୋର୍ଟର ଫଟୋ କିମ୍ବା PDF ଦିଅନ୍ତୁ",
      uploadHint: "ଆପଣଙ୍କ ଲ୍ୟାବ୍ ଟେଷ୍ଟ୍ ରିପୋର୍ଟ (blood test, urine, sugar, thyroid ଇତ୍ୟାଦି) ର ସ୍ପଷ୍ଟ ଫଟୋ କିମ୍ବା PDF ଅପଲୋଡ୍ କରନ୍ତୁ। ଏଆଇ ପଢି କହିବ କଣ ସାଧାରଣ ଏବଂ କଣ ଧ୍ୟାନ ଦରକାର।",
    },
    "doctor-slip": {
      label: "ଡକ୍ଟର୍ ପ୍ରେସକ୍ରିପସନ୍", badge: "ଫଟୋ / PDF / DOC",
      description: "ପ୍ରେସକ୍ରିପସନ୍ ପଢି ବୁଝାଇବ — ରୋଗ, ଔଷଧ, କେବେ ନେବେ, କେତେ ମାତ୍ରା, ଏବଂ ଡକ୍ଟର୍ ଙ୍କ ପରାମର୍ଶ।",
      uploadLabel: "ଡକ୍ଟର୍ ଙ୍କ ପ୍ରେସକ୍ରିପସନ୍/ସ୍ଲିପ୍ ର ଫଟୋ, PDF କିମ୍ବା DOCX ଦିଅନ୍ତୁ",
      uploadHint: "ଡକ୍ଟର୍ ଲେଖିଥିବା ସ୍ଲିପ୍ ର ସ୍ପଷ୍ଟ ଫଟୋ, PDF କିମ୍ବା ୱାର୍ଡ଼ ଫାଇଲ୍ ଅପଲୋଡ୍ କରନ୍ତୁ। ଏଆଇ କହିବ କଣ ରୋଗ, କେଉଁ ଔଷଧ, କେବେ ଏବଂ କିପରି ନେବେ।",
    },
    xray: {
      label: "ଏକ୍ସ-ରେ", badge: "ସ୍କାନ୍ ଇମେଜ୍",
      description: "ଏକ୍ସ-ରେ ଇମେଜ୍ ଦେଖି କହିବ କଣ ସାଧାରଣ ଦେଖାଯାଉଛି ଏବଂ କଣ ଅସାଧାରଣ — କେବଳ ମାର୍ଗଦର୍ଶନ ପାଇଁ, ରେଡିଓଲୋଜିଷ୍ଟ୍ ନୁହେଁ।",
      uploadLabel: "ଆପଣଙ୍କ ଏକ୍ସ-ରେ ର ଫଟୋ ଦିଅନ୍ତୁ",
      uploadHint: "ଆପଣଙ୍କ ଏକ୍ସ-ରେ ର ସ୍ପଷ୍ଟ ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ (ଛାତି, ଆଣ୍ଠୁ, ହାତ ଇତ୍ୟାଦି)। ଏଆଇ ଦେଖି କହିବ କଣ ଦେଖାଯାଉଛି ଏବଂ କଣ ଧ୍ୟାନ ଦରକାର।",
    },
    document: {
      label: "PDF / DOC", badge: "ମଲ୍ଟି-ପେଜ୍",
      description: "ବଡ଼ ମଲ୍ଟି-ପେଜ୍ PDF/DOCX ରିପୋର୍ଟ ପୃଷ୍ଠା ପ୍ରତି ପଢି ପ୍ରତ୍ୟେକ ଟେଷ୍ଟ୍ ଅଲଗା ଅଲଗା ବୁଝାଇବ — ଭାଲ୍ୟୁ, ରେଞ୍ଜ୍, ସ୍ଟାଟସ୍, ସବୁ।",
      uploadLabel: "ଆପଣଙ୍କ PDF କିମ୍ବା DOCX ରିପୋର୍ଟ ଅପଲୋଡ୍ କରନ୍ତୁ",
      uploadHint: "ଆପଣଙ୍କ ମେଡିକାଲ୍ ରିପୋର୍ଟର PDF କିମ୍ବା ୱାର୍ଡ଼ ଫାଇଲ୍ ଅପଲୋଡ୍ କରନ୍ତୁ (30-40 ପୃଷ୍ଠା ର ମଧ୍ୟ ହୋଇପାରେ)। ଏଆଇ ପ୍ରତ୍ୟେକ ପୃଷ୍ଠା ପଢି ପ୍ରତ୍ୟେକ ଟେଷ୍ଟ୍ ବାହାର କରିବ ଏବଂ ଫଳାଫଳ ସହଜ ଭାଷାରେ ବୁଝାଇବ।",
    },
    text: {
      label: "ଲେଖା ହୋଇଥିବା", badge: "ଟାଇପ୍ କରନ୍ତୁ",
      description: "ଯଦି ଫଟୋ ନାହିଁ, ତେବେ ରିପୋର୍ଟର ଟେକ୍ସଟ୍ ଏଠାରେ ଟାଇପ୍ କିମ୍ବା ପେଷ୍ଟ୍ କରନ୍ତୁ — ଏଆଇ ବୁଝାଇ ଦେବ।",
      uploadLabel: "", uploadHint: "",
    },
  } satisfies ModeLabels,
  upload: {
    processing: "ଫାଇଲ୍ ପ୍ରୋସେସ୍ ହେଉଛି...",
    hintImage: "JPG / PNG · ଡ୍ରାଗ୍ ଏବଂ ଡ୍ରପ୍ କିମ୍ବା କ୍ଲିକ୍ କରି ବାଛନ୍ତୁ",
    hintImagePdf: "JPG / PNG / PDF · ଡ୍ରାଗ୍ ଏବଂ ଡ୍ରପ୍ କିମ୍ବା କ୍ଲିକ୍ କରି ବାଛନ୍ତୁ",
    hintAll: "JPG / PNG / PDF / DOCX · ଡ୍ରାଗ୍ ଏବଂ ଡ୍ରପ୍ କିମ୍ବା କ୍ଲିକ୍ କରି ବାଛନ୍ତୁ",
    imageAttached: "ଇମେଜ୍ ସଂଲଗ୍ନ ହୋଇଛି",
    fileReady: "ଫାଇଲ୍ ପ୍ରସ୍ତୁତ। \u201cବିଶ୍ଳେଷଣ କରନ୍ତୁ\u201d ଦବାନ୍ତୁ।",
    removeImage: "ଇମେଜ୍ ହଟାନ୍ତୁ",
    removeFile: "ଫାଇଲ୍ ହଟାନ୍ତୁ",
    errorType: "ଏହି ଫାଇଲ୍ ଟାଇପ୍ ସମର୍ଥିତ ନୁହେଁ। JPG, PNG, PDF କିମ୍ବା DOCX ଅପଲୋଡ୍ କରନ୍ତୁ।",
    errorImageOnly: "ଏହି ଟ୍ୟାବରେ କେବଳ ଇମେଜ୍ ଅପଲୋଡ୍ ହୋଇପାରିବ।",
    errorDocxNotAllowed: "ଏହି ଟ୍ୟାବରେ DOCX ଅପଲୋଡ୍ ହୋଇପାରିବ ନାହିଁ।",
    errorTooLarge: "ଫାଇଲ୍ ବହୁତ ବଡ଼। 60MB ରୁ କମ୍ ରଖନ୍ତୁ।",
  } satisfies UploadLabels,
};

// ---- Assamese ----
const ASSAMESE = {
  extra: {
    headerSubtitle: "আপোনাৰ ৰিপৰ্ট আপোনাৰ ভাষাত বুজি লওক",
    aiPowered: "এআই-চালিত",
    privateLabel: "ব্যক্তিগত",
    hintText: "টেক্সট দি 'বিশ্লেষণ কৰক' টিপক।",
    hintFile: "PDF/DOCX আপলোড কৰক — ডাঙৰ ৰিপৰ্টত 1-2 মিনিট লাগিব পাৰে।",
    hintImage: "স্পষ্ট ফটো আপলোড কৰক — সোনকালে বুজিব।",
    loadingDoc: "এআই আপোনাৰ ডাঙৰ ৰিপৰ্ট পৃষ্ঠা অনুসৰি পঢ়িছে...",
    loadingImage: "এআই আপোনাৰ ৰিপৰ্ট পঢ়িছে...",
    loadingHintDoc: "ডাঙৰ PDF ৰ পৰা টেক্সট উলিয়াই প্ৰতিটো টেষ্ট বিশ্লেষণ কৰা হৈছে। 1-2 মিনিট লাগিব পাৰে। অপেক্ষা কৰক।",
    loadingHintImage: "ইমেজ বিশ্লেষণত 15-40 ছেকেণ্ড লাগিব পাৰে। অপেক্ষা কৰক।",
    textLabel: "আপোনাৰ ৰিপৰ্টৰ টেক্সট ইয়াত টাইপ কৰক বা পেষ্ট কৰক",
    textPlaceholder: "উদাহৰণ:\nHemoglobin: 10.5 g/dL (Normal: 12-15)\nWBC: 6200 /cmm\nRBC: 4.1 million/cmm\nPlatelets: 1.5 lakh\nGlucose Fasting: 145 mg/dL",
    textCounter: "{n} আখৰ · নূন্যতম 10 লাগে",
  } satisfies ExtraLabels,
  modes: {
    "test-report": {
      label: "টেষ্ট ৰিপৰ্ট", badge: "ফটো / PDF",
      description: "লেব ৰিপৰ্ট পঢ়ি কয় — কোনটো ভেল্যু সাধাৰণ, কোনটো কম/বেছি, আৰু কি সন্দেহযুক্ত। ফটো বা PDF দুয়ো চলিব।",
      uploadLabel: "আপোনাৰ মেডিকেল টেষ্ট ৰিপৰ্টৰ ফটো বা PDF দিয়ক",
      uploadHint: "আপোনাৰ লেব টেষ্ট ৰিপৰ্ট (blood test, urine, sugar, thyroid আদি) ৰ স্পষ্ট ফটো বা PDF আপলোড কৰক। এআই পঢ়ি কয় কি সাধাৰণ আৰু কি মন দিব লাগে।",
    },
    "doctor-slip": {
      label: "ডা. প্ৰেস্ক্ৰিপচন", badge: "ফটো / PDF / DOC",
      description: "প্ৰেস্ক্ৰিপচন পঢ়ি বুজাই কয় — ৰোগ, ঔষধ, কেতিয়া ল'ব, কিমান পৰিমাণ, আৰু ডাক্টৰৰ পৰামৰ্শ।",
      uploadLabel: "ডাক্টৰৰ প্ৰেস্ক্ৰিপচন/স্লিপৰ ফটো, PDF বা DOCX দিয়ক",
      uploadHint: "ডাক্টৰে লিখা স্লিপৰ স্পষ্ট ফটো, PDF বা ৱাৰ্ড ফাইল আপলোড কৰক। এআই কয় কি ৰোগ, কোনটো ঔষধ, কেতিয়া আৰু কেনেকৈ ল'ব।",
    },
    xray: {
      label: "এক্স-ৰে", badge: "স্কেন ইমেজ",
      description: "এক্স-ৰে ইমেজ চাই কয় কি সাধাৰণ দেখা যায় আৰু কি অসাধাৰণ — কেৱল সহায়ৰ বাবে, ৰেডিঅ'লজিষ্ট নহয়।",
      uploadLabel: "আপোনাৰ এক্স-ৰেৰ ফটো দিয়ক",
      uploadHint: "আপোনাৰ এক্স-ৰেৰ স্পষ্ট ফটো আপলোড কৰক (বুকু, আৰু, হাত আদি)। এআই চাই কয় কি দেখা যায় আৰু কি মন দিব লাগে।",
    },
    document: {
      label: "PDF / DOC", badge: "মাল্টি-পেজ",
      description: "ডাঙৰ মাল্টি-পেজ PDF/DOCX ৰিপৰ্ট পৃষ্ঠা অনুসৰি পঢ়ি প্ৰতিটো টেষ্ট বেলেগে বেলেগে বুজায় — ভেল্যু, ৰেঞ্জ, ষ্টেটাছ, সকলো।",
      uploadLabel: "আপোনাৰ PDF বা DOCX ৰিপৰ্ট আপলোড কৰক",
      uploadHint: "আপোনাৰ মেডিকেল ৰিপৰ্টৰ PDF বা ৱাৰ্ড ফাইল আপলোড কৰক (30-40 পৃষ্ঠাৰো হ'ব পাৰে)। এআই প্ৰতিটো পৃষ্ঠা পঢ়ি প্ৰতিটো টেষ্ট উলিয়াই ফলাফল সহজ ভাষাত বুজাব।",
    },
    text: {
      label: "লিখা হোৱা", badge: "টাইপ কৰক",
      description: "যদি ফটো নাই, তেন্তে ৰিপৰ্টৰ টেক্সট ইয়াত টাইপ বা পেষ্ট কৰক — এআই বুজাই দিব।",
      uploadLabel: "", uploadHint: "",
    },
  } satisfies ModeLabels,
  upload: {
    processing: "ফাইল প্ৰচেছ হৈছে...",
    hintImage: "JPG / PNG · ড্ৰেগ আৰু ড্ৰপ বা ক্লিক কৰি বাছক",
    hintImagePdf: "JPG / PNG / PDF · ড্ৰেগ আৰু ড্ৰপ বা ক্লিক কৰি বাছক",
    hintAll: "JPG / PNG / PDF / DOCX · ড্ৰেগ আৰু ড্ৰপ বা ক্লিক কৰি বাছক",
    imageAttached: "ইমেজ সংলগ্ন হৈছে",
    fileReady: "ফাইল প্ৰস্তুত। \u201cবিশ্লেষণ কৰক\u201d টিপক।",
    removeImage: "ইমেজ আতঁৰাওক",
    removeFile: "ফাইল আতঁৰাওক",
    errorType: "এই ফাইল টাইপ সমৰ্থিত নহয়। JPG, PNG, PDF বা DOCX আপলোড কৰক।",
    errorImageOnly: "এই টেবত কেৱল ইমেজ আপলোড কৰিব পাৰি।",
    errorDocxNotAllowed: "এই টেবত DOCX আপলোড কৰিব নোৱাৰি।",
    errorTooLarge: "ফাইল বৰ ডাঙৰ। 60MB তকৈ কম ৰাখক।",
  } satisfies UploadLabels,
};

const ALL: Record<string, typeof HINGLISH> = {
  hinglish: HINGLISH,
  english: ENGLISH,
  hindi: HINDI,
  bengali: BENGALI,
  tamil: TAMIL,
  telugu: TELUGU,
  marathi: MARATHI,
  gujarati: GUJARATI,
  kannada: KANNADA,
  malayalam: MALAYALAM,
  punjabi: PUNJABI,
  urdu: URDU,
  odia: ODIA,
  assamese: ASSAMESE,
};

export function getExtraLabels(lang: string = "hinglish"): ExtraLabels {
  return (ALL[lang] ?? HINGLISH).extra;
}

export function getModeLabels(lang: string = "hinglish"): ModeLabels {
  return (ALL[lang] ?? HINGLISH).modes;
}

export function getUploadLabels(lang: string = "hinglish"): UploadLabels {
  return (ALL[lang] ?? HINGLISH).upload;
}

// ---- ResultsView field labels ----
export interface ResultsLabels {
  value: string;
  normalRange: string;
  dosage: string;
  timing: string;
  duration: string;
  howToTake: string;
  purpose: string;
  reportSummary: string;
}

const RESULTS_LABELS: Record<string, ResultsLabels> = {
  hinglish: { value: "Value:", normalRange: "Normal:", dosage: "Maatra:", timing: "Kab:", duration: "Kitne din:", howToTake: "Kaise:", purpose: "Kis liye:", reportSummary: "Report Summary" },
  english: { value: "Value:", normalRange: "Normal:", dosage: "Dosage:", timing: "When:", duration: "Duration:", howToTake: "How:", purpose: "For:", reportSummary: "Report Summary" },
  hindi: { value: "मान:", normalRange: "सामान्य:", dosage: "मात्रा:", timing: "कब:", duration: "कितने दिन:", howToTake: "कैसे:", purpose: "किस लिए:", reportSummary: "रिपोर्ट सारांश" },
  bengali: { value: "মান:", normalRange: "স্বাভাবিক:", dosage: "মাত্রা:", timing: "কখন:", duration: "কত দিন:", howToTake: "কীভাবে:", purpose: "কিসের জন্য:", reportSummary: "রিপোর্ট সারাংশ" },
  tamil: { value: "மதிப்பு:", normalRange: "இயல்பு:", dosage: "அளவு:", timing: "எப்போது:", duration: "எத்தனை நாட்கள்:", howToTake: "எப்படி:", purpose: "எதற்கு:", reportSummary: "அறிக்கை சுருக்கம்" },
  telugu: { value: "విలువ:", normalRange: "సాధారణం:", dosage: "మోతాదు:", timing: "ఎప్పుడు:", duration: "ఎన్ని రోజులు:", howToTake: "ఎలా:", purpose: "దేనికి:", reportSummary: "నివేదిక సారాంశం" },
  marathi: { value: "मूल्य:", normalRange: "सामान्य:", dosage: "मात्रा:", timing: "कधी:", duration: "किती दिवस:", howToTake: "कसे:", purpose: "कशासाठी:", reportSummary: "अहवाल सारांश" },
  gujarati: { value: "મૂલ્ય:", normalRange: "સામાન્ય:", dosage: "માત્રા:", timing: "ક્યારે:", duration: "કેટલા દિવસ:", howToTake: "કેવી રીતે:", purpose: "શા માટે:", reportSummary: "રિપોર્ટ સારાંશ" },
  kannada: { value: "ಮೌಲ್ಯ:", normalRange: "ಸಾಮಾನ್ಯ:", dosage: "ಪ್ರಮಾಣ:", timing: "ಯಾವಾಗ:", duration: "ಎಷ್ಟು ದಿನ:", howToTake: "ಹೇಗೆ:", purpose: "ಯಾಕಾಗಿ:", reportSummary: "ವರದಿ ಸಾರಾಂಶ" },
  malayalam: { value: "മൂല്യം:", normalRange: "സാധാരണം:", dosage: "അളവ്:", timing: "എപ്പോൾ:", duration: "എത്ര ദിവസം:", howToTake: "എങ്ങനെ:", purpose: "എന്തിന്:", reportSummary: "റിപ്പോർട്ട് സംഗ്രഹം" },
  punjabi: { value: "ਮੁੱਲ:", normalRange: "ਸਧਾਰਨ:", dosage: "ਮਾਤਰਾ:", timing: "ਕਦੋਂ:", duration: "ਕਿੰਨੇ ਦਿਨ:", howToTake: "ਕਿਵੇਂ:", purpose: "ਕਿਸ ਲਈ:", reportSummary: "ਰਿਪੋਰਟ ਸਾਰ" },
  urdu: { value: "قدر:", normalRange: "نارمل:", dosage: "خوراک:", timing: "کب:", duration: "کتنے دن:", howToTake: "کیسے:", purpose: "کس لیے:", reportSummary: "رپورٹ خلاصہ" },
  odia: { value: "ମୂଲ୍ୟ:", normalRange: "ସ୍ୱାଭାବିକ:", dosage: "ମାତ୍ରା:", timing: "କେବେ:", duration: "କେତେ ଦିନ:", howToTake: "କିପରି:", purpose: "କାହିଁକି:", reportSummary: "ରିପୋର୍ଟ ସାରାଂଶ" },
  assamese: { value: "মান:", normalRange: "স্বাভাৱিক:", dosage: "মাত্ৰা:", timing: "কেতিয়া:", duration: "কিমান দিন:", howToTake: "কেনেকৈ:", purpose: "কিবাৰ বাবে:", reportSummary: "প্ৰতিৱেদন সাৰাংশ" },
};

export function getResultsLabels(lang: string = "hinglish"): ResultsLabels {
  return RESULTS_LABELS[lang] ?? RESULTS_LABELS.hinglish;
}
