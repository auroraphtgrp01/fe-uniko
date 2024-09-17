import { accountSourceServices } from '@/hooks/core/account-source/configs'
import { IAccountSourceBody, ICreateAccountSourceResponse } from '@/hooks/core/account-source/models'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'

export const useCreateAccountSource = (opts?: IUseQueryHookOptions) => {
  return useMutation<ICreateAccountSourceResponse, AxiosError, IAccountSourceBody>({
    mutationFn: accountSourceServices.createAccountSource,
    onError: (error: Error | any) => {
      if (error.response?.status === 401) {
        return toast.error(`${error?.response?.data?.messages} !`)
      }
      opts?.callBackOnError?.()
    }
  })
}
