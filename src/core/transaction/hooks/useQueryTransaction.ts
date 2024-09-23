import { transactionRoutes } from '@/api/transaction'
import { TRANSACTION_MODEL_KEY, TRANSACTION_RETRY } from '@/core/transaction/constants'
import { IGetTransactionResponse } from '@/core/transaction/models'
import { useModelQuery } from '@/hooks/useQueryModel'
import { IDynamicType } from '@/types/common.i'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export const useQueryTransaction = (query: IDynamicType) => {
  const {
    isPending: isGetTransaction,
    data: dataTransaction,
    error
  } = useModelQuery<IGetTransactionResponse>(TRANSACTION_MODEL_KEY, transactionRoutes.getTransactionById, {
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
