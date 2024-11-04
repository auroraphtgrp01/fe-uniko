'use client'

import React, { useEffect, useRef } from 'react'
import { CalendarIcon, CreditCard, Pencil, BookUserIcon, FileTextIcon, WalletCardsIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ITransaction, IUpdateTransactionBody } from '@/core/transaction/models'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { Button } from '@/components/ui/button'
import { formatDateTimeVN } from '@/libraries/utils'
import {
  ITrackerTransaction,
  IUpdateTrackerTransactionBody
} from '@/core/tracker-transaction/models/tracker-transaction.interface'
import FormZod from '@/components/core/FormZod'
import {
  defineUpdateTransactionFormBody,
  updateTransactionSchema
} from '@/core/transaction/constants/update-transaction.constant'
import { IAccountSource } from '@/core/account-source/models'
import toast from 'react-hot-toast'

interface IDetailUpdateTransactionDialogProps {
  updateTransactionProps: {
    transaction: ITransaction
    statusUpdateTransaction?: 'error' | 'success' | 'pending' | 'idle'
    handleUpdateTransaction: (
      data: IUpdateTransactionBody,
      setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
    ) => void
    isEditing: boolean
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
  }
  updateTrackerTransactionProps?: {
    trackerTransaction: Omit<ITrackerTransaction, 'Transaction'>
    statusUpdateTrackerTransaction: 'error' | 'success' | 'pending' | 'idle'
    handleUpdateTrackerTransaction: (
      data: IUpdateTrackerTransactionBody,
      setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
    ) => void
    isEditing: boolean
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
  }
  commonProps: {
    accountSourceData: IAccountSource[]
  }
}
export default function DetailUpdateTransaction({
  updateTransactionProps,
  updateTrackerTransactionProps,
  commonProps
}: IDetailUpdateTransactionDialogProps) {
  const updateTransactionRef = useRef<HTMLFormElement>(null)
  const updateTrackerTransactionRef = useRef<HTMLFormElement>(null)

  const handleSubmit = () => {
    if (updateTransactionProps.isEditing) updateTransactionRef.current?.requestSubmit()
    if (updateTrackerTransactionProps?.isEditing) updateTrackerTransactionRef.current?.requestSubmit()
  }
  useEffect(() => {
    console.log(
      '🚀 ~ statusUpdateTrackerTransaction',
      updateTrackerTransactionProps?.statusUpdateTrackerTransaction,
      'statusUpdateTransaction:',
      updateTransactionProps.statusUpdateTransaction
    )
  }, [updateTrackerTransactionProps?.statusUpdateTrackerTransaction, updateTransactionProps.statusUpdateTransaction])

  const TransactionDetails = () => (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <h3 className='text-2xl font-bold'>
            {updateTransactionProps.transaction.amount.toLocaleString()} {updateTransactionProps.transaction.currency}
          </h3>
          <Badge
            className='rounded-full px-4 py-1 text-base font-semibold'
            style={{
              backgroundColor:
                updateTransactionProps.transaction.direction === ETypeOfTrackerTransactionType.INCOMING
                  ? window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? '#b3e6cc'
                    : '#e6f7ee'
                  : window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? '#f4cccc'
                    : '#fde5e5',
              color:
                updateTransactionProps.transaction.direction === ETypeOfTrackerTransactionType.INCOMING
                  ? window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? '#276749'
                    : '#276749'
                  : window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? '#a94442'
                    : '#a94442'
            }}
          >
            {updateTransactionProps.transaction.direction === ETypeOfTrackerTransactionType.INCOMING
              ? 'Incoming'
              : 'Expense'}
          </Badge>
        </div>
        <p className='text-sm text-muted-foreground'>{'Chuyển khoản'}</p>
      </div>
      <div className='space-y-4'>
        <div className='flex items-center space-x-4'>
          <CalendarIcon className='text-muted-foreground' />
          <span>{formatDateTimeVN(updateTransactionProps.transaction.time, true)}</span>
        </div>
        {updateTransactionProps.transaction.transactionId && (
          <div className='flex items-center space-x-4'>
            <CreditCard className='text-muted-foreground' />
            <span>Mã giao dịch: {updateTransactionProps.transaction.transactionId}</span>
          </div>
        )}
        <div className='space-y-2'>
          <div className='font-semibold'>Ví gửi</div>

          {updateTransactionProps.transaction.ofAccount ? (
            <div className='flex items-start gap-3'>
              <Avatar>
                <AvatarFallback className='bg-muted'>
                  <WalletCardsIcon />
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <span className='font-medium'>{updateTransactionProps.transaction.accountSource?.name}</span>
                {updateTransactionProps.transaction.accountSource.accountBank && (
                  <span className='text-sm text-muted-foreground'>
                    {updateTransactionProps.transaction.ofAccount.accountNo +
                      ' • ' +
                      (updateTransactionProps.transaction.accountSource.accountBank.type === 'MB_BANK'
                        ? 'MB Bank'
                        : 'N/A')}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className='flex items-center space-x-4'>
              <Avatar>
                <AvatarFallback>
                  <WalletCardsIcon />
                </AvatarFallback>
              </Avatar>
              <span className='font-medium'>{updateTransactionProps.transaction.accountSource?.name}</span>
            </div>
          )}
        </div>

        {updateTransactionProps.transaction.toAccountNo && (
          <div className='space-y-2'>
            <div className='font-semibold'>Tài khoản nhận</div>
            <div className='flex items-start gap-3'>
              <Avatar>
                <AvatarFallback className='bg-muted'>
                  <BookUserIcon />
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <span className='font-medium'>{updateTransactionProps.transaction.toAccountName}</span>
                <span className='text-sm text-muted-foreground'>
                  {updateTransactionProps.transaction.toAccountNo} • {updateTransactionProps.transaction.toBankName}
                </span>
              </div>
            </div>
          </div>
        )}
        {updateTrackerTransactionProps && (
          <>
            <div className='flex items-center space-x-4'>
              <FileTextIcon className='text-muted-foreground' />
              <span>Mô tả: {updateTrackerTransactionProps.trackerTransaction.reasonName}</span>
            </div>
            <div className='space-y-2'>
              <div className='font-semibold'>Ghi chú</div>
              <p>
                {updateTrackerTransactionProps.trackerTransaction.description &&
                updateTrackerTransactionProps.trackerTransaction.description !== ''
                  ? updateTrackerTransactionProps.trackerTransaction.description
                  : 'Không có ghi chú'}
              </p>
            </div>
          </>
        )}
      </div>
      <div className='flex justify-end'>
        <Button
          onClick={() => {
            if (updateTransactionProps.transaction.ofAccount) {
              if (!updateTrackerTransactionProps?.trackerTransaction)
                toast.error('Không thể chỉnh sửa giao dịch lấy từ tài khoản ngân hàng!')
            } else updateTransactionProps.setIsEditing(true)
            if (updateTrackerTransactionProps?.trackerTransaction) updateTrackerTransactionProps.setIsEditing(true)
          }}
        >
          <Pencil className='mr-2 h-4 w-4' />
          Cập nhật
        </Button>
      </div>
    </div>
  )

  const UpdateForm = () => (
    <div className='space-y-7'>
      <FormZod
        submitRef={updateTransactionRef}
        formFieldBody={defineUpdateTransactionFormBody({ accountSourceData: commonProps.accountSourceData })}
        formSchema={updateTransactionSchema}
        onSubmit={(data) => {
          const payload: IUpdateTransactionBody = {
            direction: data.direction as ETypeOfTrackerTransactionType,
            amount: Number(data.amount),
            id: updateTransactionProps.transaction.id
          }
          updateTransactionProps.handleUpdateTransaction(payload, updateTransactionProps.setIsEditing)
        }}
        defaultValues={{
          amount: String(updateTransactionProps.transaction.amount),
          direction: updateTransactionProps.transaction.direction as ETypeOfTrackerTransactionType
        }}
      />
      <div className='flex justify-between'>
        <Button type='button' variant='outline' onClick={() => updateTransactionProps.setIsEditing(false)}>
          Hủy
        </Button>
        <Button type='button' onClick={handleSubmit}>
          Lưu thay đổi
        </Button>
      </div>
    </div>
  )

  // return <div>{isEditing ? <UpdateForm /> : <TransactionDetails />}</div>
  return <div>{updateTransactionProps.isEditing ? <UpdateForm /> : <TransactionDetails />}</div>
}
