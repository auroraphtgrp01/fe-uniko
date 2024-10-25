import { apiService } from '@/api'
import { USER_MODEL_KEY, USER_RETRY } from '@/core/users/constants'
import { useModelQuery } from '@/hooks/useQueryModel'
import { useStoreLocal } from '@/hooks/useStoreLocal'
import { setUserInfoToLocalStorage } from '@/libraries/helpers'
import { IUserGetMeResponse } from '@/types/user.i'
import { useEffect } from 'react'

const userApi = apiService.user

export const useGetMeUser = (execute: boolean) => {
  const { setUser } = useStoreLocal()
  const { isPending: isGetMeUserPending, data: userGetMeData } = useModelQuery<IUserGetMeResponse>(
    USER_MODEL_KEY,
    userApi.getMe,
    {
      enable: !!execute,
      condition: 'me',
      retry: USER_RETRY
    }
  )

  useEffect(() => {
    if (!isGetMeUserPending && userGetMeData) {
      setUserInfoToLocalStorage(userGetMeData.data)
      setUser(userGetMeData.data)
    }
  }, [userGetMeData, isGetMeUserPending])

  return { isGetMeUserPending, userGetMeData }
}
