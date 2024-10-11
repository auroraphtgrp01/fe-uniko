'use client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { authServices } from '../configs'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { ISignUpBody, ISignUpResponse } from '@/core/auth/models'
import { useMutationCustom } from '@/hooks/useMutationCustom'

export const useSignUp = (opts?: IUseQueryHookOptions) => {
  const router = useRouter()
  return useMutationCustom<ISignUpBody, ISignUpResponse>({
    pathUrl: authServices.signUp,
    mutateOption: {
      onError: (error) => {
        if (error.status === 409) {
          return toast.error('Email already exists !')
        }
        toast.error(`Errors: ${(error.response?.data as any)?.messages}`)
        opts?.callBackOnError?.()
      },
      onSuccess: (data) => {
        toast.success('Account created successfully!')
        router.push('/sign-in')
      }
    }
  })
}
