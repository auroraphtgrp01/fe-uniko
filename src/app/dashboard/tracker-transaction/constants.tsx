import { IDialogTrackerTransaction } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { IButtonInDataTableHeader } from '@/types/core.i'
import { PlusIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export const initButtonInDataTableHeader = ({
  setIsDialogOpen
}: {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTrackerTransaction>>
}): IButtonInDataTableHeader[] => {
  return [
    {
      title: 'Create',
      onClick: () => {
        setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: true }))
      },
      icon: <PlusIcon className='ml-2 h-4 w-4' />
    },
    {
      title: 'Classify',
      onClick: () => {
        setIsDialogOpen((prev) => ({ ...prev, isDialogClassifyOpen: true }))
      }
    }
  ]
}

export const initDialogFlag: IDialogTrackerTransaction = {
  isDialogCreateOpen: false,
  isDialogUpdateOpen: false,
  isDialogClassifyOpen: false
}

export const contentDialogForm = (
  <div className='grid gap-4 py-4'>
    <div className='grid grid-cols-4 items-center gap-4'>
      <Label htmlFor='sourceName' className='text-right'>
        Source Name
      </Label>
      <Input value={''} required onChange={(e) => {}} className='col-span-3' placeholder='Source Name *' />
    </div>
    <div className='grid grid-cols-4 items-center gap-4'>
      <Label htmlFor='type' className='text-right'>
        Type
      </Label>
      <Select required onValueChange={(value) => {}}>
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
        defaultValue={''}
        onChange={(e) => {}}
        className='col-span-3'
        placeholder='Init Amount *'
      />
    </div>
    <div className='grid grid-cols-4 items-center gap-4'>
      <Label htmlFor='currency' className='text-right'>
        Currency
      </Label>
      <Select required onValueChange={(value) => {}} value={''}>
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
