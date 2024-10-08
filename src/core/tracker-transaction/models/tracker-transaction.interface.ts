import { IBaseResponseData } from '@/types/common.i'

export interface IDialogTrackerTransaction {
  isDialogCreateOpen: boolean
  isDialogUpdateOpen: boolean
  isDialogClassifyOpen: boolean
}

export interface ITrackerTransaction {
  // id: string
  // name: string
  // type: string
  // initAmount: string
  // accountBank: string
  // currency: string
  // currentAmount: string
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
