import { IUseQueryHookOptions } from '@/types/query.interface'
import { useCreateTrackerTransaction } from './useCreateTrackerTransaction'

export const useTrackerTransaction = (opts?: IUseQueryHookOptions) => {
  const { mutate: createTrackerTransaction, isPending: isCreating } = useCreateTrackerTransaction(opts)

  return {
    createTrackerTransaction,
    isCreating
  }
}
