/**
 * Visual metadata for each emotion.
 * Labels and taglines are stored as translation keys (e.g. 'emotion_happy')
 * so they can be translated via the t() function from AppContext.
 */
export const EMOTIONS = {
  Happy: {
    key:        "Happy",
    emoji:      "😄",
    labelKey:   "emotion_happy",   // translated in components via t(labelKey)
    taglineKey: "tagline_happy",
    accent:     "#fbbf24",
    accentSoft: "rgba(251, 191, 36, 0.18)",
    gradient:   "from-amber-400 via-yellow-400 to-orange-500",
    ring:       "shadow-[0_0_60px_-10px_rgba(251,191,36,0.55)]",
  },
  Sad: {
    key:        "Sad",
    emoji:      "😢",
    labelKey:   "emotion_sad",
    taglineKey: "tagline_sad",
    accent:     "#60a5fa",
    accentSoft: "rgba(96, 165, 250, 0.18)",
    gradient:   "from-sky-400 via-blue-500 to-indigo-600",
    ring:       "shadow-[0_0_60px_-10px_rgba(96,165,250,0.55)]",
  },
  Angry: {
    key:        "Angry",
    emoji:      "😡",
    labelKey:   "emotion_angry",
    taglineKey: "tagline_angry",
    accent:     "#f87171",
    accentSoft: "rgba(248, 113, 113, 0.18)",
    gradient:   "from-rose-500 via-red-500 to-orange-600",
    ring:       "shadow-[0_0_60px_-10px_rgba(248,113,113,0.55)]",
  },
  Neutral: {
    key:        "Neutral",
    emoji:      "😐",
    labelKey:   "emotion_neutral",
    taglineKey: "tagline_neutral",
    accent:     "#a78bfa",
    accentSoft: "rgba(167, 139, 250, 0.18)",
    gradient:   "from-violet-400 via-purple-500 to-fuchsia-500",
    ring:       "shadow-[0_0_60px_-10px_rgba(167,139,250,0.55)]",
  },
};

// Returns the emotion metadata by class name (case-insensitive)
export function getEmotionMeta(name) {
  if (!name) return EMOTIONS.Neutral;
  const key = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  return EMOTIONS[key] ?? EMOTIONS.Neutral;
}

// Returns true only if the file has a .wav extension and a WAV MIME type
export function isWavFile(file) {
  if (!file) return false;
  const nameOk = file.name?.toLowerCase().endsWith('.wav');
  const typeOk =
    !file.type ||
    ['audio/wav', 'audio/x-wav', 'audio/wave', 'audio/vnd.wave'].includes(file.type);
  return Boolean(nameOk && typeOk);
}

// Converts a byte count to a human-readable string (e.g. 1024 → "1 KB")
export function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0, v = bytes;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}
