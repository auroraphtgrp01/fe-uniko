import ProfileForm from './form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile',
  description: ''
}

export default function page() {
  return (
    <div>
      <ProfileForm></ProfileForm>
    </div>
  )
}
