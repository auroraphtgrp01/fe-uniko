import { IBaseResponseData, IBaseResponsePagination } from '@/types/common.i'

export type TrackerTransactionTypeResponse = IBaseResponseData<ITrackerTransactionType>
export type IAdvancedTrackerTransactionTypeResponse = IBaseResponseData<ITrackerTransactionType[]>

export interface ITrackerTransactionType {
  id: string
  name: string
  description: string
  ownerIds: string[]
}

export interface ITrackerTransactionTypeBody {
  name: string
  type: string
  description?: string
}
