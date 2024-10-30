'use client'
import { IDialogTrackerTransaction } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { IButtonInDataTableHeader } from '@/types/core.i'
import { PlusCircle, PlusIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ICreateTrackerTransactionFormData } from '@/core/transaction/models'
import { Textarea } from '@/components/ui/textarea'
import {
  ITrackerTransactionType,
  ITrackerTransactionTypeBody
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { IAccountSource } from '@/core/account-source/models'
import { MoneyInput } from '@/components/core/MoneyInput'
import { ITabConfig } from '@/components/dashboard/TrackerTransactionChart'
import DonutChart, { IChartData } from '@/components/core/charts/DonutChart'
import { EmojiPicker } from '../../../components/common/EmojiPicker'
import { Combobox } from '@/components/core/Combobox'
import EditTrackerTypeDialog from '@/components/dashboard/EditTrackerType'
import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
import React from 'react'

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
