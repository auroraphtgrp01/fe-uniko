import { accountSourceRoutes } from '@/core/account-source/configs'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseGetAdvancedProps, IUseQueryHookOptions } from '@/types/query.interface'
import toast from 'react-hot-toast'

export const useDeleteAnAccountSource = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom({
    pathUrl: accountSourceRoutes.deleteAccountSource,
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
