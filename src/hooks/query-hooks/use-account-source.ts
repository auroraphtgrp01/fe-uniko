import { apiService } from '@/libraries/api'
import { IUseGetAdvancedProps, IUseQueryHookOptions } from './query-hook.i'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { IAccountSource, IAccountSourceBody } from '@/types/account-source.i'
import { AxiosError } from 'axios'
import { IBaseResponseData } from '@/types/common.i'

const accountSourceServices = apiService.accountSource
export const useAccountSource = (opts?: IUseQueryHookOptions) => {
  const { mutate: createAccountSource, isPending: isCreating } = useMutation<
    IBaseResponseData<IAccountSource>,
    AxiosError,
    IAccountSourceBody
  >({
    mutationFn: accountSourceServices.createAccountSource,
    onError: (error: Error | any) => {
      if (error.response?.status === 401) {
        return toast.error(`${error?.response?.data?.messages} !`)
      }

      opts?.callBackOnError?.()
    }
  })

  const { mutate: updateAccountSource, isPending: isUpdating } = useMutation<
    IBaseResponseData<IAccountSource>,
    AxiosError,
    IAccountSourceBody
  >({
    mutationFn: accountSourceServices.updateAccountSource,
    onError: (error: Error | any) => {
      if (error.response?.status === 401) {
        return toast.error(`${error?.response?.data?.messages} !`)
      }

      opts?.callBackOnError?.()
    }
  })

  return {
    createAccountSource,
    isCreating,
    updateAccountSource,
    isUpdating
  }
}

export const useGetAdvancedAccountSource = (props: IUseGetAdvancedProps) => {
  const { isPending: isGetAdvancedPending, data: getAdvancedData } = useQuery({
    queryKey: ['account-source', 'advanced', props.params, props.queryCondition],
    queryFn: () => accountSourceServices.getAdvanced(props.params, props.queryCondition),
    enabled: !!props,
    retry: 2,
    retryDelay: 1000
  })

  return {
    isGetAdvancedPending,
    getAdvancedData
  }
}
