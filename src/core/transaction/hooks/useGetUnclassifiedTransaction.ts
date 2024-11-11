import { transactionRoutes } from '@/api/transaction'
import { GET_UNCLASSIFIED_TRANSACTION_KEY, TRANSACTION_RETRY } from '@/core/transaction/constants'
import { IGetTransactionResponse } from '@/core/transaction/models'
import { useModelQuery } from '@/hooks/useQueryModel'
import { IUseGetAdvancedProps } from '@/types/query.interface'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export const useGetUnclassifiedTransactions = (props: IUseGetAdvancedProps) => {
  const {
    isPending: isGetUnclassifiedTxs,
    data: dataUnclassifiedTxs,
    error,
    refetch: refetchGetUnclassifiedTxs
  } = useModelQuery<IGetTransactionResponse>(
    GET_UNCLASSIFIED_TRANSACTION_KEY,
    transactionRoutes.getUnclassifiedTransactions,
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
      toast.error('Failed to get unclassified transactions !')
    }
  }, [error])

  return { isGetUnclassifiedTxs, dataUnclassifiedTxs, refetchGetUnclassifiedTxs }
}
