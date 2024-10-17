import { apiService } from '@/api'
import { USER_MODEL_KEY, USER_RETRY } from '@/core/users/constants'
import { useModelQuery } from '@/hooks/useQueryModel'
import { IUserGetMeResponse } from '@/types/user.i'

const userApi = apiService.user

export const useLogout = (execute: boolean = false) => {
  const { data: userLogoutData } = useModelQuery<IUserGetMeResponse>(USER_MODEL_KEY, userApi.clearCache, {
    enable: execute === true,
    retry: USER_RETRY
  })
  return { userLogoutData }
}
