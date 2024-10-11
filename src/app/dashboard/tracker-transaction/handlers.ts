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

import {
  IDialogTrackerTransaction,
  ITrackerTransactionResponse
} from '@/core/tracker-transaction/models/tracker-transaction.interface'
import {
  IClassifyTransactionFormData,
  ICreateTransactionFormData,
  IDataTransactionTable,
  Transaction
} from '@/core/transaction/models'
import toast from 'react-hot-toast'
import { initCreateTrackerTransactionForm } from '../transaction/constants'
import React from 'react'
import { modifyTransactionHandler } from '../transaction/handler'

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
  setIsDialogOpen
}: {
  formData: ICreateTransactionFormData
  setFormData: React.Dispatch<React.SetStateAction<ICreateTransactionFormData>>
  hookCreate: any
  hookUpdateCache: any
  setIsDialogOpen: React.Dispatch<React.SetStateAction<any>>
}) => {
  hookCreate(formData, {
    onSuccess: (res: ITrackerTransactionResponse) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        hookUpdateCache(res.data)
        toast.success('Create tracker transaction successfully!')
        setFormData({ ...initCreateTrackerTransactionForm })
        setIsDialogOpen((prev: any) => ({ ...prev, isDialogClassifyOpen: false }))
      }
    }
  })
}

export const handleClassifyTrackerTransaction = async ({
  formData,
  setFormData,
  hookCreate,
  hookUpdateCache,
  setIsDialogOpen
}: {
  formData: IClassifyTransactionFormData
  setFormData: React.Dispatch<React.SetStateAction<IClassifyTransactionFormData>>
  hookCreate: any
  hookUpdateCache: any
  setIsDialogOpen: React.Dispatch<React.SetStateAction<any>>
}) => {
  hookCreate(formData, {
    onSuccess: (res: ITrackerTransactionResponse) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        hookUpdateCache(res.data)
        toast.success('Create tracker transaction successfully!')
        setFormData({ ...initCreateTrackerTransactionForm })
        setIsDialogOpen((prev: any) => ({ ...prev, isDialogClassifyOpen: false }))
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
  const transactionToday = dataTransaction.filter((item: Transaction) => {
    isIsoStringInToday(item.time)
  })
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
