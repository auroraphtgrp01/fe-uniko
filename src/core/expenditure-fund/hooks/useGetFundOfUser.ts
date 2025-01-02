import { useModelQuery } from '@/hooks/useQueryModel'
import { IUseGetFundProps } from '@/types/query.interface'
import { IFundOfUserResponse } from '../../tracker-transaction/models/tracker-transaction.interface'
import { EXPENDITURE_FUND_MODEL_RETRY, GET_FUND_OF_USER_KEY } from '../constants'
import { expenditureFundRoutes } from '../configs'

export const useGetFundOfUser = () => {
  const { isPending: isGetFundPending, data: fundOfUserData } = useModelQuery<IFundOfUserResponse>(
    GET_FUND_OF_USER_KEY,
    expenditureFundRoutes.getFundOfUser,
    {
      retry: EXPENDITURE_FUND_MODEL_RETRY
    }
  )
  return {
    isGetFundPending,
    fundOfUserData
  }
}
