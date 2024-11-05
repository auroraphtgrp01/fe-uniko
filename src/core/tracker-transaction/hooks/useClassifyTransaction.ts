import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { ITrackerTransactionResponse } from '../models/tracker-transaction.interface'
import { trackerTransactionRoutes } from '../configs'
import { IClassifyTransactionBody } from '@/core/transaction/models'

export const useClassifyTransaction = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom<IClassifyTransactionBody, ITrackerTransactionResponse>({
    pathUrl: trackerTransactionRoutes.classify,
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
