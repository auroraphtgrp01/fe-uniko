import { useModelQuery } from '@/hooks/useQueryModel'
import { IGetStatisticExpenditureFundResponse } from '../models/expenditure-fund.interface'
import { expenditureFundRoutes } from '../configs'
import { EXPENDITURE_FUND_MODEL_RETRY, GET_STATISTIC_DETAIL_OF_FUND_KEY } from '../constants'
import { IBaseResponseData } from '@/types/common.i'
import { IPayloadDataChart } from '@/components/core/charts/DonutChart'

export const useGetStatisticDetailOfFund = (fundId: string, dateRange: string) => {
  const {
    isPending: isGetStatisticDetailOfFundPending,
    data: getStatisticDetailOfFundData,
    refetch: refetchGetStatisticDetailOfFund
  } = useModelQuery<IBaseResponseData<IPayloadDataChart[]>>(
    GET_STATISTIC_DETAIL_OF_FUND_KEY,
    expenditureFundRoutes.getStatisticDetailOfFund,
    {
      enable: !!fundId && !!dateRange,
      params: {
        fundId,
        dateRange
      },
      retry: EXPENDITURE_FUND_MODEL_RETRY
    }
  )
  return {
    refetchGetStatisticDetailOfFund,
    getStatisticDetailOfFundData,
    isGetStatisticDetailOfFundPending
  }
}
