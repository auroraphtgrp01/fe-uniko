'use client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect, useRef, useState } from 'react'
import { useUser } from '@/core/users/hooks'
import { IUser, IUserGetMeResponse } from '@/types/user.i'
import { useUpdateModel } from '@/hooks/useQueryModel'
import { Button } from '@/components/ui/button'
import FormZod from '../../../components/core/FormZod'
import toast from 'react-hot-toast'
import { updateUserFormBody, updateUserSchema } from '@/core/users/constants/update-user.constant'
import { IBaseResponseData } from '@/types/common.i'
import { USER_QUERY_ME } from '@/core/users/constants'
import {
  updatePasswordFormBodyWithCurrentPassword,
  updatePasswordFormBodyWithoutCurrentPassword,
  updatePassWordSchemaWithCurrentPassword,
  updatePassWordSchemaWithoutCurrentPassword
} from '@/core/users/constants/update-password-schema.constant'
import { useTranslation } from 'react-i18next'
import { getTranslatedFormBody } from '@/libraries/utils'
import { SaveIcon } from 'lucide-react'
import { useStoreLocal } from '@/hooks/useStoreLocal'
import { useSearchParams } from 'next/navigation'
import UserProfile from '@/components/dashboard/profile/UserProfile'
import { initEmptyUser } from './constants'
import { useExpenditureFund } from '@/core/expenditure-fund/hooks'

export default function ProfileForm() {
  const searchParams = useSearchParams()
  const [defaultUser, setIsDefaultUser] = useState({})
  const { getMe, updateUser, isUpdating, isPasswordUpdating, updatePassword } = useUser()
  const { setUser } = useStoreLocal()
  const { getAdvancedExpenditureFund } = useExpenditureFund()
  const { refetchAdvancedExpendingFund } = getAdvancedExpenditureFund({})
  const handleUpdatePassword = (formData: { currentPassword?: string; newPassword: string }) => {
    updatePassword({
      ...formData,
      id: userGetMeData?.data.id as string
    })
  }
  const handleUpdateUser = (formData: {
    fullName?: string
    dateOfBirth?: Date
    gender?: string
    workplace?: string
    phone_number?: string
    address?: string
    avatarId?: string
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
            setUser(res.data)
            refetchAdvancedExpendingFund()
            toast.success('Update successfully !')
          }
        }
      }
    )
  }
  const { t } = useTranslation(['profile'])
  const { userGetMeData, isGetMeUserPending } = getMe(true)
  const { setData } = useUpdateModel<IUserGetMeResponse>([USER_QUERY_ME], (oldData, newData) => {
    return { ...oldData, data: newData }
  })
  const formUpdateRef = useRef<HTMLFormElement>(null)
  const formUpdatePasswordRef = useRef<HTMLFormElement>(null)
  const formUpdatePasswordRef1 = useRef<HTMLFormElement>(null)
  const translatedUpdateUserFormBody = getTranslatedFormBody(updateUserFormBody, t)
  const translatedUpdatePasswordFormBodyWithoutCurrentPassword = getTranslatedFormBody(
    updatePasswordFormBodyWithoutCurrentPassword,
    t
  )
  const translatedUpdatePasswordFormBodyWithCurrentPassword = getTranslatedFormBody(
    updatePasswordFormBodyWithCurrentPassword,
    t
  )

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
        <Card className='relative flex-1 overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-b from-primary/10 to-background/50 opacity-50' />
          <CardContent className='space-y-6 p-6'>
            <UserProfile handleUpdateUser={handleUpdateUser} user={userGetMeData?.data || initEmptyUser} />
          </CardContent>
        </Card>
        <Card className='h-full flex-1 rounded-md pt-4'>
          <CardContent>
            <Tabs defaultValue={searchParams.get('openTab') || 'account'} className='h-full flex-1 rounded-md'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='account'>{t('tabs.account')}</TabsTrigger>
                <TabsTrigger value='password'>{t('tabs.password')}</TabsTrigger>
              </TabsList>
              <TabsContent value='account' className='h-fit'>
                <CardHeader className='px-0'>
                  <CardTitle>{t('userProfileTitle')}</CardTitle>
                </CardHeader>
                <CardContent className='px-0'>
                  <FormZod
                    defaultValues={defaultUser}
                    classNameForm='grid grid-cols-4 grid-rows-4 gap-4 space-y-0'
                    submitRef={formUpdateRef}
                    formFieldBody={translatedUpdateUserFormBody}
                    formSchema={updateUserSchema}
                    onSubmit={handleUpdateUser}
                  />
                </CardContent>
                <CardFooter className='flex px-0'>
                  <Button
                    className='gap-2'
                    type='button'
                    onClick={() => formUpdateRef.current?.requestSubmit()}
                    isLoading={isUpdating}
                  >
                    <SaveIcon height={15} width={15} />
                    {t('profile:form.credential.saveChangesButton')}
                  </Button>
                </CardFooter>
              </TabsContent>
              <TabsContent value='password' className='h-fit py-2 min-[1490px]:mt-2'>
                <CardHeader className='px-0'>
                  <CardTitle> {t('profile:form.credential.currentPassword.label')}</CardTitle>
                  <CardDescription>{t('profile:form.credential.passwordDescription')}</CardDescription>
                </CardHeader>
                <CardContent className='px-0'>
                  {userGetMeData?.data?.provider !== null && userGetMeData?.data?.isChangeNewPassword ? (
                    <FormZod
                      submitRef={formUpdatePasswordRef}
                      formFieldBody={translatedUpdatePasswordFormBodyWithoutCurrentPassword}
                      formSchema={updatePassWordSchemaWithoutCurrentPassword}
                      onSubmit={handleUpdatePassword}
                    />
                  ) : (
                    <FormZod
                      submitRef={formUpdatePasswordRef1}
                      formFieldBody={translatedUpdatePasswordFormBodyWithCurrentPassword}
                      formSchema={updatePassWordSchemaWithCurrentPassword}
                      onSubmit={handleUpdatePassword}
                    />
                  )}
                </CardContent>
                <CardFooter className='flex px-0'>
                  <Button
                    type='button'
                    onClick={() => formUpdatePasswordRef.current?.requestSubmit()}
                    isLoading={isPasswordUpdating}
                    className='gap-2'
                  >
                    <SaveIcon height={15} width={15} />
                    {t('profile:form.credential.savePasswordButton')}
                  </Button>
                </CardFooter>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
