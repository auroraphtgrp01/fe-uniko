import { useMutationCustom } from '@/hooks/useMutationCustom'
import toast from 'react-hot-toast'
import { authServices } from '../configs'
import { AUTH_RETRY } from '@/core/auth/constants'
import { useRouter } from 'next/navigation'
import { IResetPasswordDetailBody, IResetPasswordDetailResponse } from '@/core/auth/models'
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
        const errorMessage = (error as any)?.payload?.message || 'An error occurred. Please try again later.!'
        toast.error(errorMessage)
      }
    }
  })

  return mutation
}
