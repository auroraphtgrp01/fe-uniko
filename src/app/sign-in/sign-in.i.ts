import { IBaseResponseData } from '@/types/common.i'
import { IUser, IUserGetMeResponse } from '@/types/user.i'

export interface ISignInBody {
  email: string
  password: string
}

export type ISignInResponse = IBaseResponseData<{
  accessToken: string
  refreshToken: string
  user: IUser
}>
