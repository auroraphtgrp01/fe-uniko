import { apiService } from '@/libraries/api'
import { IUseQueryHookOptions } from './query-hook.i'
import { useMutation } from '@tanstack/react-query'
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
    IAccountSourceBody & { id: string }
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
