import { getBaseUrl } from '@/libraries/helpers'
import httpService from '@/libraries/http'
import { IAccountSource, IAccountSourceForm } from '@/types/account-source.i'
import { IBaseResponseData, IRequestGetAll, ISelectFields } from '@/types/common.i'

const baseUrl = getBaseUrl()

export const accountSourceRoutes = {
  getAccountSource: async (req: IRequestGetAll): Promise<IBaseResponseData<IAccountSource[]>> => {
    const { page, limit, condition, isExactly, sort, includePopulate, select } = req
    const { payload } = await httpService.get<IBaseResponseData<IAccountSource[]>>(
      `${baseUrl}/account-sources?page=${page}&limit=${limit}${condition ? `&condition=${condition}` : ''}${isExactly ? `&isExactly=${isExactly}` : ''}${sort ? `&sort=${sort}` : ''}${includePopulate ? `&includePopulate=${includePopulate}` : ''}${select && select.length > 0 ? select.map(({ key, value }) => `&${key}=${value}`) : ''}`
    )
    return payload
  },

  createAccountSource: async (data: IAccountSourceForm): Promise<IBaseResponseData<IAccountSource>> => {
    const { payload } = await httpService.post<IAccountSourceForm, IBaseResponseData<IAccountSource>>(
      `${baseUrl}/account-sources`,
      data
    )
    return payload
  },

  getOneAccountSourceById: async (id: string): Promise<IBaseResponseData<IAccountSource>> => {
    const { payload } = await httpService.get<IBaseResponseData<IAccountSource>>(`${baseUrl}/account-sources/${id}`)
    return payload
  },

  updateAccountSource: async (id: string, data: IAccountSourceForm): Promise<IBaseResponseData<IAccountSource>> => {
    const { payload } = await httpService.patch<IAccountSourceForm, IBaseResponseData<IAccountSource>>(
      `${baseUrl}/account-sources/${id}`,
      data
    )
    return payload
  }
}
