import { trackerTransactionTypesRoutes } from '@/api/tracker-transaction-type'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import toast from 'react-hot-toast'

export const useDeleteTrackerType = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom({
    pathUrl: trackerTransactionTypesRoutes.delete,
    method: 'delete',
    mutateOption: {
      onSuccess:(()=>{
        toast.success('Delete Tracker type successfully 🚀 ')
      }),
      onError: (error) => {
        const errorMessage = (error as any)?.payload?.details[0] || (error as any)?.payload?.message || 'Delete failed, please try again!'
        toast.error(errorMessage)
        opts?.callBackOnError?.()
      }
    }
  })
}
