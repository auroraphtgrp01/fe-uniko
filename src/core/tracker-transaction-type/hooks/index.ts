import { IUseQueryHookOptions } from '@/types/query.interface'
import { useGetAllTrackerTransactionType } from './useGetAllTrackerTransactionType'
import { useCreateTrackerTxType } from './useCreateTrackerTxType'
import { useUpdateTrackerTxType } from './useUpdateTrackerTxType'
import { useDeleteTrackerType } from '@/core/tracker-transaction-type/hooks/useDeleteTrackerType'

export const useTrackerTransactionType = (opts?: IUseQueryHookOptions) => {
  const { mutate: createTrackerTxType, isPending: isCreating } = useCreateTrackerTxType(opts)
  const { mutate: updateTrackerTxType, isPending: isUpdating } = useUpdateTrackerTxType(opts)
  const { status: isDeleteOne, mutate: deleteTrackerType } = useDeleteTrackerType(opts)

  return {
    getAllTrackerTransactionType: useGetAllTrackerTransactionType,
    isCreating,
    createTrackerTxType,
    isUpdating,
    updateTrackerTxType,
    isDeleteOne,
    deleteTrackerType
  }
}
