import { transactionRoutes } from '@/api/transaction'
import { IGetTransactionResponse } from '@/core/transaction/models'
import { useModelQuery } from '@/hooks/useQueryModel'
import { IDynamicType } from '@/types/common.i'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export const useQueryTransaction = (params: IDynamicType) => {
  const {
    isPending: isGetTransaction,
    data: dataTransaction,
    error
  } = useModelQuery<IGetTransactionResponse>('Transaction', transactionRoutes.getTransactionById, {
    params
  })

  useEffect(() => {
    if (error) {
      toast.error('Failed to get transaction !')
    }
  }, [error])

  return { isGetTransaction, dataTransaction }
}
