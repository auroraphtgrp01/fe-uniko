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
import { HandCoins, Landmark, Wallet2 } from 'lucide-react'

export const contentDialogAccountSourceForm = ({
  setFormData,
  formData
}: {
  setFormData: React.Dispatch<React.SetStateAction<IAccountSourceBody>>
  formData: IAccountSourceBody
}) => (
  <div className='grid gap-4 py-4'>
    <div className='grid grid-cols-4 items-center gap-4'>
      <Label htmlFor='sourceName' className='text-right'>
        Source Name
      </Label>
      <Input
        value={formData.name}
        required
        onChange={(e) => {
          setFormData((prev) => ({ ...prev, name: e.target.value }))
        }}
        className='col-span-3'
        placeholder='Source Name *'
      />
    </div>
    <div className='grid grid-cols-4 items-center gap-4'>
      <Label htmlFor='type' className='text-right'>
        Type
      </Label>
      <Select
        required
        onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value as EAccountSourceType }))}
        value={formData.type}
      >
        <SelectTrigger className='col-span-3'>
          <SelectValue placeholder='Select a source type' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='WALLET'>Wallet</SelectItem>
          <SelectItem value='BANKING'>Banking</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className='grid grid-cols-4 items-center gap-4'>
      <Label htmlFor='initialAmount' className='text-right'>
        Initial Amount
      </Label>
      <Input
        type='number'
        required
        defaultValue={formData.initAmount}
        onChange={(e) => {
          setFormData((prev) => ({ ...prev, initAmount: Number(e.target.value) }))
        }}
        className='col-span-3'
        placeholder='Init Amount *'
      />
    </div>
    <div className='grid grid-cols-4 items-center gap-4'>
      <Label htmlFor='currency' className='text-right'>
        Currency
      </Label>
      <Select
        required
        onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))}
        value={formData.currency}
      >
        <SelectTrigger className='col-span-3'>
          <SelectValue placeholder='Select a currency' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='USD'>USD</SelectItem>
          <SelectItem value='EUR'>EUR</SelectItem>
          <SelectItem value='VND'>VND</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
)

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
  type: EAccountSourceType.WALLET,
  initAmount: 0,
  currency: '',
  id: ''
}

export const initDialogFlag: IDialogAccountSource = {
  isDialogCreateOpen: false,
  isDialogUpdateOpen: false
}
