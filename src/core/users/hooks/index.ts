import { useGetMeUser } from '@/core/users/hooks/useQueryUser'
import { IUseQueryHookOptions } from '@/types/query.interface'

export const useUser = (opts?: IUseQueryHookOptions) => {
  return {
    getMe: useGetMeUser
  }
}
