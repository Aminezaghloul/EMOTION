import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function Loader({ progress }) {
  const { t } = useApp();

  return (
    <div className="glass-strong relative flex flex-col items-center justify-center gap-5 overflow-hidden rounded-3xl p-10">
      {/* Background aurora (same as hero) */}
      <div className="bg-aurora opacity-50" />

      {/* Pulsing rings + equaliser icon */}
      <div className="relative h-24 w-24">
        {/* Ring 1 */}
        <motion.span
          className="absolute inset-0 rounded-full border border-fuchsia-400/40"
          animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
        />
        {/* Ring 2 (delayed) */}
        <motion.span
          className="absolute inset-0 rounded-full border border-cyan-300/40"
          animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
        />

        {/* Centre glow + bars */}
        <div className="absolute inset-3 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 blur-md opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full dark:bg-ink-900/80 bg-white/80 ring-1 dark:ring-white/10 ring-slate-200">
            <div className="flex items-end gap-1">
              {[0, 1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  className="block w-1 rounded-full bg-gradient-to-t from-fuchsia-400 to-cyan-300"
                  animate={{ height: ['8px', '20px', '8px'] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.12 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="text-center">
        <p className="text-base font-semibold dark:text-white text-slate-800">
          {t('loader_title')}
        </p>
        <p className="mt-1 text-sm dark:text-white/55 text-slate-500">
          {t('loader_subtitle')}
        </p>
      </div>

      {/* Upload progress bar (only shown during file upload) */}
      {typeof progress === 'number' && progress > 0 && progress < 100 && (
        <div className="w-full max-w-xs">
          <div className="relative h-1.5 w-full overflow-hidden rounded-full dark:bg-white/10 bg-slate-200">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-center text-[11px] dark:text-white/45 text-slate-400">
            {t('loader_uploading')} · {progress}%
          </p>
        </div>
      )}
    </div>
  );
}
