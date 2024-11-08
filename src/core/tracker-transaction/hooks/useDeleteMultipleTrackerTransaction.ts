import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import toast from 'react-hot-toast'
import { trackerTransactionRoutes } from '../configs'

export const useDeleteMultipleTrackerTransaction = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom({
    pathUrl: trackerTransactionRoutes.deleteMultipleTrackerTransaction,
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
