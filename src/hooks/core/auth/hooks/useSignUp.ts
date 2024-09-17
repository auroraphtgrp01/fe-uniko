'use client'
import { ISignUpBody, ISignUpResponse } from '@/app/sign-up/sign-up.i'
import { IUseQueryHookOptions } from '@/hooks/query-hooks/query-hook.i'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { authServices } from '../configs'
import { useMutation } from '@tanstack/react-query'

export const useSignUp = (opts?: IUseQueryHookOptions) => {
  const router = useRouter()
  return useMutation<ISignUpResponse, AxiosError, ISignUpBody>({
    mutationFn: authServices.signUp,
    onError: (error) => {
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
}
