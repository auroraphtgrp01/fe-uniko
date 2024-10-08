import { IButtonInDataTableHeader } from '@/types/core.i'
import { ArrowDownToLineIcon, PlusIcon, RotateCcwIcon } from 'lucide-react'
import React from 'react'

export const transactionHeaders = ['Transaction Id', 'Amount', 'Direction', 'Currency', 'Account Bank', 'Account No']

export const initButtonInDataTableHeader = (): IButtonInDataTableHeader[] => {
  return [
    {
      title: 'Refetch in bank',
      onClick: () => {},
      icon: <ArrowDownToLineIcon className='ml-2 h-4 w-4' />
    },
    {
      title: 'Reload data',
      onClick: () => {},
      icon: <RotateCcwIcon className='ml-2 h-4 w-4' />
    }
  ]
}

export const initDialogFlag = {
  isDialogDetailOpen: false,
  isDialogTransactionTodayOpen: false,
  isDialogUnclassifiedTransactionOpen: false
}
