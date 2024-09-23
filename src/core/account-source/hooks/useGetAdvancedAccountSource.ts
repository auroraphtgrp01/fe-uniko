import { accountSourceRoutes } from '@/core/account-source/configs'
import { ACCOUNT_SOURCE_MODEL_KEY, ACCOUNT_SOURCE_RETRY_QUERY } from '@/core/account-source/constants'
import { IAdvancedAccountSourceResponse } from '@/core/account-source/models'
import { useModelQuery } from '@/hooks/useQueryModel'
import { IUseGetAdvancedProps } from '@/types/query.interface'

export const useGetAdvancedAccountSource = (props: IUseGetAdvancedProps) => {
  const { isPending: isGetAdvancedPending, data: getAdvancedData } = useModelQuery<IAdvancedAccountSourceResponse>(
    ACCOUNT_SOURCE_MODEL_KEY,
    accountSourceRoutes.getAdvanced,
    {
      query: props.query,
      enable: !!props,
      retry: ACCOUNT_SOURCE_RETRY_QUERY
    }
  )
  return {
    isGetAdvancedPending,
    getAdvancedData
  }
}
