import { ISignInBody, ISignInResponse } from '@/app/sign-in/sign-in.i'
import { ISignUpBody, ISignUpResponse } from '@/app/sign-up/sign-up.i'
import { getBaseUrl, getHeaders } from '@/libraries/helpers'
import httpService from '@/libraries/http'

const baseUrl = getBaseUrl()

export const authenticationRoutes = {
  signIn: async (body: ISignInBody): Promise<ISignInResponse> => {
    const { payload } = await httpService.post<ISignInBody, ISignInResponse>(`${baseUrl}/auth/login`, body)
    return payload
  },
  logout: async () => {
    // const { payload } = await axios.post<void>(`${baseUrl}/api/auth/logout`, null, {
    //   headers: getHeaders()
    // })
    // return payload
  },
  signUp: async (body: ISignUpBody): Promise<ISignUpResponse> => {
    const { payload } = await httpService.post<ISignUpBody, ISignUpResponse>(`${baseUrl}/auth/register`, body)
    return payload
  }
}
