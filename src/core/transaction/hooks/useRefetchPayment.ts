import { transactionRoutes } from '@/api/transaction'
import { PAYMENT_RETRY, REFETCH_PAYMENT_KEY } from '@/core/transaction/constants'
import { useModelQuery } from '@/hooks/useQueryModel'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export const useRefetchPayment = (id: string) => {
  const {
    status: isRefetchPayment,
    data: dataRefetchPayment,
    error
  } = useModelQuery<{ statusCode: number; data: boolean }>(REFETCH_PAYMENT_KEY, transactionRoutes.refetchPayment, {
    condition: id,
    enable: !!id,
    params: { id },
    retry: PAYMENT_RETRY
  })

  useEffect(() => {
    if (error) {
      toast.error('Failed to refetch payment !')
    }
  }, [error])

  return { isRefetchPayment, dataRefetchPayment }
}
