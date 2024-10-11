import { IUseQueryHookOptions } from '@/types/query.interface'
import { useRefetchPayment } from './useRefetchPayment'
import { useGetAllPayment } from './useGetPayment'

export const useTransaction = (opts?: IUseQueryHookOptions) => {
  return {
    // getTransactions: useQueryTransaction,
    getTransactions: useGetAllPayment,
    refetchPayment: useRefetchPayment
  }
}
