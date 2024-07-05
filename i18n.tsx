// /src/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const Languages = ['en', 'fr'];

i18n
  .use(Backend) // load translations using http
  .use(LanguageDetector) // detect user language
  .use(initReactI18next) // pass the i18n instance to react-i18next
  .init({
    fallbackLng: 'en', // default language
    debug: true, // enable debug mode
    supportedLngs: Languages, // supported languages

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
