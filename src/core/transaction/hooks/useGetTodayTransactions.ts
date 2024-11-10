import { transactionRoutes } from '@/api/transaction'
import { GET_TODAY_TRANSACTION_KEY, TRANSACTION_RETRY } from '@/core/transaction/constants'
import { IGetTransactionResponse } from '@/core/transaction/models'
import { useModelQuery } from '@/hooks/useQueryModel'
import { IUseGetAdvancedProps } from '@/types/query.interface'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export const useGetTodayTransactions = (props: IUseGetAdvancedProps) => {
  const {
    isPending: isGetTodayTxs,
    data: dataTodayTxs,
    error
  } = useModelQuery<IGetTransactionResponse>(GET_TODAY_TRANSACTION_KEY, transactionRoutes.getTodayTransactions, {
    query: props.query,
    enable: !!props,
    retry: TRANSACTION_RETRY
  })

  useEffect(() => {
    if (error) {
      toast.error('Failed to get today transactions !')
    }
  }, [error])

  return { isGetTodayTxs, dataTodayTxs }
}
