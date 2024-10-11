import { IDynamicType } from '@/types/common.i'

export interface IUseQueryHookOptions {
  callBackOnSuccess?: () => void
  callBackOnError?: () => void
}

export interface IUseGetAdvancedProps {
  query: IQueryOptions
  queryCondition?: IDynamicType[]
}

export interface IQueryOptions {
  page: number
  limit: number
  condition?: string
  isExactly?: boolean
  sort?: string
  includePopulate?: string
}
