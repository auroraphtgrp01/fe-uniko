import { useModelQuery } from '@/hooks/useQueryModel'
import toast from 'react-hot-toast'
import { authServices } from '../configs'
import { AUTH_RETRY, AUTH_FEATURE_2 } from '@/core/auth/constants'
import { useEffect } from 'react'
import { IUserGetMeResponse } from '@/types/user.i'

export const useForgotPassword = (props: { email: string; execute: boolean }) => {
  const {
    isPending: isForgotPasswordLoading,
    data: forgotPasswordData,
    error: forgotPasswordError
  } = useModelQuery<IUserGetMeResponse>(AUTH_FEATURE_2, authServices.forgotPassword, {
    enable: !!props.email && !!props.execute,
    params: { email: props.email },
    retry: AUTH_RETRY
  })

  useEffect(() => {
    if (forgotPasswordError) {
      const errorMessage =
        (forgotPasswordError as any)?.payload?.message || 'An error occurred. Please try again later.!'
      toast.error(errorMessage)
    } else if (forgotPasswordData) {
      toast.success('Please check your email for password reset instructions.')
    }
  }, [forgotPasswordError, forgotPasswordData])

  return { isForgotPasswordLoading, forgotPasswordData }
}
