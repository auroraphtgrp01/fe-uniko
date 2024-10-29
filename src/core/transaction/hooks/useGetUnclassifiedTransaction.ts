import { transactionRoutes } from '@/api/transaction'
import { GET_UNCLASSIFIED_TRANSACTION_KEY, TRANSACTION_RETRY } from '@/core/transaction/constants'
import { IGetTransactionResponse } from '@/core/transaction/models'
import { useModelQuery } from '@/hooks/useQueryModel'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export const useGetUnclassifiedTransactions = () => {
  const {
    isPending: isGetUnclassifiedTxs,
    data: dataUnclassifiedTxs,
    error
  } = useModelQuery<IGetTransactionResponse>(
    GET_UNCLASSIFIED_TRANSACTION_KEY,
    transactionRoutes.getUnclassifiedTransactions,
    {
      retry: TRANSACTION_RETRY
    }
  )

  useEffect(() => {
    if (error) {
      toast.error('Failed to get unclassified transactions !')
    }
  }, [error])

  return { isGetUnclassifiedTxs, dataUnclassifiedTxs }
}
