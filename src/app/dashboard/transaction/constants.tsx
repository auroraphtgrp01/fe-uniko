import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { IAccountBank, IGetAccountBankResponse } from '@/core/account-bank/models'
import {
  ITrackerTransactionType,
  ITrackerTransactionTypeBody
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { IClassifyTransactionFormData, IDialogTransaction } from '@/core/transaction/models'
import { IButtonInDataTableHeader } from '@/types/core.i'
import { ArrowDownToLineIcon, PlusCircle, RotateCcwIcon, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { handleCreateTrackerTxType, modifiedTrackerTypeForComboBox } from '../tracker-transaction/handlers'
import { IDialogTrackerTransaction } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { Combobox } from '@/components/core/Combobox'
import EditTrackerTypeDialog from '@/components/dashboard/EditTrackerType'

export const transactionHeaders = ['Transaction Id', 'Amount', 'Direction', 'Currency', 'Account Bank', 'Account No']

export const initButtonInDataTableHeader = ({
  dataAccountBank,
  setAccountBankRefetchingQueue,
  reloadDataFunction,
  refetchTransactionBySocket,
  isPendingRefetch
}: {
  dataAccountBank: IGetAccountBankResponse | undefined
  setAccountBankRefetchingQueue: React.Dispatch<React.SetStateAction<IAccountBank[]>>
  reloadDataFunction: () => void
  isPendingRefetch: boolean
  refetchTransactionBySocket: () => void
}): IButtonInDataTableHeader[] => {
  return [
    {
      title: 'Refetch in bank',
      variants: 'default',
      disabled: isPendingRefetch,
      onClick: () => {
        refetchTransactionBySocket()
        // if (dataAccountBank && dataAccountBank.data.length > 0) setAccountBankRefetchingQueue([...dataAccountBank.data])
      },
      icon: <ArrowDownToLineIcon className='ml-2 h-4 w-4' />
    },
    {
      title: 'Reload data',
      variants: 'secondary',
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
  isDialogClassifyTransactionOpen: false,
  isDialogCreateTrackerTxTypeOpen: false
}

export const initClassifyTransactionForm = {
  trackerTypeId: '',
  reasonName: '',
  description: ''
}

export const initCreateTrackerTxTypeForm = {
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

export const defineContentClassifyingTransactionDialog = ({
  formData,
  setFormData,
  trackerTransactionType,
  openEditTrackerTxTypeDialog,
  setOpenEditTrackerTxTypeDialog
}: {
  formData: IClassifyTransactionFormData
  setFormData: React.Dispatch<React.SetStateAction<IClassifyTransactionFormData>>
  trackerTransactionType: ITrackerTransactionType[]
  openEditTrackerTxTypeDialog: boolean
  setOpenEditTrackerTxTypeDialog: React.Dispatch<React.SetStateAction<boolean>>
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
        <Combobox
          onValueSelect={(value) => {
            setFormData((prev) => ({ ...prev, trackerTypeId: value }))
          }}
          setOpenEditDialog={setOpenEditTrackerTxTypeDialog}
          dataArr={modifiedTrackerTypeForComboBox(trackerTransactionType)}
          dialogEdit={EditTrackerTypeDialog({
            openEditDialog: openEditTrackerTxTypeDialog,
            setOpenEditDialog: setOpenEditTrackerTxTypeDialog,
            dataArr: modifiedTrackerTypeForComboBox(trackerTransactionType)
          })}
          label='Tracker Transaction Type'
          className='col-span-3'
        />
        {/* <Select
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
            <Button
              onClick={() => setIsDialogOpen((prev: any) => ({ ...prev, isDialogCreateTrackerTxTypeOpen: true }))}
              variant='ghost'
              className='w-full justify-start'
            >
              <PlusCircle className='mr-2 h-4 w-4' />
              Add new item
            </Button>
          </SelectContent>
        </Select> */}
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
  TrackerTransaction: null
}

export const initEmptyTransactionSummaryData = {
  transactionToday: {
    count: 0,
    amount: 0,
    data: []
  },
  unclassifiedTransaction: { count: 0, amount: 0, data: [] }
}
