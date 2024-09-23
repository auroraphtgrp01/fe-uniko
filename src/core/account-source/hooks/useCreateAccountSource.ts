import { accountSourceRoutes } from '@/core/account-source/configs'
import { IAccountSourceBody, IAccountSourceResponse } from '@/core/account-source/models'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'

export const useCreateAccountSource = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom<IAccountSourceBody, IAccountSourceResponse>({
    pathUrl: accountSourceRoutes.createAccountSource,
    mutateOption: {
      onError: (error: AxiosError | any) => {
        if (error.response?.status === 401) {
          return toast.error(`${error?.response?.data?.messages} !`)
        }
        opts?.callBackOnError?.()
      }
    }
  })
}
