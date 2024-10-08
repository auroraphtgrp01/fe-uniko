import { IBaseResponseData } from '@/types/common.i'

export interface IAccountBank {
  id: string
  type: string
  login_id: string
  sessionId: string
  deviceId: string
  userId: string
}

export type IGetAccountBankResponse = IBaseResponseData<IAccountBank[]>
