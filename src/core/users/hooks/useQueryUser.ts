import { apiService } from '@/api'
import { USER_QUERY_ME, USER_RETRY } from '@/core/users/constants'
import { useModelQuery } from '@/hooks/useQueryModel'
import { useStoreLocal } from '@/hooks/useStoreLocal'
import { setUserInfoToLocalStorage } from '@/libraries/helpers'
import { IUserGetMeResponse } from '@/types/user.i'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const userApi = apiService.user

export const useGetMeUser = (execute: boolean) => {
  const router = useRouter()
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
      if (userGetMeData?.data?.provider !== null && userGetMeData?.data?.isChangeNewPassword)
        router.push('/dashboard/profile?openTab=password')
    }
  }, [userGetMeData, isGetMeUserPending])

  return { isGetMeUserPending, userGetMeData, executeGetMe }
}
