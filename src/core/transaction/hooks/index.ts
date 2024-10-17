import { IUseQueryHookOptions } from '@/types/query.interface'
import { useRefetchPayment } from './useRefetchPayment'
import { useGetAllPayment } from './useGetPayment'
import { useQueryTransaction } from './useQueryTransaction'
import { useGetUnclassifiedTransactions } from './useGetUnclassifiedTransaction'

export const useTransaction = (opts?: IUseQueryHookOptions) => {
  return {
    getTransactions: useQueryTransaction,
    getPayments: useGetAllPayment,
    refetchPayment: useRefetchPayment,
    getUnclassifiedTransactions: useGetUnclassifiedTransactions
  }
}
