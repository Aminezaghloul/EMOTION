/**
 * All UI text for the three supported languages.
 * To add a new language, copy one block and translate every value.
 * Usage: t('key') from AppContext returns the translated string.
 */
export const translations = {

  // ─── FRENCH (default) ────────────────────────────────────────────────────
  fr: {
    // Navbar
    nav_analyze:  "Analyser",
    nav_how:      "Comment ça marche",
    nav_emotions: "Émotions",
    nav_cta:      "Essayer maintenant",

    // Hero section
    hero_badge:       "ResNet-18 · Spectrogrammes STFT · 4 émotions",
    hero_title_start: "Entendez l'",
    hero_title_em:    "émotion",
    hero_title_end:   "dans chaque voix.",
    hero_subtitle:    "Uploadez un fichier WAV et notre modèle de deep learning convertit votre audio en spectrogramme pour prédire l'émotion sous-jacente en quelques secondes.",
    hero_btn_start:   "Commencer l'analyse",
    hero_btn_how:     "Comment ça marche",

    // Emotion labels (shown on cards and result)
    emotion_happy:   "Joyeux",
    emotion_sad:     "Triste",
    emotion_angry:   "En colère",
    emotion_neutral: "Neutre",
    tagline_happy:   "Joyeux, dynamique, haute énergie",
    tagline_sad:     "Doux, bas, mélancolique",
    tagline_angry:   "Tendu, aigu, haute intensité",
    tagline_neutral: "Calme, équilibré, ton stable",

    // Analyze section
    analyze_chip:     "Analyser votre audio",
    analyze_title:    "Uploadez un WAV · on fait le reste",
    analyze_subtitle: "Déposez un fichier .wav ou enregistrez depuis votre microphone. Le modèle prédit l'émotion en quelques secondes.",

    // Dropzone
    drop_title:  "Déposez votre fichier",
    drop_ext:    ".wav",
    drop_hint:   "ici ou cliquez pour parcourir",
    drop_format: "WAV · 16kHz recommandé",
    drop_error:      "Seuls les fichiers .wav sont acceptés.",
    drop_size_error: "La taille du fichier doit être inférieure à 5 Mo.",
    drop_ready:      "prêt à analyser",

    // Buttons
    btn_clear:       "Effacer",
    btn_analyze:     "Analyser l'émotion",
    btn_try_another: "Réessayer",

    // Status messages (below dropzone)
    status_file_loaded: "Cliquez sur analyser pour envoyer votre fichier au modèle.",
    status_no_file:     "Chargez un fichier pour commencer l'analyse.",

    // Recorder panel
    rec_chip:      "Capture live",
    rec_title:     "Enregistrement micro",
    rec_subtitle:  "Enregistré en mono 16kHz et exporté en fichier .wav.",
    rec_start:     "Commencer l'enregistrement",
    rec_stop:      "Arrêter et analyser",
    rec_preparing: "Préparation...",
    rec_privacy:   "Vos enregistrements ne sont jamais stockés — ils vont uniquement à votre API locale.",
    rec_denied:    "Accès au microphone refusé. Veuillez autoriser l'accès et réessayer.",
    rec_error:     "Impossible de démarrer le microphone. Vérifiez les permissions.",
    rec_fail:      "Enregistrement échoué. Veuillez réessayer.",

    // Loader overlay
    loader_title:     "Écoute de votre voix",
    loader_subtitle:  "Construction du spectrogramme · ResNet-18 · évaluation des émotions",
    loader_uploading: "Envoi en cours",

    // Result card
    result_chip:       "Prédiction",
    result_confidence: "Confiance",
    result_disclaimer: "Le résultat est indicatif et peut varier selon la qualité de l'enregistrement.",

    // Error message
    error_title:   "Une erreur est survenue",
    error_default: "Prédiction impossible. Assurez-vous que l'API tourne sur le port 8000.",

    // How it works section
    how_chip:        "Pipeline",
    how_title_start: "De la forme d'onde à l'",
    how_title_em:    "émotion",
    how_title_end:   "en quatre étapes",
    how_subtitle:    "Le même pipeline qui tourne dans votre predict.py, à travers une interface moderne.",
    how_step1_title: "1 · Envoyer un WAV",
    how_step1_text:  "Déposez un fichier ou enregistrez depuis votre microphone en un clic.",
    how_step2_title: "2 · Spectrogramme STFT",
    how_step2_text:  "On calcule une transformée de Fourier à court terme et on la convertit en image.",
    how_step3_title: "3 · ResNet-18",
    how_step3_text:  "Un ResNet-18 ajusté lit le spectrogramme et évalue 4 émotions.",
    how_step4_title: "4 · Verdict",
    how_step4_text:  "Vous obtenez un label et un score de confiance avec une visualisation claire.",

    // Footer
    footer_tagline: "Alimenté par FastAPI · PyTorch · ResNet-18",
    footer_rights:  "Tous droits réservés",
    footer_built:   "Fait avec amour et audio",

    // Theme toggle tooltips
    theme_dark:  "Mode sombre",
    theme_light: "Mode clair",
  },

  // ─── ENGLISH ─────────────────────────────────────────────────────────────
  en: {
    nav_analyze:  "Analyze",
    nav_how:      "How it works",
    nav_emotions: "Emotions",
    nav_cta:      "Try it now",

    hero_badge:       "ResNet-18 · STFT Spectrograms · 4 emotions",
    hero_title_start: "Hear the ",
    hero_title_em:    "emotion",
    hero_title_end:   "inside every voice.",
    hero_subtitle:    "Upload a WAV file and our deep learning model converts your audio into a spectrogram to predict the underlying emotion in seconds.",
    hero_btn_start:   "Start analyzing",
    hero_btn_how:     "How it works",

    emotion_happy:   "Happy",
    emotion_sad:     "Sad",
    emotion_angry:   "Angry",
    emotion_neutral: "Neutral",
    tagline_happy:   "Joyful, upbeat, high energy",
    tagline_sad:     "Soft, low, melancholic tone",
    tagline_angry:   "Tense, sharp, high intensity",
    tagline_neutral: "Calm, balanced, steady tone",

    analyze_chip:     "Analyze your audio",
    analyze_title:    "Upload a WAV · we do the rest",
    analyze_subtitle: "Drop a .wav file or record from your microphone. The model predicts the emotion in seconds.",

    drop_title:  "Drop your",
    drop_ext:    ".wav",
    drop_hint:   "file here or click to browse",
    drop_format: "WAV · 16kHz recommended",
    drop_error:      "Only .wav files are accepted.",
    drop_size_error: "File size must be less than 5 MB.",
    drop_ready:      "ready to analyze",

    btn_clear:       "Clear",
    btn_analyze:     "Analyze emotion",
    btn_try_another: "Try another",

    status_file_loaded: "Click analyze to send your file to the model.",
    status_no_file:     "Load a file to start analyzing.",

    rec_chip:      "Live capture",
    rec_title:     "Record from your mic",
    rec_subtitle:  "Captured at 16kHz mono and exported as .wav.",
    rec_start:     "Start recording",
    rec_stop:      "Stop & analyze",
    rec_preparing: "Preparing...",
    rec_privacy:   "We never store recordings — they only travel to your local API.",
    rec_denied:    "Microphone access was denied. Please allow access and try again.",
    rec_error:     "Could not start microphone. Check your device permissions.",
    rec_fail:      "Recording failed. Please try again.",

    loader_title:     "Listening to your voice",
    loader_subtitle:  "Building spectrogram · running ResNet-18 · scoring emotions",
    loader_uploading: "Uploading",

    result_chip:       "Prediction",
    result_confidence: "Confidence",
    result_disclaimer: "Result is informational and may vary with recording quality.",

    error_title:   "Something went wrong",
    error_default: "Prediction failed. Make sure the API is running on port 8000.",

    how_chip:        "Pipeline",
    how_title_start: "From waveform to ",
    how_title_em:    "emotion",
    how_title_end:   "in four steps",
    how_subtitle:    "The same pipeline running in your predict.py, surfaced through a clean interface.",
    how_step1_title: "1 · Send a WAV",
    how_step1_text:  "Drop a file or capture a recording from your microphone in one click.",
    how_step2_title: "2 · STFT spectrogram",
    how_step2_text:  "We compute a short-time Fourier transform and turn it into an image.",
    how_step3_title: "3 · ResNet-18",
    how_step3_text:  "A fine-tuned ResNet-18 reads the spectrogram and scores 4 emotions.",
    how_step4_title: "4 · Verdict",
    how_step4_text:  "You get a label and a confidence score with a friendly visual readout.",

    footer_tagline: "Powered by FastAPI · PyTorch · ResNet-18",
    footer_rights:  "All rights reserved",
    footer_built:   "Built with love and audio",

    theme_dark:  "Dark mode",
    theme_light: "Light mode",
  },

  // ─── ARABIC ───────────────────────────────────────────────────────────────
  ar: {
    nav_analyze:  "تحليل",
    nav_how:      "كيف يعمل",
    nav_emotions: "المشاعر",
    nav_cta:      "جرّبه الآن",

    hero_badge:       "ريسنت-18 · طيف STFT · 4 مشاعر",
    hero_title_start: "اسمع ",
    hero_title_em:    "المشاعر",
    hero_title_end:   "في كل صوت.",
    hero_subtitle:    "ارفع ملف WAV ونموذج التعلم العميق يحول صوتك إلى طيف صوتي ويتوقع المشاعر في ثوانٍ.",
    hero_btn_start:   "ابدأ التحليل",
    hero_btn_how:     "كيف يعمل",

    emotion_happy:   "سعيد",
    emotion_sad:     "حزين",
    emotion_angry:   "غاضب",
    emotion_neutral: "محايد",
    tagline_happy:   "مبهج، نشيط، عالي الطاقة",
    tagline_sad:     "ناعم، هادئ، حزين",
    tagline_angry:   "متوتر، حاد، شديد الحدة",
    tagline_neutral: "هادئ، متوازن، ثابت",

    analyze_chip:     "تحليل صوتك",
    analyze_title:    "ارفع ملف WAV · نحن نتولى الباقي",
    analyze_subtitle: "اسحب ملف .wav أو سجّل من الميكروفون. النموذج يتوقع المشاعر في ثوانٍ.",

    drop_title:  "اسحب ملف",
    drop_ext:    ".wav",
    drop_hint:   "هنا أو انقر للتصفح",
    drop_format: "WAV · يُنصح بـ 16kHz",
    drop_error:      "يُقبل فقط ملفات .wav",
    drop_size_error: "يجب أن يكون حجم الملف أقل من 5 ميغابايت.",
    drop_ready:      "جاهز للتحليل",

    btn_clear:       "مسح",
    btn_analyze:     "تحليل المشاعر",
    btn_try_another: "حاول مجدداً",

    status_file_loaded: "انقر على تحليل لإرسال ملفك إلى النموذج.",
    status_no_file:     "حمّل ملفاً لبدء التحليل.",

    rec_chip:      "تسجيل مباشر",
    rec_title:     "سجّل من الميكروفون",
    rec_subtitle:  "يُسجَّل بـ 16kHz أحادي ويُصدَّر كملف .wav",
    rec_start:     "بدء التسجيل",
    rec_stop:      "إيقاف وتحليل",
    rec_preparing: "تحضير...",
    rec_privacy:   "لا نحفظ تسجيلاتك أبداً — تذهب فقط إلى واجهتك المحلية.",
    rec_denied:    "تم رفض الوصول إلى الميكروفون. يرجى السماح بالوصول.",
    rec_error:     "لا يمكن تشغيل الميكروفون. تحقق من الأذونات.",
    rec_fail:      "فشل التسجيل. يرجى المحاولة مجدداً.",

    loader_title:     "نستمع إلى صوتك",
    loader_subtitle:  "بناء الطيف الصوتي · تشغيل ريسنت-18 · تقييم المشاعر",
    loader_uploading: "جارٍ الرفع",

    result_chip:       "التنبؤ",
    result_confidence: "الثقة",
    result_disclaimer: "النتيجة إرشادية وقد تتفاوت حسب جودة التسجيل.",

    error_title:   "حدث خطأ",
    error_default: "فشل التنبؤ. تأكد من أن الـ API يعمل على المنفذ 8000.",

    how_chip:        "آلية العمل",
    how_title_start: "من الموجة الصوتية إلى ",
    how_title_em:    "المشاعر",
    how_title_end:   "في أربع خطوات",
    how_subtitle:    "نفس مسار المعالجة الموجود في predict.py، عبر واجهة حديثة.",
    how_step1_title: "١ · إرسال ملف WAV",
    how_step1_text:  "اسحب ملفاً أو سجّل من الميكروفون بنقرة واحدة.",
    how_step2_title: "٢ · طيف STFT",
    how_step2_text:  "نحسب تحويل فورييه القصير ونحوّله إلى صورة.",
    how_step3_title: "٣ · ريسنت-18",
    how_step3_text:  "يقرأ ريسنت-18 المعدَّل الطيف ويقيّم 4 مشاعر.",
    how_step4_title: "٤ · النتيجة",
    how_step4_text:  "تحصل على تصنيف ودرجة ثقة مع قراءة بصرية واضحة.",

    footer_tagline: "مدعوم بـ FastAPI · PyTorch · ResNet-18",
    footer_rights:  "جميع الحقوق محفوظة",
    footer_built:   "صُنع بحب وصوت",

    theme_dark:  "الوضع الداكن",
    theme_light: "الوضع الفاتح",
  },
};
