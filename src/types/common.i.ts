export interface IBaseResponseData<T> {
  data: T
  statusCode: number
  pagination?: IBaseResponsePagination
  timestamp?: string
  messages?: string
}

export interface IBaseResponsePagination {
  totalPage: number
  currentPage: number
  limit: number
  skip: number
}

export interface IResponseError {
  timestamp: string
  errorCode: number
  message: string
  details: string[]
}

export interface IDataTableConfig {
  totalPage: number
  currentPage: number
  limit: number
  types?: string[]
  selectedTypes?: string[]
  isPaginate: boolean
  isVisibleSortType: boolean
  classNameOfScroll?: string
}

export interface IDialogConfig {
  isOpen: boolean
  onClose: () => void
  title: any
  content: any
  className?: string
  description?: any
  footer?: any
}

export interface IDynamicType {
  [key: string]: any
}

export interface IMutateData<TBody> {
  url: string
  body: TBody
  params: IDynamicType
  headers?: Record<string, string>
  method: 'post' | 'put' | 'patch'
}

export interface IEmoji {
  id: string
  name: string
  native: string
  unified: string
  keywords: string[]
  shortcodes: string
}
