"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language, TranslationKeys } from "./translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("ru");

  useEffect(() => {
    // Detect browser language or get from localStorage
    const savedLang = localStorage.getItem("flipcon-language") as Language;
    if (savedLang && (savedLang === "ru" || savedLang === "en")) {
      setLanguageState(savedLang);
    } else {
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "en" || browserLang === "ru") {
        setLanguageState(browserLang as Language);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("flipcon-language", lang);
    document.documentElement.lang = lang;
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
