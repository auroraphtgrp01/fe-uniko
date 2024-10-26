import { IUseQueryHookOptions } from '@/types/query.interface'
import { useRefetchPayment } from './useRefetchPayment'
import { useGetAllPayment } from './useGetPayment'
import { useQueryAdvancedTransaction } from './useQueryTransaction'
import { useGetUnclassifiedTransactions } from './useGetUnclassifiedTransaction'

export const useTransaction = (opts?: IUseQueryHookOptions) => {
  return {
    getTransactions: useQueryAdvancedTransaction,
    getPayments: useGetAllPayment,
    refetchPayment: useRefetchPayment,
    getUnclassifiedTransactions: useGetUnclassifiedTransactions
  }
}
