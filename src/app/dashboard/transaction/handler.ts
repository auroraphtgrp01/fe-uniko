import { IAccountBank } from '@/core/account-bank/models'
import { IDataTransactionTable, IGetTransactionResponse } from '@/core/transaction/models'
import { formatCurrency } from '@/libraries/utils'
import toast from 'react-hot-toast'

export const modifyTransactionHandler = (payload: IGetTransactionResponse): IDataTransactionTable[] => {
  return payload.data.map((item) => {
    return {
      transactionId: item.transactionId,
      amount: formatCurrency(item.amount, 'VND', 'vi-VN'),
      direction: item.direction,
      accountBank: item.accountBankId,
      currency: item.currency,
      accountNo: item.ofAccount.accountNo,
      description: item.description
    }
  })
}

export const handleRefetchWithAccountBanks = (accountBanks: IAccountBank[], refetchPayment: any) => {
  for (const item of accountBanks) {
    const { isRefetchPayment } = refetchPayment({ accountBankId: item.id })
    if (!isRefetchPayment) toast.success(`Refetch payment with account ${item.type} success !`)
  }
  toast.success(`Refetch payment success !`)
}
