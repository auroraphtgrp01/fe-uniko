import { userRoutes } from '@/api/user'
import { ICommonInformationForm } from '@/core/users/models/user.interface'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import toast from 'react-hot-toast'

export const useUpdateUser = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom<ICommonInformationForm, any>({
    pathUrl: userRoutes.updateUser,
    method: 'patch',
    mutateOption: {
      onError: (error: Error | any) => {
        if (error.response?.status === 401) {
          return toast.error(`${error?.response?.data?.messages} !`)
        }
        opts?.callBackOnError?.()
      }
    }
  })
}
