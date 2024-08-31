import SignInForm from './form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In - UNIKO',
  description: ''
}

export default function page() {
  return (
    <div>
      <SignInForm></SignInForm>
    </div>
  )
}
