import { IDialogTrackerTransaction } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { IButtonInDataTableHeader } from '@/types/core.i'
import { PlusCircle, PlusIcon, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ICreateTransactionFormData } from '@/core/transaction/models'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ITrackerTransactionType } from '@/core/tracker-transaction/tracker-transaction-type/models/tracker-transaction-type.interface'
import { IAccountSource } from '@/core/account-source/models'

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

export const defineContentCreateTransactionDialog = ({
  formData,
  setFormData,
  newItemTrackerType,
  setItemTrackerType,
  isAddingNewTrackerType,
  setIsAddingNewTrackerType,
  trackerTransactionType,
  accountSourceData
}: {
  formData: ICreateTransactionFormData
  setFormData: React.Dispatch<React.SetStateAction<ICreateTransactionFormData>>
  newItemTrackerType: string
  setItemTrackerType: React.Dispatch<React.SetStateAction<string>>
  isAddingNewTrackerType: boolean
  setIsAddingNewTrackerType: React.Dispatch<React.SetStateAction<boolean>>
  trackerTransactionType: any
  accountSourceData: IAccountSource[]
}) => {
  console.log(trackerTransactionType)
  return (
    <div className='grid gap-4 py-4'>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='reasonName' className='text-right'>
          Reason Name
        </Label>
        <Input
          value={formData.reasonName}
          required
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, reasonName: e.target.value }))
          }}
          className='col-span-3'
          placeholder='Reason name *'
        />
      </div>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='trackerTypeId' className='text-right'>
          Tracker Type
        </Label>
        <Select
          required
          onValueChange={(value) => setFormData((prev) => ({ ...prev, trackerTypeId: value }))}
          value={formData.trackerTypeId}
        >
          <SelectTrigger className='col-span-3'>
            <SelectValue placeholder='Select a tracker type' />
          </SelectTrigger>
          <SelectContent>
            {trackerTransactionType.length > 0
              ? trackerTransactionType.map((item: ITrackerTransactionType) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))
              : ''}
            {isAddingNewTrackerType ? (
              <div className='flex items-center'>
                <Input
                  type='text'
                  value={''}
                  onChange={(e) => console.log(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') console.log('Enter key')
                  }}
                  placeholder='Enter new item'
                  className='flex-grow'
                />
                <Button onClick={() => setIsAddingNewTrackerType(false)} size='sm' className='ml-2'>
                  <X className='h-4 w-4' />
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsAddingNewTrackerType(true)} variant='ghost' className='w-full justify-start'>
                <PlusCircle className='mr-2 h-4 w-4' />
                Add new item
              </Button>
            )}
          </SelectContent>
        </Select>
      </div>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='accountSourceId' className='text-right'>
          Account Source
        </Label>
        <Select
          required
          onValueChange={(value) => setFormData((prev) => ({ ...prev, accountSourceId: value }))}
          value={formData.accountSourceId}
        >
          <SelectTrigger className='col-span-3'>
            <SelectValue placeholder='Select a tracker type' />
          </SelectTrigger>
          <SelectContent>
            {accountSourceData.length > 0
              ? accountSourceData.map((item: IAccountSource) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))
              : ''}
          </SelectContent>
        </Select>
      </div>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='description' className='text-right'>
          Description
        </Label>
        <Textarea
          value={formData.description}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }}
          className='col-span-3'
          placeholder='Description'
        />
      </div>
    </div>
  )
}
