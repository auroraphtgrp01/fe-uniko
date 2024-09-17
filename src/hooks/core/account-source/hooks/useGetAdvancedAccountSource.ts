import { accountSourceServices } from '@/hooks/core/account-source/configs'
import { IUseGetAdvancedProps } from '@/types/query.interface'
import { useQuery } from '@tanstack/react-query'

export const useGetAdvancedAccountSource = (props: IUseGetAdvancedProps) => {
  const { isPending: isGetAdvancedPending, data: getAdvancedData } = useQuery({
    queryKey: ['account-source', 'advanced', props.params, props.queryCondition],
    queryFn: () => accountSourceServices.getAdvanced(props.params, props.queryCondition),
    enabled: !!props,
    retry: 2,
    retryDelay: 1000
  })
  return {
    isGetAdvancedPending,
    getAdvancedData
  }
}
