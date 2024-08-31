import SignUpForm from './form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up - UNIKO',
  description: ''
}

export default function page() {
  return (
    <div>
      <SignUpForm></SignUpForm>
    </div>
  )
}
