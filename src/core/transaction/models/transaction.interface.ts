import { IBaseResponseData } from '@/types/common.i'

export type Transaction = {
  id: string
  direction: string
  transactionId: string
  amount: number
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
  time: string
  trackerTransactionId: string
}

export type IGetTransactionResponse = IBaseResponseData<Transaction[]>

export interface IDialogTransaction {
  isDialogDetailOpen: boolean
  isDialogTransactionTodayOpen: boolean
  isDialogUnclassifiedTransactionOpen: boolean
  isDialogClassifyTransactionOpen: boolean
  isDialogCreateTrackerTxTypeOpen: boolean
}

export interface IDataTransactionTable {
  id: string
  transactionId: string
  amount: string
  direction: string
  accountBank: string | null
  currency: string
  accountNo: string | null
  description: string
  time: string
  trackerTransactionId: string
}

export interface IClassifyTransactionFormData {
  transactionId?: string
  trackerTypeId: string
  reasonName: string
  description: string
}

export interface ICreateTrackerTransactionFormData {
  trackerTypeId: string
  reasonName: string
  description?: string
  direction: string
  amount?: number
  accountSourceId: string
}
