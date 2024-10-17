import { useModelQuery } from '@/hooks/useQueryModel'
import { IDynamicType } from '@/types/common.i'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { IGetAccountBankResponse } from '../models'
import { ACCOUNT_BANK_MODEL_KEY, ACCOUNT_BANK_RETRY } from '../constants'
import { accountBanksRoutes } from '@/api/account-bank'

export const useQueryAccountBank = (query: IDynamicType) => {
  const {
    isPending: isGetAccountBank,
    data: dataAccountBank,
    error
  } = useModelQuery<IGetAccountBankResponse>(ACCOUNT_BANK_MODEL_KEY, accountBanksRoutes.getAdvanced, {
    query,
    retry: ACCOUNT_BANK_RETRY
  })

  useEffect(() => {
    if (error) {
      toast.error('Failed to get account bank !')
    }
  }, [error])

  return { isGetAccountBank, dataAccountBank }
}
