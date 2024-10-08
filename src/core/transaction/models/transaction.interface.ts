import { IBaseResponseData } from '@/types/common.i'

export type Transaction = {
  id: string
  direction: string
  transactionId: string
  amount: 10000
  toAccountNo: string | null
  toAccountName: string | null
  toBankName: string | null
  currency: string
  description: string
  accountBankId: string
  ofAccountId: string
  ofAccount: {
    id: string
    accountNo: string
    accountBankId: string
  }
}

export type IGetTransactionResponse = IBaseResponseData<Transaction[]>

export interface IDialogTransaction {
  isDialogDetailOpen: boolean
  isDialogTransactionTodayOpen: boolean
  isDialogUnclassifiedTransactionOpen: boolean
}

export interface ITransaction {}
