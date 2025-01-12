import { formatAccountSourceData } from '@/app/dashboard/account-source/constants'
import {
  EAccountSourceType,
  IAccountSource,
  IAccountSourceBody,
  IAccountSourceDataFormat,
  IAccountSourceResponse,
  IAdvancedAccountSourceResponse,
  IDialogAccountSource,
  TAccountSourceActions
} from '@/core/account-source/models'
import { formatArrayData, getTypes } from '@/libraries/utils'
import { IBaseResponsePagination, IDataTableConfig } from '@/types/common.i'
import toast from 'react-hot-toast'

export const handleShowDetailAccountSource = (
  setFormData: React.Dispatch<React.SetStateAction<IAccountSourceBody>>,
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogAccountSource>>,
  getAccountSourceById: any
) => {
  const data: IAccountSourceBody = getAccountSourceById

  setFormData({
    id: data.id,
    name: data.name,
    type: data.type,
    initAmount: data.initAmount,
    accountSourceType: (data as IAccountSourceBody & { checkType?: string }).checkType as EAccountSourceType,
    fundId: data.fundId
  })
  setIsDialogOpen((prev) => ({ ...prev, isDialogUpdateOpen: true }))
}

export const handleCreateAccountSource = ({
  payload,
  setIsDialogOpen,
  createAccountSource,
  callBackOnSuccess
}: {
  payload: IAccountSourceBody
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogAccountSource>>
  createAccountSource: any
  callBackOnSuccess: (actions: TAccountSourceActions[]) => void
}) => {
  createAccountSource(payload, {
    onSuccess: (res: IAccountSourceResponse) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: false }))
        callBackOnSuccess(['getAllAccountSource', 'getStatisticAccountBalance', 'getAdvancedAccountSource'])
        toast.success('Create account source successfully!')
      }
    }
  })
}

export const handleUpdateAccountSource = ({
  payload,
  setIsDialogOpen,
  updateAccountSource,
  callBackOnSuccess
}: {
  payload: IAccountSourceBody
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogAccountSource>>
  updateAccountSource: any
  callBackOnSuccess: (actions: TAccountSourceActions[]) => void
}) => {
  updateAccountSource(payload, {
    onSuccess(res: IAccountSourceResponse) {
      if (res.statusCode === 200 || res.statusCode === 201) {
        callBackOnSuccess(['getAllAccountSource', 'getStatisticAccountBalance', 'getAdvancedAccountSource'])
        setIsDialogOpen((prev) => ({ ...prev, isDialogUpdateOpen: false, isDialogDetailOpen: false }))
        toast.success('Update account source successfully!')
      }
    }
  })
}

export const filterDataAccountSource = (selectedTypes: string[], data: IAccountSource[]) => {
  if (selectedTypes.length === 0)
    return formatArrayData<IAccountSource, IAccountSourceDataFormat>(data, formatAccountSourceData)
  const validValues = data.filter((item: IAccountSource) => selectedTypes.includes(item.type))

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

export const updateCacheDataForDeleteFeat = (
  oldData: IAdvancedAccountSourceResponse,
  newData: IAccountSource
): IAdvancedAccountSourceResponse => {
  const updatedData = oldData.data.filter((item) => item.id !== newData.id)
  return { ...oldData, data: updatedData }
}

export const updateCacheDetailData = (
  oldData: IAccountSourceResponse,
  newData: IAccountSource
): IAccountSourceResponse => {
  return { ...oldData, data: newData }
}

export const initDataTable = (
  setTableData: React.Dispatch<React.SetStateAction<IAccountSourceDataFormat[]>>,
  accountSourceData: IAccountSource[]
) => {
  const dataFormat: IAccountSourceDataFormat[] = formatArrayData<IAccountSource, IAccountSourceDataFormat>(
    accountSourceData,
    formatAccountSourceData
  )

  setTableData(dataFormat)
}

export const onRowClick = (
  rowData: IAccountSourceDataFormat,
  advancedTrackerTxData: IAdvancedAccountSourceResponse | undefined,
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogAccountSource>>,
  setDataDetail: React.Dispatch<React.SetStateAction<IAccountSourceDataFormat>>
) => {
  if (advancedTrackerTxData) {
    const matchingData = advancedTrackerTxData.data.find((data) => data.id === rowData.id)
    if (!matchingData) return
    const updatedData = { ...rowData, data: { ...matchingData } }
    setIsDialogOpen((prev) => ({ ...prev, isDialogDetailOpen: true }))
    setDataDetail(updatedData)
  }
}

export const handleSubmitAccountSource = ({
  payload,
  isDialogOpen,
  setIsDialogOpen,
  callBackOnSuccess,
  hookUpdate,
  hookCreate,
  fundId
}: {
  payload: IAccountSourceBody
  isDialogOpen: IDialogAccountSource
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogAccountSource>>
  callBackOnSuccess: (actions: TAccountSourceActions[]) => void
  hookUpdate: any
  hookCreate: any
  fundId: string
}) => {
  if (isDialogOpen.isDialogUpdateOpen) {
    handleUpdateAccountSource({
      payload,
      setIsDialogOpen,
      updateAccountSource: hookUpdate,
      callBackOnSuccess
    })
  }
  if (isDialogOpen.isDialogCreateOpen) {
    handleCreateAccountSource({
      payload: {
        ...payload,
        fundId
      },
      setIsDialogOpen,
      createAccountSource: hookCreate,
      callBackOnSuccess
    })
  }
}

export const handleDeleteMultipleAccountSource = ({
  hookDelete,
  idDeletes,
  callBackOnSuccess,
  setDataTableConfig,
  setIsDialogOpen,
  setIdDeletes
}: {
  hookDelete: any
  idDeletes: string[]
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogAccountSource>>
  setIdDeletes: React.Dispatch<React.SetStateAction<string[]>>
  callBackOnSuccess: (actions: TAccountSourceActions[]) => void
  setDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
}) => {
  hookDelete(
    { ids: idDeletes },
    {
      onSuccess: (res: any) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          callBackOnSuccess(['getAdvancedAccountSource', 'getAllAccountSource', 'getStatisticAccountBalance'])
          setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
          setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteOpen: false }))
          setIdDeletes([])
          setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteAllOpen: false }))
          toast.success('Delete all account source successfully')
        }
      }
    }
  )
}

export const handleDeleteAnAccountSource = ({
  hookDelete,
  id,
  callBackOnSuccess,
  setDataTableConfig,
  setIsDialogOpen,
  setIdDeletes
}: {
  hookDelete: any
  id: string
  callBackOnSuccess: (actions: TAccountSourceActions[]) => void
  setDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogAccountSource>>
  setIdDeletes: React.Dispatch<React.SetStateAction<string[]>>
}) => {
  hookDelete(
    { id },
    {
      onSuccess: (res: any) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          callBackOnSuccess(['getAllAccountSource', 'getStatisticAccountBalance', 'getAdvancedAccountSource'])
          setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
          setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteOpen: false }))
          setIdDeletes([])
          toast.success('Delete account source successfully')
        }
      }
    }
  )
}
