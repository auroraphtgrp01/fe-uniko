import { IAccountBank } from '@/core/account-bank/models'
import { ITrackerTransactionResponse } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import {
  IClassifyTransactionBody,
  IDataTransactionTable,
  IDialogTransaction,
  IGetTransactionResponse,
  ITransaction,
  ITransactionSummary,
  IUpdateTransactionBody,
  TTransactionActions
} from '@/core/transaction/models'
import { formatCurrency, formatDateTimeVN } from '@/libraries/utils'
import React from 'react'
import toast from 'react-hot-toast'
import { initCreateTrackerTransactionForm } from './constants'
import { IDataTableConfig } from '@/types/common.i'
import { QueryClient } from '@tanstack/react-query'

export const modifyTransactionHandler = (payload: ITransaction[]): IDataTransactionTable[] => {
  return payload.map((item: ITransaction) => {
    return {
      id: item.id,
      amount: formatCurrency(item.amount, 'đ', 'vi-VN'),
      direction: item.direction,
      accountSource: item.accountSource.name,
      accountNo: item.ofAccount ? item.ofAccount.accountNo : 'N/A',
      description: item.description,
      date: formatDateTimeVN(item.transactionDateTime, true),
      TrackerTransaction: item.TrackerTransaction
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

export const updateCacheDataTransactionForClassify = (
  oldData: IGetTransactionResponse,
  newData: any
): IGetTransactionResponse => {
  return {
    ...oldData,
    data: oldData.data.map((item: ITransaction) => {
      return item.id === newData.transactionId
        ? { ...item, TrackerTransaction: newData.Transaction.TrackerTransaction }
        : item
    })
  }
}

export const updateCacheDataTransactionForUpdate = (oldData: IGetTransactionResponse, newData: ITransaction) => {
  return {
    ...oldData,
    data: oldData.data.map((item: ITransaction) => {
      return item.id === newData.id ? newData : item
    })
  }
}

export const updateCacheDataTransactionForDelete = (oldData: IGetTransactionResponse, newData: ITransaction) => {
  const updatedData = oldData.data.filter((item: ITransaction) => item.id !== newData.id)
  return {
    ...oldData,
    data: updatedData
  }
}

export const handleClassifyTransaction = async ({
  formData,
  setFormData,
  hookCreate,
  hookUpdateCacheUnclassified,
  hookUpdateCache,
  setIsDialogOpen,
  hookSetDataTrackerTxs
}: {
  formData: IClassifyTransactionBody
  setFormData: React.Dispatch<React.SetStateAction<IClassifyTransactionBody>>
  hookCreate: any
  hookUpdateCacheUnclassified: any
  hookUpdateCache: any
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTransaction>>
  hookSetDataTrackerTxs: any
}) => {
  hookCreate(formData, {
    onSuccess: (res: ITrackerTransactionResponse) => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        hookUpdateCache(res.data)
        hookUpdateCacheUnclassified(res.data)
        hookSetDataTrackerTxs(res.data)
        toast.success('Classify transaction successfully!')
        setFormData(initCreateTrackerTransactionForm)
        setIsDialogOpen((prev: any) => ({ ...prev, isDialogClassifyTransactionOpen: false, isDialogDetailOpen: false }))
      }
    }
  })
}

export const paginateTodayTransactionDataTable = ({
  todayDataTableConfig,
  transactionSummary,
  setTransactionSummary
}: {
  todayDataTableConfig: IDataTableConfig[]
  transactionSummary: ITransactionSummary
  setTransactionSummary: React.Dispatch<React.SetStateAction<ITransactionSummary>>
}) => {
  setTransactionSummary((prev) => ({
    ...prev,
    transactionToday: {
      incomeAmount: 0,
      expenseAmount: 0,
      count: 0,
      data: transactionSummary.transactionToday.data.slice()
    }
  }))
}

export const handleUpdateTransaction = ({
  data,
  setIsEditing,
  hookUpdate,
  setDataTableConfig,
  setDetailDialog,
  callBackOnSuccess,
  setIsDialogOpen,
  queryClient
}: {
  data: IUpdateTransactionBody
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
  hookUpdate: any
  setDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
  setDetailDialog: React.Dispatch<React.SetStateAction<ITransaction>>
  callBackOnSuccess: (actions: TTransactionActions[]) => void
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTransaction>>
  queryClient: QueryClient
}) => {
  hookUpdate(data, {
    onSuccess: (res: any) => {
      if (res.statusCode === 200) {
        callBackOnSuccess([
          'getAllAccountSource',
          'getTransactions',
          'getTodayTransactions',
          'getStatistic',
          'getUnclassifiedTransactions'
        ])
        toast.success('Update transaction successfully!')
        setDataTableConfig((prev: any) => ({ ...prev, currentPage: 1 }))
        setDetailDialog(res.data)
        queryClient.clear()
        setIsEditing(false)
        setIsDialogOpen((prev: any) => ({ ...prev, isDialogDetailOpen: false }))
      }
    }
  })
}

export const handleDeleteTransaction = ({
  callBackOnSuccess,
  hookDelete,
  setIdDeletes,
  setIsDialogOpen,
  setUncDataTableConfig,
  setTodayDataTableConfig,
  setDataTableConfig,
  id
}: {
  hookDelete: any
  id: string
  setIdDeletes: React.Dispatch<React.SetStateAction<string[]>>
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTransaction>>
  setUncDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
  setTodayDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
  setDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
  callBackOnSuccess: (actions: TTransactionActions[]) => void
}) => {
  hookDelete(
    { id },
    {
      onSuccess: (res: any) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          callBackOnSuccess([
            'getTransactions',
            'getUnclassifiedTransactions',
            'getTodayTransactions',
            'getStatistic',
            'getAllAccountSource'
          ])
          setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
          setUncDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
          setTodayDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
          setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteOpen: false }))
          setIdDeletes([])
          toast.success('Delete account source successfully')
        }
      }
    }
  )
}

export const handleDeleteMultipleTransaction = ({
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
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTransaction>>
  setUncDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
  setTodayDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
  setDataTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
  callBackOnSuccess: (actions: TTransactionActions[]) => void
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
            'getAllAccountSource'
          ])
          setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
          setUncDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
          setTodayDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
          setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteOpen: false }))
          setIdDeletes([])
          toast.success('Delete all transaction successfully')
        }
      }
    }
  )
}
