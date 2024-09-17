import { IGetTransactionResponse } from '@/hooks/core/transaction/models'
import { formatCurrency } from '@/libraries/utils'

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

export interface IDataTransactionTable {
  transactionId: string
  amount: string
  direction: string
  accountBank: string
  currency: string
  accountNo: string
  description: string
}
