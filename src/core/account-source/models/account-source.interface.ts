import { IBaseResponseData } from '@/types/common.i'

export type IAccountSourceResponse = IBaseResponseData<IAccountSource>
export type IAdvancedAccountSourceResponse = IBaseResponseData<IAccountSource[]>

export interface IAccountSource {
  id: string
  name: String
  type: EAccountSourceType
  initAmount: number
  accountBank: any
  currency: string
  currentAmount: number
}

export interface IAccountSourceDataFormat {
  id: string
  name: String
  type: any
  initAmount: string
  accountBank: string
  currency: string
  currentAmount: string
  checkType?: string
}

export interface IAccountSourceBody {
  id: string
  name?: string
  type?: EAccountSourceType
  initAmount?: number
  currency?: string
  userId?: string
  currentAmount?: number
  accountBankId?: string
}

export interface IAccountSourceDialogFlag {
  isDialogCreateOpen: boolean
  isDialogUpdateOpen: boolean
  isCloseConfirmationDialog: boolean
}

export enum EAccountSourceType {
  WALLET = 'WALLET',
  BANKING = 'BANKING'
}

export interface IDialogAccountSource {
  isDialogCreateOpen: boolean
  isDialogUpdateOpen: boolean
  isCloseConfirmationDialog: boolean
}
