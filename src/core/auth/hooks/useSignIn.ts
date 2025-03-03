import { setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage } from '@/libraries/helpers'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { authServices } from '../configs'
import React from 'react'
import { AUTH_RETRY } from '@/core/auth/constants'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { useState } from 'react'
import { useMutationCustom } from '@/hooks/useMutationCustom'
import { useUser } from '@/core/users/hooks'
import { ISignInBody, ISignInResponse } from '@/core/auth/models'
import Cookies from 'js-cookie'
import { ResendToast } from '@/app/resend-email-toast'

export const useSignIn = (isRememberMe: boolean, opts?: IUseQueryHookOptions) => {
  const router = useRouter()
  const [executeGetMe, setExecuteGetMe] = useState<boolean>(false)
  const [countLogin, setCountLogin] = useState<number>(0)
  const params = useSearchParams()
  const redirect = params.get('redirect')
  const redirectUrl = redirect || '/dashboard/tracker-transaction?loggedIn=true'
  const mutation = useMutationCustom<ISignInBody, ISignInResponse>({
    pathUrl: authServices.signIn,
    mutateOption: {
      retry: AUTH_RETRY,
      onSuccess: (data) => {
        setCountLogin(countLogin + 1)
        if (data.data.user.status === 'ACTIVE') {
          Cookies.set('authTokenVerify', data.data.accessToken, {
            path: '/',
            secure: true,
            sameSite: 'lax',
            expires: 1
          })
          setAccessTokenToLocalStorage(data.data.accessToken)
          setRefreshTokenToLocalStorage(data.data.refreshToken)
          if (redirectUrl === '/dashboard/tracker-transaction?loggedIn=true') setExecuteGetMe(true)
          toast.success('Login successfully 🚀 ')
          router.push(redirectUrl)
        }
        if (data.data.user.status === 'UNVERIFY' && countLogin < 0) {
          toast.error('Account is inactive, please contact the administrator !')
        }
      },
      onError: (error, variables) => {
        if (error.status === 400)
          toast.custom(
            React.createElement(ResendToast, {
              title: 'User unverified!',
              description:
                'Your account is inactive. Please check your email and verify email before perform login again.',
              buttonContent: 'Resend verify email',
              email: variables.email
            }),
            { duration: 3000 }
          )
        else if (error.status === 404) toast.error('Account is not exist!', { duration: 3000 })
        else toast.error('Email or password is incorrect, please try again!', { duration: 3000 })

        opts?.callBackOnError?.()
      }
    }
  })

  const { getMe } = useUser()
  getMe(executeGetMe)

  return mutation
}
