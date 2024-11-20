'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import Logo2 from '@/images/logo-2.png'
import { useAuth } from '@/core/auth/hooks'
export default function ResetPasswordForm({ params }: { params: { token: string } }) {
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const { resetPassword, isResetPassword } = useAuth()
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    resetPassword({ token: params.token, password, confirmPassword })
  }

  return (
    <div className='bg-back relative flex min-h-screen w-full items-center justify-center overflow-hidden rounded-md px-4 py-12 pb-[5rem] pt-[5rem] antialiased bg-dot-white/[0.2] sm:px-6 md:items-center md:justify-center lg:px-8'>
      <Card className='w-full max-w-md rounded-lg bg-background_nav shadow-lg'>
        <div className='flex items-center justify-center p-4'>
          <div className='h-32 w-32'>
            <Image
              src={Logo2}
              alt='Logo'
              width={128}
              priority
              height={128}
              style={{ objectFit: 'cover' }}
              className='h-full w-full'
            />
          </div>
        </div>
        <CardContent className=''>
          <h2 className='text-center text-2xl font-bold tracking-tight text-muted-foreground sm:text-3xl'>
            Change Password
          </h2>
          <p className='mt-2 text-center text-sm text-muted-foreground'>Enter your new password below</p>
          <form className='mt-2 space-y-4 sm:space-y-6' onSubmit={handleSubmit}>
            <div>
              <Label htmlFor='password' className='text-muted-foreground'>
                New Password
              </Label>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder='••••••••'
                  className='mt-2 pr-10'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 mt-2 flex items-center pr-3'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className='h-5 w-5 text-gray-400' />
                  ) : (
                    <EyeIcon className='h-5 w-5 text-gray-400' />
                  )}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor='confirmPassword' className='text-muted-foreground'>
                Confirm New Password
              </Label>
              <div className='relative'>
                <Input
                  id='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder='••••••••'
                  className='mt-2 pr-10'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 mt-2 flex items-center pr-3'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className='h-5 w-5 text-gray-400' />
                  ) : (
                    <EyeIcon className='h-5 w-5 text-gray-400' />
                  )}
                </button>
              </div>
            </div>
            {error && <p className='text-sm text-red-500'>{error}</p>}
            <Button variant='default' className='mt-4 w-full text-white' type='submit' isLoading={isResetPassword}>
              Change Password
            </Button>
            <div className='relative mt-4'>
              <div className='absolute flex items-center'>
                <span className='w-full border-t border-muted-foreground/30' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='px-2 text-muted-foreground'>OR</span>
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
