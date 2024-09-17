import { ISignInBody, ISignInResponse } from '@/app/sign-in/sign-in.i'
import {
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
  setUserInfoToLocalStorage
} from '@/libraries/helpers'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { authServices } from '../configs'
import { useMutation } from '@tanstack/react-query'
import { AUTH_RETRY } from '@/hooks/core/auth/constants'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { useGetMeUser } from '@/hooks/core/users/hooks/useQueryUser'
import { useEffect, useState } from 'react'

export const useSignIn = (isRememberMe: boolean, opts?: IUseQueryHookOptions) => {
  const router = useRouter()
  const [accessToken, setAccessToken] = useState<string | undefined>()

  const mutation = useMutation<ISignInResponse, AxiosError, ISignInBody>({
    mutationFn: authServices.signIn,
    retry: AUTH_RETRY,
    onError: (error) => {
      if (error.response?.status === 401) {
        return toast.error('Invalid email or password!')
      }
      toast.error('An error occurred. Please try again later.')
      console.log(error)

      opts?.callBackOnError?.()
    },
    onSuccess: (data) => {
      setAccessTokenToLocalStorage(data.data.accessToken)
      setRefreshTokenToLocalStorage(data.data.refreshToken)

      setAccessToken(data.data.accessToken)

      toast.success('Login successful - Welcome back!')
    }
  })

  const { userGetMeData, isGetMeUserPending } = useGetMeUser(accessToken)

  useEffect(() => {
    if (!isGetMeUserPending && userGetMeData) {
      setUserInfoToLocalStorage(userGetMeData)
      router.push('/dashboard')
    }
  }, [userGetMeData, isGetMeUserPending, router])

  return mutation
}
