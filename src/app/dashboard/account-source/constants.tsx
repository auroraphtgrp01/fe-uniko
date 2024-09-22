import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { IAccountSourceBody, IAccountSourceDialogFlag } from '@/core/account-source/models'
import { formatCurrency } from '@/libraries/utils'
import { IAccountSource, IAccountSourceDataFormat } from '@/types/account-source.i'
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
      <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))} value={formData.type}>
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
    currentAmount: formatCurrency(currentAmount, 'VND'),
    checkType: type
  }
}

export const initAccountSourceFormData: IAccountSourceBody = {
  name: '',
  type: '',
  initAmount: 0,
  currency: '',
  id: undefined
}

export const initDialogFlag: IAccountSourceDialogFlag = {
  isDialogCreateOpen: false,
  isDialogUpdateOpen: false,
  isCloseConfirmationDialog: false
}
