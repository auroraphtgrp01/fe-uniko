import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/core/auth/hooks'
import { XCircle } from 'lucide-react'
import { useState } from 'react'

export function ResendToast({
  title,
  description,
  buttonContent,
  email
}: {
  title: string
  description: string
  buttonContent: string
  email: string
}) {
  console.log('ResendToast', email)

  // hooks
  const { resendVerifyEmail } = useAuth()
  const { isResendVerifyEmailPending, resendVerifyEmailData } = resendVerifyEmail(email)
  return (
    <div className='w-full max-w-md'>
      <Card className='overflow-hidden rounded-xl bg-white shadow-lg'>
        <CardContent className='p-6'>
          <h2 className='mb-4 text-lg font-medium text-gray-700'>{title}</h2>
          <div className='flex gap-3'>
            <XCircle className='h-6 w-6 flex-shrink-0 text-red-500' />
            <p className='text-gray-700'>{description}</p>
          </div>

          <div className='mt-6'>
            <Button
              className='w-full bg-red-500 text-white hover:bg-red-600'
              // onClick={handleResendEmail}
              // disabled={isResending}
            >
              {buttonContent}
              {/* {isResending ? 'Sending...' : 'Resend verify email'} */}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
