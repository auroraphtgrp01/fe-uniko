import { useModelQuery } from '@/hooks/useQueryModel'
import { trackerTransactionRoutes } from '../configs'
import { DateRange, IStatisticDataResponse } from '../models/tracker-transaction.interface'
import { STATISTIC_TRACKER_TRANSACTION_KEY, TRACKER_TRANSACTION_MODEL_RETRY } from '../constants'
import { IDynamicType } from '@/types/common.i'

export const useGetStatisticData = (query: IDynamicType) => {
  const { isPending: isGetting, data: statisticData } = useModelQuery<IStatisticDataResponse>(
    STATISTIC_TRACKER_TRANSACTION_KEY,
    trackerTransactionRoutes.statistics,
    {
      query,
      enable: !!query,
      retry: TRACKER_TRANSACTION_MODEL_RETRY
    }
  )
  return {
    isGetting,
    statisticData
  }
}
