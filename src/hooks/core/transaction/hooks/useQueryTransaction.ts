import { IGetTransactionResponse } from '@/hooks/core/transaction/models'
import { useModelQuery } from '@/hooks/useQueryModel'
import { apiService } from '@/libraries/api'
import { IUserGetMeResponse } from '@/types/user.i'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

const transactionApi = apiService.transaction

export const useQueryTransaction = () => {
  const {
    isPending: isGetTransaction,
    data: dataTransaction,
    error
  } = useModelQuery<IGetTransactionResponse>('Transaction', transactionApi.getTransactionById)
  useEffect(() => {
    if (error) {
      toast.error('Failed to get transaction !')
    }
  }, [error])

  return { isGetTransaction, dataTransaction }
}
