import React from 'react'
import ResetPasswordForm from './form'

export default function page({ params }: { params: { token: string } }) {
  return (
    <div>
      <ResetPasswordForm params={params} />
    </div>
  )
}
