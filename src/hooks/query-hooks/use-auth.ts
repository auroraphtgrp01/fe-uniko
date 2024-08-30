'use client'

import { ISignInBody, ISignInResponse } from '@/app/sign-in/sign-in.i'
import { apiService } from '@/libraries/api'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'

export const TOO_MANY_REQUESTS = {
  message: `You have exceeded the number of requests allowed per minute.`,
  description: 'Please try again later.'
}

const authServices = apiService.authentication

export const useAuth = () => {
  const { mutate: signIn, isPending: isSigningIn } = useMutation<ISignInResponse, AxiosError, ISignInBody>({
    mutationFn: authServices.signIn,
    onError: (error) => {
      toast.error('Unauthorized - Invalid email or password')
    },
    onSuccess: (data) => {
      toast.success('Welcome back!')
    }
  })
  return {
    signIn,
    isSigningIn
  }
}
