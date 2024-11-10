import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import toast from 'react-hot-toast'
import { ITransaction, IUpdateTransactionBody } from '../models'
import { transactionRoutes } from '../configs'

export const useUpdateTransaction = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom<IUpdateTransactionBody, ITransaction>({
    pathUrl: transactionRoutes.updateTransaction,
    method: 'patch',
    mutateOption: {
      onError: (error: Error | any) => {
        if (error.response?.status === 401) {
          return toast.error(`${error?.response?.data?.messages} !`)
        }
        opts?.callBackOnError?.()
      }
    }
  })
}
