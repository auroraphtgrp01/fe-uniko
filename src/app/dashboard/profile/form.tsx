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
import { useAuth } from '@/core/auth/hooks'
import { getRefreshTokenFromLocalStorage } from '@/libraries/helpers'
import { formatDateToInput, getTranslatedFormBody } from '@/libraries/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Briefcase, Calendar, Mail, MapPin, Phone, Save, SaveIcon, User2 } from 'lucide-react'
import AvatarDefault from '@/images/avatar.jpg'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'

export default function ProfileForm() {
  const [defaultUser, setIsDefaultUser] = useState({})
  const { getMe, updateUser, isUpdating, isPasswordUpdating, updatePassword } = useUser()
  const handleUpdatePassword = (formData: { currentPassword?: string; newPassword: string }) => {
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
  const { verifyToken } = useAuth()
  const { isVerifyingToken } = verifyToken({ refreshToken: getRefreshTokenFromLocalStorage() })
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
        <Card className='relative overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-b from-primary/10 to-background/50 opacity-50' />
          <CardContent className='space-y-6 p-6'>
            <div className='flex flex-col items-center space-y-4'>
              <Avatar className='h-32 w-32 ring-2 ring-border'>
                <Image src={AvatarDefault} alt='' width={128} height={128} />
              </Avatar>
              <div className='text-center'>
                <h2 className='text-2xl font-bold'>{userGetMeData?.data?.fullName ?? 'Unknown'}</h2>
                <p className='text-sm text-muted-foreground'>{userGetMeData?.data?.email ?? 'Unknown'}</p>
              </div>
            </div>
            <Separator />
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-4'>
                <InfoItem icon={Mail} label='Email' value={userGetMeData?.data?.email} />
                <InfoItem icon={Phone} label='Phone' value={userGetMeData?.data?.phone_number} />
                <InfoItem icon={MapPin} label='Location' value={userGetMeData?.data?.address} />
              </div>
              <div className='space-y-4'>
                <InfoItem
                  icon={Calendar}
                  label='Date of Birth'
                  value={formatDateToInput(userGetMeData?.data?.dateOfBirth)}
                />
                <InfoItem icon={User2} label='Gender' value={userGetMeData?.data?.gender} />
                <InfoItem icon={Briefcase} label='Workplace' value={userGetMeData?.data?.workplace} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Tabs defaultValue='account' className='h-full flex-1 rounded-md'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='account'>{t('tabs.account')}</TabsTrigger>
            <TabsTrigger value='password'>{t('tabs.password')}</TabsTrigger>
          </TabsList>
          <TabsContent value='account' className='h-fit py-2'>
            <Card>
              <CardHeader>
                <CardTitle>{t('userProfileTitle')}</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                <FormZod
                  defaultValues={defaultUser}
                  classNameForm='grid grid-cols-4 grid-rows-4 gap-3 space-y-0'
                  submitRef={formUpdateRef}
                  formFieldBody={translatedUpdateUserFormBody}
                  formSchema={updateUserSchema}
                  onSubmit={handleUpdateUser}
                />
              </CardContent>
              <CardFooter className='flex'>
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
            </Card>
          </TabsContent>
          <TabsContent value='password' className='h-fit py-2 min-[1490px]:mt-2'>
            <Card>
              <CardHeader>
                <CardTitle> {t('profile:form.credential.currentPassword.label')}</CardTitle>
                <CardDescription>{t('profile:form.credential.passwordDescription')}</CardDescription>
              </CardHeader>
              <CardContent className='space-y-2'>
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
              <CardFooter className='flex'>
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
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

const InfoItem = ({
  icon: Icon,
  label,
  value
}: {
  icon: React.ElementType
  label: string | undefined
  value: string | undefined
}) => (
  <div className='flex items-center space-x-4 rounded-lg border p-3 transition-colors hover:bg-accent'>
    <Icon className='h-5 w-5 text-muted-foreground' />
    <div className='space-y-1'>
      <p className='text-sm font-medium leading-none'>{label}</p>
      <p className='text-xs text-muted-foreground'>{value || 'Unknown'}</p>
    </div>
  </div>
)
