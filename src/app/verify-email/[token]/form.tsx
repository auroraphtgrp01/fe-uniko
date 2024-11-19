'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Logo2 from '@/images/logo-2.png'
import Image from 'next/image'
import { useAuth } from '@/core/auth/hooks'
import { motion } from 'framer-motion'
import { Spotlight } from '@/components/homepage/Spotlight'

export default function VerifyEmailForm({ token }: { token: string }) {
  const { useVerifyEmail } = useAuth()
  const { isVerifyEmailData, isVerifyEmailPending } = useVerifyEmail(token)
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
              <div className='h-32 w-32'>
                <Image
                  src={Logo2}
                  alt='Logo'
                  width={300}
                  height={300}
                  priority
                  style={{ objectFit: 'cover' }}
                  className='h-full w-full'
                />
              </div>
            </motion.div>

            <CardContent>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.6 }}
              >
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
                    <Link href={'/sign-in'}>
                      <Button className='mt-5 w-full text-center text-sm'>Sign-in now</Button>
                    </Link>
                  </div>
                ) : (
                  <p className='mt-2 text-center text-sm text-muted-foreground'>
                    Your account is not active. Please check your email for the verification link.
                  </p>
                )}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
