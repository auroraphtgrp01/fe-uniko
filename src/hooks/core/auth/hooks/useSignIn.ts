'use client'

import { ISignInBody, ISignInResponse } from '@/app/sign-in/sign-in.i'
import { setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage } from '@/libraries/helpers'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { authServices } from '../configs'
import { useMutation } from '@tanstack/react-query'
import { AUTH_RETRY } from '@/hooks/core/auth/constants'
import { IUseQueryHookOptions } from '@/types/query.interface'

export const useSignIn = (isRememberMe: boolean, opts?: IUseQueryHookOptions) => {
  const router = useRouter()
  return useMutation<ISignInResponse, AxiosError, ISignInBody>({
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
      if (isRememberMe) {
        setAccessTokenToLocalStorage(data.data.accessToken)
        setRefreshTokenToLocalStorage(data.data.refreshToken)
      }
      toast.success('Welcome back!')
      router.push('/dashboard')
    }
  })
}
