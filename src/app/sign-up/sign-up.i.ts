import { ISignInResponse } from '@/app/sign-in/sign-in.i'
import { IBaseResponseData } from '@/types/common.i'

export interface ISignUpBody {
  email: string
  password: string
  fullName: string
}

export type ISignUpResponse = ISignInResponse
