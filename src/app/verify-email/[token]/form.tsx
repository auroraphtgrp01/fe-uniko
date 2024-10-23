'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Logo2 from '@/images/logo-2.png'
import Image from 'next/image'
import { useAuth } from '@/core/auth/hooks'

export default function VerifyEmailForm({ token }: { token: string }) {
  const { useVerifyEmail } = useAuth()
  const { isVerifyEmailData, isVerifyEmailPending } = useVerifyEmail(token)
  return (
    <div className='relative flex w-full items-center justify-center overflow-hidden rounded-md bg-background px-4 py-12 pb-[5rem] pt-[5rem] antialiased sm:px-6 md:items-center md:justify-center lg:px-8'>
      <Card className='w-full max-w-[50%] rounded-lg bg-background_nav shadow-lg'>
        <div className='flex items-center justify-center p-4'>
          <div className='h-32 w-32'>
            <Image
              src={Logo2}
              alt='Logo'
              width={400}
              height={400}
              layout='responsive'
              objectFit='cover'
              className='h-full w-full'
            />
          </div>
        </div>
        <CardContent className='w-full'>
          <h2 className='text-center text-2xl font-bold tracking-tight text-muted-foreground sm:text-3xl'>
            Welcome to the Uniko Platform
          </h2>
          {isVerifyEmailPending && (
            <p className='mt-2 text-center text-sm text-muted-foreground'>Verifying email address...</p>
          )}
          {isVerifyEmailData?.statusCode === 200 ? (
            <div>
              <p className='mt-2 text-center text-sm text-muted-foreground'>
                Your account is active. Click the button below to go to the dashboard.
              </p>
              <Link href={'/dashboard'}>
                <Button className='mt-5 w-full text-center text-sm'>Go to Dashboard</Button>
              </Link>
            </div>
          ) : (
            <p className='mt-2 text-center text-sm text-muted-foreground'>
              Your account is not active. Please check your email for the verification link.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
