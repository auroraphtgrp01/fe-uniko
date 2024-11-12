import { useModelQuery } from '@/hooks/useQueryModel'
import { IUseGetAdvancedProps } from '@/types/query.interface'
import { IAdvancedTrackerTransactionResponse } from '../models/tracker-transaction.interface'
import { GET_ADVANCED_TRACKER_TRANSACTION_KEY, TRACKER_TRANSACTION_MODEL_RETRY } from '../constants'
import { trackerTransactionRoutes } from '../configs'

export const useGetAdvancedTrackerTransaction = (props: IUseGetAdvancedProps) => {
  const {
    isPending: isGetAdvancedPending,
    data: advancedTrackerTxData,
    refetch: refetchGetAdvancedTrackerTransaction
  } = useModelQuery<IAdvancedTrackerTransactionResponse>(
    GET_ADVANCED_TRACKER_TRANSACTION_KEY,
    trackerTransactionRoutes.getAdvanced,
    {
      query: props.query,
      condition: props.fundId,
      enable: !!props.fundId,
      retry: TRACKER_TRANSACTION_MODEL_RETRY,
      params: {
        fundId: props.fundId
      }
    }
  )
  return {
    isGetAdvancedPending,
    advancedTrackerTxData,
    refetchGetAdvancedTrackerTransaction
  }
}
