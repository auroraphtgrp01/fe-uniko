import { IBaseResponseData } from '@/types/common.i'

export interface IUserFromToken {
  accessToken: string
  refreshToken: string
  user: {
    userId: string
    email: string
    fullName: string
    roleId: string
    status: EUserStatus
  }
}

export interface IUserPayloadForSocket {
  userId: string
  email: string
  fullName: string
  roleId?: string
  status: EUserStatus
}

/* eslint-disable no-unused-vars */
export enum EUserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  UNVERIFIED = 'UNVERIFIED'
}
/* eslint-enable no-unused-vars */
export interface IUser {
  id: string
  profession: string
  fullName: string
  dateOfBirth: string
  gender: string
  username: string
  email: string
  isChangeNewPassword?: boolean
  licenseNumber: string
  experience: string
  workplace: string
  status: string
  phone_number: string
  address: string
  roleId: string
  forgetPasswordToken: string
  refresh_token: string
  emailVerifyToken: string
  avatarUrl: string
  provider?: string
}

export type IUserGetMeResponse = IBaseResponseData<IUser>
