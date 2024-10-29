'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Icons } from '@/components/ui/icons'
import { Card, CardContent } from '@/components/ui/card'
import { useRef } from 'react'
import Logo2 from '@/images/logo-2.png'
import Image from 'next/image'
import { useAuth } from '@/core/auth/hooks'
import { getAccessTokenFromLocalStorage } from '@/libraries/helpers'
import { useRouter } from 'next/navigation'
import FormZod from '../../components/core/FormZod'
import { signInFormBody, signInSchema } from '@/core/auth/constants/sign-in.constant'
import { useGoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'
export default function SignInForm() {
  const { signIn, isSigningIn, isRememberMe, setIsRememberMe } = useAuth()
  const formRef = useRef<HTMLFormElement>(null)
  const isAuthenticated = getAccessTokenFromLocalStorage()
  const router = useRouter()
  if (isAuthenticated && isSigningIn) router.push('/dashboard')
  const { signInGoogle } = useAuth()
  const loginGoogle = useGoogleLogin({
    onSuccess: (credentialResponse) => {
      signInGoogle({
        access_token: credentialResponse.access_token
      })
    },
    onError: () => {
      toast.error('An error occurred. Please try again later.')
    }
  })
  return (
    <div className='relative flex min-h-screen w-full items-center justify-center overflow-hidden rounded-md bg-background px-4 py-12 pb-[5rem] pt-[5rem] antialiased sm:px-6 md:items-center md:justify-center lg:px-8'>
      <Card className='w-full max-w-md rounded-lg bg-background_nav shadow-lg'>
        <div className='flex items-center justify-center p-4'>
          <div className='h-32 w-32'>
            <Image
              src={Logo2}
              alt='Logo'
              width={500}
              height={500}
              layout='responsive'
              objectFit='cover'
              className='h-full w-full'
            />
          </div>
        </div>
        <CardContent className=''>
          <h2 className='text-center text-2xl font-bold tracking-tight text-muted-foreground sm:text-3xl'>
            Sign in to your account
          </h2>
          <p className='mt-2 text-center text-sm text-muted-foreground'>Open up your own world!</p>

          <FormZod
            classNameForm='mt-5'
            formFieldBody={signInFormBody}
            formSchema={signInSchema}
            onSubmit={(value) => {
              signIn(value)
            }}
            submitRef={formRef}
          />
          <div className='mt-4 flex items-center justify-between'>
            <div className='flex items-center'>
              <Checkbox
                checked={isRememberMe}
                onCheckedChange={(e) => {
                  setIsRememberMe(e as boolean)
                }}
              />
              <Label htmlFor='remember' className='ml-2 text-sm text-muted-foreground'>
                Remember me
              </Label>
            </div>
            <Link href='/forgot-password' className='text-sm font-medium text-muted-foreground'>
              Forgot password?
            </Link>
          </div>
          <Button
            variant='default'
            className='mt-4 w-full text-white'
            onClick={() => formRef.current?.requestSubmit()}
            isLoading={isSigningIn}
          >
            Sign in
          </Button>
          <div className='relative mt-4'>
            <div className='absolute flex items-center'>
              <span className='w-full border-t border-muted-foreground/30' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='mb-4 mt-2 px-2 text-muted-foreground'>Don&apos;t have an account yet? </span>
            </div>
          </div>
          <div className='mt-2'>
            <Link href={'/sign-up'} className=''>
              <Button variant='secondary' className='w-full' type='button'>
                Sign Up
              </Button>
            </Link>
          </div>
          <div className='relative mt-6'>
            <div className='absolute flex items-center'>
              <span className='w-full border-t border-muted-foreground/30' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='mb-2 px-2 text-muted-foreground'>Or continue with</span>
            </div>
          </div>
          <div className='mt-4 flex flex-col sm:flex-row sm:space-x-2'>
            <Button onClick={() => loginGoogle()} variant='greenPastel1' className='mb-2 me-5 w-full'>
              <Icons.google className='mr-2 h-5 w-5' />
              Sign in with Google
            </Button>
            <Button variant='blueVin' className='w-full'>
              <Icons.gitHub className='mr-2 h-5 w-5' />
              Sign in with GitHub
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
