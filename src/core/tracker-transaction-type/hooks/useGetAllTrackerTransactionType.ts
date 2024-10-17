import { useModelQuery } from '@/hooks/useQueryModel'
import {
  TRACKER_TRANSACTION_TYPE_MODEL_KEY,
  TRACKER_TRANSACTION_TYPE_MODEL_RETRY
} from '../../tracker-transaction/constants'
import { trackerTransactionTypeRoutes } from '../configs'
import { IAdvancedTrackerTransactionTypeResponse } from '../models/tracker-transaction-type.interface'

export const useGetAllTrackerTransactionType = () => {
  const { data: dataTrackerTransactionType, status: isGettingTrackerTransactionType } =
    useModelQuery<IAdvancedTrackerTransactionTypeResponse>(
      TRACKER_TRANSACTION_TYPE_MODEL_KEY,
      trackerTransactionTypeRoutes.getAll,
      {
        retry: TRACKER_TRANSACTION_TYPE_MODEL_RETRY
      }
    )
  return {
    dataTrackerTransactionType,
    isGettingTrackerTransactionType
  }
}
