'use client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect, useRef, useState } from 'react'
import { useUser } from '@/core/users/hooks'
import ProfileCardContainer from './profileCardContainer'
import { IUser, IUserGetMeResponse } from '@/types/user.i'
import { useUpdateModel } from '@/hooks/useQueryModel'
import { Button } from '@/components/ui/button'
import FormZod from '../../../components/core/FormZod'
import { updatePasswordFormBody, updatePassWordSchema } from '@/core/users/constants/update-password-schema.constant'
import toast from 'react-hot-toast'
import { updateUserFormBody, updateUserSchema } from '@/core/users/constants/update-user.constant'
import { IBaseResponseData } from '@/types/common.i'
import { USER_QUERY_ME } from '@/core/users/constants'

export default function ProfileForm() {
  const [defaultUser, setIsDefaultUser] = useState({})
  const { getMe, updateUser, isUpdating, isPasswordUpdating, updatePassword } = useUser()
  const handleUpdatePassword = (formData: { currentPassword: string; newPassword: string }) => {
    updatePassword({
      ...formData,
      id: userGetMeData?.data.id as string
    })
  }
  const handleUpdateUser = (formData: {
    fullName: string
    dateOfBirth: Date
    gender: string
    workplace: string
    phone_number: string
    address: string
  }) => {
    updateUser(
      {
        ...formData,
        id: userGetMeData?.data.id as string
      },
      {
        onSuccess: (res: IBaseResponseData<IUser>) => {
          if (!isUpdating && (res.statusCode === 200 || res.statusCode === 201)) {
            setData(res.data)
            toast.success('Update common information successfully')
          }
        }
      }
    )
  }
  const { userGetMeData, isGetMeUserPending } = getMe(true)
  const { setData } = useUpdateModel<IUserGetMeResponse>([USER_QUERY_ME], (oldData, newData) => {
    return { ...oldData, data: newData }
  })
  const formUpdateRef = useRef<HTMLFormElement>(null)
  const formUpdatePasswordRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (userGetMeData?.data && !isGetMeUserPending) {
      setIsDefaultUser({
        fullName: userGetMeData?.data.fullName,
        dateOfBirth: userGetMeData?.data.dateOfBirth,
        gender: userGetMeData?.data.gender,
        workplace: userGetMeData?.data.workplace,
        phone_number: userGetMeData?.data.phone_number,
        address: userGetMeData?.data.address
      })
    }
  }, [userGetMeData])

  return (
    <div className='relative mx-auto flex gap-4 overflow-hidden rounded-md antialiased'>
      <div className='flex flex-1 flex-col gap-8 min-[1350px]:flex-row'>
        <Card className='h-full flex-1'>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileCardContainer data={userGetMeData?.data as IUser} />
          </CardContent>
        </Card>
        <Tabs defaultValue='account' className='h-full flex-1 rounded-md'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='account'>Common Information</TabsTrigger>
            <TabsTrigger value='password'>Credential Information</TabsTrigger>
          </TabsList>
          <TabsContent value='account' className='h-fit py-2'>
            <Card>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                <FormZod
                  defaultValues={defaultUser}
                  classNameForm='grid grid-cols-4 grid-rows-4 gap-3 space-y-0'
                  submitRef={formUpdateRef}
                  formFieldBody={updateUserFormBody}
                  formSchema={updateUserSchema}
                  onSubmit={handleUpdateUser}
                />
              </CardContent>
              <CardFooter className='flex'>
                <Button type='button' onClick={() => formUpdateRef.current?.requestSubmit()} isLoading={isUpdating}>
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value='password' className='h-fit py-2 min-[1490px]:mt-2'>
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password here. After saving, you will be logged out.</CardDescription>
              </CardHeader>
              <CardContent className='space-y-2'>
                <FormZod
                  submitRef={formUpdatePasswordRef}
                  formFieldBody={updatePasswordFormBody}
                  formSchema={updatePassWordSchema}
                  onSubmit={handleUpdatePassword}
                />
              </CardContent>
              <CardFooter className='flex'>
                <Button
                  type='button'
                  onClick={() => formUpdatePasswordRef.current?.requestSubmit()}
                  isLoading={isPasswordUpdating}
                >
                  Save password
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
