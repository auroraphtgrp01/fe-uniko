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

export interface IRequestGetAll {
  page: number
  limit: number
  condition?: string
  isExactly?: boolean
  sort?: string
  includePopulate?: boolean
  select?: ISelectFields[]
}

// Interface định dạng các field mà user muốn lấy (select) từ database
export interface ISelectFields {
  key: string
  value: string
}
