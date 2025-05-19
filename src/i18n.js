import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/translation.json";
import th from "./locales/th/translation.json";
import cn from "./locales/cn/translation.json";
import jp from "./locales/jp/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: false,
    interpolation: { escapeValue: false },
    resources: {
      en: { translation: en },
      th: { translation: th },
      cn: { translation: cn },
      jp: { translation: jp },
    },
  });

export default i18n;
