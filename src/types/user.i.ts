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

export enum EUserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  UNVERIFIED = 'UNVERIFIED'
}
