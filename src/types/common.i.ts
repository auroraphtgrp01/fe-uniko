export interface IBaseResponseData<T> {
  data: T
  statusCode: number
}

export interface IResponseError {
  timestamp: string
  errorCode: number
  message: string
  details: string[]
}
