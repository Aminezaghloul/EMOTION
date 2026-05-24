import { motion } from 'framer-motion';
import { Sparkles, UploadCloud, ArrowDown } from 'lucide-react';
import { EMOTIONS } from '../utils/emotions';
import { useApp } from '../context/AppContext';

export default function Hero() {
  const { t } = useApp();

  return (
    <section id="top" className="relative overflow-hidden px-6 pt-12 pb-24 sm:pt-20 sm:pb-32">
      {/* Decorative aurora blobs + grid (defined in index.css) */}
      <div className="bg-aurora" />
      <div className="bg-grid" />

      <div className="relative mx-auto max-w-5xl text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="chip mx-auto mb-6"
        >
          <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" />
          <span>{t('hero_badge')}</span>
        </motion.div>

        {/* Main headline — "emotion" word is always rendered in gradient */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="text-balance text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl dark:text-white text-slate-900"
        >
          {t('hero_title_start')}
          <span className="gradient-text">{t('hero_title_em')}</span>
          {t('hero_title_end')}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-6 max-w-2xl text-pretty text-base dark:text-white/65 text-slate-600 sm:text-lg"
        >
          {t('hero_subtitle')}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <a href="#analyze" className="btn-primary">
            <UploadCloud className="h-4 w-4" />
            {t('hero_btn_start')}
          </a>
          <a href="#how" className="btn-secondary">
            <ArrowDown className="h-4 w-4" />
            {t('hero_btn_how')}
          </a>
        </motion.div>

        {/* Floating emotion cards */}
        <motion.div
          id="emotions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {Object.values(EMOTIONS).map((e, idx) => (
            <motion.div
              key={e.key}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass relative flex flex-col items-center justify-center gap-2 rounded-2xl px-4 py-5"
              style={{ animation: `float 6s ease-in-out ${idx * 0.4}s infinite` }}
            >
              {/* Glow behind the card */}
              <div
                className="absolute inset-0 -z-10 rounded-2xl opacity-40 blur-xl"
                style={{ background: e.accentSoft }}
              />
              <span className="text-3xl">{e.emoji}</span>
              <span className="text-sm font-semibold dark:text-white/90 text-slate-800">
                {t(e.labelKey)}
              </span>
              <span className="text-center text-[11px] dark:text-white/45 text-slate-500">
                {t(e.taglineKey)}
              </span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
