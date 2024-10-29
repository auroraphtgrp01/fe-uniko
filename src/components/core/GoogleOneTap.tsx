import { useGoogleOneTapLogin } from '@react-oauth/google'

export default function GoogleOneTap() {
  useGoogleOneTapLogin({
    onSuccess: (response) => {
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
