import { IUseQueryHookOptions } from '@/types/query.interface'
import { useCreateTrackerTransaction } from './useCreateTrackerTransaction'
import { useGetStatisticData } from './useGetStatisticData'
import { useGetAdvancedTrackerTransaction } from './useGetAdvancedTrackerTransaction'

export const useTrackerTransaction = (opts?: IUseQueryHookOptions) => {
  const { mutate: createTrackerTransaction, isPending: isCreating } = useCreateTrackerTransaction(opts)

  return {
    createTrackerTransaction,
    isCreating,
    getStatisticData: useGetStatisticData,
    getAdvancedData: useGetAdvancedTrackerTransaction
  }
}
