import { IChartData } from '@/components/core/charts/DonutChart'
import { IAccountSource } from '@/core/account-source/models'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import {
  IEditTrackerTypeDialogProps,
  ITrackerTransactionType,
  ITrackerTransactionTypeBody
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import {
  IClassifyTransactionBody,
  IClassifyTransactionFormProps,
  ICreateTrackerTransactionBody,
  IDataTransactionTable,
  IDialogTransaction,
  ITransaction,
  IUpdateTransactionBody
} from '@/core/transaction/models'
import { IBaseResponseData, IDataTableConfig } from '@/types/common.i'

export interface IDialogTrackerTransaction {
  isDialogCreateOpen: boolean
  isDialogUpdateOpen: boolean
  isDialogClassifyTransactionOpen: boolean
  isDialogUnclassifiedOpen: boolean
  isDialogCreateTrackerTxTypeOpen: boolean
  isDialogDetailOpen: boolean
  isDialogDeleteOpen: boolean
  isDialogDeleteAllOpen: boolean
  isDialogDetailTransactionOpen: boolean
}

export interface ITrackerTransaction {
  id: string
  trackerTypeId: string
  reasonName: string
  description: string | null
  userId: string
  transactionId: string | null
  Transaction: ITransaction | null
  TrackerType: {
    id: string
    name: string
    type: string
    description: string | null
    ownerIds: string[]
  }
  time: string
}

export interface IUpdateTrackerTransactionBody {
  id: string
  reasonName: string
  description: string
  trackerTypeId: string
}

export interface ICustomTrackerTransaction {
  id: string
  reasonName: string
  trackerType: string
  type: string
  amount: string
  transactionDate: string
  accountSource: string
  checkType: string
}

export type ITrackerTransactionResponse = IBaseResponseData<ITrackerTransaction>
export type IAdvancedTrackerTransactionResponse = IBaseResponseData<ITrackerTransaction[]>

export interface ITrackerTransactionDataFormat {
  id: string
  transactionName: string
  type: string
  amount: string
  fromAccount: string
  description?: string
  checkType?: string
}

export interface IStatisticData extends IChartData {
  statusCode: number
}
export type IStatisticDataResponse = IBaseResponseData<IStatisticData>

export interface IDateRange {
  startDay?: Date
  endDay?: Date
}

// UnclassifiedTransactionDialog
export interface IUnclassifiedTxDialog {
  columns: any[]
  unclassifiedTxTableData: IDataTransactionTable[]
  tableConfig: IDataTableConfig
  setTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
}
export interface IClassifyTransactionDialog {
  classifyTransaction: any
  handleClassify: (data: IClassifyTransactionBody) => void
}
export interface ICreateTrackerTransactionDialog {
  handleCreate: (data: ICreateTrackerTransactionBody) => void
}

export interface ICreateTrackerTransactionTypeDialog {
  formData: ITrackerTransactionTypeBody
  setFormData: React.Dispatch<React.SetStateAction<ITrackerTransactionTypeBody>>
  createTrackerTransactionType: any
  hookUpdateCache: any
}

export interface ISharedDialogElements {
  incomeTrackerType: ITrackerTransactionType[]
  expenseTrackerType: ITrackerTransactionType[]
  isDialogOpen: IDialogTrackerTransaction
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTrackerTransaction>>
  hookResetCacheStatistic: any
  handleCreateTrackerType: (
    data: ITrackerTransactionTypeBody,
    setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
  ) => void
  handleUpdateTrackerType: (data: ITrackerTransactionTypeBody) => void
  accountSourceData: IAccountSource[]
  typeOfTrackerType: ETypeOfTrackerTransactionType
  setTypeOfTrackerType: React.Dispatch<React.SetStateAction<ETypeOfTrackerTransactionType>>
}

export interface IDetailUpdateTrackerTransactionDialog {
  dataDetail: ITrackerTransaction
  setDataDetail: React.Dispatch<React.SetStateAction<ITrackerTransaction>>
  statusUpdateTrackerTransaction: 'error' | 'success' | 'pending' | 'idle'
  handleUpdateTrackerTransaction: (
    data: IUpdateTrackerTransactionBody,
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
  ) => void
  statusUpdateTransaction: 'error' | 'success' | 'pending' | 'idle'
  handleUpdateTransaction: (
    data: IUpdateTransactionBody,
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
  ) => void
}

export interface ITrackerTransactionDialogProps {
  unclassifiedTxDialog: IUnclassifiedTxDialog
  classifyTransactionDialog: IClassifyTransactionDialog
  createTrackerTransactionDialog: ICreateTrackerTransactionDialog
  sharedDialogElements: ISharedDialogElements
  createTrackerTransactionTypeDialog: ICreateTrackerTransactionTypeDialog
  detailUpdateTrackerTransactionDialog: IDetailUpdateTrackerTransactionDialog
}

export interface IDetailUpdateTransactionDialogProps {
  updateTransactionProps: {
    transaction: ITransaction
    statusUpdateTransaction: 'error' | 'success' | 'pending' | 'idle'
    handleUpdateTransaction: (
      data: IUpdateTransactionBody,
      setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
    ) => void
    isEditing: boolean
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
  }
  updateTrackerTransactionProps?: {
    trackerTransaction: Omit<ITrackerTransaction, 'Transaction'>
    statusUpdateTrackerTransaction: 'error' | 'success' | 'pending' | 'idle'
    handleUpdateTrackerTransaction: (
      data: IUpdateTrackerTransactionBody,
      setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
    ) => void
    isEditing: boolean
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
    editTrackerTransactionTypeProps: {
      incomeTrackerType: ITrackerTransactionType[]
      expenseTrackerType: ITrackerTransactionType[]
      editTrackerTypeDialogProps: Omit<
        IEditTrackerTypeDialogProps,
        'dataArr' | 'type' | 'setType' | 'setOpenEditDialog' | 'openEditDialog'
      >
    }
    typeOfEditTrackerType: ETypeOfTrackerTransactionType
    setTypeOfEditTrackerType: React.Dispatch<React.SetStateAction<ETypeOfTrackerTransactionType>>
    setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>
    openEditDialog: boolean
  }
  commonProps: {
    accountSourceData: IAccountSource[]
  }
  classifyDialogProps?: {
    ClassifyForm: any
    formClassifyRef: React.RefObject<HTMLFormElement>
  }
}

export interface IUpdateTrackerTransactionFormProps extends IClassifyTransactionFormProps {
  currentDirection: ETypeOfTrackerTransactionType
  accountSourceData: IAccountSource[]
}

export type IFundOfUserResponse = IBaseResponseData<IFundOfUser[]>

export interface IFundOfUser {
  id: string
  name: string
  description: string
  status: string
  currentAmount: string
  currency: string
}

export type TTrackerTransactionActions =
  | 'getTransactions'
  | 'getTodayTransactions'
  | 'getUnclassifiedTransactions'
  | 'getAllAccountSource'
  | 'getStatistic'
  | 'getAllTrackerTransactionType'
  | 'getTrackerTransaction'
  | 'getStatisticExpenditureFund'
  | 'getExpenditureFund'
