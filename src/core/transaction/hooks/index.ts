import { IUseQueryHookOptions } from '@/types/query.interface'
import { useRefetchPayment } from './useRefetchPayment'
import { useGetAllPayment } from './useGetPayment'
import { useQueryAdvancedTransaction } from './useQueryTransaction'
import { useGetUnclassifiedTransactions } from './useGetUnclassifiedTransaction'
import { useGetTodayTransactions } from './useGetTodayTransactions'
import { useUpdateTransaction } from './useUpdateTransaction'
import { useDeleteAnTransaction } from './useDeleteAnTransaction'
import { useDeleteMultipleTransaction } from './useDeleteMultipleTransaction'
import { useGetSummaryRecentTransactions } from './useGetSummaryRecentTransaction'

export const useTransaction = (opts?: IUseQueryHookOptions) => {
  const { status: statusUpdate, mutate: updateTransaction } = useUpdateTransaction(opts)
  const { status: isDeleteOne, mutate: deleteAnTransaction } = useDeleteAnTransaction(opts)
  const { status: isDeleteMultiple, mutate: deleteMultipleTransaction } = useDeleteMultipleTransaction(opts)
  return {
    getTransactions: useQueryAdvancedTransaction,
    getPayments: useGetAllPayment,
    refetchPayment: useRefetchPayment,
    getUnclassifiedTransactions: useGetUnclassifiedTransactions,
    getTodayTransactions: useGetTodayTransactions,
    getSummaryRecentTransactions: useGetSummaryRecentTransactions,
    updateTransaction,
    statusUpdate,
    deleteAnTransaction,
    isDeleteOne,
    isDeleteMultiple,
    deleteMultipleTransaction
  }
}
