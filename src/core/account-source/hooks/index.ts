'use client'

import { useCreateAccountSource } from '@/core/account-source/hooks/useCreateAccountSource'
import { useUpdateAccountSource } from '@/core/account-source/hooks/useUpdateAccountSource'
import { IUseQueryHookOptions } from '@/types/query.interface'

export * from './useGetAdvancedAccountSource'

export const useAccountSource = (opts?: IUseQueryHookOptions) => {
  const { mutate: createAccountSource, isPending: isCreating } = useCreateAccountSource(opts)
  const { mutate: updateAccountSource, isPending: isUpdating } = useUpdateAccountSource(opts)

  return {
    createAccountSource,
    isCreating,
    updateAccountSource,
    isUpdating
  }
}
