'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Logo2 from '@/images/logo-2.png'
import Image from 'next/image'
import { useExpenditureFund } from '@/core/expenditure-fund/hooks'

export default function JoinExpenditureFund({ token }: { token: string }) {
  const { joinExpenditureFund } = useExpenditureFund()
  const { isJoinExpenditureFundPending, joinExpenditureFundData } = joinExpenditureFund({ token })
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
              priority
              style={{ objectFit: 'cover' }}
              className='h-full w-full'
            />
          </div>
        </div>
        <CardContent className='w-full'>
          <h2 className='text-center text-2xl font-bold tracking-tight text-muted-foreground sm:text-3xl'>
            Join the Expenditure Fund
          </h2>
          {isJoinExpenditureFundPending && (
            <p className='mt-2 text-center text-sm text-muted-foreground'>Processing your fund membership request...</p>
          )}
          {joinExpenditureFundData?.statusCode === 200 ? (
            <div>
              <p className='mt-2 text-center text-sm text-muted-foreground'>
                Your membership has been successfully activated. Click the button below to access the fund management
                dashboard.
              </p>
              <Link href={'/dashboard'}>
                <Button className='mt-5 w-full text-center text-sm'>Go to Fund Dashboard</Button>
              </Link>
            </div>
          ) : (
            <p className='mt-2 text-center text-sm text-muted-foreground'>
              Your membership request is pending. Please check your email for the verification link to complete your
              registration.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
