import { useGetMeUser } from '@/core/users/hooks/useQueryUser'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { useUpdateUser } from './useUpdateUser'
import { useUpdatePassword } from './useUpdatePassword'

export const useUser = () => {
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser()
  const { mutate: updatePassword, isPending: isPasswordUpdating } = useUpdatePassword()
  return {
    getMe: useGetMeUser,
    updateUser,
    isUpdating,
    isPasswordUpdating,
    updatePassword
  }
}
