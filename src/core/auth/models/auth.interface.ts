import { IBaseResponseData } from '@/types/common.i'
import { IErrorResponseBase } from '@/types/core.i'

export interface ISignInBody {
  email: string
  password: string
}

export type ISignInResponse = IBaseResponseData<{
  accessToken: string
  refreshToken: string
}>

export interface ISignUpBody {
  email: string
  password: string
  fullName: string
}

export type ISignUpResponse = ISignInResponse & {
  user: {
    email: string
  }
}

export type IVerifyEmailResponse = IBaseResponseData<any> & IErrorResponseBase
