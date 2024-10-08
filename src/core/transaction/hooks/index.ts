import { useQueryTransaction } from '@/core/transaction/hooks/useQueryTransaction'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { useRefetchPayment } from './useRefetchPayment'

export const useTransaction = (opts?: IUseQueryHookOptions) => {
  return {
    getTransactions: useQueryTransaction,
    refetchPayment: useRefetchPayment
  }
}
