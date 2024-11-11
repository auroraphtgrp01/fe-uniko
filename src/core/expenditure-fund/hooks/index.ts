import { IUseQueryHookOptions } from '@/types/query.interface'
import { useCreateExpenditureFund } from './useCreateExpenditureFund'

export const useExpenditureFund = (opts?: IUseQueryHookOptions) => {
  const { mutate: createExpenditureFund, status: statusCreate } = useCreateExpenditureFund(opts)
  return {
    createExpenditureFund,
    statusCreate
  }
}
