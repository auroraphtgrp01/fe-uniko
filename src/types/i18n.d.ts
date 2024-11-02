import 'i18next'
import { resources, defaultNS } from '../libraries/i18n'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS
    resources: (typeof resources)['vi']
  }
}

export type AppNamespace = 'common' | 'trackerTransaction' | 'transaction' | 'profile' | 'accountSource'
