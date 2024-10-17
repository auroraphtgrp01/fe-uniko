import { MoneyInput } from '@/components/core/MoneyInput'
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
import { HandCoins, Landmark, PlusIcon, Wallet2 } from 'lucide-react'

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
        onValueChange={(value) => setFormData((prev) => ({ ...prev, accountSourceType: value as EAccountSourceType }))}
        value={formData.accountSourceType}
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
    {/* --------------- */}
    {formData.accountSourceType === EAccountSourceType.BANKING && (
      <>
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='type' className='text-right'>
            Account Bank Type
          </Label>
          <Select
            required
            onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
            value={formData.type}
          >
            <SelectTrigger className='col-span-3'>
              <SelectValue placeholder='Select a account bank type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='MB_BANK'>MB Bank</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='login_id' className='text-right'>
            Login ID
          </Label>
          <Input
            value={formData.login_id}
            required
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, login_id: e.target.value }))
            }}
            className='col-span-3'
            placeholder='Login Id *'
          />
        </div>
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='password' className='text-right'>
            Password
          </Label>
          <Input
            value={formData.password}
            type='password'
            required
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }}
            className='col-span-3'
            placeholder='Password *'
          />
        </div>
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='accounts' className='text-right'>
            Account
          </Label>
          <Input
            value={formData.account}
            required
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, account: e.target.value }))
            }}
            className='col-span-3'
            placeholder='Account *'
          />
        </div>
      </>
    )}

    {/* --------------- */}

    <div className='grid grid-cols-4 items-center gap-4'>
      <Label htmlFor='initialAmount' className='text-right'>
        Initial Amount
      </Label>
      <MoneyInput
        required
        className='col-span-3'
        defaultValue={formData.initAmount}
        placeholder='Init Amount'
        onChange={(e) => {
          setFormData((prev) => ({ ...prev, initAmount: Number(e.target.value) }))
        }}
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
      onClick: () => setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: true })),
      icon: <PlusIcon className='ml-2 h-4 w-4' />
    }
  ]
}
