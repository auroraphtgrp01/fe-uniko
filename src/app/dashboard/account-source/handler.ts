import { formatAccountSourceData } from '@/app/dashboard/account-source/constants'
import {
  EAccountSourceType,
  IAccountSource,
  IAccountSourceBody,
  IAccountSourceDataFormat,
  IAdvancedAccountSourceResponse,
  IDialogAccountSource
} from '@/core/account-source/models'
import { formatArrayData } from '@/libraries/utils'
import toast from 'react-hot-toast'
export const handleShowDetailAccountSource = async (
  setFormData: React.Dispatch<React.SetStateAction<IAccountSourceBody>>,
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogAccountSource>>,
  getAccountSourceById: any
) => {
  const data = getAccountSourceById.data
  setFormData({
    id: data.id,
    name: data.name as string,
    type: data.type,
    initAmount: Number(data.initAmount),
    currency: data.currency
  })
  setIsDialogOpen((prev) => ({ ...prev, isDialogUpdateOpen: true }))
}

export const handleCreateAccountSource = async ({
  formData,
  setIsDialogOpen,
  setFormData,
  createAccountSource,
  setFetchedData,
  setDataCreate
}: {
  formData: IAccountSourceBody
  setIsDialogOpen: React.Dispatch<
    React.SetStateAction<{
      isDialogCreateOpen: boolean
      isDialogUpdateOpen: boolean
    }>
  >
  createAccountSource: any
  updateAccountSource?: any
  setFetchedData: React.Dispatch<React.SetStateAction<IAccountSource[]>>
  setFormData: React.Dispatch<React.SetStateAction<IAccountSourceBody>>
  setDataCreate: any
}) => {
  const payload: IAccountSourceBody = {
    name: formData.name,
    type: formData.type,
    initAmount: formData.initAmount,
    currency: formData.currency,
    id: formData.id
  }
  createAccountSource(payload, {
    onSuccess: (res: any) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: false }))
        setFetchedData((prev) => [res.data, ...prev])
        setDataCreate(res.data)
        setFormData((prev) => ({ ...prev, name: '', type: EAccountSourceType.WALLET, initAmount: 0, currency: '' }))
        toast.success('Create account source successfully!')
      }
    }
  })
}

export const handleUpdateAccountSource = async ({
  formData,
  setIsDialogOpen,
  fetchedData,
  setFetchedData,
  setFormData,
  updateAccountSource,
  setDataUpdate
}: {
  formData: IAccountSourceBody
  setIsDialogOpen: React.Dispatch<
    React.SetStateAction<{
      isDialogCreateOpen: boolean
      isDialogUpdateOpen: boolean
    }>
  >
  updateAccountSource: any
  setFetchedData: React.Dispatch<React.SetStateAction<IAccountSource[]>>
  setFormData: React.Dispatch<React.SetStateAction<IAccountSourceBody>>
  fetchedData: IAccountSource[]
  setDataUpdate: any
}) => {
  const payload: IAccountSourceBody = {
    name: formData.name,
    type: formData.type,
    initAmount: formData.initAmount,
    currency: formData.currency,
    id: formData.id
  }
  updateAccountSource(payload, {
    onSuccess(res: any) {
      if (res.statusCode === 200 || res.statusCode === 201) {
        const format = formatAccountSourceData(res.data)
        const indexDataUpdated = fetchedData.findIndex((item) => item.id === format.id)
        fetchedData[indexDataUpdated] = res.data
        setFetchedData(fetchedData)
        setDataUpdate(res.data)
        setIsDialogOpen((prev) => ({ ...prev, isDialogUpdateOpen: false }))
        setFormData((prev) => ({ ...prev, name: '', type: EAccountSourceType.WALLET, initAmount: 0, currency: '' }))
        toast.success('Update account source successfully!')
      }
    }
  })
}

export const filterDataAccountSource = (data: IAccountSource[], filter: string[]): IAccountSourceDataFormat[] => {
  if (filter.length === 0)
    return formatArrayData<IAccountSource, IAccountSourceDataFormat>(data, formatAccountSourceData)
  const validValues = data.filter((item: IAccountSource) => filter.includes(item.type as string))
  return formatArrayData<IAccountSource, IAccountSourceDataFormat>(validValues, formatAccountSourceData)
}

export const updateCacheDataCreate = (
  oldData: IAdvancedAccountSourceResponse,
  newData: IAccountSource
): IAdvancedAccountSourceResponse => {
  const updatedData = [newData, ...oldData.data]
  if (updatedData.length > 1) updatedData.pop()
  return { ...oldData, data: updatedData }
}

export const updateCacheDataUpdate = (
  oldData: IAdvancedAccountSourceResponse,
  newData: IAccountSource
): IAdvancedAccountSourceResponse => {
  const updatedData = [...oldData.data]
  const index = updatedData.findIndex((item) => item.id === newData.id)
  if (index !== -1) {
    updatedData.splice(index, 1)
    updatedData.splice(index, 0, { ...updatedData[index], ...newData })
  }
  return { ...oldData, data: updatedData }
}
