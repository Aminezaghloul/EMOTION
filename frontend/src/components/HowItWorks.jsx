import { motion } from 'framer-motion';
import { FileAudio2, Waves, Brain, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function HowItWorks() {
  const { t } = useApp();

  // Steps data — icons come from Lucide, text comes from translations
  const STEPS = [
    { icon: FileAudio2, titleKey: 'how_step1_title', textKey: 'how_step1_text' },
    { icon: Waves,      titleKey: 'how_step2_title', textKey: 'how_step2_text' },
    { icon: Brain,      titleKey: 'how_step3_title', textKey: 'how_step3_text' },
    { icon: Sparkles,   titleKey: 'how_step4_title', textKey: 'how_step4_text' },
  ];

  return (
    <section id="how" className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28">

      {/* Section header */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="chip mx-auto mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          {t('how_chip')}
        </p>
        <h2 className="text-balance text-3xl font-bold tracking-tight dark:text-white text-slate-900 sm:text-4xl">
          {t('how_title_start')}
          <span className="gradient-text">{t('how_title_em')}</span>
          {t('how_title_end')}
        </h2>
        <p className="mt-3 dark:text-white/60 text-slate-600">
          {t('how_subtitle')}
        </p>
      </div>

      {/* Four step cards */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.titleKey}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="glass group relative overflow-hidden rounded-2xl p-6"
          >
            {/* Top highlight line */}
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            {/* Icon */}
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-400/30 ring-1 dark:ring-white/10 ring-slate-200">
              <step.icon className="h-5 w-5 dark:text-white text-slate-700" />
            </div>

            <h3 className="text-base font-semibold dark:text-white text-slate-800">
              {t(step.titleKey)}
            </h3>
            <p className="mt-2 text-sm dark:text-white/55 text-slate-500">
              {t(step.textKey)}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
