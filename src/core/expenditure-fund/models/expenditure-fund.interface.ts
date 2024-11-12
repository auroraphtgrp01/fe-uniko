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
  description?: string
}

export interface IUpdateExpenditureFundBody extends ICreateExpenditureFundBody {
  status: EFundStatus
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

export interface IExpenditureFundDataFormat {
  id: string
  name: string
  description: string
  status: JSX.Element
  currentAmount: string
  currency: string
  owner: string
}

export interface IExpenditureFundDialogProps {
  commonDialogState: {
    isDialogOpen: IExpenditureFundDialogOpen
    setIsDialogOpen: React.Dispatch<React.SetStateAction<IExpenditureFundDialogOpen>>
  }
  createDialog: {
    handleCreate: (data: ICreateExpenditureFundBody) => void
    status: 'error' | 'idle' | 'pending' | 'success'
  }
  detailUpdateDialog: {
    handleUpdate: (data: IUpdateExpenditureFundBody, setEditing: React.Dispatch<React.SetStateAction<boolean>>) => void
    data: IExpenditureFund
    setDetailData: React.Dispatch<React.SetStateAction<IExpenditureFund>>
    status: 'error' | 'idle' | 'pending' | 'success'
  }
}

export interface IUpdateExpenditureFundFormProps {
  handleUpdate: (data: IUpdateExpenditureFundBody, setIsEditing: React.Dispatch<React.SetStateAction<boolean>>) => void
  formUpdateRef: RefObject<HTMLFormElement>
  defaultValues: IUpdateExpenditureFundBody
  isEditing: boolean
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
  detailData: IExpenditureFund
}

export interface IHandleCreateExpenditureFundProps {
  data: ICreateExpenditureFundBody
  hookCreate: any
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IExpenditureFundDialogOpen>>
  callBackRefetchAPI: () => void
}

export interface IHandleUpdateExpenditureFundProps extends Omit<IHandleCreateExpenditureFundProps, 'hookCreate'> {
  data: IUpdateExpenditureFundBody
  hookUpdate: any
  setEditing: React.Dispatch<React.SetStateAction<boolean>>
}
