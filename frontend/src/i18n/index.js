import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import hi from './locales/hi.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import de from './locales/de.json';
import pt from './locales/pt.json';
import ru from './locales/ru.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      es: { translation: es },
      fr: { translation: fr },
      ar: { translation: ar },
      zh: { translation: zh },
      ja: { translation: ja },
      de: { translation: de },
      pt: { translation: pt },
      ru: { translation: ru }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: 'US' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: 'IN' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: 'ES' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: 'FR' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: 'SA' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: 'CN' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: 'JP' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: 'DE' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: 'BR' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: 'RU' }
];

export const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' }
];

export default i18n;
