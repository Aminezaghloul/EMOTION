/**
 * AppContext — global state for language and theme.
 *
 * Provides:
 *   lang      : current language code ('fr' | 'en' | 'ar')
 *   setLang   : function to change the language
 *   isDark    : boolean, true = dark mode (default)
 *   setIsDark : function to toggle theme
 *   t(key)    : returns the translated string for the given key
 *
 * Usage in any component:
 *   import { useApp } from '../context/AppContext';
 *   const { t, lang, isDark, setLang, setIsDark } = useApp();
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

// Create the context object
const AppContext = createContext();

// ─── Provider ────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [lang, setLang]     = useState('fr');   // French is the default language
  const [isDark, setIsDark] = useState(true);   // Dark mode is the default theme

  // Apply theme: add 'dark' class to <html> for Tailwind dark: variants
  // and 'light' class for our own CSS overrides in index.css
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark',  isDark);
    root.classList.toggle('light', !isDark);
  }, [isDark]);

  // Apply text direction: Arabic is RTL, all others are LTR
  useEffect(() => {
    document.documentElement.setAttribute('dir',  lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  // Translation function
  // Falls back to French if a key is missing in the selected language
  const t = (key) =>
    translations[lang]?.[key] ??
    translations['fr']?.[key]  ??
    key; // last resort: return the key itself so nothing breaks

  return (
    <AppContext.Provider value={{ lang, setLang, isDark, setIsDark, t }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook — shortcut for useContext(AppContext)
export const useApp = () => useContext(AppContext);
