import { IChartData } from '@/components/core/charts/DonutChart'
import { IBaseResponseData } from '@/types/common.i'

export interface IDialogTrackerTransaction {
  isDialogCreateOpen: boolean
  isDialogUpdateOpen: boolean
  isDialogClassifyTransactionOpen: boolean
  isDialogUnclassifiedOpen: boolean
  isDialogCreateTrackerTxTypeOpen: boolean
}

export interface ITrackerTransaction {
  id: string
  trackerTypeId: string
  reasonName: string
  description: string | null
  userId: string
  transactionId: string | null
  Transaction: {
    id: string
    direction: string
    amount: number
    currency: string
    accountSource: {
      id: string
      name: string
      type: string
      currentAmount: number
    }
  }
  TrackerType: {
    id: string
    name: string
    type: string
    description: string
    ownerIds: string[]
  }
  time: string
}

export interface ICustomTrackerTransaction {
  id: string
  reasonName: string
  trackerTypeName: string
  type: string
  amount: string
  transactionDate: string
  accountSourceName: string
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

export interface IClassifyTransactionBody {
  id?: string
  transactionId?: string
  trackerType: string
  description: string
}

export interface IStatisticData extends IChartData {
  statusCode: number
}
export type IStatisticDataResponse = IBaseResponseData<IStatisticData>

export interface IDateRange {
  startDay?: Date
  endDay?: Date
}
