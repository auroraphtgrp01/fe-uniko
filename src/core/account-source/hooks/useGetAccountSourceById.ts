import { GET_ACCOUNT_SOURCE_BY_ID_KEY } from '@/core/account-source/constants'
import { accountSourceRoutes } from '../configs'
import { useModelQuery } from '@/hooks/useQueryModel'

export const useGetAccountSourceById = (id: string) => {
  const { data: getDetailAccountSource, status: isPending } = useModelQuery(
    GET_ACCOUNT_SOURCE_BY_ID_KEY,
    accountSourceRoutes.getById,
    {
      condition: id,
      enable: !!id,
      params: { id }
    }
  )
  return {
    getDetailAccountSource,
    isPending
  }
}
