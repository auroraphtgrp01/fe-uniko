import { IEditForm, Transaction } from '@/app/chatbox/constants'
import { handleStartEdit } from '@/app/chatbox/handler'
import { Button } from '@/components/ui/button'
import { ITrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { Pencil } from 'lucide-react'
import React from 'react'

export const DetailTransaction = ({
  transaction,
  trackerType,
  setEditForms,
  setEditingId
}: {
  transaction: Transaction
  trackerType: ITrackerTransactionType[]
  setEditForms: React.Dispatch<React.SetStateAction<IEditForm>>
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>
}) => {
  return (
    <div className='space-y-4 p-4'>
      <div className='grid gap-2 text-sm'>
        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground'>Danh mục:</span>
          <span className='rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800'>
            {transaction?.categoryName ?? trackerType[0].name}
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground'>Ví:</span>
          <span>{transaction?.walletName ?? ''}</span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground'>Loại:</span>
          <span>{transaction.type === 'EXPENSE' ? 'Chi tiêu' : 'Thu nhập'}</span>
        </div>
      </div>
      <div className='flex justify-end'>
        <Button
          variant='outline'
          size='sm'
          className='gap-2'
          onClick={() => handleStartEdit({ transaction, setEditForms, setEditingId })}
        >
          <Pencil className='h-4 w-4' />
          Chỉnh sửa
        </Button>
      </div>
    </div>
  )
}
