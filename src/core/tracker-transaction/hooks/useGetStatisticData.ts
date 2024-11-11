import { useModelQuery } from '@/hooks/useQueryModel'
import { trackerTransactionRoutes } from '../configs'
import { IStatisticDataResponse } from '../models/tracker-transaction.interface'
import { STATISTIC_TRACKER_TRANSACTION_KEY, TRACKER_TRANSACTION_MODEL_RETRY } from '../constants'
import { IDynamicType } from '@/types/common.i'

export const useGetStatisticData = (query: IDynamicType, fundId: string) => {
  const {
    isPending: isGetting,
    data: statisticData,
    refetch: refetchStatistic
  } = useModelQuery<IStatisticDataResponse>(STATISTIC_TRACKER_TRANSACTION_KEY, trackerTransactionRoutes.statistics, {
    query,
    enable: !!fundId,
    retry: TRACKER_TRANSACTION_MODEL_RETRY,
    params: {
      fundId
    }
  })
  return {
    isGetting,
    statisticData,
    refetchStatistic
  }
}
