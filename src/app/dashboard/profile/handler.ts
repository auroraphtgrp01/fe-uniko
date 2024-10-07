import { ICommonInformationForm, ICredentialInformationForm } from '@/core/users/models/user.interface'
import { IBaseResponseData } from '@/types/common.i'
import { IUser, IUserGetMeResponse } from '@/types/user.i'
import toast from 'react-hot-toast'
import { initCredentialInfFormData } from './constants'

export const initData = (
  userGetMeData: IUserGetMeResponse,
  isGetMeUserPending: boolean,
  setCommonInfFormData: React.Dispatch<React.SetStateAction<ICommonInformationForm>>,
  setCredentialInfFormData: React.Dispatch<React.SetStateAction<ICredentialInformationForm>>
) => {
  const { id, fullName, dateOfBirth, gender, address, phone_number, workplace }: ICommonInformationForm = (
    userGetMeData as IUserGetMeResponse
  ).data
  if (userGetMeData && !isGetMeUserPending) {
    setCommonInfFormData({ id, fullName, dateOfBirth, gender, address, phone_number, workplace })
    setCredentialInfFormData({ id })
  }
}

export const handleUpdateCommonInformation = (
  formData: ICommonInformationForm,
  hookUpdate: any,
  isUpdating: boolean,
  setData: (data: IUser) => void
) => {
  console.log('formData', formData)

  hookUpdate(formData, {
    onSuccess: (res: IBaseResponseData<IUser>) => {
      if (!isUpdating && (res.statusCode === 200 || res.statusCode === 201)) {
        setData(res.data)
        toast.success('Update common information successfully')
      }
    }
  })
}

export const handleUpdateCredentialInformation = (
  formData: ICredentialInformationForm,
  hookUpdate: any,
  isUpdating: boolean,
  resetForm: React.Dispatch<React.SetStateAction<ICredentialInformationForm>>
) => {
  console.log('formData', formData)

  hookUpdate(formData, {
    onSuccess: (res: IBaseResponseData<IUser>) => {
      if (!isUpdating && (res.statusCode === 200 || res.statusCode === 201)) {
        resetForm({ ...initCredentialInfFormData, id: formData.id })
        toast.success('Update common information successfully')
      }
    }
  })
}
