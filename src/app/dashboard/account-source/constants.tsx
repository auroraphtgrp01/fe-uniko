import { MoneyInput } from '@/components/core/MoneyInput'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  EAccountSourceType,
  IAccountSource,
  IAccountSourceBody,
  IAccountSourceDataFormat,
  IDialogAccountSource
} from '@/core/account-source/models'
import { formatArrayData, formatCurrency } from '@/libraries/utils'
import { IButtonInDataTableHeader } from '@/types/core.i'
import { HandCoins, Landmark, PlusCircle, PlusIcon, Trash2, Wallet2 } from 'lucide-react'

export const formatAccountSourceData = (data: IAccountSource): IAccountSourceDataFormat => {
  const { id, name, type, initAmount, currency, currentAmount, accountBank } = data
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
    initAmount: formatCurrency(initAmount, currency),
    accountBank: accountBank?.type,
    currency,
    currentAmount: formatCurrency(currentAmount, currency),
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
  isDialogRefetchMoneyOpen: false
}

export const initButtonInDataTableHeader = ({
  setIsDialogOpen
}: {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogAccountSource>>
}): IButtonInDataTableHeader[] => {
  return [
    {
      title: 'Create',
      variants: 'default',
      onClick: () => setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: true })),
      icon: <PlusIcon className='ml-2 h-4 w-4' />
    }
  ]
}
