import { useModelQuery } from '@/hooks/useQueryModel'
import { IGetStatisticExpenditureFundResponse } from '../models/expenditure-fund.interface'
import { expenditureFundRoutes } from '../configs'
import { EXPENDITURE_FUND_MODEL_RETRY, GET_STATISTIC_EXPENDITURE_FUND_KEY } from '../constants'

export const useGetStatisticExpenditureFund = () => {
  const {
    isPending: isGetStatisticPending,
    data: getStatisticExpenditureFundData,
    refetch: refetchGetStatisticExpendingFund
  } = useModelQuery<IGetStatisticExpenditureFundResponse>(
    GET_STATISTIC_EXPENDITURE_FUND_KEY,
    expenditureFundRoutes.getStatistic,
    {
      retry: EXPENDITURE_FUND_MODEL_RETRY
    }
  )
  return {
    refetchGetStatisticExpendingFund,
    getStatisticExpenditureFundData,
    isGetStatisticPending
  }
}
