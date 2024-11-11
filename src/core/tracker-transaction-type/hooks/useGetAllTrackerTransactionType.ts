import { useModelQuery } from '@/hooks/useQueryModel'
import {
  GET_ALL_TRACKER_TRANSACTION_TYPE_KEY,
  TRACKER_TRANSACTION_TYPE_MODEL_RETRY
} from '../../tracker-transaction/constants'
import { trackerTransactionTypeRoutes } from '../configs'
import { IAdvancedTrackerTransactionTypeResponse } from '../models/tracker-transaction-type.interface'

export const useGetAllTrackerTransactionType = (fundId: string) => {
  const {
    data: dataTrackerTransactionType,
    status: isGettingTrackerTransactionType,
    refetch: refetchTrackerTransactionType
  } = useModelQuery<IAdvancedTrackerTransactionTypeResponse>(
    GET_ALL_TRACKER_TRANSACTION_TYPE_KEY,
    trackerTransactionTypeRoutes.getAll,
    {
      enable: !!fundId,
      retry: TRACKER_TRANSACTION_TYPE_MODEL_RETRY,
      params: {
        fundId
      }
    }
  )
  return {
    dataTrackerTransactionType,
    isGettingTrackerTransactionType,
    refetchTrackerTransactionType
  }
}
