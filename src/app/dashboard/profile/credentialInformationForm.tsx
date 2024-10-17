import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ICredentialInformationForm } from '@/core/users/models/user.interface'
import { IBaseResponseData } from '@/types/common.i'
import { IUser } from '@/types/user.i'
import { FormEvent } from 'react'

export default function CredentialInformationForm({
  formData,
  setFormData,
  onSubmit,
  updatePassword,
  isUpdating
}: {
  formData: ICredentialInformationForm
  setFormData: React.Dispatch<React.SetStateAction<ICredentialInformationForm>>
  onSubmit: (
    formData: ICredentialInformationForm,
    hookUpdate: (
      data: ICredentialInformationForm,
      options: { onSuccess: (res: IBaseResponseData<IUser>) => void }
    ) => void,
    isUpdating: boolean,
    resetForm: React.Dispatch<React.SetStateAction<ICredentialInformationForm>>
  ) => void
  updatePassword: any
  isUpdating: boolean
}) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSubmit(formData, updatePassword, isUpdating, setFormData)
  }
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your password here. After saving, you will be logged out.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-2'>
          <div className='space-y-1'>
            <Label htmlFor='current'>Current password</Label>
            <Input
              value={formData.currentPassword}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  currentPassword: event.target.value
                }))
              }
              required
              type='password'
              placeholder='••••••••'
            />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='new'>New password</Label>
            <Input
              value={formData.newPassword}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  newPassword: event.target.value
                }))
              }
              type='password'
              required
              placeholder='••••••••'
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type='submit' isLoading={isUpdating}>
            Save password
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
