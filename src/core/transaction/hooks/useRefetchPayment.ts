import { transactionRoutes } from '@/api/transaction'
import { PAYMENT_MODEL_KEY, PAYMENT_RETRY } from '@/core/transaction/constants'
import { useModelQuery } from '@/hooks/useQueryModel'
import { IBaseResponseData } from '@/types/common.i'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export const useRefetchPayment = (id: string) => {
  const {
    status: isRefetchPayment,
    data: dataRefetchPayment,
    error
  } = useModelQuery<{ statusCode: number; data: boolean }>(PAYMENT_MODEL_KEY, transactionRoutes.refetchPayment, {
    condition: id,
    enable: !!id,
    params: { id }
  })

  useEffect(() => {
    if (error) {
      toast.error('Failed to refetch payment !')
    }
  }, [error])

  return { isRefetchPayment, dataRefetchPayment }
}
