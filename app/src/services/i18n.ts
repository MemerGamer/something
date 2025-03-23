import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../locales/en.json';
import hu from '../locales/hu.json';

export const languageResources = {
  en: { translation: en },
  hu: { translation: hu }
};

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    lng: 'en',
    resources: languageResources
  });

export default i18n;
