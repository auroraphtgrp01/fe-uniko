import VerifyEmailForm from '@/app/verify-email/[token]/form'
import React from 'react'

export default function page({ params }: { params: { token: string } }) {
  return (
    <div>
      <VerifyEmailForm token={params.token} />
    </div>
  )
}
