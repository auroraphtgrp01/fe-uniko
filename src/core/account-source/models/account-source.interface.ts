import { IAccountBank } from '@/core/account-bank/models'
import { IBaseResponseData } from '@/types/common.i'

export type IAccountSourceResponse = IBaseResponseData<IAccountSource>
export type IAdvancedAccountSourceResponse = IBaseResponseData<IAccountSource[]>

export interface IAccountSource {
  id: string
  name: string
  type: EAccountSourceType
  initAmount: number
  accountBank: IAccountBank | null
  currency: string
  currentAmount: number
}

export interface IAccountSourceDataFormat {
  id: string
  name: string
  type: any
  initAmount: string
  accountBank: string
  currentAmount: string
  checkType?: string
}

export interface IAccountSourceBody {
  id?: string
  name: string
  accountSourceType: EAccountSourceType
  initAmount: number
  userId?: string
  currentAmount?: number
  accountBankId?: string
  password?: string
  login_id?: string
  type?: string
  accounts?: string[]
  fundId?: string
}

export interface IAccountSourceFormData {
  accountSource: {
    id?: string
    accountSourceName: string
    accountSourceType: EAccountSourceType
    initAmount?: string
  }
  accountBank: (Omit<IAccountBank, 'id'> & { accounts: string[] }) | undefined
}

export enum EAccountSourceType {
  WALLET = 'WALLET',
  BANKING = 'BANKING'
}

export interface IDialogAccountSource {
  isDialogCreateOpen: boolean
  isDialogUpdateOpen: boolean
  isDialogRefetchMoneyOpen: boolean
  isDialogDeleteOpen: boolean
  isDialogDeleteAllOpen: boolean
  isDialogDetailOpen: boolean
}

export interface IAccountBalanceStatistic {
  name: string
  currentAmount: number
}

export type TAccountSourceActions = 'getAllAccountSource' | 'getStatisticAccountBalance'
