import {
  IAdvancedTrackerTransactionResponse,
  ICustomTrackerTransaction,
  IDialogTrackerTransaction,
  ITrackerTransaction,
  ITrackerTransactionResponse,
  IUpdateTrackerTransactionBody,
  TTrackerTransactionActions
} from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { IClassifyTransactionBody, ICreateTrackerTransactionBody, ITransaction } from '@/core/transaction/models'
import toast from 'react-hot-toast'
import React from 'react'
import { IBaseResponsePagination, IDataTableConfig } from '@/types/common.i'
import {
  ITrackerTransactionType,
  ITrackerTransactionTypeBody
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { formatArrayData, formatCurrency, formatDateTimeVN, getTypes } from '@/libraries/utils'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { IFlatListData } from '@/components/core/FlatList'
import { formatTrackerTransactionData } from '@/app/dashboard/tracker-transaction/constants'
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import { IAdvancedAccountSourceResponse } from '@/core/account-source/models'

export const handleCreateTrackerTransaction = async ({
  payload,
  hookCreate,
  setIsDialogOpen,
  setDataTableConfig,
  setUncDataTableConfig,
  callbackOnSuccess,
  refetchAllAccountSourceData
}: {
  payload: ICreateTrackerTransactionBody
  hookCreate: any
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTrackerTransaction>>
  setDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
  setUncDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
  callbackOnSuccess: (actions: TTrackerTransactionActions[]) => void
  refetchAllAccountSourceData: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<IAdvancedAccountSourceResponse, Error>>
}) => {
  hookCreate(payload, {
    onSuccess: (res: ITrackerTransactionResponse) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        callbackOnSuccess([
          'getTrackerTransaction',
          'getStatistic',
          'getTodayTransactions',
          'getTransactions',
          'getAllAccountSource',
          'getStatisticExpenditureFund',
          'getStatisticExpenditureFund',
          'getExpenditureFund',
          'getAllAccountSource',
          'getStatisticOverview'
        ])
        setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
        setUncDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
        setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: false }))
        refetchAllAccountSourceData()
        toast.success('Create tracker transaction successfully!')
      }
    }
  })
}

export const handleClassifyTransaction = async ({
  payload,
  setIsDialogOpen,
  hookClassify,
  setUncDataTableConfig,
  setTodayDataTableConfig,
  setDataTableConfig,
  setIsEditing,
  callBackOnSuccess
}: {
  payload: IClassifyTransactionBody
  setIsDialogOpen: React.Dispatch<React.SetStateAction<any>>
  hookClassify: any
  callBackOnSuccess: (
    actions: (
      | 'getTransactions'
      | 'getUnclassifiedTransactions'
      | 'getTodayTransactions'
      | 'getStatistic'
      | 'getTrackerTransaction'
      | 'getExpenditureFund'
      | 'getStatisticOverview'
    )[]
  ) => void
  setUncDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
  setTodayDataTableConfig?: React.Dispatch<React.SetStateAction<IDataTableConfig>>
  setDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  hookClassify(payload, {
    onSuccess: (res: ITrackerTransactionResponse) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        callBackOnSuccess([
          'getTransactions',
          'getUnclassifiedTransactions',
          'getTodayTransactions',
          'getStatistic',
          'getTrackerTransaction',
          'getExpenditureFund',
          'getStatisticOverview'
        ])
        if (setUncDataTableConfig) setUncDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
        if (setTodayDataTableConfig) setTodayDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
        if (setDataTableConfig) setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
        if (setIsEditing) setIsEditing(false)
        setIsDialogOpen((prev: any) => ({
          ...prev,
          isDialogClassifyTransactionOpen: false,
          isDialogDetailTransactionOpen: false
        }))
        toast.success('Classify transaction successfully!')
      }
    }
  })
}

function isIsoStringInToday(isoString: string): boolean {
  const today = new Date()
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0)
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999)
  const inputDate = new Date(isoString)

  if (isNaN(inputDate.getTime())) {
    return false
  }

  return inputDate >= startOfToday && inputDate <= endOfToday
}

export const updateCacheDataClassifyFeat = (
  oldData: IAdvancedTrackerTransactionResponse,
  newData: ITrackerTransaction
): IAdvancedTrackerTransactionResponse => {
  return { ...oldData, data: oldData.data.filter((item: ITrackerTransaction) => item.id !== newData.transactionId) }
}

function instanceOfInterface<T>(object: any): object is T {
  return 'member' in object
}

export const updateCacheDataTodayTxClassifyFeat = (
  oldData: IAdvancedTrackerTransactionResponse,
  newData: ITrackerTransaction
): IAdvancedTrackerTransactionResponse => {
  const updatedData = oldData.data.map((item) => {
    return item.id === newData.transactionId ? { ...item, ...newData.Transaction } : item
  })
  return { ...oldData, data: updatedData.flat() }
}

export const updateCacheDataCreateClassify = (
  oldData: IAdvancedTrackerTransactionResponse,
  newData: ITrackerTransaction
): IAdvancedTrackerTransactionResponse => {
  const updatedData = [newData, ...oldData.data]

  if (updatedData.length > (oldData.pagination as IBaseResponsePagination).limit) updatedData.pop()
  return { ...oldData, data: updatedData }
}

export const updateCacheDataDeleteFeat = (
  oldData: IAdvancedTrackerTransactionResponse,
  newData: ITrackerTransaction
): IAdvancedTrackerTransactionResponse => {
  const updatedData = oldData.data.filter((item) => item.id !== newData.id)

  return { ...oldData, data: updatedData }
}

export const handleCreateTrackerTxType = ({
  payload,
  hookCreate,
  setIsCreating,
  callBackOnSuccess
}: {
  payload: ITrackerTransactionTypeBody
  hookCreate: any
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
  callBackOnSuccess: (actions: ('getAllTrackerTransactionType' | 'getExpenditureFund')[]) => void
}) => {
  hookCreate(payload, {
    onSuccess: (res: ITrackerTransactionResponse) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        callBackOnSuccess(['getAllTrackerTransactionType', 'getExpenditureFund'])
        toast.success('Create tracker transaction type successfully!')
        setIsCreating(false)
      }
    }
  })
}

export const handleUpdateTrackerTxType = ({
  payload,
  hookUpdate,
  callBackOnSuccess
}: {
  payload: ITrackerTransactionTypeBody
  hookUpdate: any
  callBackOnSuccess: (actions: 'getAllTrackerTransactionType'[]) => void
}) => {
  hookUpdate(payload, {
    onSuccess: (res: ITrackerTransactionResponse) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        callBackOnSuccess(['getAllTrackerTransactionType'])
        toast.success('Update tracker transaction type successfully!')
      }
    }
  })
}

export const initTrackerTransactionDataTable = (
  isGetAdvancedPending: boolean,
  getAdvancedData: IAdvancedTrackerTransactionResponse | undefined,
  setDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>,
  setTableData: React.Dispatch<React.SetStateAction<ICustomTrackerTransaction[]>>
) => {
  if (!isGetAdvancedPending && getAdvancedData) {
    const formattedData: ICustomTrackerTransaction[] = formatArrayData(
      getAdvancedData.data,
      formatTrackerTransactionData
    )

    setDataTableConfig((prev) => ({
      ...prev,
      types: getTypes(getAdvancedData.data, 'Transaction.direction'),
      totalPage: Number(getAdvancedData.pagination?.totalPage)
    }))
    setTableData(formattedData)
  }
}

export const filterTrackerTransactionWithType = (selectedTypes: string[], data: ITrackerTransaction[]) => {
  if (selectedTypes.length === 0)
    return formatArrayData<ITrackerTransaction, ICustomTrackerTransaction>(data, formatTrackerTransactionData)
  const validValues = data.filter((item: ITrackerTransaction) =>
    selectedTypes.includes(item.Transaction?.direction as string)
  )

  return formatArrayData<ITrackerTransaction, ICustomTrackerTransaction>(validValues, formatTrackerTransactionData)
}

export const onRowClick = (
  rowData: ICustomTrackerTransaction,
  advancedTrackerTxData: IAdvancedTrackerTransactionResponse | undefined,
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTrackerTransaction>>
) => {
  if (advancedTrackerTxData) {
    const transactionData = advancedTrackerTxData.data.find((item) => item.id === rowData.id)
    setIsDialogOpen((prev) => ({ ...prev, isDialogClassifyTransactionOpen: true }))
  }
}

export const modifiedTrackerTypeForComboBox = (type: any) => {
  return type?.map((item: any) => ({
    value: item.id,
    label: `${item.name}${item.currentAmount ? ` - ${formatCurrency(item.currentAmount, 'VND').split(',').join('.')}` : ''}`,
    ...item
  }))
}

export const initTrackerTypeData = (
  data: ITrackerTransactionType[],
  setIncomingTrackerType: React.Dispatch<React.SetStateAction<ITrackerTransactionType[]>>,
  setExpenseTrackerType: React.Dispatch<React.SetStateAction<ITrackerTransactionType[]>>
) => {
  setIncomingTrackerType(data?.filter((item) => item.type === ETypeOfTrackerTransactionType.INCOMING))
  setExpenseTrackerType(data?.filter((item) => item.type === ETypeOfTrackerTransactionType.EXPENSE))
}

export const handleCreateTrackerType = ({
  payload,
  hookCreate,
  hookUpdateCacheTrackerType,
  setIsCreating
}: {
  hookCreate: any
  hookUpdateCacheTrackerType: any
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
  payload: ITrackerTransactionTypeBody
}) => {
  hookCreate(payload, {
    onSuccess: (res: ITrackerTransactionResponse) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        hookUpdateCacheTrackerType(res.data)
        setIsCreating(false)
        toast.success('Create tracker transaction type successfully!')
      }
    }
  })
}

export const handleUpdateTrackerTransaction = async ({
  data,
  hookUpdate,
  setDataTableConfig,
  setIsEditing,
  setIsDialogOpen,
  callBackOnSuccess,
  refetchAllAccountSourceData
}: {
  data: IUpdateTrackerTransactionBody
  hookUpdate: any
  setDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTrackerTransaction>>
  callBackOnSuccess: (actions: TTrackerTransactionActions[]) => void
  refetchAllAccountSourceData: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<IAdvancedAccountSourceResponse, Error>>
}) => {
  hookUpdate(data, {
    onSuccess: (res: any) => {
      if (res.statusCode === 200) {
        callBackOnSuccess([
          'getTrackerTransaction',
          'getStatistic',
          'getTodayTransactions',
          'getTransactions',
          'getAllAccountSource',
          'getExpenditureFund'
        ])
        setIsDialogOpen((prev) => ({ ...prev, isDialogDetailOpen: false }))
        setDataTableConfig((prev: any) => ({ ...prev, currentPage: 1 }))
        setIsEditing(false)
        refetchAllAccountSourceData()
        toast.success('Update transaction successfully!')
      }
    }
  })
}

export const modifyFlatListData = (data: ITransaction[]): IFlatListData[] => {
  return data.map((item) => ({
    id: item.id,
    amount: formatCurrency(item.amount, 'đ'),
    accountNo: item.ofAccount?.accountNo || '',
    direction: item.direction as ETypeOfTrackerTransactionType,
    transactionDateTime: item.transactionDateTime
  }))
}

export const handleDeleteTrackerTransaction = ({
  id,
  hookDelete,
  callBackOnSuccess,
  setDataTableConfig,
  setIdDeletes,
  setIsDialogOpen
}: {
  callBackOnSuccess: (actions: TTrackerTransactionActions[]) => void
  id: string
  hookDelete: any
  setDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
  setIdDeletes: React.Dispatch<React.SetStateAction<string[]>>
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTrackerTransaction>>
}) => {
  hookDelete(
    { id },
    {
      onSuccess: (res: any) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          callBackOnSuccess([
            'getStatistic',
            'getTransactions',
            'getUnclassifiedTransactions',
            'getTodayTransactions',
            'getTrackerTransaction'
          ])
          setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
          setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteOpen: false }))
          setIdDeletes([])
          toast.success('Delete transaction successfully')
        }
      }
    }
  )
}

export const handleDeleteMultipleTrackerTransaction = ({
  callBackOnSuccess,
  hookDelete,
  setIdDeletes,
  setIsDialogOpen,
  setUncDataTableConfig,
  setTodayDataTableConfig,
  setDataTableConfig,
  ids
}: {
  hookDelete: any
  ids: string[]
  setIdDeletes: React.Dispatch<React.SetStateAction<string[]>>
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTrackerTransaction>>
  setUncDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
  setTodayDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
  setDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
  callBackOnSuccess: (actions: TTrackerTransactionActions[]) => void
}) => {
  hookDelete(
    { ids },
    {
      onSuccess: (res: any) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          callBackOnSuccess([
            'getTransactions',
            'getUnclassifiedTransactions',
            'getTodayTransactions',
            'getStatistic',
            'getAllAccountSource',
            'getExpenditureFund',
            'getTrackerTransaction'
          ])
          setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
          setUncDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
          setTodayDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
          setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteAllOpen: false }))
          setIdDeletes([])
          toast.success('Delete all transaction successfully')
        }
      }
    }
  )
}
