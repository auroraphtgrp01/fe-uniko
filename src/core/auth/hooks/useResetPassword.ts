import { useMutationCustom } from '@/hooks/useMutationCustom'
import toast from 'react-hot-toast'
import { authServices } from '../configs'
import { AUTH_RETRY } from '@/core/auth/constants'
import { IResetPasswordDetailBody, IResetPasswordDetailResponse } from '@/app/forgot-password/forgot-password.i'
import { useRouter } from 'next/navigation'
export const useResetPassword = () => {
  const router = useRouter()
  const mutation = useMutationCustom<IResetPasswordDetailBody, IResetPasswordDetailResponse>({
    pathUrl: authServices.resetPassword,
    method: 'patch',
    mutateOption: {
      retry: AUTH_RETRY,
      onSuccess: (data) => {
        toast.success(data.data.message || 'Password reset successfully.')
        router.push('/sign-in')
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
