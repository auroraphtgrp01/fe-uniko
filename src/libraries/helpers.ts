import { IUser } from '@/types/user.i'

export const isClient = typeof window !== 'undefined'

export function getBaseUrl() {
  if (isClient) {
    return process.env.NEXT_PUBLIC_API_ENDPOINT || ''
  }
  const vercelUrl = process.env.VERCEL_URL
  const localhost = `http://localhost:${process.env.PORT ?? 3000}`
  return vercelUrl ? `https://${vercelUrl}` : localhost
}

export function getBaseClientUrl() {
  return process.env.NEXT_PUBLIC_URL || ''
}

export function getHeaders() {
  return {
    'Content-type': 'application/json'
  }
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function capitalizeMany(str: string) {
  return str
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ')
}

export function isNullish<T>(value: T | null | undefined): value is null | undefined {
  return value == null || value == undefined
}

export const getAccessTokenFromLocalStorage = () => (isClient ? localStorage.getItem('accessToken') : null)

export const getRefreshTokenFromLocalStorage = () => (isClient ? localStorage.getItem('refreshToken') : null)
export const setAccessTokenToLocalStorage = (value: string) => isClient && localStorage.setItem('accessToken', value)

export const getUserInfoFromLocalStorage = (): IUser | null => {
  if (!isClient) return null

  const userInfo = localStorage.getItem('userInfo')

  try {
    return userInfo ? JSON.parse(userInfo) : {}
  } catch (error) {
    console.error('Failed to parse userInfo from localStorage:', error)
    return null
  }
}

export const setUserInfoToLocalStorage = (value: any) =>
  isClient && localStorage.setItem('userInfo', JSON.stringify(value))

export const setRefreshTokenToLocalStorage = (value: string) => isClient && localStorage.setItem('refreshToken', value)
export const removeTokensFromLocalStorage = () => {
  isClient && localStorage.removeItem('accessToken')
  isClient && localStorage.removeItem('refreshToken')
}

export const setTimeCountRefetchLimit = () => {
  if (isClient) {
    const now = Date.now()
    localStorage.setItem('timeCountRefetchLimit', now.toString())
  }
}
export const getTimeCountRefetchLimit = () => {
  return isClient ? Number(localStorage.getItem('timeCountRefetchLimit') || '0') : 0
}

export const setEmailWhenRegister = (value: string) => isClient && localStorage.setItem('registerData', value)

export const getEmailWhenRegister = () => (isClient ? localStorage.getItem('registerData') : null)

export const isLogin = (): IUser | null => {
  const accessToken = getAccessTokenFromLocalStorage()
  const refreshToken = getRefreshTokenFromLocalStorage()
  const userInfo = getUserInfoFromLocalStorage()

  const isUserInfoEmpty = (obj: any) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object
  }

  return accessToken !== null || refreshToken !== null || (userInfo !== null && !isUserInfoEmpty(userInfo))
    ? userInfo
    : null
}
