import { initReactI18next } from 'react-i18next'
import translationVi from './locales/vi/translation.json'
import translationEN from './locales/en/translation.json'
import translationKE from './locales/ke/translation.json'
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-xhr-backend'

const i18n = i18next.createInstance()
const fallbackLng = ['vi']
const availableLanguages = ['vi,en,ke']

const resources = {
  vi: {
    translation: translationVi
  },
  en: {
    translation: translationEN
  },
  ke: {
    translation: translationKE
  },
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng,

    detection: {
      checkWhitelist: true
    },

    debug: false,

    whitelist: availableLanguages,

    interpolation: {
      escapeValue: false
    }
  })

export default i18n
