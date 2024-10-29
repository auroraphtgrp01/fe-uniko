'use client'
import { useAuth } from '@/core/auth/hooks'
import { useGoogleOneTapLogin } from '@react-oauth/google'

export default function GoogleOneTap() {
  const { signInGoogle } = useAuth()
  useGoogleOneTapLogin({
    auto_select: true,
    onSuccess: (response) => {
      signInGoogle({
        credential: response.credential
      })
      console.log('Google response:', response)
    },
    onError: () => {
      console.error('Login Failed')
    },
    promptMomentNotification: (notification) => {
      if (notification.isDisplayMoment()) {
      }
    }
  })

  return <div className='bg-transparent'></div>
}