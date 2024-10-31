import { useModelQuery } from '@/hooks/useQueryModel'
import toast from 'react-hot-toast'
import { authServices } from '../configs'
import { AUTH_LOGOUT, AUTH_RETRY } from '@/core/auth/constants'
import { useEffect } from 'react'
import { IUserGetMeResponse } from '@/types/user.i'
import { useRouter } from 'next/navigation'

export const useLogout = (execute: boolean, handleChangeExecute: () => void) => {
  const router = useRouter()
  const {
    isPending: isLogoutLoading,
    data: logoutData,
    error: logoutError
  } = useModelQuery<IUserGetMeResponse>(AUTH_LOGOUT, authServices.logout, {
    enable: !!execute,
    retry: AUTH_RETRY
  })

  useEffect(() => {
    if (logoutError) {
      const errorMessage = (logoutError as any)?.payload?.message || 'An error occurred. Please try again later.!'
      toast.error(errorMessage)
      handleChangeExecute()
    } else if (logoutData) {
      console.log('Logout data exists, removing items from localStorage...')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userInfo')
      toast.success('Logout successful')
      router.push('/')
      handleChangeExecute()
    }
  }, [logoutError, logoutData])

  return { isLogoutLoading, logoutData }
}
