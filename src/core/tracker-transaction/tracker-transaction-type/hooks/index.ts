import { IUseQueryHookOptions } from '@/types/query.interface'
import { useGetAllTrackerTransactionType } from './useGetAllTrackerTransactionType'

export const useTrackerTransactionType = (opts?: IUseQueryHookOptions) => {
  return {
    getAllTrackerTransactionType: useGetAllTrackerTransactionType
  }
}
