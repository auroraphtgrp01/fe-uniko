'use client'
import { IDialogTrackerTransaction } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { IButtonInDataTableHeader } from '@/types/core.i'
import { PlusIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ITrackerTransactionTypeBody } from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { ITabConfig } from '@/components/dashboard/TrackerTransactionChart'
import DonutChart, { IChartData } from '@/components/core/charts/DonutChart'
import { EmojiPicker } from '../../../components/common/EmojiPicker'
import React from 'react'
import { translate } from '@/libraries/utils'
import { TFunction } from 'i18next'
import NoDataPlaceHolder from '@/images/2.png'
import Image from 'next/image'
import { initEmptyDetailTransactionData } from '../transaction/constants'

export const initButtonInDataTableHeader = ({
  setIsDialogOpen
}: {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTrackerTransaction>>
}): IButtonInDataTableHeader[] => {
  const t = translate(['trackerTransaction', 'common'])
  return [
    {
      title: t('common:button.create'),
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
  isDialogCreateTrackerTxTypeOpen: false,
  isDialogDetailOpen: false,
  isDialogDeleteOpen: false,
  isDialogDeleteAllOpen: false,
  isDialogDetailTransactionOpen: false
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

export const initTrackerTransactionTab = (data: IChartData | undefined, t: TFunction<any>): ITabConfig => {
  return {
    default: 'expenseChart',
    tabContents: [
      {
        content: (
          <div>
            {data && data.expenseTransactionTypeStats?.length > 0 ? (
              <DonutChart
                data={data.expenseTransactionTypeStats}
                className='mt-[-2rem] h-[20rem] w-full'
                types='donut'
              />
            ) : (
              <div className='mt-12 flex flex-col items-center justify-center'>
                <Image src={NoDataPlaceHolder} alt='No data available' width={150} height={150} />
                <span className='mt-2 text-sm font-semibold text-foreground'>No data available</span>
              </div>
            )}
          </div>
        ),
        labels: t('trackerTransaction:charts.expenseChart.label'),
        value: t('trackerTransaction:charts.expenseChart.value')
      },
      {
        content: (
          <div>
            {data && data.incomingTransactionTypeStats?.length > 0 ? (
              <DonutChart
                data={data.incomingTransactionTypeStats}
                className='mt-[-2rem] h-[20rem] w-full'
                types='donut'
              />
            ) : (
              <div className='mt-12 flex flex-col items-center justify-center'>
                <Image src={NoDataPlaceHolder} alt='No data available' width={150} height={150} />
                <span className='mt-2 text-sm font-semibold text-foreground'>No data available</span>
              </div>
            )}
          </div>
        ),
        labels: t('trackerTransaction:charts.incomingChart.label'),
        value: t('trackerTransaction:charts.incomingChart.value')
      }
    ]
  }
}

export const initEmptyDetailTrackerTransaction = {
  id: 'N/A',
  trackerTypeId: 'N/A',
  reasonName: 'N/A',
  description: 'N/A',
  userId: 'N/A',
  transactionId: 'N/A',
  Transaction: initEmptyDetailTransactionData,
  TrackerType: {
    id: 'N/A',
    name: 'N/A',
    type: 'N/A',
    description: 'N/A',
    ownerIds: []
  },
  time: new Date().toISOString()
}
