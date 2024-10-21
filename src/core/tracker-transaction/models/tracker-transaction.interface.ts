import { IChartData, IPayloadDataChart } from '@/components/core/charts/DonutChart'
import { IBaseResponseData } from '@/types/common.i'

export interface IDialogTrackerTransaction {
  isDialogCreateOpen: boolean
  isDialogUpdateOpen: boolean
  isDialogClassifyTransactionOpen: boolean
  isDialogUnclassifiedOpen: boolean
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
  trackerTypeId: string
  type: string
  amount: string
  transactionDate: string
  source: string
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
