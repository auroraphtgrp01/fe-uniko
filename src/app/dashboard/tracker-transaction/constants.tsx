'use client'
import {
  ICustomTrackerTransaction,
  IDialogTrackerTransaction,
  IFundOfUser,
  ITrackerTransaction
} from '@/core/tracker-transaction/models/tracker-transaction.interface'
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
import { formatCurrency, translate } from '@/libraries/utils'
import { TFunction } from 'i18next'
import NoDataPlaceHolder from '@/images/2.png'
import Image from 'next/image'
import { initEmptyDetailTransactionData } from '../transaction/constants'
import { Combobox } from '../../../components/core/Combobox'
import { EParticipantRole, EParticipantStatus } from '@/core/expenditure-fund/models/expenditure-fund.interface'
import { initEmptyUser } from '../profile/constants'
import { Badge } from '@/components/ui/badge'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'

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
  const t = translate(['trackerTransaction', 'common'])
  return (
    <div className='grid gap-4 py-4'>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='name' className='text-right'>
          {t('defineContentCreateTracker.labelName')}
        </Label>
        <div className='col-span-3 flex gap-2'>
          <Input
            value={formData.name}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }}
            placeholder={t('defineContentCreateTracker.placeholderName')}
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
          {t('defineContentCreateTracker.type')}
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
          {t('defineContentCreateTracker.labelDes')}
        </Label>
        <Textarea
          value={formData.description}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }}
          className='col-span-3'
          placeholder={t('defineContentCreateTracker.placeholderDes')}
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
          <div className='flex w-full items-center justify-center'>
            {data && data.expenseTransactionTypeStats?.length > 0 ? (
              <DonutChart data={data.expenseTransactionTypeStats} className='h-[17rem] w-full' types='donut' />
            ) : (
              <div className='mt-10 flex flex-col items-center justify-center'>
                <Image priority src={NoDataPlaceHolder} alt='No data available' width={150} height={150} />
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
          <div className='flex w-full items-center justify-center'>
            {data && data.incomingTransactionTypeStats?.length > 0 ? (
              <DonutChart data={data.incomingTransactionTypeStats} className='h-[17rem] w-full' types='donut' />
            ) : (
              <div className='mt-10 flex flex-col items-center justify-center'>
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
  participant: {
    id: 'N/A',
    role: EParticipantRole.MEMBER,
    status: EParticipantStatus.PENDING,
    subEmail: null,
    user: initEmptyUser
  },
  time: new Date().toISOString(),
  trackerTime: new Date().toISOString()
}

export const ExtendsJSXTrackerTransaction = ({
  data,
  setFundId,
  fundId
}: {
  data: IFundOfUser[]
  setFundId: (value: string) => void
  fundId: string
}) => {
  const [selectedValue, setSelectedValue] = React.useState<string>('')

  React.useEffect(() => {
    if (data?.length > 0) {
      setSelectedValue(fundId)
    }
  }, [data, fundId])

  return (
    <div className='flex'>
      <Combobox
        dataArr={data?.map((item) => ({ value: item.id, label: item.name }))}
        onChange={(v) => {
          setFundId(v)
          setSelectedValue(v)
        }}
        label='Expenditure Fund'
        value={selectedValue}
      />
    </div>
  )
}

export const formatTrackerTransactionData = (data: ITrackerTransaction): ICustomTrackerTransaction => {
  return {
    id: data.id || 'N/A',
    reasonName: data.reasonName || 'N/A',
    trackerType:
      data.Transaction?.direction === 'INCOMING' ? (
        <Badge className='flex min-w-[140px] max-w-[150px] items-center justify-center truncate rounded-xl bg-[#047858] px-2 py-1 font-semibold text-green-100 hover:bg-[#047858]/90'>
          <span className='flex items-center gap-1.5'>{data.TrackerType.name || 'N/A'}</span>
        </Badge>
      ) : (
        <Badge className='flex min-w-[140px] max-w-[150px] items-center justify-center truncate rounded-xl bg-[#be123c] px-2 py-1 font-semibold text-red-100 hover:bg-[#be123c]/90'>
          <span className='flex items-center gap-1.5'>{data.TrackerType.name || 'N/A'}</span>
        </Badge>
      ),
    amount: `${formatCurrency(data.Transaction?.amount || 0, 'đ')}`,
    transactionDate: data.time ? data.time : 'N/A',
    accountSource: data.Transaction?.accountSource?.name || 'N/A'
  }
}

export enum EPaymentEvents {
  REFETCH_COMPLETE = 'refetchComplete',
  REFETCH_FAILED = 'refetchFailed',
  REFETCH_STARTED = 'refetchStarted'
}


export const typeCallBack: any = [
  'getAllTrackerTransactionType',
  'getTransactions',
  'getTodayTransactions',
  'getUnclassifiedTransactions',
  'getAllAccountSource',
  'getStatistic',
  'getTrackerTransaction',
  'getStatisticExpenditureFund',
  'getExpenditureFund'
]


export interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
}

export interface ChatResponse {
  messages: string
  recent: string
  transactions: any[]
  statistics: {
    total_expense: number
    total_income: number
    transaction_count: number
    categories: any
  }
}


export interface Category {
  id: string
  name: string
  type: ETypeOfTrackerTransactionType
}

export interface Wallet {
  id: string
  name: string
  type: 'WALLET'
  currency: string
  currentAmount: number
}

export interface Transaction {
  id: string
  amount: number
  type: ETypeOfTrackerTransactionType
  description: string
  walletName: string
  categoryId: string
  categoryName: string
  fundId: string
  userId: string
}

export interface IEditForm {
  [key: string]: {
    description: string
    amount: number
    categoryId: string
    walletId: string
    categoryName: string
  }
}