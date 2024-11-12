import { useModelQuery } from '@/hooks/useQueryModel'
import { IUseGetAdvancedProps } from '@/types/query.interface'
import { IAdvancedExpenditureFundResponse } from '../models/expenditure-fund.interface'
import { expenditureFundRoutes } from '../configs'
import { EXPENDITURE_FUND_MODEL_RETRY, GET_ADVANCED_EXPENDITURE_FUND_KEY } from '../constants'

export const useGetAdvancedExpenditureFund = (props: IUseGetAdvancedProps) => {
  const {
    isPending: isGetAdvancedPending,
    data: advancedExpenditureFundData,
    refetch: refetchAdvancedExpendingFund
  } = useModelQuery<IAdvancedExpenditureFundResponse>(
    GET_ADVANCED_EXPENDITURE_FUND_KEY,
    expenditureFundRoutes.getAdvanced,
    {
      query: props.query,
      enable: !!props,
      retry: EXPENDITURE_FUND_MODEL_RETRY
    }
  )
  return {
    isGetAdvancedPending,
    advancedExpenditureFundData,
    refetchAdvancedExpendingFund
  }
}
