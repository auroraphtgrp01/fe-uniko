import { IAccountBank } from '@/core/account-bank/models'
import { ITrackerTransactionResponse } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import {
  IClassifyTransactionFormData,
  IDataTransactionTable,
  IDialogTransaction,
  IGetTransactionResponse,
  Transaction
} from '@/core/transaction/models'
import { formatCurrency } from '@/libraries/utils'
import React from 'react'
import toast from 'react-hot-toast'
import { initCreateTrackerTransactionForm } from './constants'

export const modifyTransactionHandler = (payload: Transaction[]): IDataTransactionTable[] => {
  return payload.map((item: Transaction) => {
    return {
      id: item.id,
      transactionId: item.transactionId,
      amount: formatCurrency(item.amount, 'VND', 'vi-VN'),
      direction: item.direction,
      accountBank: item.accountBankId,
      currency: item.currency,
      accountNo: item.ofAccount ? item.ofAccount.accountNo : null,
      description: item.description,
      time: item.time,
      trackerTransactionId: item.trackerTransactionId
    }
  })
}

export const handleRefetchPaymentCompletion = ({
  accountBankRefetching,
  dataRefetchPayment,
  setAccountBankRefetchingQueue,
  setAccountBankRefetching
}: {
  accountBankRefetching: IAccountBank | undefined
  dataRefetchPayment:
    | {
        statusCode: number
        data: boolean
      }
    | undefined
  setAccountBankRefetchingQueue: React.Dispatch<React.SetStateAction<IAccountBank[]>>
  setAccountBankRefetching: React.Dispatch<React.SetStateAction<IAccountBank | undefined>>
}) => {
  if (accountBankRefetching && dataRefetchPayment) {
    if (dataRefetchPayment.statusCode === 200 && dataRefetchPayment.data === true)
      setTimeout(() => {
        toast.success(
          `Refetching payment in bank ${accountBankRefetching.login_id}. Please wait a few minutes to complete the request!`
        )
      }, 5000)
    else
      setTimeout(() => {
        toast.error(`Refetch payment in bank ${accountBankRefetching.login_id} failed!`)
      }, 5000)
    setAccountBankRefetchingQueue((prevQueue) => prevQueue.slice(1))
    setAccountBankRefetching(undefined)
  }
}
export const handleAccountBankRefetching = (
  accountBankRefetchingQueue: IAccountBank[],
  accountBankRefetching: IAccountBank | undefined,
  setAccountBankRefetching: React.Dispatch<React.SetStateAction<IAccountBank | undefined>>
) => {
  if (accountBankRefetchingQueue.length > 0 && accountBankRefetching === undefined)
    setAccountBankRefetching(accountBankRefetchingQueue[0])
}

export const updateCacheDataUpdate = (oldData: IGetTransactionResponse, newData: any): IGetTransactionResponse => {
  const updatedData = oldData.data.map((item: Transaction) => {
    return item.id === newData.transactionId ? { ...item, trackerTransactionId: newData.id } : item
  })
  return { ...oldData, data: updatedData }
}

export const handleClassifyTransaction = async ({
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
        toast.success('Classify transaction successfully!')
        setFormData(initCreateTrackerTransactionForm)
        setIsDialogOpen((prev: any) => ({ ...prev, isDialogClassifyTransactionOpen: false, isDialogDetailOpen: false }))
      }
    }
  })
}
