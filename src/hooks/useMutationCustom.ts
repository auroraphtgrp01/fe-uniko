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

/**
 * Custom React hook to perform mutations using the `useMutation` hook from `@tanstack/react-query`.
 * This hook integrates with a custom `postData` function and allows for additional query parameters,
 * headers, and other mutation options.
 *
 * @template TBody - The type of the request body.
 * @template TResponse - The type of the response.
 *
 * @param {IUseMutationCustomProps<TResponse, AxiosError, TBody>} props - The properties for configuring the mutation.
 * @param {string} props.pathUrl - The path URL to append to the base URL for the mutation endpoint.
 * @param {QueryOptions} [props.options] - Optional query parameters, conditions, and headers.
 * @param {IDynamicType} [props.options.params] - Optional query parameters to include in the request URL.
 * @param {string|null} [props.options.condition] - Optional condition to include in the request (not used in this implementation).
 * @param {Record<string, string>} [props.options.headers] - Optional headers to include in the request.
 * @param {UseMutationOptions<TResponse, AxiosError, TBody>} [props.mutateOption] - Options to customize the behavior of `useMutation`.
 *
 * @returns {ReturnType<typeof useMutation>} - The return value of `useMutation` with custom configuration.
 */
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