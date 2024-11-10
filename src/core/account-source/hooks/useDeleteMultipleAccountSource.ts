import { accountSourceRoutes } from '@/core/account-source/configs'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import toast from 'react-hot-toast'

export const useDeleteMultipleAccountSource = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom({
    pathUrl: accountSourceRoutes.deleteMultipleAccountSource,
    method: 'delete',
    mutateOption: {
      onError: (error: Error | any) => {
        if (error.response?.status === 401) {
          return toast.error(`${error?.response?.data?.messages} !`)
        }
        opts?.callBackOnError?.()
      }
    }
  })
}
