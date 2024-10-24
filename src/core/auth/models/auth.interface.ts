import { IBaseResponseData } from '@/types/common.i'
import { IErrorResponseBase } from '@/types/core.i'
import { IUser } from '@/types/user.i'

export interface ISignInBody {
  email: string
  password: string
}

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

export interface IForgotPasswordBody {
  email: string
}

export interface IResetPasswordDetailBody {
  password: string
  confirmPassword: string
  token: string
}

export type IResetPasswordDetailResponse = IBaseResponseData<{
  message: string
}>
export interface ISignInBody {
  email: string
  password: string
}

export type ISignInResponse = IBaseResponseData<{
  accessToken: string
  refreshToken: string
  user: IUser
}>
