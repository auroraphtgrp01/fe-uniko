import { getBaseUrl } from '@/libraries/helpers'
import httpService from '@/libraries/http'
import { IUserGetMeResponse } from '@/types/user.i'

const baseUrl = getBaseUrl()

export const userRoutes = {
  getMe: async (): Promise<IUserGetMeResponse> => {
    const { payload } = await httpService.get<IUserGetMeResponse>(`${baseUrl}/users/me`)
    return payload
  }
}
