import { useModelQuery } from '@/hooks/useQueryModel'
import { IAdvancedExpenditureFundResponse } from '../models/expenditure-fund.interface'
import { expenditureFundRoutes } from '../configs'
import { EXPENDITURE_FUND_MODEL_RETRY, GET_ADVANCED_EXPENDITURE_FUND_KEY } from '../constants'

export const useGetAllExpenditureFund = () => {
  const {
    isPending: isGetAllPending,
    data: getAllExpenditureFundData,
    refetch: refetchAllExpendingFund
  } = useModelQuery<IAdvancedExpenditureFundResponse>(GET_ADVANCED_EXPENDITURE_FUND_KEY, expenditureFundRoutes.getAll, {
    retry: EXPENDITURE_FUND_MODEL_RETRY
  })
  return {
    isGetAllPending,
    getAllExpenditureFundData,
    refetchAllExpendingFund
  }
}
