import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import EN from '../locales/en'
import VI from '../locales/vi'
export const locales = {
  en: 'en',
  vi: 'vi'
} as const

export const resources = {
  en: EN,
  vi: VI
}

export const defaultNS = 'overview'

i18next.use(initReactI18next).init({
  lng: 'en',
  resources,
  fallbackLng: 'en',
  defaultNS,
  interpolation: {
    escapeValue: false
  }
})

export default i18next
