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
import { useRouter } from 'next/navigation'
import FormZod from '../../components/core/FormZod'
import { signInFormBody, signInSchema } from '@/core/auth/constants/sign-in.constant'
import { useGoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Spotlight } from '@/components/homepage/Spotlight'

export default function SignInForm() {
  const { signIn, isSigningIn, isRememberMe, setIsRememberMe } = useAuth()
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()
  if (isSigningIn) router.push('/dashboard')
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className='relative flex min-h-screen w-full items-center justify-center overflow-hidden rounded-md bg-black px-4 py-12 pb-[5rem] pt-[5rem] antialiased sm:px-6 md:items-center md:justify-center lg:px-8'
    >
      <div className='fixed inset-0 overflow-hidden'>
        <Spotlight className='left-0 top-40 md:-top-20 md:left-60' fill='white' />

        <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.1),transparent_70%)]' />
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className='absolute h-2 w-2 rounded-full bg-red-500/20'
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      <div
        className='fixed inset-0'
        style={{
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      <div className='relative z-10'>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.2 }}
        >
          <Card className='w-full max-w-md rounded-lg border border-white/10 bg-black/30 shadow-xl backdrop-blur-xl'>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.4 }}
              className='flex items-center justify-center p-4'
            >
              <Link href='/'>
                <div className='flex items-center justify-center'>
                  <Image
                    src={Logo2}
                    alt='Logo'
                    width={300}
                    height={300}
                    priority
                    style={{ objectFit: 'cover' }}
                    className='h-32 w-32'
                  />
                </div>
              </Link>
            </motion.div>

            <CardContent className=''>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.6 }}
              >
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
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
