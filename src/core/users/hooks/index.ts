import { useGetMeUser } from '@/core/users/hooks/useQueryUser'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { useUpdateUser } from './useUpdateUser'

export const useUser = (opts?: IUseQueryHookOptions) => {
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser(opts)
  return {
    getMe: useGetMeUser,
    updateUser,
    isUpdating
  }
}
