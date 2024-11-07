'use client'

import React, { useEffect, useRef } from 'react'
import { CalendarIcon, CreditCard, Pencil, BookUserIcon, FileTextIcon, WalletCardsIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { IUpdateTransactionBody } from '@/core/transaction/models'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { Button } from '@/components/ui/button'
import { formatDateTimeVN } from '@/libraries/utils'
import {
  IDetailUpdateTransactionDialogProps,
  IUpdateTrackerTransactionBody
} from '@/core/tracker-transaction/models/tracker-transaction.interface'
import FormZod from '@/components/core/FormZod'
import {
  defineUpdateTransactionFormBody,
  updateTransactionSchema
} from '@/core/transaction/constants/update-transaction.constant'
import toast from 'react-hot-toast'
import {
  defineUpdateTrackerTransactionFormBody,
  TUpdateTrackerTransactionSchema,
  updateTrackerTransactionSchema
} from '@/core/tracker-transaction/constants/update-tracker-transaction.constant'
import { UseFormSetValue } from 'react-hook-form'

export default function DetailUpdateTransaction({
  updateTransactionProps,
  updateTrackerTransactionProps,
  commonProps,
  classifyDialogProps
}: IDetailUpdateTransactionDialogProps) {
  const submitUpdateTransactionRef = useRef<HTMLFormElement>(null)
  const submitUpdateTrackerTransactionRef = useRef<HTMLFormElement>(null)
  const formUpdateTrackerTransactionRef = useRef<any>()

  const handleSubmit = () => {
    if (updateTransactionProps.isEditing) {
      if (classifyDialogProps?.formClassifyRef) {
        classifyDialogProps.formClassifyRef.current?.requestSubmit()
      } else {
        submitUpdateTransactionRef.current?.requestSubmit()
      }
    }
    if (updateTrackerTransactionProps?.isEditing) submitUpdateTrackerTransactionRef.current?.requestSubmit()
  }

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
            if (
              updateTransactionProps.transaction.ofAccount &&
              updateTransactionProps.transaction.TrackerTransaction &&
              !updateTrackerTransactionProps
            )
              toast.error('Không thể chỉnh sửa giao dịch lấy từ tài khoản ngân hàng!')
            else updateTransactionProps.setIsEditing(true)
          }}
        >
          <Pencil className='mr-2 h-4 w-4' />
          {!updateTransactionProps.transaction.TrackerTransaction && !updateTrackerTransactionProps
            ? 'Phân loại'
            : 'Cập nhật'}
        </Button>
      </div>
    </div>
  )

  const UpdateForm = () => (
    <div className='space-y-7'>
      {!updateTransactionProps.transaction.TrackerTransaction && classifyDialogProps ? (
        <classifyDialogProps.ClassifyForm />
      ) : (
        <>
          {/* Form update transaction */}
          {!updateTransactionProps.transaction.ofAccount && (
            <FormZod
              submitRef={submitUpdateTransactionRef}
              formFieldBody={defineUpdateTransactionFormBody({
                accountSourceData: commonProps.accountSourceData,
                handleSetTrackerTypeDefault: (value: string) => {
                  if (value !== updateTransactionProps.transaction.direction) {
                    console.log('value', value)

                    formUpdateTrackerTransactionRef.current?.setValue('trackerTypeId', undefined)
                    console.log(
                      'formUpdateTrackerTransactionRef',
                      formUpdateTrackerTransactionRef.current?.getValues('trackerTypeId')
                    )
                  }
                }
              })}
              formSchema={updateTransactionSchema}
              onSubmit={(data) => {
                const payload: IUpdateTransactionBody = {
                  accountSourceId: data.accountSourceId,
                  direction: data.direction as ETypeOfTrackerTransactionType,
                  amount: Number(data.amount),
                  id: updateTransactionProps.transaction.id
                }
                updateTransactionProps.handleUpdateTransaction(payload, updateTransactionProps.setIsEditing)
              }}
              defaultValues={{
                amount: String(updateTransactionProps.transaction.amount),
                accountSourceId: updateTransactionProps.transaction.accountSource.id,
                direction: updateTransactionProps.transaction.direction as ETypeOfTrackerTransactionType
              }}
            />
          )}

          {/* Form update tracker transaction */}
          {updateTrackerTransactionProps && (
            <FormZod
              formRef={formUpdateTrackerTransactionRef}
              submitRef={submitUpdateTrackerTransactionRef}
              formFieldBody={defineUpdateTrackerTransactionFormBody({
                editTrackerTypeDialogProps:
                  updateTrackerTransactionProps.editTrackerTransactionTypeProps.editTrackerTypeDialogProps,
                expenseTrackerType: updateTrackerTransactionProps.editTrackerTransactionTypeProps.expenseTrackerType,
                incomeTrackerType: updateTrackerTransactionProps.editTrackerTransactionTypeProps.incomeTrackerType,
                typeOfEditTrackerType: updateTrackerTransactionProps.typeOfEditTrackerType,
                setTypeOfEditTrackerType: updateTrackerTransactionProps.setTypeOfEditTrackerType,
                setOpenEditDialog: updateTrackerTransactionProps.setOpenEditDialog,
                openEditDialog: updateTrackerTransactionProps.openEditDialog
              })}
              formSchema={updateTrackerTransactionSchema}
              onSubmit={(data: any) => {
                const payload: IUpdateTrackerTransactionBody = {
                  ...data,
                  id: updateTrackerTransactionProps.trackerTransaction.id
                }

                updateTrackerTransactionProps.handleUpdateTrackerTransaction(
                  payload,
                  updateTransactionProps.setIsEditing
                )
              }}
              defaultValues={{
                reasonName: updateTrackerTransactionProps?.trackerTransaction.reasonName || '',
                trackerTypeId: updateTrackerTransactionProps?.trackerTransaction.trackerTypeId || '',
                description: updateTrackerTransactionProps?.trackerTransaction.description
              }}
            />
          )}
        </>
      )}
      <div className='flex justify-between'>
        <Button type='button' variant='outline' onClick={() => updateTransactionProps.setIsEditing(false)}>
          Hủy
        </Button>
        <Button
          type='button'
          onClick={handleSubmit}
          isLoading={
            updateTrackerTransactionProps
              ? updateTrackerTransactionProps.statusUpdateTrackerTransaction === 'pending' &&
                updateTransactionProps.statusUpdateTransaction === 'pending'
              : updateTransactionProps.statusUpdateTransaction === 'pending'
          }
        >
          Lưu thay đổi
        </Button>
      </div>
    </div>
  )

  // return <div>{isEditing ? <UpdateForm /> : <TransactionDetails />}</div>
  return <div>{updateTransactionProps.isEditing ? <UpdateForm /> : <TransactionDetails />}</div>
}
