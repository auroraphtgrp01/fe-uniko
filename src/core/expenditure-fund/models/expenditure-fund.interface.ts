import { ITransaction } from '@/core/transaction/models'
import { IBaseResponseData, IDataTableConfig } from '@/types/common.i'
import { RefObject } from 'react'

export interface IExpenditureFundDialogOpen {
  isDialogCreateOpen: boolean
  isDialogDetailOpen: boolean
  isDialogUpdateOpen: boolean
  isDialogDeleteOpen: boolean
  isDialogDeleteAllOpen: boolean
}

export interface IInitButtonInHeaderProps {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IExpenditureFundDialogOpen>>
}

export interface ICreateExpenditureFundBody {
  name: string
  // currency: ECurrencyUnit
  description?: string
}

export interface IUpdateExpenditureFundBody extends ICreateExpenditureFundBody {
  status: EFundStatus
  id: string
}

export interface ICreateExpenditureFundFormProps {
  handleCreate: (data: ICreateExpenditureFundBody) => void
  formCreateRef: RefObject<HTMLFormElement>
}

export type IExpenditureFundResponse = IBaseResponseData<IExpenditureFund>
export type IAdvancedExpenditureFundResponse = IBaseResponseData<IExpenditureFund[]>
export type IGetStatisticExpenditureFundResponse = IBaseResponseData<IStatisticExpenditureFund>

export interface IStatisticExpenditureFund {
  totalBalanceSummary: number
  expenditureFunds: IExpenditureFund[]
}

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

enum EParticipantRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

interface IExpenditureFundParticipant {
  id: string
  role: EParticipantRole
  user: {
    id: string
    fullName: string
    email: string
    phone_number: string
  }
}

enum ICategoryTrackerType {
  DEFAULT = 'DEFAULT',
  CUSTOM = 'CUSTOM',
  CONTRIBUTE = 'CONTRIBUTE'
}

interface IExpenditureFundCategories {
  id: string
  name: string
  description: string
  trackerType: ICategoryTrackerType
}

export interface IExpenditureFund {
  id: string
  name: string
  description: string
  status: EFundStatus
  currentAmount: number
  // currency: ECurrencyUnit
  ownerName: string
  participants: IExpenditureFundParticipant[]
  categories: IExpenditureFundCategories[]
  time: string
  transactions: ITransaction[]
  countParticipants: number
}

export interface IExpenditureFundDataFormat {
  id: string
  name: string
  description: string
  status: JSX.Element
  currentAmount: string
  // currency: string
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
    handleUpdate: (data: IUpdateExpenditureFundBody) => void
    data: IExpenditureFund
    setDetailData: React.Dispatch<React.SetStateAction<IExpenditureFund>>
    status: 'error' | 'idle' | 'pending' | 'success'
  }
}

export interface IDetailExpenditureFundProps {
  detailData: IExpenditureFund
}

export interface IUpdateExpenditureFundFormProps {
  handleUpdate: (data: IUpdateExpenditureFundBody) => void
  formUpdateRef: RefObject<HTMLFormElement>
  defaultValues: IUpdateExpenditureFundBody
}

export interface IHandleCreateExpenditureFundProps {
  data: ICreateExpenditureFundBody
  hookCreate: any
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IExpenditureFundDialogOpen>>
  callBackRefetchAPI: () => void
  setDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
}

export interface IHandleUpdateExpenditureFundProps extends Omit<IHandleCreateExpenditureFundProps, 'hookCreate'> {
  data: IUpdateExpenditureFundBody
  hookUpdate: any
  setDetailData: React.Dispatch<React.SetStateAction<IExpenditureFund>>
}

export interface IHandleDeleteAnExpenditureFundProps
  extends Omit<IHandleCreateExpenditureFundProps, 'hookCreate' | 'data' | 'setDetailData'> {
  id: string
  hookDelete: any
  setIdDeletes: React.Dispatch<React.SetStateAction<string[]>>
}

export interface IHandleDeleteMultipleExpenditureFundProps extends Omit<IHandleDeleteAnExpenditureFundProps, 'id'> {
  ids: string[]
}
