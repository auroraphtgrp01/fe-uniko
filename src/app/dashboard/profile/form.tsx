'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect, useState } from 'react'
import { useUser } from '@/core/users/hooks'
import { getAccessTokenFromLocalStorage } from '@/libraries/helpers'
import { ICommonInformationForm } from '@/core/users/models/user.interface'
import { handleUpdateCommonInformation, initData } from './handler'
import CommonInformationForm from './commonInformationForm'
import CredentialInformationForm from './credentialInformationForm'
import ProfileCardContainer from './profileCardContainer'
import { IUser, IUserGetMeResponse } from '@/types/user.i'
import { initFormData } from './constants'
import { useUpdateModel } from '@/hooks/useQueryModel'

export default function ProfileForm() {
  const accessToken = getAccessTokenFromLocalStorage()
  // states
  const [formData, setFormData] = useState<ICommonInformationForm>(initFormData)

  // hooks
  const { getMe, updateUser, isUpdating } = useUser()
  const { userGetMeData, isGetMeUserPending } = getMe(accessToken as string)
  const { setData } = useUpdateModel<IUserGetMeResponse>(['USER', 'me', ''], (oldData, newData) => {
    return { ...oldData, data: newData }
  })

  // Effects
  useEffect(() => {
    if (!isGetMeUserPending && userGetMeData) initData(userGetMeData, isGetMeUserPending, setFormData)
  }, [userGetMeData, isGetMeUserPending])

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
          <TabsContent value='account' className='h-fit'>
            <CommonInformationForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleUpdateCommonInformation}
              updateUser={updateUser}
              isUpdating={isUpdating}
              setData={setData}
            />
          </TabsContent>
          <TabsContent value='password' className='h-fit min-[1490px]:mt-2'>
            <CredentialInformationForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
