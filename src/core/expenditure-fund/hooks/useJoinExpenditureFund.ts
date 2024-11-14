import { useModelQuery } from '@/hooks/useQueryModel'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { IUserGetMeResponse } from '@/types/user.i'
import { useRouter, usePathname } from 'next/navigation'
import { expenditureFundRoutes } from '../configs'
import { JOIN_EXPENDITURE_FUND_KEY } from '../constants'
import { useUser } from '@/core/users/hooks'

export const useJoinExpenditureFund = ({ token }: { token: string }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [executeGetMe, setExecuteGetMe] = useState<boolean>(false)

  const {
    isPending: isJoinExpenditureFundPending,
    data: joinExpenditureFundData,
    error: joinExpenditureFundError
  } = useModelQuery<IUserGetMeResponse>(JOIN_EXPENDITURE_FUND_KEY, expenditureFundRoutes.joinExpenditureFund, {
    params: { token }
  })

  useEffect(() => {
    if (joinExpenditureFundData) {
      if (joinExpenditureFundData?.statusCode === 200 || joinExpenditureFundData?.statusCode === 201) {
        toast.success('Join expenditure fund successfully')
        setExecuteGetMe(true)
      }
    } else if (joinExpenditureFundError) {
      if ((joinExpenditureFundError as any)?.payload.error_code === 401) {
        router.push(`/sign-in?redirect=${encodeURIComponent(pathname)}`)
      }
      const errorMessage = (joinExpenditureFundError as any)?.payload?.message || 'Join expenditure fund failed'
      toast.error(errorMessage)
    }
  }, [joinExpenditureFundData, joinExpenditureFundError])

  const { getMe } = useUser()
  getMe(executeGetMe)

  return { isJoinExpenditureFundPending, joinExpenditureFundData, joinExpenditureFundError }
}
