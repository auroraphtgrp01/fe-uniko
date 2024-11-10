'use client'

import { useCreateAccountSource } from '@/core/account-source/hooks/useCreateAccountSource'
import { useGetAccountSourceById } from '@/core/account-source/hooks/useGetAccountSourceById'
import { useGetAdvancedAccountSource } from '@/core/account-source/hooks/useGetAdvancedAccountSource'
import { useUpdateAccountSource } from '@/core/account-source/hooks/useUpdateAccountSource'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { useGetAllAccountSource } from './useGetAllAccountSource'
import { useDeleteAnAccountSource } from './useDeleteAnAccountSource'
import { useDeleteMultipleAccountSource } from './useDeleteMultipleAccountSource'

export const useAccountSource = (opts?: IUseQueryHookOptions) => {
  const { mutate: createAccountSource, isPending: isCreating } = useCreateAccountSource(opts)
  const { mutate: updateAccountSource, isPending: isUpdating } = useUpdateAccountSource(opts)
  const { mutate: deleteAnAccountSource, isPending: isDeletingOne } = useDeleteAnAccountSource(opts)
  const { mutate: deleteMultipleAccountSource, isPending: isDeletingMultiple } = useDeleteMultipleAccountSource(opts)

  return {
    createAccountSource,
    isCreating,
    updateAccountSource,
    isUpdating,
    useGetAccountSourceById,
    getAdvancedAccountSource: useGetAdvancedAccountSource,
    getAllAccountSource: useGetAllAccountSource,
    deleteAnAccountSource,
    isDeletingOne,
    deleteMultipleAccountSource,
    isDeletingMultiple
  }
}
