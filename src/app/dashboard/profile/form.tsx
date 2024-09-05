'use client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Cake, BriefcaseBusiness, Phone, MapPin, User } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export default function ProfileForm() {
  return (
    <div className='container relative mx-auto flex gap-4 overflow-hidden rounded-md antialiased'>
      <div className='flex flex-1 flex-col gap-8 lg:flex-row min-[1050px]:flex-row'>
        {/* Card */}
        <Card className='h-full flex-1'>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className='grid w-full items-center gap-4'>
                <div className='mt-3 flex flex-col items-center justify-center lg:flex-row'>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Avatar className='mx-5 rounded-full hover:cursor-pointer max-[768px]:h-32 max-[768px]:w-32 md:h-44 md:w-44'>
                        <AvatarImage src='https://github.com/shadcn.png' />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </PopoverTrigger>
                    <PopoverContent className='w-64'>
                      <Input id='picture' type='file' />
                    </PopoverContent>
                  </Popover>
                  <div className='mt-3 flex-1 text-center md:ml-6 md:mt-0 md:text-left'>
                    <h1 className='text-xl font-bold max-[1050px]:mt-3 md:text-2xl'>Nguyễn Quang Huy</h1>
                    <h1 className='mb-1 text-gray-500'>@kwanghy</h1>
                    <h1 className='text-md mb-2 flex items-center justify-center md:justify-start'>
                      <Cake className='mb-1 mr-2' /> 23/03/2003
                    </h1>
                    <h1 className='text-md mb-2 flex items-center justify-center md:justify-start'>
                      <User className='mb-1 mr-2' /> Nam
                    </h1>
                    <h1 className='text-md mb-2 flex items-center justify-center md:justify-start'>
                      <BriefcaseBusiness className='mb-1 mr-2' /> Da Nang
                    </h1>
                    <h1 className='text-md mb-2 flex items-center justify-center md:justify-start'>
                      <Phone className='mb-1 mr-2' /> 0987654321
                    </h1>
                    <h1 className='text-md mb-2 flex items-center justify-center md:justify-start'>
                      <MapPin className='mb-1 mr-2' /> 69 Nhon Hoa 17, Cam Le, Da Nang
                    </h1>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue='account' className='min-[800px]:w- h-full flex-1 rounded-md'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='account'>Common Information</TabsTrigger>
            <TabsTrigger value='password'>Credential Information</TabsTrigger>
          </TabsList>
          <TabsContent value='account' className='h-fit'>
            <Card className='h-full flex-1 rounded-md'>
              <CardContent className='space-y-1'>
                <div className='mb-2 mt-2 flex-1 items-center space-y-1'>
                  <Label htmlFor='name'>Name:</Label>
                  <Input id='username' />
                </div>
                <div className='flex flex-col gap-2 lg:flex-row'>
                  <div className='mb-2 flex-1 items-center space-y-1'>
                    <Label htmlFor='dateofbirth'>Date of Birth:</Label>
                    <Input id='dateofbirth' />
                  </div>
                  <div className='mb-2 flex-1 items-center space-y-1'>
                    <Label htmlFor='gender'>Gender:</Label>
                    <Input id='gender' />
                  </div>
                </div>
                <div className='flex flex-col gap-2 lg:flex-row'>
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
                <CardDescription className='ml-6 flex items-start space-y-1 font-bold'>
                  Make changes to your account. Click update when you are done.
                </CardDescription>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value='password' className='h-fit'>
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password here. After saving, you will be logged out.</CardDescription>
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
    </div>
  )
}
