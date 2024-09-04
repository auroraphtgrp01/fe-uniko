'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Icons } from '@/components/ui/icons'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useState, FormEvent } from 'react'
import { useAuth } from '@/hooks/query-hooks/use-auth'
import Logo2 from '@/images/logo-2.png'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Cake, BriefcaseBusiness, Phone, MapPin, User } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export default function ProfileForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, isSigningIn, isRememberMe, setIsRememberMe } = useAuth()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    signIn({ email, password })
  }

  return (
    <div className='relative flex flex-col overflow-hidden rounded-md bg-black/[0.8] py-6 antialiased bg-dot-white/[0.2] sm:m-7 md:m-7 md:justify-center md:py-12 lg:flex-row lg:px-8'>
      <Card className=':mr-10 mb-8 mr-0 h-fit w-full flex-shrink-0 md:mr-8 lg:w-[550px]'>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className='grid w-full items-center gap-4'>
              <div className='flex flex-col items-center gap-5 md:flex-row'>
                <Popover>
                  <PopoverTrigger asChild>
                    <Avatar className='h-36 w-36 rounded-full hover:cursor-pointer md:h-52 md:w-52'>
                      <AvatarImage src='https://github.com/shadcn.png' />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </PopoverTrigger>
                  <PopoverContent className='w-80'>
                    <Input id='picture' type='file' />
                  </PopoverContent>
                </Popover>

                <div className='flex-1 text-center md:text-left'>
                  <h1 className='text-xl font-bold md:text-2xl'>Nguyễn Quang Huy</h1>
                  <h1 className='mb-1 text-gray-500'>@kwanghy</h1>
                  <h1 className='text-md flex justify-center md:justify-start md:text-lg'>
                    <Cake className='mr-2 md:mr-3' /> 23/03/2003
                  </h1>
                  <h1 className='text-md mb-2 flex justify-center md:justify-start md:text-lg'>
                    <User className='mr-2 md:mr-3' /> Nam{' '}
                  </h1>
                  <h1 className='text-md mb-2 flex justify-center md:justify-start md:text-lg'>
                    <BriefcaseBusiness className='mr-2 md:mr-3' /> Da Nang
                  </h1>
                  <h1 className='text-md mb-2 flex justify-center md:justify-start md:text-lg'>
                    <Phone className='mr-2 md:mr-3' />
                    0987654321
                  </h1>
                  <h1 className='text-md mb-2 flex justify-center md:justify-start md:text-lg'>
                    <MapPin className='mr-2 md:mr-3' />
                    69 Nhon Hoa 17, Cam Le, Da Nang
                  </h1>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Tabs defaultValue='account' className='max-h-screen w-full lg:w-[550px]'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='account'>Common Information</TabsTrigger>
          <TabsTrigger value='password'>Credential Information</TabsTrigger>
        </TabsList>
        <TabsContent value='account'>
          <Card>
            <CardHeader>
              <CardTitle>Common Information</CardTitle>
              <CardDescription>Make changes to your account here. Click save when you re done.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-1'>
              <div className='mb-2 flex-1 items-center space-y-1'>
                <Label htmlFor='name'>Name:</Label>
                <Input id='username' />
              </div>
              <div className='flex flex-col gap-2 md:flex-row'>
                <div className='mb-2 flex-1 items-center space-y-1'>
                  <Label htmlFor='dateofbirth'>Date of Birth:</Label>
                  <Input id='dateofbirth' />
                </div>
                <div className='mb-2 flex-1 items-center space-y-1'>
                  <Label htmlFor='gender'>Gender:</Label>
                  <Input id='gender' />
                </div>
              </div>
              <div className='flex flex-col gap-2 md:flex-row'>
                <div className='mb-2 flex-1 items-center space-y-1'>
                  <Label htmlFor='workplace'>Workplace:</Label>
                  <Input id='workplace' />
                </div>
                <div className='mb-2 flex-1 items-center space-y-1'>
                  <Label htmlFor='phonenumber'>Phone Number:</Label>
                  <Input id='phonenumber' />
                </div>
              </div>
              <div className='mb-2 items-center space-y-1'>
                <Label htmlFor='address'>Address:</Label>
                <Input id='address' />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value='password' className='min-h-screen'>
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password here. After saving, youll be logged out.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='space-y-1'>
                <Label htmlFor='current'>Current password</Label>
                <Input id='current' type='password' />
              </div>
              <div className='space-y-1'>
                <Label htmlFor='new'>New password</Label>
                <Input id='new' type='password' />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
