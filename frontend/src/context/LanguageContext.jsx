/**
 * Language Context — SevaSangam
 *
 * Provides internationalisation (i18n) state across the application.
 * Manages the current UI language, language switching, and exposes
 * the list of supported languages.
 *
 * Supported languages (MVP): English, Hindi, Marathi.
 * Default: "en" (overridable via VITE_DEFAULT_LANGUAGE env variable).
 *
 * Persistence: selected language is saved to localStorage so the user's
 * preference survives page reloads.
 */
import { createContext, useState, useCallback, useMemo, useEffect } from 'react';
import i18n from '../i18n/config';

const LANG_KEY = 'sevasangam_language';

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
];

/**
 * Determine the initial language from localStorage → env → fallback.
 */
const getInitialLanguage = () => {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) {
      return stored;
    }
  } catch {
    // localStorage may be unavailable in SSR / tests
  }
  return import.meta.env.VITE_DEFAULT_LANGUAGE || 'en';
};

export const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(getInitialLanguage);

  // Sync i18next with the initial language on mount
  useEffect(() => {
    if (i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
    document.documentElement.lang = currentLanguage;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Switch the active UI language.
   * Ignored if `langCode` is not in SUPPORTED_LANGUAGES.
   */
  const changeLanguage = useCallback((langCode) => {
    const isSupported = SUPPORTED_LANGUAGES.some((l) => l.code === langCode);
    if (!isSupported) return;

    setCurrentLanguage(langCode);
    i18n.changeLanguage(langCode);
    document.documentElement.lang = langCode;

    try {
      localStorage.setItem(LANG_KEY, langCode);
    } catch {
      // Fail silently — localStorage may be full or disabled
    }
  }, []);

  const t = useCallback(
    (key, options) => {
      return i18n.t(key, options);
    },
    // re-trigger when currentLanguage changes
    [currentLanguage]
  );

  const value = useMemo(
    () => ({
      currentLanguage,
      language: currentLanguage,
      setLanguage: changeLanguage,
      changeLanguage,
      supportedLanguages: SUPPORTED_LANGUAGES,
      t,
    }),
    [currentLanguage, changeLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};
