import { apiService } from '@/api'
import { USER_QUERY_ME, USER_RETRY } from '@/core/users/constants'
import { useModelQuery } from '@/hooks/useQueryModel'
import { useStoreLocal } from '@/hooks/useStoreLocal'
import { setUserInfoToLocalStorage } from '@/libraries/helpers'
import { IUserGetMeResponse } from '@/types/user.i'
import { useEffect } from 'react'

const userApi = apiService.user

export const useGetMeUser = (execute: boolean) => {
  const { setUser } = useStoreLocal()
  const {
    isPending: isGetMeUserPending,
    data: userGetMeData,
    refetch
  } = useModelQuery<IUserGetMeResponse>(USER_QUERY_ME, userApi.getMe, {
    enable: !!execute,
    condition: 'me',
    retry: USER_RETRY
  })

  const executeGetMe = () => {
    refetch()
  }

  useEffect(() => {
    if (!isGetMeUserPending && userGetMeData) {
      setUserInfoToLocalStorage(userGetMeData.data)
      setUser(userGetMeData.data)
    }
  }, [userGetMeData, isGetMeUserPending])

  return { isGetMeUserPending, userGetMeData, executeGetMe }
}
