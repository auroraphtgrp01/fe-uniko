import { useModelQuery } from '@/hooks/useQueryModel'
import { IBaseResponseData, IDynamicType } from '@/types/common.i'
import { IPayloadDataChart } from '@/components/core/charts/DonutChart'
import { accountSourceRoutes } from '../configs'
import { ACCOUNT_SOURCE_RETRY_QUERY, GET_ALL_ACCOUNT_SOURCE_KEY, GET_STATISTIC_ACCOUNT_BALANCE_KEY } from '../constants'
import { IAccountBalanceStatistic } from '../models'

export const useGetStatisticAccountBalance = (fundId: string) => {
  const {
    isPending: isGetStatisticAccountBalancePending,
    data: getStatisticAccountBalanceData,
    refetch: refetchGetStatisticAccountBalanceData
  } = useModelQuery<IBaseResponseData<IAccountBalanceStatistic[]>>(
    GET_STATISTIC_ACCOUNT_BALANCE_KEY,
    accountSourceRoutes.getStatisticAccountBalance,
    {
      enable: !!fundId,
      params: {
        fundId
      },
      retry: ACCOUNT_SOURCE_RETRY_QUERY
    }
  )
  return {
    refetchGetStatisticAccountBalanceData,
    getStatisticAccountBalanceData,
    isGetStatisticAccountBalancePending
  }
}
