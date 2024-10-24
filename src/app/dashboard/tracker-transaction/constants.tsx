'use client'
import { IDialogTrackerTransaction } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { IButtonInDataTableHeader } from '@/types/core.i'
import { PlusCircle, PlusIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ICreateTrackerTransactionFormData } from '@/core/transaction/models'
import { Textarea } from '@/components/ui/textarea'
import { ITrackerTransactionTypeBody } from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { IAccountSource } from '@/core/account-source/models'
import { MoneyInput } from '@/components/core/MoneyInput'
import { ITabConfig } from '@/components/dashboard/TrackerTransactionChart'
import DonutChart, { IChartData } from '@/components/core/charts/DonutChart'
import { EmojiPicker } from '../../../components/common/EmojiPicker'
import { Combobox } from '@/components/core/Combobox'
import EditTrackerTypeDialog from '@/components/dashboard/EditTrackerType'
import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'

export const initButtonInDataTableHeader = ({
  setIsDialogOpen
}: {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTrackerTransaction>>
}): IButtonInDataTableHeader[] => {
  return [
    {
      title: 'Classify',
      variants: 'secondary',
      onClick: () => {
        setIsDialogOpen((prev) => ({ ...prev, isDialogUnclassifiedOpen: true }))
      }
    },
    {
      title: 'Create',
      onClick: () => {
        setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: true }))
      },
      variants: 'default',
      icon: <PlusIcon className='ml-2 h-4 w-4' />
    }
  ]
}

export const initDialogFlag: IDialogTrackerTransaction = {
  isDialogCreateOpen: false,
  isDialogUpdateOpen: false,
  isDialogClassifyTransactionOpen: false,
  isDialogUnclassifiedOpen: false,
  isDialogCreateTrackerTxTypeOpen: false
}

export const defineContentCreateTransactionDialog = ({
  formData,
  setFormData,
  trackerTransactionType,
  accountSourceData,
  openEditTrackerTxTypeDialog,
  setOpenEditTrackerTxTypeDialog
}: {
  formData: ICreateTrackerTransactionFormData
  setFormData: React.Dispatch<React.SetStateAction<ICreateTrackerTransactionFormData>>
  trackerTransactionType: any
  accountSourceData: IAccountSource[]
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

export const defineContentCreateTrackerTxTypeDialog = ({
  formData,
  setFormData
}: {
  formData: ITrackerTransactionTypeBody
  setFormData: React.Dispatch<React.SetStateAction<ITrackerTransactionTypeBody>>
}) => {
  return (
    <div className='grid gap-4 py-4'>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='name' className='text-right'>
          Name
        </Label>
        <div className='col-span-3 flex gap-2'>
          <Input
            value={formData.name}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }}
            placeholder='Name *'
          />
          <EmojiPicker
            onChangeValue={(value) => {
              setFormData((prev) => ({ ...prev, name: prev.name + value.native }))
            }}
          />
        </div>
      </div>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='type' className='text-right'>
          Type
        </Label>
        <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))} value={formData.type}>
          <SelectTrigger className='col-span-3'>
            <SelectValue placeholder='Select a type' />
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
        <Label htmlFor='description' className='text-right'>
          Description
        </Label>
        <Textarea
          value={formData.description}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }}
          className='col-span-3'
          placeholder='Description *'
        />
      </div>
    </div>
  )
}

export const initTrackerTransactionTab = (data: IChartData | undefined): ITabConfig => {
  return {
    default: 'expenseChart',
    tabContents: [
      {
        content: (
          <DonutChart
            data={data ? data.expenseTransactionTypeStats : []}
            className={`h-[30rem] w-full`}
            types='donut'
          />
        ),
        labels: 'Expense Chart',
        value: 'expenseChart'
      },
      {
        content: (
          <DonutChart
            data={data ? data.incomingTransactionTypeStats : []}
            className={`h-[30rem] w-full`}
            types='donut'
          />
        ),
        labels: 'Incoming Chart',
        value: 'incomingChart'
      }
    ]
  }
}
