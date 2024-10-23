import { apiService } from '@/api'
import { IVerifyEmailResponse } from '@/core/auth/models'
import { USER_MODEL_KEY, USER_RETRY } from '@/core/users/constants'
import { useModelQuery } from '@/hooks/useQueryModel'

const authApi = apiService.authentication
export const useVerifyEmail = (token: string) => {
  const { isPending: isVerifyEmailPending, data: isVerifyEmailData } = useModelQuery<IVerifyEmailResponse>(
    USER_MODEL_KEY,
    authApi.verifyEmail,
    {
      enable: !!token,
      retry: USER_RETRY,
      params: {
        token: token
      }
    }
  )
  return { isVerifyEmailPending, isVerifyEmailData }
}
