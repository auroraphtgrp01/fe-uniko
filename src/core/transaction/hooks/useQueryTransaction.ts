import { transactionRoutes } from '@/api/transaction'
import { GET_ADVANCED_TRANSACTION_KEY, TRANSACTION_RETRY } from '@/core/transaction/constants'
import { IGetTransactionResponse } from '@/core/transaction/models'
import { useModelQuery } from '@/hooks/useQueryModel'
import { IUseGetAdvancedProps } from '@/types/query.interface'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export const useQueryAdvancedTransaction = (props: IUseGetAdvancedProps) => {
  const {
    isPending: isGetTransaction,
    data: dataTransaction,
    error
  } = useModelQuery<IGetTransactionResponse>(GET_ADVANCED_TRANSACTION_KEY, transactionRoutes.getAdvancedTransaction, {
    query: props.query,
    enable: !!props.fundId,
    retry: TRANSACTION_RETRY,
    params: {
      fundId: props?.fundId
    }
  })

  useEffect(() => {
    if (error) {
      toast.error('Failed to get transaction !')
    }
  }, [error])

  return { isGetTransaction, dataTransaction }
}
