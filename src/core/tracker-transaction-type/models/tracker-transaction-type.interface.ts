import { IBaseResponseData, IBaseResponsePagination } from '@/types/common.i'
import { ETypeOfTrackerTransactionType } from './tracker-transaction-type.enum'

export type TrackerTransactionTypeResponse = IBaseResponseData<ITrackerTransactionType>
export type IAdvancedTrackerTransactionTypeResponse = IBaseResponseData<ITrackerTransactionType[]>

export interface ITrackerTransactionType {
  id: string
  name: string
  description: string
  ownerIds: string[]
  type: string
}

export interface ITrackerTransactionTypeBody {
  name: string
  fundId?: string
  type: string
  description?: string | undefined
}

export interface IEditTrackerTypeDialogData extends ITrackerTransactionType {
  value: string
  label: string
}
export interface IEditTrackerTypeDialogProps {
  openEditDialog: boolean
  setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>
  dataArr: IEditTrackerTypeDialogData[]
  typeDefault: ETypeOfTrackerTransactionType
  type: ETypeOfTrackerTransactionType
  setType: React.Dispatch<React.SetStateAction<ETypeOfTrackerTransactionType>>
  onClose?: () => void
  handleCreateTrackerType: (
    data: ITrackerTransactionTypeBody,
    setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
  ) => void
  handleUpdateTrackerType: (data: ITrackerTransactionTypeBody) => void
}
