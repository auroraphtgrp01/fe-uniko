import { userRoutes } from '@/api/user'
import { useGetMeUser } from '@/core/users/hooks/useQueryUser'
import { ICommonInformationForm, ICredentialInformationForm } from '@/core/users/models/user.interface'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import toast from 'react-hot-toast'

export const useUpdatePassword = (opts?: IUseQueryHookOptions) => {
  const { executeGetMe, userGetMeData } = useGetMeUser(true)
  return useMutationCustom<ICredentialInformationForm, any>({
    pathUrl: userRoutes.updatePassword,
    method: 'patch',
    mutateOption: {
      onError: (error: Error | any) => {
        toast.error('Current password is incorrect')
      },
      onSuccess: (res) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          toast.success('Update password successfully')
          executeGetMe()
        }
      }
    }
  })
}
