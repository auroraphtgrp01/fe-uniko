import { getBaseUrl } from '@/libraries/helpers'
import { postData } from '@/libraries/http'
import { IDynamicType } from '@/types/common.i'
import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { AxiosError } from 'axios'

interface QueryOptions {
  params?: IDynamicType
  condition?: string | null
  headers?: Record<string, string>
}

export interface IUseMutationCustomProps<TData, TError, TVariables> {
  pathUrl: string
  options?: QueryOptions
  mutateOption?: UseMutationOptions<TData, TError, TVariables>
}

const baseUrl = getBaseUrl()

export const useMutationCustom = <TBody, TResponse>({
  pathUrl,
  options = {},
  mutateOption
}: IUseMutationCustomProps<TResponse, AxiosError, TBody>) => {
  const paramsString = options.params
    ? new URLSearchParams(
        Object.entries(options.params).map(([key, value]) => [key, value?.toString() ?? ''])
      ).toString()
    : ''
  return useMutation<TResponse, AxiosError, TBody>({
    mutationFn: (body: TBody) =>
      postData<TBody, TResponse>(
        `${baseUrl}/${pathUrl}${paramsString ? '?' + paramsString : ''}`,
        body,
        options.headers
      ),
    ...mutateOption
  })
}
