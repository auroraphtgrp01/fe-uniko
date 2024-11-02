import { IDateRange } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { IDynamicType } from '@/types/common.i'
import { IBodyFormField } from '@/types/formZod.interface'
import { AppNamespace } from '@/types/i18n'
import { type ClassValue, clsx } from 'clsx'
import i18next, { TFunction, TOptions } from 'i18next'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}
export const convertToCamelCase = (str: string) => {
  const words = str.toLowerCase().split(' ')
  for (let i = 1; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1)
  }
  return words.join('')
}

export const formatCurrency = (amount: number, currency = 'USD', locale = 'en-US') => {
  const formattedAmount = new Intl.NumberFormat(locale).format(amount)
  return `${formattedAmount} ${currency}`
}

export const formatDateTimeVN = (date: string, hasTime: boolean) => {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: hasTime ? '2-digit' : undefined,
    minute: hasTime ? '2-digit' : undefined
  }).format(new Date(date))
}
const getPropertyByPath = (data: any, propertyPath: string): any => {
  const properties = propertyPath.split('.')
  return properties.reduce((prev, curr) => prev && prev[curr], data)
}

export const getTypes = (data: any, propertyName: string): string[] => {
  const types: string[] = data.map((item: any) => getPropertyByPath(item, propertyName))
  return Array.from(new Set(types))
}

const camelCaseToTitleCase = (input: string): string => {
  const result = input.replace(/([A-Z])/g, ' $1').trim()
  return result
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const getConvertedKeysToTitleCase = (obj: Record<string, any> = {}): string[] =>
  Object.keys(obj).map(camelCaseToTitleCase)

export const formatArrayData = <T, R>(data: T[], formatFunc: (item: T) => R): R[] => {
  return data.map((item: T) => {
    return formatFunc(item)
  })
}

export function replaceParams(pathUrl: string, params: IDynamicType) {
  return pathUrl.replace(/:(\w+)/g, (_, key) => {
    return params[key] ? params[key] : `:${key}`
  })
}

export function mergeQueryParams(query: IDynamicType): string {
  return Object.keys(query)
    .map((key) => `${key}=${encodeURIComponent(query ? query[key] : '')}`)
    .join('&')
}

export function formatDateToInput(dateString: string) {
  const date = new Date(dateString)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const getCurrentMonthDateRange = (): IDateRange => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const startDay = new Date(year, month, 1)
  const endDay = new Date(year, month + 1, 0)
  return {
    startDay,
    endDay
  }
}

export function translate(keyOrNamespace: AppNamespace | AppNamespace[]): TFunction
export function translate(keyOrNamespace: string, options?: TOptions<any>): string
export function translate(
  keyOrNamespace: string | AppNamespace | AppNamespace[],
  options?: TOptions<any>
): string | TFunction {
  if (typeof keyOrNamespace === 'string' || Array.isArray(keyOrNamespace)) {
    const namespaces = keyOrNamespace as AppNamespace | AppNamespace[]
    return ((key: string, options?: TOptions<any>) => i18next.t(key, { ns: namespaces, ...options })) as TFunction
  }

  return i18next.t(keyOrNamespace as string, options)
}

export function getTranslatedFormBody(formBody: IBodyFormField[], t: TFunction<any>): IBodyFormField[] {
  return formBody.map((field) => ({
    ...field,
    label: typeof field.label === 'string' ? t(field.label) : field.label,
    placeHolder: typeof field.placeHolder === 'string' ? t(field.placeHolder) : field.placeHolder,
    dataSelector: field.dataSelector?.map((option) => ({
      ...option,
      label: typeof option.label === 'string' ? t(option.label) : option.label
    }))
  }))
}
