import {
  IAdvancedTrackerTransactionResponse,
  ICustomTrackerTransaction,
  IDialogTrackerTransaction,
  ITrackerTransaction,
  ITrackerTransactionResponse
} from '@/core/tracker-transaction/models/tracker-transaction.interface'
import {
  IClassifyTransactionFormData,
  ICreateTrackerTransactionFormData,
  IDataTransactionTable,
  IDialogTransaction,
  Transaction
} from '@/core/transaction/models'
import toast from 'react-hot-toast'
import { initCreateTrackerTransactionForm, initCreateTrackerTxTypeForm } from '../transaction/constants'
import React from 'react'
import { modifyTransactionHandler } from '../transaction/handler'
import { IBaseResponsePagination, IDataTableConfig } from '@/types/common.i'
import { ITrackerTransactionTypeBody } from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { formatArrayData, formatDateTimeVN, getTypes } from '@/libraries/utils'

// const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
//   if (event.key === 'Enter') {
//     handleAddNewItem()
//   }
// }

export const handleCreateTrackerTransaction = async ({
  formData,
  setFormData,
  hookCreate,
  hookUpdateCache,
  setIsDialogOpen,
  hookResetCacheStatistic
}: {
  formData: ICreateTrackerTransactionFormData
  setFormData: React.Dispatch<React.SetStateAction<ICreateTrackerTransactionFormData>>
  hookCreate: any
  hookUpdateCache: any
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTrackerTransaction>>
  hookResetCacheStatistic: any
}) => {
  hookCreate(formData, {
    onSuccess: (res: ITrackerTransactionResponse) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        hookUpdateCache(res.data)
        hookResetCacheStatistic()
        toast.success('Create tracker transaction successfully!')
        setFormData(initCreateTrackerTransactionForm)
        setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: false }))
      }
    }
  })
}

export const handleClassifyTransaction = async ({
  formData,
  setFormData,
  hookCreate,
  hookUpdateCache,
  setIsDialogOpen,
  hookResetCacheStatistic,
  hookResetTrackerTx
}: {
  formData: IClassifyTransactionFormData
  setFormData: React.Dispatch<React.SetStateAction<IClassifyTransactionFormData>>
  hookCreate: any
  hookUpdateCache: any
  setIsDialogOpen: React.Dispatch<React.SetStateAction<any>>
  hookResetCacheStatistic: any
  hookResetTrackerTx: any
}) => {
  hookCreate(formData, {
    onSuccess: (res: ITrackerTransactionResponse) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        hookUpdateCache(res.data)
        hookResetCacheStatistic(res.data)
        hookResetTrackerTx(res.data)
        toast.success('Classify transaction successfully!')
        setFormData({ ...initCreateTrackerTransactionForm })
        setIsDialogOpen((prev: any) => ({ ...prev, isDialogClassifyTransactionOpen: false, isDialogDetailOpen: false }))
      }
    }
  })
}

export const initDataTableTransaction = (
  dataTransaction: Transaction[],
  setDataTable: React.Dispatch<React.SetStateAction<IDataTransactionTable[]>>,
  setDataTableUnclassifiedTransaction: React.Dispatch<
    React.SetStateAction<{
      totalTransaction: number
      totalAmount: number
      data: IDataTransactionTable[]
    }>
  >,
  setDataTableTransactionToday: React.Dispatch<
    React.SetStateAction<{
      totalTransaction: number
      totalAmount: number
      data: IDataTransactionTable[]
    }>
  >
) => {
  setDataTable(modifyTransactionHandler(dataTransaction))
  const transactionToday = dataTransaction.filter((item: Transaction) => isIsoStringInToday(item.time))
  const unclassifiedTransaction = dataTransaction.filter((item: Transaction) => !item.trackerTransactionId)
  const totalAmountToday = transactionToday.reduce((acc, item) => acc + item.amount, 0)
  const totalAmountUnclassified = unclassifiedTransaction.reduce((acc, item) => acc + item.amount, 0)

  setDataTableTransactionToday({
    totalTransaction: transactionToday.length,
    totalAmount: totalAmountToday,
    data: modifyTransactionHandler(transactionToday)
  })
  setDataTableUnclassifiedTransaction({
    totalTransaction: unclassifiedTransaction.length,
    totalAmount: totalAmountUnclassified,
    data: modifyTransactionHandler(unclassifiedTransaction)
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

export const updateCacheDataUpdate = (
  oldData: IAdvancedTrackerTransactionResponse,
  newData: any
): IAdvancedTrackerTransactionResponse => {
  return { ...oldData, data: oldData.data.filter((item: ITrackerTransaction) => item.id !== newData.transactionId) }
}

export const updateCacheDataCreate = (
  oldData: IAdvancedTrackerTransactionResponse,
  newData: ITrackerTransaction
): IAdvancedTrackerTransactionResponse => {
  const updatedData = [newData, ...oldData.data]

  if (updatedData.length > (oldData.pagination as IBaseResponsePagination).limit) updatedData.pop()
  return { ...oldData, data: updatedData }
}
// const handleAddNewItem = () => {
//   if (newItemValue.trim() !== '') {
//     const newItem = {
//       value: newItemValue.toUpperCase().replace(/\s+/g, '_'),
//       label: newItemValue.trim()
//     }
//     setItems([...items, newItem])
//     setNewItemValue('')
//     setIsAddingNew(false)
//     onValueChange(newItem.value)
//   }
// }

export const handleCreateTrackerTxType = ({
  formData,
  setFormData,
  hookCreateTrackerTxType,
  hookSetCacheTrackerTxType,
  setIsDialogOpen
}: {
  formData: ITrackerTransactionTypeBody
  setFormData: React.Dispatch<React.SetStateAction<ITrackerTransactionTypeBody>>
  hookCreateTrackerTxType: any
  hookSetCacheTrackerTxType: any
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTrackerTransaction>>
}) => {
  hookCreateTrackerTxType(formData, {
    onSuccess: (res: ITrackerTransactionResponse) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        hookSetCacheTrackerTxType(res.data)
        toast.success('Create tracker transaction type successfully!')
        setFormData(initCreateTrackerTxTypeForm)
        setIsDialogOpen((prev) => ({ ...prev, isDialogCreateTrackerTxTypeOpen: false }))
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

export const formatTrackerTransactionData = (data: ITrackerTransaction): ICustomTrackerTransaction => {
  return {
    id: data.id || '',
    reasonName: data.reasonName || '',
    type: data.Transaction.direction || '',
    checkType: data.Transaction.direction || '',
    trackerTypeName: data.TrackerType.name || '',
    amount: `${new Intl.NumberFormat('en-US').format(data.Transaction?.amount || 0)} ${data.Transaction?.currency}`,
    transactionDate: data.time ? formatDateTimeVN(data.time, false) : '',
    accountSourceName: data.Transaction?.accountSource?.name || ''
  }
}

export const filterTrackerTransactionWithType = (selectedTypes: string[], data: ITrackerTransaction[]) => {
  if (selectedTypes.length === 0)
    return formatArrayData<ITrackerTransaction, ICustomTrackerTransaction>(data, formatTrackerTransactionData)
  const validValues = data.filter((item: ITrackerTransaction) =>
    selectedTypes.includes(item.Transaction.direction as string)
  )

  return formatArrayData<ITrackerTransaction, ICustomTrackerTransaction>(validValues, formatTrackerTransactionData)
}

export const modifiedTrackerTypeForComboBox = (type: any) => {
  return type.map((item: any) => ({
    value: item.id,
    label: item.name,
    ...item
  }))
}
