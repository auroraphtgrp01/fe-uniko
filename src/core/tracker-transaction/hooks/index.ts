import { IUseQueryHookOptions } from '@/types/query.interface'
import { useGetStatisticData } from './useGetStatisticData'
import { useGetAdvancedTrackerTransaction } from './useGetAdvancedTrackerTransaction'
import { useClassifyTransaction } from './useClassifyTransaction'
import { useCreateTrackerTransaction } from './useCreateTrackerTransaction'
import { useUpdateTrackerTransaction } from './useUpdateTrackerTransaction'
import { useDeleteAnTrackerTransaction } from './useDeleteAnTrackerTransaction'
import { useDeleteMultipleTrackerTransaction } from './useDeleteMultipleTrackerTransaction'
import { useGetFundOfUser } from '@/core/tracker-transaction/hooks/useGetFundOfUser'

export const useTrackerTransaction = (opts?: IUseQueryHookOptions) => {
  const { mutate: classifyTransaction, isPending: isClassing } = useClassifyTransaction(opts)
  const { mutate: createTrackerTransaction, isPending: isCreating } = useCreateTrackerTransaction(opts)
  const { mutate: updateTrackerTransaction, status: statusUpdating } = useUpdateTrackerTransaction(opts)
  const { mutate: deleteAnTrackerTransaction, isPending: isDeletingTrackerTransaction } =
    useDeleteAnTrackerTransaction(opts)
  const { mutate: deleteMultipleTrackerTransaction, isPending: isDeletingMultipleTrackerTransaction } =
    useDeleteMultipleTrackerTransaction(opts)
  return {
    classifyTransaction,
    isClassing,
    getStatisticData: useGetStatisticData,
    getAdvancedData: useGetAdvancedTrackerTransaction,
    createTrackerTransaction,
    isCreating,
    updateTrackerTransaction,
    statusUpdating,
    deleteAnTrackerTransaction,
    deleteMultipleTrackerTransaction,
    isDeletingTrackerTransaction,
    isDeletingMultipleTrackerTransaction,
    getFundOfUser: useGetFundOfUser
  }
}
