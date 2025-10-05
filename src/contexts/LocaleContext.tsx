"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { IntlProvider } from 'next-intl';
import type { Locale } from '@/i18n';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [messages, setMessages] = useState<Record<string, unknown>>({});

  useEffect(() => {
    // Get locale from cookie on mount
    const cookies = document.cookie.split(';');
    const localeCookie = cookies.find(c => c.trim().startsWith('NEXT_LOCALE='));
    const savedLocale = localeCookie?.split('=')[1]?.trim();
    
    if (savedLocale === 'en' || savedLocale === 'id') {
      setLocaleState(savedLocale);
    }
  }, []);

  useEffect(() => {
    // Load messages when locale changes
    import(`../../messages/${locale}.json`)
      .then((module) => setMessages(module.default))
      .catch(() => setMessages({}));
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <IntlProvider locale={locale} messages={messages}>
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
}

export function useLocaleContext() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocaleContext must be used within LocaleProvider');
  }
  return context;
}
