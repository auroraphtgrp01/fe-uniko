import { apiService } from '@/api'
import { USER_MODEL_KEY, USER_RETRY } from '@/core/users/constants'
import { useModelQuery } from '@/hooks/useQueryModel'
import { AUTH_FEATURE_4 } from '../constants'

const authApi = apiService.authentication
export const useResendVerifyEmail = (email: string) => {
  const { isPending: isResendVerifyEmailPending, data: resendVerifyEmailData } = useModelQuery<any>(
    AUTH_FEATURE_4,
    authApi.resendVerifyToken,
    {
      enable: !!email,
      retry: USER_RETRY,
      params: {
        email: email
      }
    }
  )
  return { isResendVerifyEmailPending, resendVerifyEmailData }
}
