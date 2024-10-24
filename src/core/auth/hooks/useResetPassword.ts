import { useMutationCustom } from '@/hooks/useMutationCustom'
import toast from 'react-hot-toast'
import { authServices } from '../configs'
import { AUTH_RETRY } from '@/core/auth/constants'
import { IForgotPasswordDetailBody, IForgotPasswordDetailResponse } from '@/app/forgot-password/forgot-password.i'

export const useResetPassword = () => {
  const mutation = useMutationCustom<IForgotPasswordDetailBody, IForgotPasswordDetailResponse>({
    pathUrl: authServices.resetPassword,
    method: 'patch',
    mutateOption: {
      retry: AUTH_RETRY,
      onSuccess: (data) => {
        toast.success(data.data.message || 'Password reset successfully.')
      },
      onError: (error) => {
        if (error.response?.status) {
          return toast.error(`${(error.response?.data as { message: string }).message} !`)
        }
        toast.error('An error occurred. Please try again later.')
      }
    }
  })

  return mutation
}
