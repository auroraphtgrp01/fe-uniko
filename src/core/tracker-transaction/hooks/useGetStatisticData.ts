import { useModelQuery } from '@/hooks/useQueryModel'
import { trackerTransactionRoutes } from '../configs'
import { IStatisticDataResponse } from '../models/tracker-transaction.interface'
import { STATISTIC_TRACKER_TRANSACTION_KEY, TRACKER_TRANSACTION_MODEL_RETRY } from '../constants'

export const useGetStatisticData = () => {
  const { isPending: isGetting, data: statisticData } = useModelQuery<IStatisticDataResponse>(
    STATISTIC_TRACKER_TRANSACTION_KEY,
    trackerTransactionRoutes.statistics,
    {
      retry: TRACKER_TRANSACTION_MODEL_RETRY
    }
  )
  return {
    isGetting,
    statisticData
  }
}
