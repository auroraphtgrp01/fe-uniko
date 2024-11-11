import { IBaseResponseData } from '@/types/common.i'
import { RefObject } from 'react'

export interface IExpenditureFundDialogOpen {
  isDialogCreateOpen: boolean
  isDialogDetailUpdateOpen: boolean
  isDialogDeleteOpen: boolean
  isDialogDeleteAllOpen: boolean
}

export interface IInitButtonInHeaderProps {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IExpenditureFundDialogOpen>>
}

export interface ICreateExpenditureFundBody {
  name: string
  currency: 'USD' | 'VND' | 'EUR'
}

export interface ICreateExpenditureFundFormProps {
  handleCreate: (data: ICreateExpenditureFundBody) => void
  formCreateRef: RefObject<HTMLFormElement>
}

export type IExpenditureFundResponse = IBaseResponseData<IExpenditureFund>
export type IAdvancedExpenditureFundResponse = IBaseResponseData<IExpenditureFund[]>

export enum EFundStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  PENDING = 'PENDING'
}

export enum ECurrencyUnit {
  USD = 'USD',
  VND = 'VND',
  EUR = 'EUR'
}

export interface IExpenditureFund {
  id: string
  name: string
  description: string
  status: EFundStatus
  currentAmount: number
  currency: ECurrencyUnit
  ownerName: string
}
