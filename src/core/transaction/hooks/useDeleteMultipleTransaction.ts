import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import toast from 'react-hot-toast'
import { transactionRoutes } from '../configs'

export const useDeleteMultipleTransaction = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom({
    pathUrl: transactionRoutes.deleteMultipleTransaction,
    method: 'delete',
    mutateOption: {
      onError: (error) => {
        const errorMessage =
          (error as any)?.payload?.details[0] || (error as any)?.payload?.message || 'Delete failed, please try again!'
        toast.error(errorMessage)
        opts?.callBackOnError?.()
      }
    }
  })
}
