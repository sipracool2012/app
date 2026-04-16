import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Original locales
import en from './locales/en.json';
import ar from './locales/ar.json';
import de from './locales/de.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import hi from './locales/hi.json';
import ja from './locales/ja.json';
import pt from './locales/pt.json';
import ru from './locales/ru.json';
import zh from './locales/zh.json';

// New locales
import da from './locales/da.json';
import enCA from './locales/en-CA.json';
import enGB from './locales/en-GB.json';
import enUS from './locales/en-US.json';
import esES from './locales/es-ES.json';
import esLA from './locales/es-LA.json';
import fi from './locales/fi.json';
import frCA from './locales/fr-CA.json';
import id from './locales/id.json';
import is from './locales/is.json';
import it from './locales/it.json';
import ko from './locales/ko.json';
import lv from './locales/lv.json';
import ms from './locales/ms.json';
import my from './locales/my.json';
import nl from './locales/nl.json';
import no from './locales/no.json';
import pl from './locales/pl.json';
import ptBR from './locales/pt-BR.json';
import ptPT from './locales/pt-PT.json';
import sv from './locales/sv.json';
import th from './locales/th.json';
import tr from './locales/tr.json';
import uk from './locales/uk.json';
import vi from './locales/vi.json';
import zhCN from './locales/zh-CN.json';
import zhTW from './locales/zh-TW.json';

const legalPageKeys = ['privacy', 'terms', 'cookies', 'refund'];

function mergeLegalPages(locale) {
  const mergedPages = { ...(locale.pages || {}) };

  for (const pageKey of legalPageKeys) {
    mergedPages[pageKey] = {
      ...(enUS.pages?.[pageKey] || {}),
      ...(locale.pages?.[pageKey] || {})
    };
  }

  return {
    ...locale,
    pages: mergedPages
  };
}

const resources = {
  en: mergeLegalPages(en),
  ar: mergeLegalPages(ar),
  de: mergeLegalPages(de),
  es: mergeLegalPages(es),
  fr: mergeLegalPages(fr),
  hi: mergeLegalPages(hi),
  ja: mergeLegalPages(ja),
  pt: mergeLegalPages(pt),
  ru: mergeLegalPages(ru),
  zh: mergeLegalPages(zh),
  da: mergeLegalPages(da),
  'en-CA': mergeLegalPages(enCA),
  'en-GB': mergeLegalPages(enGB),
  'en-US': mergeLegalPages(enUS),
  'es-ES': mergeLegalPages(esES),
  'es-LA': mergeLegalPages(esLA),
  fi: mergeLegalPages(fi),
  'fr-CA': mergeLegalPages(frCA),
  id: mergeLegalPages(id),
  is: mergeLegalPages(is),
  it: mergeLegalPages(it),
  ko: mergeLegalPages(ko),
  lv: mergeLegalPages(lv),
  ms: mergeLegalPages(ms),
  my: mergeLegalPages(my),
  nl: mergeLegalPages(nl),
  no: mergeLegalPages(no),
  pl: mergeLegalPages(pl),
  'pt-BR': mergeLegalPages(ptBR),
  'pt-PT': mergeLegalPages(ptPT),
  sv: mergeLegalPages(sv),
  th: mergeLegalPages(th),
  tr: mergeLegalPages(tr),
  uk: mergeLegalPages(uk),
  vi: mergeLegalPages(vi),
  'zh-CN': mergeLegalPages(zhCN),
  'zh-TW': mergeLegalPages(zhTW)
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: Object.fromEntries(
      Object.entries(resources).map(([code, translation]) => [code, { translation }])
    ),
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export const languages = [
  { code: 'en-US', name: 'English (US)',           nativeName: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)',           nativeName: 'English (UK)' },
  { code: 'en-CA', name: 'English (Canada)',       nativeName: 'English (Canada)' },
  { code: 'ar',    name: 'Arabic',                 nativeName: 'العربية' },
  { code: 'da',    name: 'Danish',                 nativeName: 'Dansk' },
  { code: 'de',    name: 'German',                 nativeName: 'Deutsch' },
  { code: 'es-ES', name: 'Spanish (Spain)',        nativeName: 'Español (España)' },
  { code: 'es-LA', name: 'Spanish (Latin America)',nativeName: 'Español (Latinoamérica)' },
  { code: 'fi',    name: 'Finnish',                nativeName: 'Suomi' },
  { code: 'fr',    name: 'French',                 nativeName: 'Français' },
  { code: 'fr-CA', name: 'French (Canada)',        nativeName: 'Français (Canada)' },
  { code: 'hi',    name: 'Hindi',                  nativeName: 'हिन्दी' },
  { code: 'id',    name: 'Indonesian',             nativeName: 'Bahasa Indonesia' },
  { code: 'is',    name: 'Icelandic',              nativeName: 'Íslenska' },
  { code: 'it',    name: 'Italian',                nativeName: 'Italiano' },
  { code: 'ja',    name: 'Japanese',               nativeName: '日本語' },
  { code: 'ko',    name: 'Korean',                 nativeName: '한국어' },
  { code: 'lv',    name: 'Latvian',                nativeName: 'Latviešu' },
  { code: 'ms',    name: 'Malay',                  nativeName: 'Bahasa Melayu' },
  { code: 'my',    name: 'Burmese',                nativeName: 'မြန်မာဘာသာ' },
  { code: 'nl',    name: 'Dutch',                  nativeName: 'Nederlands' },
  { code: 'no',    name: 'Norwegian',              nativeName: 'Norsk' },
  { code: 'pl',    name: 'Polish',                 nativeName: 'Polski' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)',    nativeName: 'Português (Brasil)' },
  { code: 'pt-PT', name: 'Portuguese (Portugal)',  nativeName: 'Português (Portugal)' },
  { code: 'ru',    name: 'Russian',                nativeName: 'Русский' },
  { code: 'sv',    name: 'Swedish',                nativeName: 'Svenska' },
  { code: 'th',    name: 'Thai',                   nativeName: 'ภาษาไทย' },
  { code: 'tr',    name: 'Turkish',                nativeName: 'Türkçe' },
  { code: 'uk',    name: 'Ukrainian',              nativeName: 'Українська' },
  { code: 'vi',    name: 'Vietnamese',             nativeName: 'Tiếng Việt' },
  { code: 'zh-CN', name: 'Chinese (Simplified)',   nativeName: '中文（简体）' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '中文（繁體）' }
];

export const currencies = [
  { code: 'USD', symbol: '$',   name: 'US Dollar' },
  { code: 'EUR', symbol: '€',   name: 'Euro' },
  { code: 'GBP', symbol: '£',   name: 'British Pound' },
  { code: 'INR', symbol: '₹',   name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥',   name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥',   name: 'Chinese Yuan' },
  { code: 'AUD', symbol: 'A$',  name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$',  name: 'Canadian Dollar' },
  { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' },
  { code: 'BRL', symbol: 'R$',  name: 'Brazilian Real' }
];

export default i18n;
