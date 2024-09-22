import { useQueryTransaction } from '@/core/transaction/hooks/useQueryTransaction'
import { IUseQueryHookOptions } from '@/types/query.interface'

export const useTransaction = (opts?: IUseQueryHookOptions) => {
  return {
    getTransactions: useQueryTransaction
  }
}
