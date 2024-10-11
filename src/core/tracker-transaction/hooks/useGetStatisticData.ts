import { useModelQuery } from '@/hooks/useQueryModel'
import { trackerTransactionRoutes } from '../configs'
import { IStatisticDataResponse } from '../models/tracker-transaction.interface'
import { TRANSACTION_MODEL_KEY, TRANSACTION_RETRY } from '@/core/transaction/constants'

export const useGetStatisticData = () => {
  const { isPending: isGetting, data: statisticData } = useModelQuery<IStatisticDataResponse>(
    TRANSACTION_MODEL_KEY,
    trackerTransactionRoutes.statistics,
    {
      retry: TRANSACTION_RETRY
    }
  )
  return {
    isGetting,
    statisticData
  }
}
