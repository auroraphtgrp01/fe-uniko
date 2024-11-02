import { apiService } from '@/api'
import { AUTH_LOGOUT } from '@/core/auth/constants'
import { useModelQuery } from '@/hooks/useQueryModel'
import { IUserGetMeResponse } from '@/types/user.i'

const userApi = apiService.user

export const useLogout = (execute: boolean = false) => {
  const { data: userLogoutData } = useModelQuery<IUserGetMeResponse>(AUTH_LOGOUT, userApi.clearCache, {
    enable: !!execute
  })
  return { userLogoutData }
}
