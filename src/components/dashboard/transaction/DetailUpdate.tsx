'use client'

import { useEffect, useRef, useState } from 'react'
import {
  CalendarIcon,
  CreditCard,
  DollarSign,
  User,
  Pencil,
  BookUser,
  BookUserIcon,
  FileTextIcon,
  WalletCardsIcon
} from 'lucide-react'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { IDialogTransaction, ITransaction } from '@/core/transaction/models'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { Button } from '@/components/ui/button'
import { cn, formatDateTimeVN } from '@/libraries/utils'
import { ITrackerTransaction } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import FormZod from '@/components/core/FormZod'
import {
  defineUpdateTransactionFormBody,
  updateTransactionSchema
} from '@/core/transaction/constants/update-transaction.constant'
import { IAccountSource } from '@/core/account-source/models'

type TransactionStatus = 'Thành công' | 'Đang xử lý' | 'Thất bại'
type TransactionType = 'Chuyển khoản' | 'Nạp tiền' | 'Rút tiền'

interface DetailTransaction {
  transactionId: string
  amount: number
  currency: string
  type: TransactionType
  status: TransactionStatus
  date: string
  accountNumberSender: string
  accountNumberRecipient: string
}
interface IDetailUpdateTransactionDialogProps {
  transaction: ITransaction
  trackerTransaction?: Omit<ITrackerTransaction, 'Transaction'>
  accountSourceData: IAccountSource[]
}
export default function DetailUpdateTransaction({
  transaction,
  trackerTransaction,
  accountSourceData
}: IDetailUpdateTransactionDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  const updateTransactionRef = useRef<HTMLFormElement>(null)
  const updateTrackerTransactionRef = useRef<HTMLFormElement>(null)

  const TransactionDetails = () => (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <h3 className='text-2xl font-bold'>
            {transaction.amount.toLocaleString()} {transaction.currency}
          </h3>
          <Badge
            className='rounded-full px-4 py-1 text-base font-semibold'
            style={{
              backgroundColor:
                transaction.direction === ETypeOfTrackerTransactionType.INCOMING
                  ? window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? '#b3e6cc'
                    : '#e6f7ee'
                  : window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? '#f4cccc'
                    : '#fde5e5',
              color:
                transaction.direction === ETypeOfTrackerTransactionType.INCOMING
                  ? window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? '#276749'
                    : '#276749'
                  : window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? '#a94442'
                    : '#a94442'
            }}
          >
            {transaction.direction === ETypeOfTrackerTransactionType.INCOMING ? 'Incoming' : 'Expense'}
          </Badge>
        </div>
        <p className='text-sm text-muted-foreground'>{'Chuyển khoản'}</p>
      </div>
      <div className='space-y-4'>
        <div className='flex items-center space-x-4'>
          <CalendarIcon className='text-muted-foreground' />
          <span>{formatDateTimeVN(transaction.time, true)}</span>
        </div>
        {transaction.transactionId && (
          <div className='flex items-center space-x-4'>
            <CreditCard className='text-muted-foreground' />
            <span>Mã giao dịch: {transaction.transactionId}</span>
          </div>
        )}

        <div className='space-y-2'>
          <div className='font-semibold'>Ví gửi</div>

          {transaction.ofAccount ? (
            <div className='flex items-start gap-3'>
              <Avatar>
                <AvatarFallback className='bg-muted'>
                  <WalletCardsIcon />
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <span className='font-medium'>{transaction.accountSource?.name}</span>
                {transaction.accountSource.accountBank && (
                  <span className='text-sm text-muted-foreground'>
                    {transaction.ofAccount.accountNo +
                      ' • ' +
                      (transaction.accountSource.accountBank.type === 'MB_BANK' ? 'MB Bank' : 'N/A')}
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
              <span className='font-medium'>{transaction.accountSource?.name}</span>
            </div>
          )}
        </div>
        {transaction.toAccountNo && (
          <div className='space-y-2'>
            <div className='font-semibold'>Tài khoản nhận</div>
            <div className='flex items-start gap-3'>
              <Avatar>
                <AvatarFallback className='bg-muted'>
                  <BookUserIcon />
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <span className='font-medium'>{transaction.toAccountName}</span>
                <span className='text-sm text-muted-foreground'>
                  {transaction.toAccountNo} • {transaction.toBankName}
                </span>
              </div>
            </div>
          </div>
        )}
        {trackerTransaction && (
          <>
            <div className='flex items-center space-x-4'>
              <FileTextIcon className='text-muted-foreground' />
              <span>Mô tả: {trackerTransaction.reasonName}</span>
            </div>
            <div className='space-y-2'>
              <div className='font-semibold'>Ghi chú</div>
              <p>
                {trackerTransaction.description && trackerTransaction.description !== ''
                  ? trackerTransaction.description
                  : 'Không có ghi chú'}
              </p>
            </div>
          </>
        )}
      </div>
      <div className='flex justify-end'>
        <Button onClick={() => setIsEditing(true)}>
          <Pencil className='mr-2 h-4 w-4' />
          Cập nhật
        </Button>
      </div>
    </div>
  )

  const UpdateForm = () => (
    <FormZod
      submitRef={updateTransactionRef}
      formFieldBody={defineUpdateTransactionFormBody({ accountSourceData })}
      formSchema={updateTransactionSchema}
      onSubmit={() => {}}
    />

    // <form onSubmit={() => {}} className='space-y-4'>
    //   <div className='grid gap-2'>
    //     <Label htmlFor='amount'>Số tiền</Label>
    //     <Input id='amount' name='amount' type='number' defaultValue={emptyTransaction.amount} required />
    //   </div>
    //   <div className='grid gap-2'>
    //     <Label htmlFor='type'>Loại giao dịch</Label>
    //     <Select name='type' defaultValue={transaction.type}>
    //       <SelectTrigger id='type'>
    //         <SelectValue placeholder='Chọn loại giao dịch' />
    //       </SelectTrigger>
    //       <SelectContent>
    //         <SelectItem value='Chuyển khoản'>Chuyển khoản</SelectItem>
    //         <SelectItem value='Nạp tiền'>Nạp tiền</SelectItem>
    //         <SelectItem value='Rút tiền'>Rút tiền</SelectItem>
    //       </SelectContent>
    //     </Select>
    //   </div>
    //   <div className='grid gap-2'>
    //     <Label htmlFor='status'>Trạng thái</Label>
    //     <Select name='status' defaultValue={transaction.status}>
    //       <SelectTrigger id='status'>
    //         <SelectValue placeholder='Chọn trạng thái' />
    //       </SelectTrigger>
    //       <SelectContent>
    //         <SelectItem value='Thành công'>Thành công</SelectItem>
    //         <SelectItem value='Đang xử lý'>Đang xử lý</SelectItem>
    //         <SelectItem value='Thất bại'>Thất bại</SelectItem>
    //       </SelectContent>
    //     </Select>
    //   </div>
    //   <div className='grid gap-2'>
    //     <Label htmlFor='date'>Ngày giao dịch</Label>
    //     <Input id='date' name='date' type='date' defaultValue={transaction.date} required />
    //   </div>
    //   <div className='flex justify-between'>
    //     <Button type='button' variant='outline' onClick={() => setIsEditing(false)}>
    //       Hủy
    //     </Button>
    //     <Button type='submit'>Lưu thay đổi</Button>
    //   </div>
    // </form>
  )

  // return <div>{isEditing ? <UpdateForm /> : <TransactionDetails />}</div>
  return <div>{isEditing ? <UpdateForm /> : <TransactionDetails />}</div>
}
