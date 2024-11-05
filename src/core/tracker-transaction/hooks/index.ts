import { IUseQueryHookOptions } from '@/types/query.interface'
import { useGetStatisticData } from './useGetStatisticData'
import { useGetAdvancedTrackerTransaction } from './useGetAdvancedTrackerTransaction'
import { useClassifyTransaction } from './useClassifyTransaction'
import { useCreateTrackerTransaction } from './useCreateTrackerTransaction'
import { useUpdateTrackerTransaction } from './useUpdateTrackerTransaction'

export const useTrackerTransaction = (opts?: IUseQueryHookOptions) => {
  const { mutate: classifyTransaction, isPending: isClassing } = useClassifyTransaction(opts)
  const { mutate: createTrackerTransaction, isPending: isCreating } = useCreateTrackerTransaction(opts)
  const { mutate: updateTrackerTransaction, status: statusUpdating } = useUpdateTrackerTransaction(opts)
  return {
    classifyTransaction,
    isClassing,
    getStatisticData: useGetStatisticData,
    getAdvancedData: useGetAdvancedTrackerTransaction,
    createTrackerTransaction,
    isCreating,
    updateTrackerTransaction,
    statusUpdating
  }
}
