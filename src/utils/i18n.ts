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

// Like getTranslation, but for keys whose value is an array of strings
export function getListTranslation(locale: Locale) {
  return function tList(key: string): string[] {
    const lookup = (loc: Locale): unknown => {
      let value: any = translations[loc];
      for (const k of key.split('.')) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return undefined;
        }
      }
      return value;
    };

    const value = lookup(locale) ?? lookup('en');
    return Array.isArray(value) ? value : [];
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

// Prefix a site-relative path with the locale segment ('/product' -> '/nl/product')
export function localePath(locale: Locale, path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'en') return normalized;
  return normalized === '/' ? '/nl/' : `/nl${normalized}`;
}

// Same page, other locale: '/nl/product' <-> '/product'
export function switchLocalePath(pathname: string, target: Locale): string {
  const bare = pathname.replace(/^\/nl(?=\/|$)/, '') || '/';
  return localePath(target, bare);
}



// Language display labels (short codes — full names read oddly mixed-language)
export const LANGUAGE_NAMES: Record<Locale, string> = {
  en: 'EN',
  nl: 'NL',
};

// Available locales
export const LOCALES: Locale[] = ['en', 'nl'];