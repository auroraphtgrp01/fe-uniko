import { useQuery } from '@tanstack/react-query'
import { accountSourceServices } from '../configs'

export const useGetAccountSourceById = (id: string) => {
  const { data: getDetailAccountSource, status: isPending } = useQuery({
    queryKey: ['account source', id],
    queryFn: () => accountSourceServices.getOneAccountSourceById(id),
    enabled: !!id,
    retry: 2,
    retryDelay: 1000
  })
  return {
    getDetailAccountSource,
    isPending
  }
}
