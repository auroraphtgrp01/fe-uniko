import { renderToString } from 'react-dom/server'
import parse from 'html-react-parser'

export const convertToCamelCase = (str: string) => {
  const words = str.toLowerCase().split(' ')
  for (let i = 1; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1)
  }
  return words.join('')
}

export const formatCurrencyVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}
export const formatDateTimeVN = (date: string) => {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(date))
}
export const parseReactToHtml = (ui: any) => {
  return parse(renderToString(ui))
}
