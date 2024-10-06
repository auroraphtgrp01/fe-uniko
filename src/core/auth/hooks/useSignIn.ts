import { ISignInBody, ISignInResponse } from '@/app/sign-in/sign-in.i'
import {
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
  setUserInfoToLocalStorage
} from '@/libraries/helpers'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { authServices } from '../configs'
import { AUTH_RETRY } from '@/core/auth/constants'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { useEffect, useState } from 'react'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { useUser } from '@/core/users/hooks'

export const useSignIn = (isRememberMe: boolean, opts?: IUseQueryHookOptions) => {
  const router = useRouter()
  const [accessToken, setAccessToken] = useState<string | undefined>()

  const mutation = useMutationCustom<ISignInBody, ISignInResponse>({
    pathUrl: authServices.signIn,
    mutateOption: {
      retry: AUTH_RETRY,
      onSuccess: (data) => {
        setAccessTokenToLocalStorage(data.data.accessToken)
        setRefreshTokenToLocalStorage(data.data.refreshToken)

        setAccessToken(data.data.accessToken)

        toast.success('Login successful - Welcome back!')
        router.push('/dashboard')
      },
      onError: (error) => {
        if (error.response?.status === 401) {
          return toast.error('Invalid email or password!')
        }
        toast.error('An error occurred. Please try again later.')

        opts?.callBackOnError?.()
      }
    }
  })

  const { getMe } = useUser()

  const { userGetMeData, isGetMeUserPending } = getMe(accessToken)

  useEffect(() => {
    if (!isGetMeUserPending && userGetMeData) {
      setUserInfoToLocalStorage(userGetMeData)
      router.push('/dashboard')
    }
  }, [userGetMeData, isGetMeUserPending, router])

  return mutation
}
