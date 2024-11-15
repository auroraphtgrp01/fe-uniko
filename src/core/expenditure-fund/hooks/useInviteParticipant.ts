import { accountSourceRoutes } from '@/core/account-source/configs'
import { IAccountSourceBody, IAccountSourceResponse } from '@/core/account-source/models'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { participantRoutes } from '@/api/participant'

export const useInviteParticipantToExpenditureFund = (opts?: IUseQueryHookOptions) => {
  return useMutationCustom<{ fundId: string; userInfoValues: string[] }, any>({
    pathUrl: participantRoutes.inviteParticipantToExpenditureFund,
    mutateOption: {
      onError: (error: AxiosError | any) => {
        if (error.response?.status === 401) {
          return toast.error(`${error?.response?.data?.messages} !`)
        }
        opts?.callBackOnError?.()
      }
    }
  })
}
