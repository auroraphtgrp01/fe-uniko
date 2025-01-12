import { useModelQuery } from '@/hooks/useQueryModel'
import { IBaseResponseData, IDynamicType } from '@/types/common.i'
import { IPayloadDataChart } from '@/components/core/charts/DonutChart'
import { GET_STATISTIC_OVERVIEW_PAGE_KEY, OVERVIEW_FUND_MODEL_RETRY } from '../constants'
import { overviewRoutes } from '../configs'
import { IStatisticOverview } from '../models/overview.interface'

export const useGetStatisticOverviewPage = (query: IDynamicType, fundId: string) => {
  const {
    isPending: isGetStatisticOverviewPagePending,
    data: getStatisticOverviewPageData,
    refetch: refetchGetStatisticOverviewPageData
  } = useModelQuery<IBaseResponseData<IStatisticOverview>>(
    GET_STATISTIC_OVERVIEW_PAGE_KEY,
    overviewRoutes.getStatistic,
    {
      query,
      enable: !!fundId,
      params: {
        fundId
      },
      retry: OVERVIEW_FUND_MODEL_RETRY
    }
  )
  return {
    refetchGetStatisticOverviewPageData,
    getStatisticOverviewPageData,
    isGetStatisticOverviewPagePending
  }
}
