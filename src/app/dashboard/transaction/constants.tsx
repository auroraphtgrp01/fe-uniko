import { IButtonInDataTableHeader } from '@/types/core.i'
import { ArrowDownToLineIcon, RotateCcwIcon } from 'lucide-react'

export const transactionHeaders = ['Amount', 'Direction', 'Currency', 'Account Source']

export const initButtonInDataTableHeader = ({
  reloadDataFunction,
  refetchTransactionBySocket,
  isPendingRefetch
}: {
  reloadDataFunction: () => void
  isPendingRefetch: boolean
  refetchTransactionBySocket: () => void
}): IButtonInDataTableHeader[] => {
  return [
    {
      title: 'Refetch in bank',
      variants: 'default',
      disabled: isPendingRefetch,
      onClick: () => refetchTransactionBySocket(),
      icon: <ArrowDownToLineIcon className='ml-2 h-4 w-4' />
    },
    {
      title: 'Reload data',
      variants: 'secondary',
      onClick: () => reloadDataFunction(),
      icon: <RotateCcwIcon className='ml-2 h-4 w-4' />
    }
  ]
}

export const initDialogFlag = {
  isDialogDetailOpen: false,
  isDialogTransactionTodayOpen: false,
  isDialogUnclassifiedTransactionOpen: false,
  isDialogClassifyTransactionOpen: false,
  isDialogCreateTrackerTxTypeOpen: false
}

export const initClassifyTransactionForm = {
  trackerTypeId: '',
  reasonName: '',
  description: ''
}

export const initTrackerTypeForm = {
  name: '',
  type: '',
  description: ''
}

export const initCreateTrackerTransactionForm = {
  accountSourceId: '',
  trackerTypeId: '',
  reasonName: '',
  description: '',
  direction: '',
  currency: ''
}

export const initEmptyDetailTransaction = {
  id: '',
  amount: '',
  direction: '',
  accountNo: '',
  accountSource: '',
  currency: '',
  description: '',
  time: '',
  TrackerTransaction: null
}

export const initEmptyTransactionSummaryData = {
  transactionToday: {
    count: 0,
    incomeAmount: 0,
    expenseAmount: 0,
    data: []
  },
  unclassifiedTransaction: { count: 0, incomeAmount: 0, expenseAmount: 0, data: [] }
}
