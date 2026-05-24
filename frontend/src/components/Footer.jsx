import { AudioLines, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { t } = useApp();

  return (
    <footer className="relative mt-20 border-t dark:border-white/5 border-slate-200">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">

        {/* Logo + tagline */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400">
            <AudioLines className="h-4 w-4 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold dark:text-white/90 text-slate-800">
              Voice Emotion AI
            </p>
            <p className="text-[11px] dark:text-white/40 text-slate-500">
              {t('footer_tagline')}
            </p>
          </div>
        </div>

        {/* Copyright + built-with */}
        <div className="flex items-center gap-6 text-xs dark:text-white/45 text-slate-400">
          <span>© {new Date().getFullYear()} · {t('footer_rights')}</span>
          <span className="inline-flex items-center gap-1.5">
            {t('footer_built')} <Heart className="h-3.5 w-3.5 text-pink-400" />
          </span>
        </div>

      </div>
    </footer>
  );
}
