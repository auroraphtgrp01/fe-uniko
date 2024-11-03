import { accountSourceRoutes } from '@/core/account-source/configs'
import { ACCOUNT_SOURCE_RETRY_QUERY, GET_ALL_ACCOUNT_SOURCE_KEY } from '@/core/account-source/constants'
import { IAdvancedAccountSourceResponse } from '@/core/account-source/models'
import { useModelQuery } from '@/hooks/useQueryModel'

export const useGetAllAccountSource = () => {
  const { isPending: isGetAllPending, data: getAllData } = useModelQuery<IAdvancedAccountSourceResponse>(
    GET_ALL_ACCOUNT_SOURCE_KEY,
    accountSourceRoutes.getAdvanced,
    {
      enable: true,
      retry: ACCOUNT_SOURCE_RETRY_QUERY
    }
  )
  return {
    isGetAllPending,
    getAllData
  }
}
