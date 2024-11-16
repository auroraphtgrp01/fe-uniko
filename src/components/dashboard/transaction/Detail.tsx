import { Button } from '@/components/ui/button'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import {
  IDialogTrackerTransaction,
  ITrackerTransaction
} from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { ITransaction } from '@/core/transaction/models'
import { formatDateTimeVN } from '@/libraries/utils'
import { IDialogConfig } from '@/types/common.i'
import { BookUserIcon, CalendarIcon, CreditCard, WalletCardsIcon } from 'lucide-react'
import CustomDialog from '../Dialog'
import { Badge } from '@/components/ui/badge'
import { Pencil2Icon } from '@radix-ui/react-icons'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function DetailTransactionDialog({
  detailData,
  isDialogOpen,
  setIsDialogOpen
}: {
  detailData: ITransaction
  isDialogOpen: IDialogTrackerTransaction
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTrackerTransaction>>
}) {
  const config: IDialogConfig = {
    content: (
      <div className='space-y-6'>
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <h3 className='text-2xl font-bold'>
              {detailData.amount.toLocaleString()} {detailData.currency}
            </h3>
            <Badge
              className='rounded-full px-4 py-1 text-base font-semibold'
              style={{
                backgroundColor:
                  detailData.direction === ETypeOfTrackerTransactionType.INCOMING
                    ? window.matchMedia('(prefers-color-scheme: dark)').matches
                      ? '#b3e6cc'
                      : '#e6f7ee'
                    : window.matchMedia('(prefers-color-scheme: dark)').matches
                      ? '#f4cccc'
                      : '#fde5e5',
                color:
                  detailData.direction === ETypeOfTrackerTransactionType.INCOMING
                    ? window.matchMedia('(prefers-color-scheme: dark)').matches
                      ? '#276749'
                      : '#276749'
                    : window.matchMedia('(prefers-color-scheme: dark)').matches
                      ? '#a94442'
                      : '#a94442'
              }}
            >
              {detailData.direction === ETypeOfTrackerTransactionType.INCOMING ? 'Incoming' : 'Expense'}
            </Badge>
          </div>
          <p className='text-sm text-muted-foreground'>{'Chuyển khoản'}</p>
        </div>
        <div className='space-y-4'>
          <div className='flex items-center space-x-4'>
            <CalendarIcon className='text-muted-foreground' />
            <span>{formatDateTimeVN(detailData.time, true)}</span>
          </div>
          {detailData.transactionId && (
            <div className='flex items-center space-x-4'>
              <CreditCard className='text-muted-foreground' />
              <span>Mã giao dịch: {detailData.transactionId}</span>
            </div>
          )}
          <div className='space-y-2'>
            <div className='font-semibold'>Ví gửi</div>

            {detailData.ofAccount ? (
              <div className='flex items-start gap-3'>
                <Avatar>
                  <AvatarFallback className='bg-muted'>
                    <WalletCardsIcon />
                  </AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <span className='font-medium'>{detailData.accountSource?.name}</span>
                  <span className='text-sm text-muted-foreground'>
                    {detailData.ofAccount.accountNo +
                      ' • ' +
                      (detailData.accountBank.type === 'MB_BANK' ? 'MB Bank' : 'N/A')}
                  </span>
                </div>
              </div>
            ) : (
              <div className='flex items-center space-x-4'>
                <Avatar>
                  <AvatarFallback>
                    <WalletCardsIcon />
                  </AvatarFallback>
                </Avatar>
                <span className='font-medium'>{detailData.accountSource?.name}</span>
              </div>
            )}
          </div>

          {detailData.toAccountNo && (
            <>
              <div className='space-y-2'>
                <div className='font-semibold'>Tài khoản nhận</div>
                <div className='flex items-start gap-3'>
                  <Avatar>
                    <AvatarFallback className='bg-muted'>
                      <BookUserIcon />
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col'>
                    <span className='font-medium'>{detailData.toAccountName}</span>
                    <span className='text-sm text-muted-foreground'>
                      {detailData.toAccountNo} • {detailData.toBankName}
                    </span>
                  </div>
                </div>
              </div>
              <div className='space-y-2'>
                <div className='font-semibold'>Nội dung chuyển tiền</div>
                <div className='flex items-start gap-3'>
                  <Avatar>
                    <AvatarFallback className='bg-muted'>
                      <Pencil2Icon className='h-5 w-5' />
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col'>
                    <span className='text-sm text-muted-foreground'>{detailData.description}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    ),
    title: 'Chi tiết giao dịch',
    footer: (
      <div className='flex justify-end gap-2'>
        <Button
          variant={'secondary'}
          onClick={() => {
            setIsDialogOpen((prev) => ({ ...prev, isDialogClassifyTransactionOpen: true }))
          }}
        >
          Classtify
        </Button>

        <Button
          onClick={() => setIsDialogOpen((prev) => ({ ...prev, isDialogDetailTransactionOpen: false }))}
          variant={'destructive'}
        >
          Đóng
        </Button>
      </div>
    ),
    onClose: () => {
      setIsDialogOpen((prev) => ({ ...prev, isDialogDetailTransactionOpen: false }))
    },
    isOpen: isDialogOpen.isDialogDetailTransactionOpen
  }
  return <CustomDialog config={config} />
}
