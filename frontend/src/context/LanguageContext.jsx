/**
 * Language Context — SevaSangam
 * 
 * Provides internationalization (i18n) state.
 * Manages current language and language switching.
 */
import { createContext, useState, useCallback, useMemo } from 'react';
import i18n from '../i18n/config';

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
];

export const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(
    import.meta.env.VITE_DEFAULT_LANGUAGE || 'en'
  );

  const changeLanguage = useCallback((langCode) => {
    const isSupported = SUPPORTED_LANGUAGES.some((l) => l.code === langCode);
    if (isSupported) {
      setCurrentLanguage(langCode);
      i18n.changeLanguage(langCode);
      document.documentElement.lang = langCode;
    }
  }, []);

  const value = useMemo(
    () => ({
      currentLanguage,
      changeLanguage,
      supportedLanguages: SUPPORTED_LANGUAGES,
    }),
    [currentLanguage, changeLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};
