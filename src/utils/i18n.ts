import { getRelativeLocaleUrl } from 'astro:i18n';

// Import translation files
import enTranslations from '../i18n/en.json';
import nlTranslations from '../i18n/nl.json';

// Type definitions
export type Locale = 'en' | 'nl';

export interface Translations {
  [key: string]: any;
}

// Translation data
const translations: Record<Locale, Translations> = {
  en: enTranslations,
  nl: nlTranslations,
};

// Get translation function
export function getTranslation(locale: Locale) {
  return function t(key: string): string {
    const keys = key.split('.');
    let value: any = translations[locale];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        value = translations['en'];
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if not found in fallback
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };
}

// Get locale from URL
export function getLocaleFromUrl(url: URL): Locale {
  const pathname = url.pathname;
  
  if (pathname.startsWith('/nl')) {
    return 'nl';
  }
  
  return 'en'; // Default to English
}



// Language display names
export const LANGUAGE_NAMES: Record<Locale, string> = {
  en: 'English',
  nl: 'Nederlands',
};

// Available locales
export const LOCALES: Locale[] = ['en', 'nl'];