import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCw } from 'lucide-react';
import { getEmotionMeta } from '../utils/emotions';
import { useApp } from '../context/AppContext';

export default function ResultCard({ result, onReset }) {
  const { t } = useApp();
  if (!result) return null;

  // Get the visual metadata (colors, emoji, gradient) for this emotion
  const meta       = getEmotionMeta(result.class_name);
  const confidence = Math.round((result.confidence ?? 0) * 1000) / 10; // e.g. 0.853 → 85.3

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={meta.key}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        exit={   { opacity: 0, y: -16            }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`glass-strong relative overflow-hidden rounded-3xl p-8 sm:p-10 ${meta.ring}`}
      >
        {/* Decorative blobs tinted with the emotion colour */}
        <motion.div
          aria-hidden
          className="absolute -top-32 -right-32 h-80 w-80 rounded-full opacity-60 blur-3xl"
          style={{ background: meta.accentSoft }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full opacity-50 blur-3xl"
          style={{ background: meta.accentSoft }}
          animate={{ scale: [1.05, 1, 1.05] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* ── Main content ── */}
        <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">

          {/* Emoji + label */}
          <div className="flex items-center gap-6">
            <motion.div
              initial={{ scale: 0.6, rotate: -10 }}
              animate={{ scale: 1,   rotate: 0   }}
              transition={{ type: 'spring', stiffness: 220, damping: 14 }}
              className={`relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br ${meta.gradient} text-5xl shadow-xl`}
            >
              <motion.span
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {meta.emoji}
              </motion.span>
            </motion.div>

            <div>
              <p className="chip mb-3" style={{ borderColor: meta.accentSoft }}>
                <Sparkles className="h-3.5 w-3.5" style={{ color: meta.accent }} />
                {t('result_chip')}
              </p>
              {/* Emotion label in the emotion's accent colour */}
              <h3
                className="text-4xl font-extrabold tracking-tight sm:text-5xl"
                style={{ color: meta.accent }}
              >
                {t(meta.labelKey)}
              </h3>
              <p className="mt-1 text-sm dark:text-white/55 text-slate-500">
                {t(meta.taglineKey)}
              </p>
            </div>
          </div>

          {/* Confidence bar */}
          <div className="w-full max-w-xs">
            <div className="flex items-end justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] dark:text-white/40 text-slate-500">
                {t('result_confidence')}
              </span>
              <span className="text-2xl font-bold" style={{ color: meta.accent }}>
                {confidence.toFixed(1)}%
              </span>
            </div>
            {/* Animated bar — grows from 0 to confidence% */}
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full dark:bg-white/10 bg-slate-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                className={`h-full rounded-full bg-gradient-to-r ${meta.gradient}`}
              />
            </div>
            <p className="mt-3 text-xs dark:text-white/45 text-slate-500">
              {t('result_disclaimer')}
            </p>
          </div>
        </div>

        {/* ── Footer row ── */}
        <div className="relative mt-8 flex items-center justify-between gap-4 border-t dark:border-white/10 border-slate-200 pt-6">
          <p className="text-xs dark:text-white/40 text-slate-400">
            ResNet-18 · STFT spectrogram
          </p>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full border transition
                       dark:border-white/10 border-slate-200
                       dark:bg-white/5 bg-slate-100
                       px-4 py-2 text-sm font-semibold
                       dark:text-white/85 text-slate-700
                       dark:hover:border-white/20 hover:border-slate-300"
          >
            <RotateCw className="h-4 w-4" />
            {t('btn_try_another')}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
