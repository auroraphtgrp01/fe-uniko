import ForgotPasswordDetail from '@/app/forgot-password/[token]/form'
import React from 'react'

export default function page({ params }: { params: { token: string } }) {
  return (
    <div>
      <ForgotPasswordDetail params={params} />
    </div>
  )
}
