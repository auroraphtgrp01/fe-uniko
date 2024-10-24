import { IBaseResponseData } from '@/types/common.i'

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
