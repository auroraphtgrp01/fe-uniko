import { ISignInResponse } from '@/app/sign-in/sign-in.i'

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
