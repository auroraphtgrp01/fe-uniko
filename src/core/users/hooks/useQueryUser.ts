import { apiService } from '@/api'
import { USER_MODEL_KEY, USER_RETRY } from '@/core/users/constants'
import { useModelQuery } from '@/hooks/useQueryModel'
import { IUserGetMeResponse } from '@/types/user.i'

const userApi = apiService.user

export const useGetMeUser = (accessToken: string | undefined) => {
  const { isPending: isGetMeUserPending, data: userGetMeData } = useModelQuery<IUserGetMeResponse>(
    USER_MODEL_KEY,
    userApi.getMe,
    {
      condition: 'me',
      enable: !!accessToken,
      retry: USER_RETRY,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  )
  return { isGetMeUserPending, userGetMeData }
}
