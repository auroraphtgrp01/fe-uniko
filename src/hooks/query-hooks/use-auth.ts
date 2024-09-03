'use client'

import { ISignInBody, ISignInResponse } from '@/app/sign-in/sign-in.i'
import { apiService } from '@/libraries/api'
import { setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage } from '@/libraries/helpers'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { IUseQueryHookOptions } from '@/hooks/query-hooks/query-hook.i'
import { useRouter } from 'next/navigation'
import { ISignUpBody, ISignUpResponse } from '@/app/sign-up/sign-up.i'

const authServices = apiService.authentication

export const useAuth = (opts?: IUseQueryHookOptions) => {
  const [isRememberMe, setIsRememberMe] = useState(true)
  const router = useRouter()
  const { mutate: signIn, isPending: isSigningIn } = useMutation<ISignInResponse, AxiosError, ISignInBody>({
    mutationFn: authServices.signIn,
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

  const { mutate: signUp, isPending: isSigningUp } = useMutation<ISignUpResponse, AxiosError, ISignUpBody>({
    mutationFn: authServices.signUp,
    onError: (error) => {
      console.log(error)

      if (error.status === 409) {
        return toast.error('Email already exists !')
      }
      toast.error(`Errors: ${(error.response?.data as any)?.messages}`)
      opts?.callBackOnError?.()
    },
    onSuccess: (data) => {
      console.log(data)
      toast.success('Account created successfully!')
      router.push('/sign-in')
    }
  })

  return {
    signIn,
    isSigningIn,
    isRememberMe,
    setIsRememberMe,
    signUp,
    isSigningUp
  }
}
