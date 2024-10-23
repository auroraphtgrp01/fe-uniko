import { getBaseUrl } from '@/libraries/helpers'
import { fetchData } from '@/libraries/http'
import { mergeQueryParams, replaceParams } from '@/libraries/utils'
import { IBaseResponseData, IDynamicType } from '@/types/common.i'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const baseUrl = getBaseUrl()

export type Updater<T> =
  T extends IBaseResponseData<infer U>
    ? U extends Array<infer ItemType>
      ? ItemType
      : never
    : T extends Array<infer ItemType>
      ? ItemType
      : never
interface QueryOptions {
  refetchOnMount?: boolean
  refetchOnWindowFocus?: boolean
  refetchOnReconnect?: boolean
  enable?: boolean
  query?: IDynamicType
  condition?: string | null
  headers?: Record<string, string>
  retry?: number
  params?: IDynamicType
}

const defaultOptions: QueryOptions = {
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  enable: true,
  query: {},
  condition: null,
  retry: 2
}

/**
 * Custom React hook that fetches data using React Query with customizable options.
 *
 * @template TResponse - The expected response type.
 * @param {string} modelName - The name of the model to query.
 * @param {string} pathUrl - The URL path for the query endpoint.
 * @param {QueryOptions} [options={}] - Optional configuration to customize the query behavior.
 * @returns {object} - Returns the result of the `useQuery` hook from React Query.
 */
export const useModelQuery = <TResponse>(modelName: string, pathUrl: string, options: QueryOptions = {}) => {
  const mergedOptions: QueryOptions = { ...defaultOptions, ...options }
  const query = mergeQueryParams(mergedOptions.query ?? {})
  const queryKey = [modelName, mergedOptions.condition ?? '', query]
  const finalUrl = `${baseUrl}/${replaceParams(pathUrl, options.params ?? {})}?${query}`
  return useQuery<TResponse>({
    queryKey,
    queryFn: () => fetchData<TResponse>(finalUrl, options.headers),
    refetchOnMount: mergedOptions.refetchOnMount,
    refetchOnWindowFocus: mergedOptions.refetchOnWindowFocus,
    refetchOnReconnect: mergedOptions.refetchOnReconnect,
    staleTime: 1000 * 60,
    enabled: mergedOptions.enable,
    retry: mergedOptions.retry
  })
}

/**
 * @param {T | undefined} oldData - The existing data before the update. It could be undefined if no data has been previously fetched.
 * @param {Partial<T>} newData - The new data to update with. This is a partial object of type T.
 * @returns {T} - If oldData is not defined, it returns the newData cast to type T.
 */
export const useUpdateModel = <T>(queryKey: string | string[], dataUpdater: (oldData: T, newData: Updater<T>) => T) => {
  const queryClient = useQueryClient()
  const key = Array.isArray(queryKey) ? queryKey : [queryKey]

  const setData = (newData: Updater<T>) => {
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
