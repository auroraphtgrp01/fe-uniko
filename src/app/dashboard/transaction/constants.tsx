import { IAccountBank } from '@/core/account-bank/models'
import { IButtonInDataTableHeader } from '@/types/core.i'
import { ArrowDownToLineIcon, PlusIcon, RotateCcwIcon } from 'lucide-react'

export const transactionHeaders = ['Transaction Id', 'Amount', 'Direction', 'Currency', 'Account Bank', 'Account No']

export const initButtonInDataTableHeader = ({
  refetchFunction,
  reloadDataFunction
}: {
  refetchFunction: () => void
  reloadDataFunction: () => void
}): IButtonInDataTableHeader[] => {
  return [
    {
      title: 'Refetch in bank',
      onClick: () => {
        refetchFunction()
      },
      icon: <ArrowDownToLineIcon className='ml-2 h-4 w-4' />
    },
    {
      title: 'Reload data',
      onClick: () => {
        reloadDataFunction()
      },
      icon: <RotateCcwIcon className='ml-2 h-4 w-4' />
    }
  ]
}

export const initDialogFlag = {
  isDialogDetailOpen: false,
  isDialogTransactionTodayOpen: false,
  isDialogUnclassifiedTransactionOpen: false
}
