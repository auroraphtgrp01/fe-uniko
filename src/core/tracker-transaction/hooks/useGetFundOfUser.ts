import { useModelQuery } from '@/hooks/useQueryModel'
import { IUseGetFundProps } from '@/types/query.interface'
import { IFundOfUserResponse } from '../models/tracker-transaction.interface'
import { GET_FUND_OF_USER_KEY, TRACKER_TRANSACTION_MODEL_RETRY } from '../constants'
import { trackerTransactionRoutes } from '../configs'

export const useGetFundOfUser = () => {
  const { isPending: isGetFundPending, data: fundOfUserData } = useModelQuery<IFundOfUserResponse>(
    GET_FUND_OF_USER_KEY,
    trackerTransactionRoutes.getFundOfUser,
    {
      retry: TRACKER_TRANSACTION_MODEL_RETRY
    }
  )
  return {
    isGetFundPending,
    fundOfUserData
  }
}
