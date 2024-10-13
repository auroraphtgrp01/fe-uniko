import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { IAccountBank, IGetAccountBankResponse } from '@/core/account-bank/models'
import { ITrackerTransactionType } from '@/core/tracker-transaction/tracker-transaction-type/models/tracker-transaction-type.interface'
import { IClassifyTransactionFormData } from '@/core/transaction/models'
import { IButtonInDataTableHeader } from '@/types/core.i'
import { ArrowDownToLineIcon, PlusCircle, RotateCcwIcon, X } from 'lucide-react'
import toast from 'react-hot-toast'

export const transactionHeaders = ['Transaction Id', 'Amount', 'Direction', 'Currency', 'Account Bank', 'Account No']

export const initButtonInDataTableHeader = ({
  dataAccountBank,
  setAccountBankRefetchingQueue,
  reloadDataFunction
}: {
  dataAccountBank: IGetAccountBankResponse | undefined
  setAccountBankRefetchingQueue: React.Dispatch<React.SetStateAction<IAccountBank[]>>
  reloadDataFunction: () => void
}): IButtonInDataTableHeader[] => {
  return [
    {
      title: 'Refetch in bank',
      onClick: () => {
        toast.loading('Sending request... Please wait until it is completed!')

        if (dataAccountBank && dataAccountBank.data.length > 0) setAccountBankRefetchingQueue([...dataAccountBank.data])
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
  isDialogUnclassifiedTransactionOpen: false,
  isDialogClassifyTransactionOpen: false
}

export const initClassifyTransactionForm = {
  trackerTypeId: '',
  reasonName: '',
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

export const defineContentClassifyingTransactionDialog = ({
  formData,
  setFormData,
  newItemTrackerType,
  setItemTrackerType,
  isAddingNewTrackerType,
  setIsAddingNewTrackerType,
  trackerTransactionType
}: {
  formData: IClassifyTransactionFormData
  setFormData: React.Dispatch<React.SetStateAction<IClassifyTransactionFormData>>
  newItemTrackerType: string
  setItemTrackerType: React.Dispatch<React.SetStateAction<string>>
  isAddingNewTrackerType: boolean
  setIsAddingNewTrackerType: React.Dispatch<React.SetStateAction<boolean>>
  trackerTransactionType: any
}) => {
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

export const initEmptyDetailTransaction = {
  id: '',
  transactionId: '',
  amount: '',
  direction: '',
  accountBank: '',
  currency: '',
  accountNo: '',
  description: '',
  time: '',
  trackerTransactionId: ''
}

export const initEmptyDataTransactionTable = {
  totalTransaction: 0,
  totalAmount: 0,
  data: []
}
