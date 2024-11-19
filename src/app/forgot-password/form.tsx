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
import { motion } from 'framer-motion'
import { Spotlight } from '@/components/homepage/Spotlight'

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className='relative flex min-h-screen w-full items-center justify-center overflow-hidden rounded-md bg-black px-4 py-12 pb-[5rem] pt-[5rem] antialiased sm:px-6 md:items-center md:justify-center lg:px-8'
    >
      {/* Background effects */}
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

      {/* Main content */}
      <div className='relative z-10'>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.2 }}
        >
          <Card className='w-full max-w-md rounded-lg border border-white/10 bg-black/30 p-2 shadow-xl backdrop-blur-xl'>
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

            <CardContent className='p-5'>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.6 }}
              >
                <h2 className='text-center text-2xl font-bold tracking-tight text-muted-foreground sm:text-3xl'>
                  Forgot Password
                </h2>
                <p className='mt-2 text-center text-sm text-muted-foreground'>
                  Enter your email to reset your password
                </p>
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
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
