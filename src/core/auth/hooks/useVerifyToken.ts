import { useModelQuery } from '@/hooks/useQueryModel'
import { authServices } from '../configs'
import { AUTH_RETRY, AUTH_FEATURE_3 } from '@/core/auth/constants'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import { IUserGetMeResponse } from '@/types/user.i'
import { useRouter } from 'next/navigation'

export const useVerifyToken = () => {
  const router = useRouter()
  const {
    isPending: isVerifyingToken,
    data: verifyTokenData,
    error: verifyTokenError
  } = useModelQuery<IUserGetMeResponse>(AUTH_FEATURE_3, authServices.verifyToken, {
    retry: AUTH_RETRY
  })

  useEffect(() => {
    if (verifyTokenError) {
      const errorMessage = (verifyTokenError as any)?.payload?.message || 'Session expired. Please log in again.'
      toast.error(errorMessage)
      router.push('/sign-in')
    }
  }, [verifyTokenError, verifyTokenData])

  return { isVerifyingToken, verifyTokenData, verifyTokenError }
}
