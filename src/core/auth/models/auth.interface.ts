import { IBaseResponseData } from '@/types/common.i'

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
