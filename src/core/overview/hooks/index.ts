import { IUseQueryHookOptions } from '@/types/query.interface'
import { useGetStatisticOverviewPage } from './useGetStatisticOverviewPage'

export const useOverviewPage = (opts?: IUseQueryHookOptions) => {
  return {
    getStatisticOverviewPage: useGetStatisticOverviewPage
  }
}
