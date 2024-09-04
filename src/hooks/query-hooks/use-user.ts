'use client'

import { useQuery } from '@tanstack/react-query'
import { apiService } from '@/libraries/api'
import { IUseQueryHookOptions } from '@/hooks/query-hooks/query-hook.i'

const userServices = apiService.user

// eslint-disable-next-line
export const useUser = (opts?: IUseQueryHookOptions) => {
  // eslint-disable-next-line
  const { isPending: isGetMePending, data: getMeData } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: userServices.getMe
  })

  return {
    getMeData: getMeData?.data
  }
}
