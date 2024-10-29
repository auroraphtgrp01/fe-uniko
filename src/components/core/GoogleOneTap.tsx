import { useGoogleOneTapLogin } from '@react-oauth/google'

export default function GoogleOneTap() {
  useGoogleOneTapLogin({
    onSuccess: (response) => {
      console.log('Google response:', response)
    }
  })
  return <div></div>
}
