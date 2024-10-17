import { IUseQueryHookOptions } from '@/types/query.interface'
import { useGetAllTrackerTransactionType } from './useGetAllTrackerTransactionType'
import { useCreateTrackerTxType } from './useCreateTrackerTxType'

export const useTrackerTransactionType = (opts?: IUseQueryHookOptions) => {
  const { mutate: createTrackerTxType, isPending: isCreating } = useCreateTrackerTxType(opts)

  return {
    getAllTrackerTransactionType: useGetAllTrackerTransactionType,
    isCreating,
    createTrackerTxType
  }
}
