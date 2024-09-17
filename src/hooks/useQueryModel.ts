import { getBaseUrl } from '@/libraries/helpers'
import { fetchData } from '@/libraries/http'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const baseUrl = getBaseUrl()

interface QueryOptions {
  refetchOnMount?: boolean
  refetchOnWindowFocus?: boolean
  refetchOnReconnect?: boolean
  enable?: boolean
  params?: { key: string; value: any }[]
  condition?: string | null
  headers?: Record<string, string>
  retry?: number
}

const defaultOptions: QueryOptions = {
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  enable: true,
  params: [],
  condition: null,
  retry: 2
}

export const useModelQuery = <TResponse>(modelName: string, pathUrl: string, options: QueryOptions = {}) => {
  const mergedOptions: QueryOptions = { ...defaultOptions, ...options }

  const queryKey = [
    modelName,
    mergedOptions.condition ?? '',
    mergedOptions.params?.length
      ? '?' + mergedOptions.params.map((param) => `${param.key}=${encodeURIComponent(param.value)}`).join('&')
      : ''
  ]
  return useQuery<TResponse>({
    queryKey,
    queryFn: () =>
      fetchData<TResponse>(
        `${baseUrl}/${pathUrl}` +
          (mergedOptions.params?.length
            ? '?' + mergedOptions.params.map((param) => `${param.key}=${encodeURIComponent(param.value)}`).join('&')
            : ''),
        options.headers
      ),
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
