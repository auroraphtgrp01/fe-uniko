'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { Card, CardContent } from '@/components/ui/card'
import Logo2 from '@/images/logo-2.png'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/core/auth/hooks'
import { getAccessTokenFromLocalStorage } from '@/libraries/helpers'
import FormZod from '../../components/core/FormZod'
import { signUpFormBody, signUpSchema } from '@/core/auth/constants/sign-up.constant'

export default function SignUpForm() {
  const { signUp, isSigningUp } = useAuth()
  const router = useRouter()
  const isAuthenticated = getAccessTokenFromLocalStorage()
  if (isAuthenticated && isSigningUp) router.push('/dashboard')

  return (
    <div className='relative flex min-h-screen w-full items-center justify-center overflow-hidden rounded-md bg-background px-4 py-12 pb-[5rem] pt-[5rem] antialiased sm:px-6 md:items-center md:justify-center lg:px-8'>
      <Card className='w-full max-w-md rounded-lg bg-background_nav shadow-lg'>
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
        <CardContent>
          <h2 className='text-center text-2xl font-bold tracking-tight text-muted-foreground sm:text-3xl'>
            Create your account
          </h2>
          <p className='mt-2 text-center text-sm text-muted-foreground'>Join us and open up your own world!</p>

          <FormZod
            classNameForm='mt-5'
            formFieldBody={signUpFormBody}
            formSchema={signUpSchema}
            onSubmit={signUp}
            buttonConfig={{
              label: 'Sign Up',
              className: 'w-full mt-4'
            }}
          />
          <div className='relative mt-4'>
            <div className='absolute flex items-center'>
              <span className='w-full border-t border-muted-foreground/30' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='px-2 text-muted-foreground'>Already have an account?</span>
            </div>
          </div>
          <Button variant='secondary' className='mt-4 w-full' type='button' onClick={() => router.push('/sign-in')}>
            <Link href={'/sign-in'}>Sign In</Link>
          </Button>
          <div className='relative mt-4'>
            <div className='absolute flex items-center'>
              <span className='w-full border-t border-muted-foreground/30' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='px-2 text-muted-foreground'>Or continue with</span>
            </div>
          </div>
          <div className='mt-4 flex flex-col sm:flex-row sm:space-x-2'>
            <Button variant='greenPastel1' className='mb-2 me-5 w-full'>
              <Icons.google className='mr-2 h-5 w-5' />
              Sign up with Google
            </Button>
            <Button variant='blueVin' className='w-full'>
              <Icons.gitHub className='mr-2 h-5 w-5' />
              Sign up with GitHub
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
