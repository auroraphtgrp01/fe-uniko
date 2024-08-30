'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Icons } from '@/components/ui/icons'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'
import { useAuth } from '@/hooks/query-hooks/use-auth'

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, isSigningIn } = useAuth()
  function handleSubmit() {
    console.log(isSigningIn)
    signIn({ email, password })
    console.log(isSigningIn)
  }
  return (
    <div className='flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8'>
      <Card>
        <CardContent>
          <div className='w-full max-w-md space-y-8'>
            <div>
              <h2 className='text-3 mt-6 text-center font-bold tracking-tight text-foreground'>
                Sign in to your account
              </h2>
              <p className='mt-2 text-center text-sm text-muted-foreground'>Open up your own world !</p>
            </div>
            <div className='space-y-4'>
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='email'>Email address</Label>
                  <Input
                    id='email'
                    autoComplete='email'
                    required
                    placeholder='name@example.com'
                    className='mt-2'
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <div className='flex items-center justify-between'>
                    <Label htmlFor='password'>Password</Label>
                  </div>
                  <Input
                    id='password'
                    type='password'
                    autoComplete='current-password'
                    required
                    placeholder='Password'
                    className='mt-2'
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className='flex justify-between'>
                  <div className='flex'>
                    <Checkbox id='remember' />
                    <Label htmlFor='remember' className='ml-2 block text-sm text-muted-foreground'>
                      Remember me
                    </Label>
                  </div>
                  <Link href='#' className='text-sm font-medium text-primary hover:text-primary/80' prefetch={false}>
                    Forgot password?
                  </Link>
                </div>
                <Button variant={'blueVin'} className='w-full' onClick={handleSubmit} isLoading={true}>
                  Sign in
                </Button>
                <div className='relative'>
                  <div className='absolute inset-0 flex items-center'>
                    <span className='w-full border-t' />
                  </div>
                  <div className='relative flex justify-center text-xs uppercase'>
                    <span className='bg-background px-2 text-muted-foreground'>Or continue with</span>
                  </div>
                </div>
                <div className='flex flex-col sm:flex-row sm:space-x-2'>
                  <Button isLoading={true} variant='greenPastel1' className='mb-2 sm:mb-0 sm:w-full'>
                    <Icons.google className='mr-2 h-5 w-5' />
                    Sign in with Google
                  </Button>
                  <Button variant='blueVin' className='w-full'>
                    <Icons.gitHub className='mr-2 h-5 w-5' />
                    Sign in with GitHub
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
