import { useModelQuery } from '@/hooks/useQueryModel'
import { IUseGetAdvancedProps } from '@/types/query.interface'
import { IAdvancedTrackerTransactionResponse } from '../models/tracker-transaction.interface'
import { TRACKER_TRANSACTION_MODEL_KEY, TRACKER_TRANSACTION_MODEL_RETRY } from '../constants'
import { trackerTransactionRoutes } from '../configs'

export const useGetAdvancedTrackerTransaction = (props: IUseGetAdvancedProps) => {
  const { isPending: isGetAdvancedPending, data: advancedTrackerTxData } =
    useModelQuery<IAdvancedTrackerTransactionResponse>(
      TRACKER_TRANSACTION_MODEL_KEY,
      trackerTransactionRoutes.getAdvanced,
      {
        query: props.query,
        enable: !!props,
        retry: TRACKER_TRANSACTION_MODEL_RETRY
      }
    )
  return {
    isGetAdvancedPending,
    advancedTrackerTxData
  }
}
