export const locales = ['en', 'id'] as const;
export type Locale = (typeof locales)[number];

export function getLocaleFromCookie(): Locale {
  if (typeof window === 'undefined') return 'en';
  
  const cookies = document.cookie.split(';');
  const localeCookie = cookies.find(c => c.trim().startsWith('NEXT_LOCALE='));
  const locale = localeCookie?.split('=')[1]?.trim();
  
  return locales.includes(locale as Locale) ? (locale as Locale) : 'en';
}
