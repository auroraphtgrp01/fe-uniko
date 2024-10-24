import { IBaseResponseData } from '@/types/common.i'

export interface IForgotPasswordBody {
  email: string
}

export interface IForgotPasswordDetailBody {
  password: string
  confirmPassword: string
  token: string
}

export type IForgotPasswordDetailResponse = IBaseResponseData<{
  message: string
}>
