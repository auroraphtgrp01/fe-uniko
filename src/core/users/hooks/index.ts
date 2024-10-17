import { useGetMeUser } from '@/core/users/hooks/useQueryUser'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { useUpdateUser } from './useUpdateUser'
import { useUpdatePassword } from './useUpdatePassword'
import { useLogout } from './useLogout'

export const useUser = (opts?: IUseQueryHookOptions) => {
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser(opts)
  const { mutate: updatePassword, isPending: isPasswordUpdating } = useUpdatePassword(opts)
  return {
    getMe: useGetMeUser,
    updateUser,
    isUpdating,
    isPasswordUpdating,
    updatePassword,
    logout: useLogout
  }
}
