import { ICommonInformationForm } from '@/core/users/models/user.interface'
import { IBaseResponseData } from '@/types/common.i'
import { IUserGetMeResponse } from '@/types/user.i'
import toast from 'react-hot-toast'

export const initData = (
  userGetMeData: IUserGetMeResponse,
  isGetMeUserPending: boolean,
  setFormData: React.Dispatch<React.SetStateAction<ICommonInformationForm>>
) => {
  const { id, fullName, dateOfBirth, gender, address, phone_number, workplace }: ICommonInformationForm = (
    userGetMeData as IUserGetMeResponse
  ).data
  if (userGetMeData && !isGetMeUserPending)
    setFormData({ id, fullName, dateOfBirth, gender, address, phone_number, workplace })
}

export const handleUpdateCommonInformation = (
  formData: ICommonInformationForm,
  updateUser: any,
  isUpdating: boolean
) => {
  updateUser(formData, {
    onSuccess: (res: IBaseResponseData<any>) => {
      console.log(res)
      if (!isUpdating && (res.statusCode === 200 || res.statusCode === 201))
        toast.success('Update common information successfully')
    }
  })
}
