import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ICommonInformationForm, ICredentialInformationForm } from '@/core/users/models/user.interface'
import { formatDateToInput } from '@/libraries/utils'
import { IBaseResponseData } from '@/types/common.i'
import { IUser } from '@/types/user.i'
import React, { FormEvent } from 'react'

export default function CommonInformationForm({
  formData,
  setFormData,
  onSubmit,
  updateUser,
  isUpdating,
  setData
}: {
  formData: ICommonInformationForm
  setFormData: React.Dispatch<React.SetStateAction<ICommonInformationForm>>
  onSubmit: (
    formData: ICommonInformationForm,
    hookUpdate: (data: ICommonInformationForm, options: { onSuccess: (res: IBaseResponseData<IUser>) => void }) => void,
    isUpdating: boolean,
    setData: (data: IUser) => void
  ) => void
  updateUser: any
  isUpdating: boolean
  setData: any
}) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSubmit(formData, updateUser, isUpdating, setData)
  }
  return (
    <form onSubmit={handleSubmit}>
      <Card className='h-full flex-1 rounded-md'>
        <CardContent className='space-y-1'>
          <div className='mb-2 mt-2 flex-1 items-center space-y-1'>
            <Label htmlFor='name'>Name:</Label>
            <Input
              value={formData?.fullName}
              placeholder='John Doe'
              required
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  fullName: event.target.value
                }))
              }
            />
          </div>
          <div className='flex flex-col gap-2 md:flex-row'>
            <div className='mb-2 flex-1 items-center space-y-1'>
              <Label htmlFor='dateOfBirth'>Date of Birth:</Label>
              <Input
                value={formData?.dateOfBirth ? formatDateToInput(formData?.dateOfBirth) : ''}
                type='date'
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    dateOfBirth: event.target.value
                  }))
                }
              />
            </div>
            <div className='mb-2 flex-1 items-center space-y-1'>
              <Label htmlFor='gender'>Gender:</Label>
              <Select
                value={formData?.gender ?? ''}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    gender: value
                  }))
                }
              >
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Select a gender' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='MALE'>Male</SelectItem>
                  <SelectItem value='FEMALE'>Female</SelectItem>
                  <SelectItem value='OTHER'>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='flex flex-col gap-2 md:flex-row'>
            <div className='mb-2 flex-1 items-center space-y-1'>
              <Label htmlFor='workplace'>Workplace:</Label>
              <Input
                value={formData?.workplace ?? ''}
                placeholder='London'
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    workplace: event.target.value
                  }))
                }
              />
            </div>
            <div className='mb-2 flex-1 items-center space-y-1'>
              <Label htmlFor='phoneNumber'>Phone Number:</Label>
              <Input
                value={formData?.phone_number ?? ''}
                placeholder='+84*********'
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    phone_number: event.target.value
                  }))
                }
              />
            </div>
          </div>
          <div className='mb-2 items-center space-y-1'>
            <Label htmlFor='address'>Address:</Label>
            <Input
              value={formData?.address ?? ''}
              placeholder='789 Baker Street'
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  address: event.target.value
                }))
              }
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type='submit'>Update</Button>
          <CardDescription className='ml-6 flex items-start space-y-1 font-bold'>
            Make changes to your account. Click update when you are done.
          </CardDescription>
        </CardFooter>
      </Card>
    </form>
  )
}
