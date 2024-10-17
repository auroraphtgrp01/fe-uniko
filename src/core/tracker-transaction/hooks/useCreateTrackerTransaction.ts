import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { ITrackerTransactionResponse } from '../models/tracker-transaction.interface'
import { trackerTransactionRoutes } from '../configs'
import { ICreateTrackerTransactionFormData } from '@/core/transaction/models'

export const useCreateTrackerTransaction = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom<ICreateTrackerTransactionFormData, ITrackerTransactionResponse>({
    pathUrl: trackerTransactionRoutes.create,
    mutateOption: {
      onError: (error: AxiosError | any) => {
        if (error.response?.status === 401) {
          return toast.error(`${error?.response?.data?.messages} !`)
        }
        opts?.callBackOnError?.()
      }
    }
  })
}
