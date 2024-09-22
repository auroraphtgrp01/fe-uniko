import { getBaseUrl } from '@/libraries/helpers'
import { fetchData } from '@/libraries/http'
import { IDynamicType } from '@/types/common.i'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const baseUrl = getBaseUrl()

interface QueryOptions {
  refetchOnMount?: boolean
  refetchOnWindowFocus?: boolean
  refetchOnReconnect?: boolean
  enable?: boolean
  params?: IDynamicType
  condition?: string | null
  headers?: Record<string, string>
  retry?: number
}

const defaultOptions: QueryOptions = {
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  enable: true,
  params: {},
  condition: null,
  retry: 2
}

export const useModelQuery = <TResponse>(modelName: string, pathUrl: string, options: QueryOptions = {}) => {
  const mergedOptions: QueryOptions = { ...defaultOptions, ...options }
  const params = Object.keys(mergedOptions.params ?? {})
    .map((key) => `${key}=${encodeURIComponent(mergedOptions.params ? mergedOptions.params[key] : '')}`)
    .join('&')
  const queryKey = [modelName, mergedOptions.condition ?? '', params]

  return useQuery<TResponse>({
    queryKey,
    queryFn: () => fetchData<TResponse>(`${baseUrl}/${pathUrl}?` + params, options.headers),
    refetchOnMount: mergedOptions.refetchOnMount,
    refetchOnWindowFocus: mergedOptions.refetchOnWindowFocus,
    refetchOnReconnect: mergedOptions.refetchOnReconnect,
    staleTime: 1000 * 60,
    enabled: mergedOptions.enable,
    retry: mergedOptions.retry
  })
}

export const useUpdateModel = <T>(queryKey: string | string[], dataUpdater: (oldData: T, newData: Partial<T>) => T) => {
  const queryClient = useQueryClient()
  const key = Array.isArray(queryKey) ? queryKey : [queryKey]

  const setData = (newData: Partial<T>) => {
    queryClient.setQueryData(key, (oldData: T | undefined) => {
      if (!oldData) return newData as T
      return dataUpdater(oldData, newData)
    })
  }

  const resetData = () => {
    queryClient.invalidateQueries({ queryKey: key })
    queryClient.refetchQueries({ queryKey: key })
  }

  return { setData, resetData }
}
