'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect, useState } from 'react'
import { useUser } from '@/core/users/hooks'
import { getAccessTokenFromLocalStorage } from '@/libraries/helpers'
import { ICommonInformationForm, ICredentialInformationForm } from '@/core/users/models/user.interface'
import { handleUpdateCredentialInformation, handleUpdateCommonInformation, initData } from './handler'
import CommonInformationForm from './commonInformationForm'
import CredentialInformationForm from './credentialInformationForm'
import ProfileCardContainer from './profileCardContainer'
import { IUser, IUserGetMeResponse } from '@/types/user.i'
import { initCredentialInfFormData, initCommonInfFormData } from './constants'
import { useUpdateModel } from '@/hooks/useQueryModel'

export default function ProfileForm() {
  const accessToken = getAccessTokenFromLocalStorage()
  // states
  const [commonInfFormData, setCommonInfFormData] = useState<ICommonInformationForm>(initCommonInfFormData)
  const [credentialInfFormData, setCredentialInfFormData] =
    useState<ICredentialInformationForm>(initCredentialInfFormData)

  // hooks
  const { getMe, updateUser, isUpdating, isPasswordUpdating, updatePassword } = useUser()
  const { userGetMeData, isGetMeUserPending } = getMe(true)
  const { setData } = useUpdateModel<IUserGetMeResponse>(['USER', 'me', ''], (oldData, newData) => {
    return { ...oldData, data: newData }
  })

  // Effects
  useEffect(() => {
    if (!isGetMeUserPending && userGetMeData)
      initData(userGetMeData, isGetMeUserPending, setCommonInfFormData, setCredentialInfFormData)
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
          <TabsContent value='account' className='h-fit py-2'>
            <CommonInformationForm
              formData={commonInfFormData}
              setFormData={setCommonInfFormData}
              onSubmit={handleUpdateCommonInformation}
              updateUser={updateUser}
              isUpdating={isUpdating}
              setData={setData}
            />
          </TabsContent>
          <TabsContent value='password' className='h-fit py-2 min-[1490px]:mt-2'>
            <CredentialInformationForm
              formData={credentialInfFormData}
              setFormData={setCredentialInfFormData}
              onSubmit={handleUpdateCredentialInformation}
              updatePassword={updatePassword}
              isUpdating={isPasswordUpdating}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
