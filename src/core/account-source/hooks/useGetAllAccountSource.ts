import { accountSourceRoutes } from '@/core/account-source/configs'
import { ACCOUNT_SOURCE_RETRY_QUERY, GET_ALL_ACCOUNT_SOURCE_KEY } from '@/core/account-source/constants'
import { IAdvancedAccountSourceResponse } from '@/core/account-source/models'
import { useModelQuery } from '@/hooks/useQueryModel'

export const useGetAllAccountSource = (fundId: string) => {
  const { isPending: isGetAllPending, data: getAllData } = useModelQuery<IAdvancedAccountSourceResponse>(
    GET_ALL_ACCOUNT_SOURCE_KEY,
    accountSourceRoutes.getAll,
    {
      enable: !!fundId,
      retry: ACCOUNT_SOURCE_RETRY_QUERY,
      params: {
        fundId
      }
    }
  )
  return {
    isGetAllPending,
    getAllData
  }
}
