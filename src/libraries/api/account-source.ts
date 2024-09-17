import { getBaseUrl } from '@/libraries/helpers'
import httpService from '@/libraries/http'
import { IAccountSource, IAccountSourceBody } from '@/types/account-source.i'
import { IBaseResponseData } from '@/types/common.i'
import { IDynamicType, IQueryOptions } from '@/types/query.interface'

const baseUrl = getBaseUrl()

export const accountSourceRoutes = {
  getAdvanced: async (
    params: IQueryOptions,
    queryCondition?: IDynamicType[]
  ): Promise<IBaseResponseData<IAccountSource[]>> => {
    const { page, limit, condition, isExactly, sort, includePopulate } = params
    const { payload } = await httpService.get<IBaseResponseData<IAccountSource[]>>(
      `${baseUrl}/account-sources?page=${page}&limit=${limit}${condition ? `&condition=${condition}` : ''}${isExactly ? `&isExactly=${isExactly}` : ''}${sort ? `&sort=${sort}` : ''}${includePopulate ? `&includePopulate=${includePopulate}` : ''}${queryCondition && queryCondition.length > 0 ? queryCondition.map(({ key, value }) => `&${key}=${value}`) : ''}`
    )
    return payload
  },

  createAccountSource: async (data: IAccountSourceBody): Promise<IBaseResponseData<IAccountSource>> => {
    const { payload } = await httpService.post<IAccountSourceBody, IBaseResponseData<IAccountSource>>(
      `${baseUrl}/account-sources`,
      data
    )
    return payload
  },

  getOneAccountSourceById: async (id: string): Promise<IBaseResponseData<IAccountSource>> => {
    const { payload } = await httpService.get<IBaseResponseData<IAccountSource>>(`${baseUrl}/account-sources/${id}`)
    return payload
  },

  updateAccountSource: async (data: IAccountSourceBody): Promise<IBaseResponseData<IAccountSource>> => {
    const { payload } = await httpService.patch<IAccountSourceBody, IBaseResponseData<IAccountSource>>(
      `${baseUrl}/account-sources/${data.id}`,
      data
    )
    return payload
  }
}
