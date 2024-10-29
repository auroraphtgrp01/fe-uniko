import { transactionRoutes } from '@/api/transaction'
import { GET_ADVANCED_TRANSACTION_KEY, TRANSACTION_RETRY } from '@/core/transaction/constants'
import { IGetTransactionResponse } from '@/core/transaction/models'
import { useModelQuery } from '@/hooks/useQueryModel'
import { IDynamicType } from '@/types/common.i'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export const useQueryAdvancedTransaction = (query: IDynamicType) => {
  const {
    isPending: isGetTransaction,
    data: dataTransaction,
    error
  } = useModelQuery<IGetTransactionResponse>(GET_ADVANCED_TRANSACTION_KEY, transactionRoutes.getAdvancedTransaction, {
    query,
    retry: TRANSACTION_RETRY
  })

  useEffect(() => {
    if (error) {
      toast.error('Failed to get transaction !')
    }
  }, [error])

  return { isGetTransaction, dataTransaction }
}
