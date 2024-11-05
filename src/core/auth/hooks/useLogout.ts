import { apiService } from '@/api'
import { AUTH_LOGOUT } from '@/core/auth/constants'
import { useModelQuery } from '@/hooks/useQueryModel'
import { IUserGetMeResponse } from '@/types/user.i'

const authApi = apiService.authentication

export const useLogout = () => {
  const { data: userLogoutData, refetch } = useModelQuery<IUserGetMeResponse>(AUTH_LOGOUT, authApi.logOut, {
    enable: false
  })

  const executeLogout = () => {
    refetch()
  }

  return { userLogoutData, executeLogout }
}
