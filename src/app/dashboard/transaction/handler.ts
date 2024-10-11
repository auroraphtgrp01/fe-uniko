import { IAccountBank } from '@/core/account-bank/models'
import { IDataTransactionTable, Transaction } from '@/core/transaction/models'
import { formatCurrency } from '@/libraries/utils'
import React from 'react'
import toast from 'react-hot-toast'

export const modifyTransactionHandler = (payload: Transaction[]): IDataTransactionTable[] => {
  return payload.map((item: Transaction) => {
    return {
      id: item.id,
      transactionId: item.transactionId,
      amount: formatCurrency(item.amount, 'VND', 'vi-VN'),
      direction: item.direction,
      accountBank: item.accountBankId,
      currency: item.currency,
      accountNo: item.ofAccount.accountNo,
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
        toast.success(`Refetch payment in bank ${accountBankRefetching.login_id} success!`)
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

export const updateDataCache = (oldData: any, newData: any) => {
  return {
    ...oldData,
    ...newData
  }
}
