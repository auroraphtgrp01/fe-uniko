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
import { IClassifyTransactionFormData, IDataTransactionTable, IDialogTransaction } from '@/core/transaction/models'
import toast from 'react-hot-toast'
import { initClassifyTransactionForm } from '../transaction/constants'
import React from 'react'

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
  formData: IClassifyTransactionFormData
  setFormData: React.Dispatch<React.SetStateAction<IClassifyTransactionFormData>>
  hookCreate: any
  hookUpdateCache: any
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTransaction>>
}) => {
  hookCreate(formData, {
    onSuccess: (res: ITrackerTransactionResponse) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        hookUpdateCache(res.data)
        toast.success('Create tracker transaction successfully!')
        setFormData({ ...initClassifyTransactionForm })
        setIsDialogOpen((prev) => ({ ...prev, isDialogClassifyTransactionOpen: false, isDialogDetailOpen: false }))
      }
    }
  })
}

export const initTodayAndUnclassifiedTx = (
  dataTable: IDataTransactionTable[],
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
  const transactionToday = dataTable.filter((item: IDataTransactionTable) => isIsoStringToday(item.time))
  const unclassifiedTransaction = dataTable.filter((item: IDataTransactionTable) => !item.trackerTransactionId)
  const totalAmountToday = transactionToday.reduce((acc, item) => acc + parseFloat(item.amount), 0)
  const totalAmountUnclassified = unclassifiedTransaction.reduce((acc, item) => acc + parseFloat(item.amount), 0)
  setDataTableTransactionToday({
    totalTransaction: transactionToday.length,
    totalAmount: totalAmountToday,
    data: transactionToday
  })
  setDataTableUnclassifiedTransaction({
    totalTransaction: unclassifiedTransaction.length,
    totalAmount: totalAmountUnclassified,
    data: transactionToday
  })
}

function isIsoStringToday(isoString: string): boolean {
  const inputDate = new Date(isoString)
  if (isNaN(inputDate.getTime())) {
    return false
  }
  const today = new Date()
  return (
    inputDate.getUTCFullYear() === today.getUTCFullYear() &&
    inputDate.getUTCMonth() === today.getUTCMonth() &&
    inputDate.getUTCDate() === today.getUTCDate()
  )
}
