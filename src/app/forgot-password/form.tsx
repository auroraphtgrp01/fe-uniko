'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Logo2 from '@/images/logo-2.png'
import { useState } from 'react'
import { useAuth } from '@/core/auth/hooks'
export default function ResetPasswordForm() {
  const [formGetTokenData, setFormGetTokenData] = useState({
    email: '',
    execute: false
  })
  const { forgotPassword } = useAuth()
  const { isForgotPasswordLoading } = forgotPassword(formGetTokenData)
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormGetTokenData((prev) => ({ ...prev, execute: true }))
  }

  return (
    <div className='relative flex min-h-screen w-full items-center justify-center overflow-hidden rounded-md bg-background px-4 py-12 pb-[5rem] pt-[5rem] antialiased bg-dot-white/[0.2] sm:px-6 md:items-center md:justify-center lg:px-8'>
      <Card className='w-full max-w-md rounded-lg bg-background_nav shadow-lg'>
        <div className='flex items-center justify-center p-4'>
          <div className='h-32 w-32'>
            <Image
              priority
              src={Logo2}
              alt='Logo'
              width={500}
              height={500}
              style={{ objectFit: 'cover' }}
              className='h-full w-full'
            />
          </div>
        </div>
        <CardContent className=''>
          <h2 className='text-center text-2xl font-bold tracking-tight text-muted-foreground sm:text-3xl'>
            Forgot Password
          </h2>
          <p className='mt-2 text-center text-sm text-muted-foreground'>Enter your email to reset your password</p>
          <form className='space-y-4 sm:space-y-6' onSubmit={handleSubmit}>
            <div className='mt-2'>
              <Label htmlFor='email' className='text-muted-foreground'>
                Email address
              </Label>
              <Input
                id='email'
                autoComplete='email'
                required
                placeholder='name@example.com'
                className='mt-2'
                value={formGetTokenData.email}
                onChange={(event) => setFormGetTokenData((prev) => ({ ...prev, email: event.target.value }))}
              />
            </div>
            <Button
              variant='default'
              className='mt-4 w-full text-white'
              type='submit'
              isLoading={isForgotPasswordLoading && formGetTokenData.execute === true}
            >
              Reset Password
            </Button>
            <div className='relative mt-4'>
              <div className='absolute flex items-center'>
                <span className='w-full border-t border-muted-foreground/30' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='px-2 text-muted-foreground'>Remember your password? </span>
              </div>
            </div>
            <div className='mt-2'>
              <Link href='/sign-in' className=''>
                <Button variant='secondary' className='w-full' type='button'>
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
