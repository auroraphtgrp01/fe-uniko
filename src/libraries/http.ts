import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import configProject from '@/config/configService'
import {
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage
} from '@/libraries/helpers'
import { normalizePath } from '@/libraries/utils'
import { IMutateData } from '@/types/common.i'
import toast from 'react-hot-toast'
import Router from 'next/router'
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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const { response } = error
    if (error.response?.status === 401 || error.response?.status === 403) {
      toast.error('Unauthorized or Account inactive, please sign-in again !')
      window.location.href = '/sign-in'
    }
    removeTokensFromLocalStorage()
    return Promise.reject(
      new HttpError({
        status: response?.status || 0,
        payload: response?.data || {},
        message: error.message
      })
    )
  }
)

const request = async <TResponseponse>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  options?: AxiosRequestConfig,
  headers?: Record<string, string>
): Promise<{ status: number; payload: TResponseponse }> => {
  const fullUrl = normalizePath(url)
  const response = await axiosInstance.request<TResponseponse>({
    url: fullUrl,
    method,
    ...options,
    headers
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
  get<TResponse>(url: string, options?: AxiosRequestConfig, headers?: Record<string, string>) {
    return request<TResponse>('GET', url, options, headers)
  },
  post<TBody, TResponse>(url: string, body: TBody, options?: AxiosRequestConfig, headers?: Record<string, string>) {
    return request<TResponse>('POST', url, { ...options, data: body }, headers)
  },
  put<TBody, TResponse>(url: string, body: TBody, options?: AxiosRequestConfig, headers?: Record<string, string>) {
    return request<TResponse>('PUT', url, { ...options, data: body }, headers)
  },
  delete<TResponse>(url: string, options?: AxiosRequestConfig, headers?: Record<string, string>) {
    return request<TResponse>('DELETE', url, options, headers)
  },
  patch<TBody, TResponse>(url: string, body: TBody, options?: AxiosRequestConfig, headers?: Record<string, string>) {
    return request<TResponse>('PATCH', url, { ...options, data: body }, headers)
  }
}

export const fetchData = async <TResponse>(
  url: string,
  params: Record<string, any> = {},
  headers?: Record<string, string>
): Promise<TResponse> => {
  const { payload } = await httpService.get<TResponse>(url, { params }, headers)
  return payload
}

export const mutateData = async <TBody, TResponse>(props: IMutateData<TBody>): Promise<TResponse> => {
  const { url, body, params = {}, headers = {}, method = 'post' } = props
  const { payload } = await httpService[method]<TBody, TResponse>(url, body, { params }, headers)
  return payload
}

export default httpService
