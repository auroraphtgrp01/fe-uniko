import { ISignInBody, ISignInResponse } from '@/app/sign-in/sign-in.i'
import { ISignUpBody, ISignUpResponse } from '@/app/sign-up/sign-up.i'
import { getBaseUrl, getHeaders } from '@/libraries/helpers'
import axios from 'axios'

const baseUrl = getBaseUrl()

export const authenticationRoutes = {
  signIn: async (body: ISignInBody): Promise<ISignInResponse> => {
    const { data } = await axios.post<ISignInResponse>(`${baseUrl}/auth/login`, body, {
      headers: getHeaders()
    })
    return data
  },
  logout: async () => {
    const { data } = await axios.post<void>(`${baseUrl}/api/auth/logout`, null, {
      headers: getHeaders()
    })
    return data
  },
  signUp: async (body: ISignUpBody): Promise<ISignUpResponse> => {
    const { data } = await axios.post<ISignUpResponse>(`${baseUrl}/api/auth/register`, body, {
      headers: getHeaders()
    })
    return data
  }
}
