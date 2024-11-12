import { useModelQuery } from '@/hooks/useQueryModel'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import { IUserGetMeResponse } from '@/types/user.i'
import { useRouter } from 'next/navigation'
import { expenditureFundRoutes } from '../configs'
import { JOIN_EXPENDITURE_FUND_KEY } from '../constants'

export const useJoinExpenditureFund = ({ token }: { token: string }) => {
  const router = useRouter()
  const {
    isPending: isJoinExpenditureFundPending,
    data: joinExpenditureFundData,
    error: joinExpenditureFundError
  } = useModelQuery<IUserGetMeResponse>(JOIN_EXPENDITURE_FUND_KEY, expenditureFundRoutes.joinExpenditureFund, {
    params: { token }
  })

  useEffect(() => {
    if (joinExpenditureFundData) {
      toast.success('Join expenditure fund successfully')
      router.push('/dashboard/expenditure-fund')
    } else if (joinExpenditureFundError) {
      const errorMessage = (joinExpenditureFundError as any)?.payload?.message || 'Join expenditure fund failed'
      toast.error(errorMessage)
    }
  }, [joinExpenditureFundData, joinExpenditureFundError])

  return { isJoinExpenditureFundPending, joinExpenditureFundData, joinExpenditureFundError }
}
