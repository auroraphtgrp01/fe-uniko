import { ACCOUNT_SOURCE_MODEL_KEY } from '@/core/account-source/constants'
import { accountSourceRoutes } from '../configs'
import { useModelQuery } from '@/hooks/useQueryModel'

export const useGetAccountSourceById = (id: string) => {
  const { data: getDetailAccountSource, status: isPending } = useModelQuery(
    ACCOUNT_SOURCE_MODEL_KEY,
    accountSourceRoutes.getById,
    {
      condition: id,
      enable: !!id
    }
  )
  return {
    getDetailAccountSource,
    isPending
  }
}
