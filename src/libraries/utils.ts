import { IDynamicType } from '@/types/common.i'
import { type ClassValue, clsx } from 'clsx'
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
    minute: hasTime ? '2-digit' : undefined,
    second: hasTime ? '2-digit' : undefined
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
