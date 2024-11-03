import { EAccountSourceType } from '@/core/account-source/models'
import { translate } from '@/libraries/utils'
import { IButtonInDataTableHeader } from '@/types/core.i'
import { ArrowDownToLineIcon, RotateCcwIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const transactionHeaders = ['Amount', 'Direction', 'Account Source', 'Account No', 'Date']

export const initButtonInDataTableHeader = ({
  reloadDataFunction,
  refetchTransactionBySocket,
  isPendingRefetch
}: {
  reloadDataFunction: () => void
  isPendingRefetch: boolean
  refetchTransactionBySocket: () => void
}): IButtonInDataTableHeader[] => {
  const t = translate(['common'])
  return [
    {
      title: t('button.refetch_in_bank'),
      variants: 'default',
      disabled: isPendingRefetch,
      onClick: () => refetchTransactionBySocket(),
      icon: <ArrowDownToLineIcon className='ml-2 h-4 w-4' />
    },
    {
      title: t('button.reload_data'),
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
  id: 'N/A',
  amount: 'N/A',
  direction: 'N/A',
  accountNo: 'N/A',
  accountSource: 'N/A',
  currency: 'N/A',
  description: 'N/A',
  date: 'N/A',
  TrackerTransaction: null
}

export const initEmptyTransactionData = {
  id: 'N/A',
  transactionDateTime: 'N/A',
  direction: 'N/A',
  transactionId: 'N/A',
  amount: 0,
  toAccountNo: 'N/A',
  toAccountName: 'N/A',
  toBankName: 'N/A',
  currency: 'N/A',
  description: 'N/A',
  accountBankId: 'N/A',
  ofAccountId: 'N/A',
  ofAccount: {
    id: 'N/A',
    accountNo: 'N/A',
    accountBankId: 'N/A'
  },
  time: 'N/A',
  TrackerTransaction: null,
  accountSource: {
    id: 'N/A',
    name: 'N/A',
    type: EAccountSourceType.WALLET,
    initAmount: 0,
    accountBank: null,
    currency: 'N/A',
    currentAmount: 0
  }
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
