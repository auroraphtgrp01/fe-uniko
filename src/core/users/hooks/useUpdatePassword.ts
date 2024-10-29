import { userRoutes } from '@/api/user'
import { ICommonInformationForm, ICredentialInformationForm } from '@/core/users/models/user.interface'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import toast from 'react-hot-toast'

export const useUpdatePassword = () => {
  return useMutationCustom<ICredentialInformationForm, any>({
    pathUrl: userRoutes.updatePassword,
    method: 'patch',
    mutateOption: {
      onError: (error: Error | any) => {
        return toast.error('Current password is incorrect')
      },
      onSuccess: (res) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          toast.success('Update password successfully')
        }
      }
    }
  })
}
