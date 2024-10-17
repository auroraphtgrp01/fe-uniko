import { formatAccountSourceData } from '@/app/dashboard/account-source/constants'
import {
  EAccountSourceType,
  IAccountSource,
  IAccountSourceBody,
  IAccountSourceDataFormat,
  IAccountSourceResponse,
  IAdvancedAccountSourceResponse,
  IDialogAccountSource
} from '@/core/account-source/models'
import { formatArrayData, getTypes } from '@/libraries/utils'
import { IBaseResponsePagination, IDataTableConfig } from '@/types/common.i'
import toast from 'react-hot-toast'

export const handleShowDetailAccountSource = (
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

export const handleCreateAccountSource = ({
  formData,
  setIsDialogOpen,
  setFormData,
  createAccountSource,
  setFetchedData,
  setDataCreate
}: {
  formData: IAccountSourceBody
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogAccountSource>>
  createAccountSource: any
  setFetchedData: React.Dispatch<React.SetStateAction<IAccountSource[]>>
  setFormData: React.Dispatch<React.SetStateAction<IAccountSourceBody>>
  setDataCreate: any
}) => {
  const payload = {
    name: formData.name,
    accountSourceType: formData.accountSourceType,
    initAmount: formData.initAmount,
    currency: formData.currency,
    accountBankId: formData.accountBankId,
    password: formData.password,
    login_id: formData.login_id,
    accounts: [formData.account],
    type: formData.type
  }
  createAccountSource(payload, {
    onSuccess: (res: IAccountSourceResponse) => {
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

export const handleUpdateAccountSource = ({
  formData,
  setIsDialogOpen,
  fetchedData,
  setFetchedData,
  setFormData,
  updateAccountSource,
  setDataUpdate,
  setDetailData,
  setIdRowClicked
}: {
  formData: IAccountSourceBody
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogAccountSource>>
  updateAccountSource: any
  setFetchedData: React.Dispatch<React.SetStateAction<IAccountSource[]>>
  setFormData: React.Dispatch<React.SetStateAction<IAccountSourceBody>>
  fetchedData: IAccountSource[]
  setDataUpdate: any
  setDetailData: any
  setIdRowClicked: React.Dispatch<React.SetStateAction<string>>
}) => {
  const payload: IAccountSourceBody = {
    name: formData.name,
    type: formData.type,
    initAmount: formData.initAmount,
    currency: formData.currency,
    id: formData.id
  }
  updateAccountSource(payload, {
    onSuccess(res: IAccountSourceResponse) {
      if (res.statusCode === 200 || res.statusCode === 201) {
        const clonedData = JSON.parse(JSON.stringify(res))
        const updatedData = fetchedData.map((item) => (item.id === clonedData.data.id ? clonedData.data : item))
        setFetchedData(updatedData)
        setDataUpdate(res.data)
        setDetailData(res.data)
        setIsDialogOpen((prev) => ({ ...prev, isDialogUpdateOpen: false }))
        setFormData((prev) => ({ ...prev, name: '', type: EAccountSourceType.WALLET, initAmount: 0, currency: '' }))
        setIdRowClicked('')
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

  if (updatedData.length > (oldData.pagination as IBaseResponsePagination).limit) updatedData.pop()
  return { ...oldData, data: updatedData }
}

export const updateCacheDataUpdate = (
  oldData: IAdvancedAccountSourceResponse,
  newData: IAccountSource
): IAdvancedAccountSourceResponse => {
  const updatedData = oldData.data.map((item) => {
    return item.id === newData.id ? { ...item, ...newData } : item
  })
  return { ...oldData, data: updatedData }
}

export const updateCacheDetailData = (
  oldData: IAccountSourceResponse,
  newData: IAccountSource
): IAccountSourceResponse => {
  return { ...oldData, data: newData }
}

export const initDataTable = (
  isGetAdvancedPending: boolean,
  getAdvancedData: IAdvancedAccountSourceResponse | undefined,
  setDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>,
  setFetchedData: React.Dispatch<React.SetStateAction<IAccountSource[]>>,
  setTableData: React.Dispatch<React.SetStateAction<IAccountSourceDataFormat[]>>
) => {
  if (!isGetAdvancedPending && getAdvancedData) {
    const dataFormat: IAccountSourceDataFormat[] = formatArrayData<IAccountSource, IAccountSourceDataFormat>(
      getAdvancedData.data,
      formatAccountSourceData
    )
    setDataTableConfig((prev) => ({
      ...prev,
      types: getTypes(getAdvancedData.data),
      totalPage: Number(getAdvancedData.pagination?.totalPage)
    }))
    setFetchedData(getAdvancedData.data)
    setTableData(dataFormat)
  }
}
