import { IUseQueryHookOptions } from '@/types/query.interface'
import { useCreateExpenditureFund } from './useCreateExpenditureFund'
import { useGetAdvancedExpenditureFund } from './useQueryAdvancedExpenditureFund'
import { useUpdateExpenditureFund } from './useUpdateExpenditureFund'

export const useExpenditureFund = (opts?: IUseQueryHookOptions) => {
  const { mutate: createExpenditureFund, status: statusCreate } = useCreateExpenditureFund(opts)
  const { mutate: updateExpenditureFund, status: statusUpdate } = useUpdateExpenditureFund(opts)
  return {
    createExpenditureFund,
    statusCreate,
    updateExpenditureFund,
    statusUpdate,
    getAdvancedExpenditureFund: useGetAdvancedExpenditureFund
  }
}
