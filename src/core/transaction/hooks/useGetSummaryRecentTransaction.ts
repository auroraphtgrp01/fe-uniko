import { transactionRoutes } from '@/api/transaction'
import {
  GET_SUMMARY_RECENT_TRANSACTION_KEY,
  GET_TODAY_TRANSACTION_KEY,
  TRANSACTION_RETRY
} from '@/core/transaction/constants'
import { IGetSummaryRecentTransactionResponse, IGetTransactionResponse } from '@/core/transaction/models'
import { useModelQuery } from '@/hooks/useQueryModel'
import { IUseGetAdvancedProps } from '@/types/query.interface'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export const useGetSummaryRecentTransactions = (props: IUseGetAdvancedProps) => {
  const {
    isPending: isGetSummaryRecentTransactions,
    data: dataSummaryRecentTransactions,
    refetch: refetchGetSummaryRecentTransactions,
    error
  } = useModelQuery<IGetSummaryRecentTransactionResponse>(
    GET_SUMMARY_RECENT_TRANSACTION_KEY,
    transactionRoutes.getSummaryRecentTransactions,
    {
      query: props.query,
      enable: !!props.fundId,
      retry: TRANSACTION_RETRY,
      params: {
        fundId: props.fundId
      }
    }
  )

  useEffect(() => {
    if (error) {
      toast.error('Failed to get summary recent transactions !')
    }
  }, [error])

  return { isGetSummaryRecentTransactions, dataSummaryRecentTransactions, refetchGetSummaryRecentTransactions }
}
