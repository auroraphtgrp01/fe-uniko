'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
  CalendarIcon,
  CreditCard,
  Pencil,
  BookUserIcon,
  FileTextIcon,
  WalletCardsIcon,
  User,
  Clock,
  ChartBarStackedIcon
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { IUpdateTransactionBody } from '@/core/transaction/models'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDateTimeVN, translate } from '@/libraries/utils'
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
  updateTrackerTransactionSchema
} from '@/core/tracker-transaction/constants/update-tracker-transaction.constant'
import { Pencil2Icon } from '@radix-ui/react-icons'
import { Separator } from '@/components/ui/separator'
import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
import {
  ITrackerTranSactionEditType,
  ITrackerTransactionType
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'

export default function DetailUpdateTransaction({
  updateTransactionProps,
  updateTrackerTransactionProps,
  commonProps,
  classifyDialogProps
}: IDetailUpdateTransactionDialogProps) {
  const submitUpdateTransactionRef = useRef<HTMLFormElement>(null)
  const submitUpdateTrackerTransactionRef = useRef<HTMLFormElement>(null)
  const formUpdateTrackerTransactionRef = useRef<any>()
  const [trackerTypeData, setTrackerTypeData] = useState<ITrackerTransactionType[]>([])
  const [transactionState, setTransactionState] = useState<ITrackerTranSactionEditType>({
    isUpdateTrackerTransaction:
      (updateTransactionProps.transaction.direction as ETypeOfTrackerTransactionType) ||
      ETypeOfTrackerTransactionType.INCOMING,
    direction: updateTransactionProps.transaction.direction as ETypeOfTrackerTransactionType,
    trackerTypeId: updateTrackerTransactionProps?.trackerTransaction.trackerTypeId || ''
  })
  const handleSubmit = () => {
    if (updateTransactionProps.isEditing) {
      if (
        classifyDialogProps?.formClassifyRef &&
        !updateTransactionProps.transaction.TrackerTransaction &&
        !updateTrackerTransactionProps
      ) {
        classifyDialogProps.formClassifyRef.current?.requestSubmit()
      } else {
        submitUpdateTransactionRef.current?.requestSubmit()
      }
    }
    if (updateTrackerTransactionProps?.isEditing) submitUpdateTrackerTransactionRef.current?.requestSubmit()
  }

  useEffect(() => {
    setTrackerTypeData(
      modifiedTrackerTypeForComboBox(
        transactionState.isUpdateTrackerTransaction === ETypeOfTrackerTransactionType.INCOMING
          ? updateTrackerTransactionProps?.editTrackerTransactionTypeProps.incomeTrackerType
          : updateTrackerTransactionProps?.editTrackerTransactionTypeProps.expenseTrackerType
      )
    )
  }, [transactionState.isUpdateTrackerTransaction])
  const t = translate(['transaction', 'common'])

  const TransactionDetails = () => (
    <div className='select-none space-y-6'>
      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <h3 className='text-2xl font-bold'>{formatCurrency(updateTransactionProps.transaction.amount, 'đ')}</h3>
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
        <div className='flex items-center gap-2'>
          <Clock className='h-4 w-4 text-muted-foreground' />
          <p className='font-medium'>{formatDateTimeVN(updateTransactionProps.transaction.time, true)}</p>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-1'>
          <p className='text-sm text-muted-foreground'>{t('transaction:transactionDetails.senderAccount')}</p>
          {updateTransactionProps.transaction.ofAccount ? (
            <div className='mt-1 flex items-start gap-3'>
              <Avatar>
                <AvatarFallback className='bg-muted'>
                  <WalletCardsIcon className='h-4 w-4 text-muted-foreground' />
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <span className='font-medium'>{updateTransactionProps.transaction.accountSource?.name}</span>
                <span className='text-sm text-muted-foreground'>
                  {updateTransactionProps.transaction.ofAccount.accountNo +
                    ' • ' +
                    (updateTransactionProps.transaction.accountBank.type === 'MB_BANK' ? 'MB Bank' : 'N/A')}
                </span>
              </div>
            </div>
          ) : (
            <div className='flex items-center gap-3'>
              <Avatar>
                <AvatarFallback>
                  <WalletCardsIcon className='h-4 w-4 text-muted-foreground' />
                </AvatarFallback>
              </Avatar>
              <span className='font-medium'>{updateTransactionProps.transaction.accountSource?.name}</span>
            </div>
          )}
        </div>

        {updateTransactionProps.transaction.toAccountNo && (
          <div className='space-y-1'>
            <p className='text-sm text-muted-foreground'>{t('transaction:transactionDetails.receiverAccount')}</p>
            <div className='flex items-start gap-3'>
              <Avatar>
                <AvatarFallback className='bg-muted'>
                  <BookUserIcon className='h-4 w-4 text-muted-foreground' />
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
      </div>

      <div className='space-y-2'>
        <div className='text-sm text-muted-foreground'>{t('transaction:transactionDetails.transactionContent')}</div>
        {updateTransactionProps.transaction.description ? (
          <div className='flex items-start gap-3'>
            <Avatar>
              <AvatarFallback className='bg-muted'>
                <Pencil2Icon className='h-4 w-4 text-muted-foreground' />
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <span className='text-sm text-muted-foreground'>
                {updateTransactionProps.transaction.description || 'N/A'}
              </span>
            </div>
          </div>
        ) : (
          <div className='flex items-center space-x-4'>
            <Avatar>
              <AvatarFallback className='bg-muted'>
                <Pencil2Icon className='h-5 w-5 bg-muted' />
              </AvatarFallback>
            </Avatar>
            <span className='text-sm text-muted-foreground'>N/A</span>
          </div>
        )}
      </div>

      {updateTransactionProps.transaction.transactionId && (
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <CreditCard className='h-4 w-4' />
          <span>
            {t('transaction:transactionDetails.transactionCode')} {updateTransactionProps.transaction.transactionId}
          </span>
        </div>
      )}

      {updateTrackerTransactionProps && (
        <>
          <Separator />
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>{t('transaction:transactionDetails.classifier')}</p>
                <div className='flex items-center gap-2'>
                  <User className='h-4 w-4 text-muted-foreground' />
                  <p className='font-medium'>
                    {updateTrackerTransactionProps.trackerTransaction.participant.user.fullName}
                  </p>
                </div>
              </div>

              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>
                  {t('transaction:transactionDetails.classificationTime')}
                </p>
                <div className='flex items-center gap-2'>
                  <Clock className='h-4 w-4 text-muted-foreground' />
                  <p className='font-medium'>
                    {formatDateTimeVN(updateTrackerTransactionProps.trackerTransaction.trackerTime, true)}
                  </p>
                </div>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>{t('transaction:transactionDetails.description')}</p>
                <div className='flex items-center gap-2'>
                  <p className='font-semibold'>
                    {updateTrackerTransactionProps.trackerTransaction.reasonName || 'N/A'}
                  </p>
                </div>
              </div>

              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>{t('transaction:transactionDetails.category')}</p>
                <div className='flex items-center gap-2'>
                  {/* <ChartBarStackedIcon className='h-4 w-4 text-muted-foreground' /> */}
                  <p className='font-medium'>{updateTrackerTransactionProps.trackerTransaction.TrackerType.name}</p>
                </div>
              </div>
            </div>

            <div className='space-y-1'>
              <p className='text-sm text-muted-foreground'>{t('transaction:transactionDetails.note')}</p>
              <p className='text-muted-foreground'>
                {updateTrackerTransactionProps.trackerTransaction.description ||
                  t('transaction:transactionDetails.noNote')}
              </p>
            </div>
          </div>
        </>
      )}

      <div className='flex justify-end'>
        <Button
          onClick={() => {
            if (
              updateTransactionProps.transaction.ofAccount &&
              updateTransactionProps.transaction.TrackerTransaction &&
              !updateTrackerTransactionProps
            )
              toast.error(t('transactionDetails.toast'))
            else updateTransactionProps.setIsEditing(true)
          }}
        >
          <Pencil className='mr-2 h-4 w-4' />
          {!updateTransactionProps.transaction.TrackerTransaction && !updateTrackerTransactionProps
            ? t('transactionDetails.classify')
            : t('common:button.update')}
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
                  setTransactionState((prevState) => ({
                    ...prevState,
                    isUpdateTrackerTransaction: value as ETypeOfTrackerTransactionType,
                    direction: value as ETypeOfTrackerTransactionType,
                    trackerTypeId:
                      value === updateTransactionProps.transaction.direction
                        ? updateTrackerTransactionProps?.trackerTransaction.trackerTypeId || ''
                        : ''
                  }))
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
                direction: transactionState.direction
              }}
            />
          )}

          {/* Form update tracker transaction */}
          {updateTrackerTransactionProps && (
            <FormZod
              formRef={formUpdateTrackerTransactionRef}
              submitRef={submitUpdateTrackerTransactionRef}
              formFieldBody={defineUpdateTrackerTransactionFormBody({
                trackerTypeData,
                editTrackerTypeDialogProps:
                  updateTrackerTransactionProps.editTrackerTransactionTypeProps.editTrackerTypeDialogProps,
                expenseTrackerType: updateTrackerTransactionProps.editTrackerTransactionTypeProps.expenseTrackerType,
                incomeTrackerType: updateTrackerTransactionProps.editTrackerTransactionTypeProps.incomeTrackerType,
                typeOfEditTrackerType: transactionState.isUpdateTrackerTransaction as ETypeOfTrackerTransactionType,
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
                trackerTypeId: transactionState.trackerTypeId || '',
                description: updateTrackerTransactionProps?.trackerTransaction.description
              }}
            />
          )}
        </>
      )}
      <div className='flex justify-between'>
        <Button type='button' variant='outline' onClick={() => updateTransactionProps.setIsEditing(false)}>
          {t('common:button.cancel')}
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
          {t('common:button.save_changes')}
        </Button>
      </div>
    </div>
  )

  return <div>{updateTransactionProps.isEditing ? <UpdateForm /> : <TransactionDetails />}</div>
}
