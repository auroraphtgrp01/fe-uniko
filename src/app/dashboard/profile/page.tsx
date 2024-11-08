import ProfileForm from './form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UNIKO - Profile',
  description: '',
  icons: 'favicon.ico'
}

export default function page() {
  return (
    <div>
      <ProfileForm></ProfileForm>
    </div>
  )
}
