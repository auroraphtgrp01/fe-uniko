import { IDialogTrackerTransaction } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { IButtonInDataTableHeader } from '@/types/core.i'
import { PlusCircle, PlusIcon, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ICreateTrackerTransactionFormData } from '@/core/transaction/models'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  ITrackerTransactionType,
  ITrackerTransactionTypeBody
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { IAccountSource } from '@/core/account-source/models'
import { handleCreateTrackerTxType } from './handlers'
import { MoneyInput } from '@/components/core/MoneyInput'

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
        setIsDialogOpen((prev) => ({ ...prev, isDialogUnclassifiedOpen: true }))
      }
    }
  ]
}

export const initDialogFlag: IDialogTrackerTransaction = {
  isDialogCreateOpen: false,
  isDialogUpdateOpen: false,
  isDialogClassifyTransactionOpen: false,
  isDialogUnclassifiedOpen: false
}

export const defineContentCreateTransactionDialog = ({
  formData,
  setFormData,
  formDataCreateTrackerTxType,
  setFormDataCreateTrackerTxType,
  isAddingNewTrackerType,
  setIsAddingNewTrackerType,
  trackerTransactionType,
  accountSourceData,
  hookCreateTrackerTxType,
  hookSetCacheTrackerTxType
}: {
  formData: ICreateTrackerTransactionFormData
  setFormData: React.Dispatch<React.SetStateAction<ICreateTrackerTransactionFormData>>
  formDataCreateTrackerTxType: ITrackerTransactionTypeBody
  setFormDataCreateTrackerTxType: React.Dispatch<React.SetStateAction<ITrackerTransactionTypeBody>>
  isAddingNewTrackerType: boolean
  setIsAddingNewTrackerType: React.Dispatch<React.SetStateAction<boolean>>
  trackerTransactionType: any
  accountSourceData: IAccountSource[]
  hookCreateTrackerTxType: any
  hookSetCacheTrackerTxType: any
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
        <Label htmlFor='amount' className='text-right'>
          Amount
        </Label>
        <MoneyInput
          defaultValue={formData.amount}
          required
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, amount: Number(e.target.value) }))
          }}
          className='col-span-3'
          placeholder='Amount *'
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
                  value={formDataCreateTrackerTxType.name}
                  onChange={(e) => setFormDataCreateTrackerTxType((prev) => ({ ...prev, name: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter')
                      handleCreateTrackerTxType({
                        formData: formDataCreateTrackerTxType,
                        setFormData: setFormDataCreateTrackerTxType,
                        hookCreateTrackerTxType,
                        hookSetCacheTrackerTxType,
                        setIsAddingNewTrackerType
                      })
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
        <Label htmlFor='direction' className='text-right'>
          Direction
        </Label>
        <Select
          required
          onValueChange={(value) => setFormData((prev) => ({ ...prev, direction: value }))}
          value={formData.direction}
        >
          <SelectTrigger className='col-span-3'>
            <SelectValue placeholder='Select a direction' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key={'INCOMING'} value={'INCOMING'}>
              Incoming
            </SelectItem>
            <SelectItem key={'EXPENSE'} value={'EXPENSE'}>
              Expense
            </SelectItem>
          </SelectContent>
        </Select>
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
            <SelectItem key={'USD'} value={'USD'}>
              USD
            </SelectItem>
            <SelectItem key={'VND'} value={'VND'}>
              VND
            </SelectItem>
            <SelectItem key={'EUR'} value={'EUR'}>
              EUR
            </SelectItem>
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
