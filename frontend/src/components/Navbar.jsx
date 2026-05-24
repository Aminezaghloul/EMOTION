import { motion } from 'framer-motion';
import { AudioLines, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Language options shown in the switcher
const LANGS = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'AR' },
];

export default function Navbar() {
  const { lang, setLang, isDark, setIsDark, t } = useApp();

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-0 z-30 w-full"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* ── Logo ── */}
        <a href="#top" className="flex items-center gap-3">
          <div className="relative">
            {/* Glow behind the icon */}
            <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 blur-md opacity-60" />
            <div className="flex h-10 w-10 items-center justify-center rounded-xl dark:bg-ink-900/80 bg-white/80 ring-1 dark:ring-white/10 ring-slate-200">
              <AudioLines className="h-5 w-5 dark:text-white text-violet-600" />
            </div>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-wide dark:text-white/90 text-slate-800">
              VOICE EMOTION
            </p>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] dark:text-white/40 text-slate-500">
              AI · Acoustic Intelligence
            </p>
          </div>
        </a>

        {/* ── Center nav links (hidden on mobile) ── */}
        <nav className="hidden items-center gap-8 md:flex">
          {[
            { href: '#analyze',  key: 'nav_analyze'  },
            { href: '#how',      key: 'nav_how'      },
            { href: '#emotions', key: 'nav_emotions'  },
          ].map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="text-sm font-medium dark:text-white/70 text-slate-600 transition dark:hover:text-white hover:text-slate-900"
            >
              {t(link.key)}
            </a>
          ))}
        </nav>

        {/* ── Right side: language switcher + theme toggle ── */}
        <div className="flex items-center gap-2">

          {/* Language switcher — three compact buttons */}
          <div className="flex items-center overflow-hidden rounded-full border dark:border-white/10 border-slate-200">
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`px-3 py-1.5 text-xs font-bold uppercase transition ${
                  lang === code
                    ? 'bg-violet-600 text-white'
                    : 'dark:text-white/50 text-slate-500 dark:hover:text-white hover:text-slate-900'
                }`}
                aria-label={`Switch to ${label}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Theme toggle — Sun (light) / Moon (dark) */}
          <button
            onClick={() => setIsDark(!isDark)}
            title={isDark ? t('theme_light') : t('theme_dark')}
            className="flex h-9 w-9 items-center justify-center rounded-full border transition
                       dark:border-white/10 border-slate-200
                       dark:text-white/70 text-slate-600
                       dark:hover:border-white/20 dark:hover:text-white hover:text-slate-900"
            aria-label="Toggle theme"
          >
            {isDark
              ? <Sun  className="h-4 w-4" />
              : <Moon className="h-4 w-4" />
            }
          </button>
        </div>

      </div>
    </motion.header>
  );
}
