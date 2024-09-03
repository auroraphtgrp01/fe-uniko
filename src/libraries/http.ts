import axios, { AxiosRequestConfig, AxiosError } from 'axios'
import configProject from '@/config/configService'
import {
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage
} from '@/libraries/helpers'
import { normalizePath } from '@/libraries/utils'

const AUTHENTICATION_ERROR_STATUS = 401

export class HttpError extends Error {
  status: number
  payload: Record<string, any>

  constructor({
    status,
    payload,
    message = 'HTTP Error'
  }: {
    status: number
    payload: Record<string, any>
    message?: string
  }) {
    super(message)
    this.status = status
    this.payload = payload
  }
}

let clientLogoutRequest: null | Promise<any> = null
const isClient = typeof window !== 'undefined'

const axiosInstance = axios.create({
  baseURL: configProject.NEXT_PUBLIC_API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use((config) => {
  if (isClient) {
    const accessToken = getAccessTokenFromLocalStorage()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
  }
  return config
})

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const { response } = error
//     if (response?.status === AUTHENTICATION_ERROR_STATUS && isClient) {
//       if (!clientLogoutRequest) {
//         clientLogoutRequest = axiosInstance.post('/api/auth/logout')
//         try {
//           await clientLogoutRequest
//         } catch {
//           // Handle error silently
//         } finally {
//           removeTokensFromLocalStorage()
//           clientLogoutRequest = null
//           // window.location.href = `/sign-in`
//         }
//       }
//     }
//     return Promise.reject(
//       new HttpError({
//         status: response?.status || 0,
//         payload: response?.data || {},
//         message: error.message
//       })
//     )
//   }
// )

const request = async <TResponse>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  options?: AxiosRequestConfig
): Promise<{ status: number; payload: TResponse }> => {
  const fullUrl = normalizePath(url)
  const response = await axiosInstance.request<TResponse>({
    url: fullUrl,
    method,
    ...options
  })

  const { data, status } = response

  if (isClient) {
    handleClientSideActions(fullUrl, data)
  }

  return { status, payload: data }
}

const handleClientSideActions = (url: string, data: any) => {
  const normalizedUrl = normalizePath(url)
  if (['api/auth/login'].includes(normalizedUrl)) {
    const { accessToken, refreshToken } = data.data
    setAccessTokenToLocalStorage(accessToken)
    setRefreshTokenToLocalStorage(refreshToken)
  } else if (normalizedUrl === 'api/auth/token') {
    const { accessToken, refreshToken } = data as { accessToken: string; refreshToken: string }
    setAccessTokenToLocalStorage(accessToken)
    setRefreshTokenToLocalStorage(refreshToken)
  } else if (['api/auth/logout', 'api/guest/auth/logout'].includes(normalizedUrl)) {
    removeTokensFromLocalStorage()
  }
}

const httpService = {
  get<TRes>(url: string, options?: AxiosRequestConfig) {
    return request<TRes>('GET', url, options)
  },
  post<TBody, TRes>(url: string, body: TBody, options?: AxiosRequestConfig) {
    return request<TRes>('POST', url, { ...options, data: body })
  },
  put<TBody, TRes>(url: string, body: TBody, options?: AxiosRequestConfig) {
    return request<TRes>('PUT', url, { ...options, data: body })
  },
  delete<TRes>(url: string, options?: AxiosRequestConfig) {
    return request<TRes>('DELETE', url, options)
  }
}

export default httpService
