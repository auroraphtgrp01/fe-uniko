import { IUseQueryHookOptions } from '@/types/query.interface'
import { useRefetchPayment } from './useRefetchPayment'
import { useGetAllPayment } from './useGetPayment'
import { useQueryAdvancedTransaction } from './useQueryTransaction'
import { useGetUnclassifiedTransactions } from './useGetUnclassifiedTransaction'
import { useGetTodayTransactions } from './useGetTodayTransactions'
import { useUpdateTransaction } from './useUpdateTransaction'
import { useDeleteAnTransaction } from './useDeleteAnTransaction'

export const useTransaction = (opts?: IUseQueryHookOptions) => {
  const { status: statusUpdate, mutate: updateTransaction } = useUpdateTransaction(opts)
  const { status: isDeleteOne, mutate: deleteAnTransaction } = useDeleteAnTransaction(opts)
  return {
    getTransactions: useQueryAdvancedTransaction,
    getPayments: useGetAllPayment,
    refetchPayment: useRefetchPayment,
    getUnclassifiedTransactions: useGetUnclassifiedTransactions,
    getTodayTransactions: useGetTodayTransactions,
    updateTransaction,
    statusUpdate,
    deleteAnTransaction,
    isDeleteOne
  }
}
