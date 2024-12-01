import {
  EAccountSourceType,
  IAccountSource,
  IAccountSourceBody,
  IAccountSourceDataFormat,
  IDialogAccountSource
} from '@/core/account-source/models'
import { formatCurrency, translate } from '@/libraries/utils'
import { IButtonInDataTableHeader } from '@/types/core.i'
import { HandCoins, Landmark, PlusIcon, Wallet2 } from 'lucide-react'

export const formatAccountSourceData = (data: IAccountSource): IAccountSourceDataFormat => {
  const { id, name, type, initAmount, currentAmount, accountBank } = data
  return {
    id,
    name,
    type:
      type === 'WALLET' ? (
        <div className='Ư flex items-center'>
          <Wallet2 className='mr-2' />
          <span>Wallet</span>
        </div>
      ) : type === 'BANKING' ? (
        <div className='flex items-center'>
          <Landmark className='mr-2' /> <span>Banking</span>
        </div>
      ) : (
        <div className='flex items-center'>
          <HandCoins className='mr-2' /> <span>Transfer</span>
        </div>
      ),
    initAmount: formatCurrency(initAmount, 'đ'),
    accountBank: accountBank ? accountBank.type.split('_')[0] + ' Bank' : 'N/A',
    currentAmount: formatCurrency(currentAmount, 'đ'),
    checkType: type
  }
}

export const initAccountSourceFormData: IAccountSourceBody = {
  name: '',
  initAmount: 0,
  accountSourceType: EAccountSourceType.WALLET
}

export const initDialogFlag: IDialogAccountSource = {
  isDialogCreateOpen: false,
  isDialogUpdateOpen: false,
  isDialogRefetchMoneyOpen: false,
  isDialogDeleteOpen: false,
  isDialogDeleteAllOpen: false,
  isDialogDetailOpen: false
}

export const initButtonInDataTableHeader = ({
  setIsDialogOpen
}: {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogAccountSource>>
}): IButtonInDataTableHeader[] => {
  const t = translate(['common'])
  return [
    {
      title: t('common:button.create'),
      variants: 'default',
      onClick: () => setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: true })),
      icon: <PlusIcon className='ml-2 h-4 w-4' />
    }
  ]
}

export const initEmptyDetailAccountSource: IAccountSourceDataFormat = {
  id: '',
  name: '',
  type: '',
  initAmount: '',
  accountBank: '',
  currentAmount: '',
  checkType: ''
}

export const initEmptyDetailAccountSourceType = {
  type: EAccountSourceType.WALLET,
  data: {
    accountBank: {
      id: '',
      type: '',
      login_id: '',
      accounts: ''
    },
    accountSource: {
      id: '',
      accountSourceName: '',
      accountSourceType: EAccountSourceType.WALLET
    }
  }
}

export const gradientClasses = [
  'bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600',
  'bg-gradient-to-br from-teal-400 via-emerald-500 to-green-600',
  'bg-gradient-to-br from-orange-400 via-pink-500 to-rose-600',
  'bg-gradient-to-br from-purple-500 via-pink-600 to-red-500',
  'bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600',
  'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500',
  'bg-gradient-to-br from-green-400 via-lime-500 to-yellow-500',
  'bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400',
  'bg-gradient-to-br from-gray-700 via-gray-900 to-black',
  'bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-700'
]
