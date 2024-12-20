import 'i18next'
import { resources, defaultNS } from '../libraries/i18n'
import { Namespace } from 'i18next'
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS
    resources: (typeof resources)['vi']
  }
}

export type KPrefix = KeyPrefix<FallbackNs<Namespace>>
export type KNamespace = Namespace | KPrefix
