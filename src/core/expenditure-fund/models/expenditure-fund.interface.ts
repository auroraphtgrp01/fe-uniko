import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { ITrackerTransactionTypeBody } from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { IUpdateTrackerTransactionBody } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { ICreateTrackerTransactionBody, ITransaction } from '@/core/transaction/models'
import { IBaseResponseData, IDataTableConfig } from '@/types/common.i'
import { IUser } from '@/types/user.i'
import { RefObject } from 'react'

export interface IExpenditureFundDialogOpen {
  isDialogCreateOpen: boolean
  isDialogDetailOpen: boolean
  isDialogUpdateOpen: boolean
  isDialogDeleteOpen: boolean
  isDialogDeleteAllOpen: boolean
  isDialogInviteOpen: boolean
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
  totalAmountIncomingTransaction: number
  totalAmountExpenseTransaction: number
  expenditureFunds: IExpenditureFund[]
  summaryRecentTransactions: ITransaction[]
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

export interface IExpenditureFundParticipant {
  id: string
  role: EParticipantRole
  status: 'PENDING' | 'ACCEPTED'
  user: {
    id: string
    fullName: string
    email: string
    phone_number: string
    avatar: string | null
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
  type: ETypeOfTrackerTransactionType
  trackerType: ICategoryTrackerType
}

export interface IExpenditureFund {
  id: string
  name: string
  description: string
  status: EFundStatus
  currentAmount: number
  // currency: ECurrencyUnit
  owner: { id: string; fullName: string }
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
  inviteParticipantDialog: {
    handleInvite: (data: string[]) => void
    status: 'error' | 'idle' | 'pending' | 'success'
  }
  createUpdateCategory: {
    handleCreateTrackerType: (
      data: ITrackerTransactionTypeBody,
      setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
    ) => void
    handleUpdateTrackerType: (data: ITrackerTransactionTypeBody) => void
  }
}

export interface IDetailExpenditureFundProps {
  detailData: IExpenditureFund
  inviteTabProps: {
    formRef: RefObject<HTMLFormElement>
    handleInvite: (data: string[]) => void
  }
  categoryTabProps: {
    handleUpdate: (data: ITrackerTransactionTypeBody) => void
    handleCreate: (
      data: ITrackerTransactionTypeBody,
      setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
    ) => void
    isEditing: boolean
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
  }
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

export interface IInviteParticipantFormProps {
  handleInvite: (data: string[]) => void
  formInviteRef: RefObject<HTMLFormElement>
}

export type TExpenditureFundActions =
  | 'getExpenditureFund'
  | 'getStatisticExpenditureFund'
  | 'getAllTrackerTransactionType'
