import { IBaseResponseData } from '@/types/common.i'

export interface IDialogTrackerTransaction {
  isDialogCreateOpen: boolean
  isDialogUpdateOpen: boolean
  isDialogClassifyTransactionOpen: boolean
  isDialogUnclassifiedOpen: boolean
}

export interface ITrackerTransaction {
  id: string
  trackerTypeId: string
  reasonName: string
  description: string | null
  userId: string
  transactionId: string | null
}

export type ITrackerTransactionResponse = IBaseResponseData<ITrackerTransaction>
export type IAdvancedTrackerTransactionResponse = IBaseResponseData<ITrackerTransaction[]>

export interface ITrackerTransactionDataFormat {
  id: string
  transactionName: string
  type: string
  amount: string
  fromAccount: string // tên ví hoăc tên ngân hàng
  description?: string
  checkType?: string
}

export interface ITrackerTransactionBody {
  id?: string
  transactionId?: string
  trackerType: string
  description: string
}

export interface IStatisticData {
  trackerTypeStats: any[]
  trackerAccStats: any[]
  totalSpendingToday: number
  totalIncomeToday: number
  totalExpenseToday: number
}

export type IStatisticDataResponse = IBaseResponseData<IStatisticData>
