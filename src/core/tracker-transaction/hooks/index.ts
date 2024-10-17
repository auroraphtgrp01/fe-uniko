import { IUseQueryHookOptions } from '@/types/query.interface'
import { useGetStatisticData } from './useGetStatisticData'
import { useGetAdvancedTrackerTransaction } from './useGetAdvancedTrackerTransaction'
import { useClassifyTransaction } from './useClassifyTransaction'
import { useCreateTrackerTransaction } from './useCreateTrackerTransaction'

export const useTrackerTransaction = (opts?: IUseQueryHookOptions) => {
  const { mutate: classifyTransaction, isPending: isClassing } = useClassifyTransaction(opts)
  const { mutate: createTransaction, isPending: isCreating } = useCreateTrackerTransaction(opts)

  return {
    classifyTransaction,
    isClassing,
    getStatisticData: useGetStatisticData,
    getAdvancedData: useGetAdvancedTrackerTransaction,
    createTransaction,
    isCreating
  }
}
