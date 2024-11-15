import {
  ECurrencyUnit,
  EFundStatus,
  ICreateExpenditureFundBody,
  IExpenditureFund,
  IExpenditureFundDataFormat,
  IExpenditureFundDialogOpen,
  IInitButtonInHeaderProps,
  IUpdateExpenditureFundBody
} from '@/core/expenditure-fund/models/expenditure-fund.interface'
import { formatCurrency, formatDateTimeVN } from '@/libraries/utils'
import { IButtonInDataTableHeader } from '@/types/core.i'
import { PlusIcon } from 'lucide-react'
import React from 'react'

export const initEmptyExpenditureFundDialogOpen = {
  isDialogCreateOpen: false,
  isDialogDetailOpen: false,
  isDialogUpdateOpen: false,
  isDialogDeleteOpen: false,
  isDialogDeleteAllOpen: false,
  isDialogInviteOpen: false,
  isDialogDeleteParticipantOpen: false
}

export const initButtonInHeaders = ({ setIsDialogOpen }: IInitButtonInHeaderProps): IButtonInDataTableHeader[] => {
  return [
    {
      title: 'Create ',
      icon: <PlusIcon className='h-4 w-4' />,
      onClick: () => {
        setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: true }))
      },
      variants: 'default'
    }
  ]
}

export const formatExpenditureFundData = (data: IExpenditureFund): IExpenditureFundDataFormat => {
  const { id, currentAmount, description, name, owner, status } = data
  return {
    id,
    name,
    description,
    status: <span className='rounded-full bg-green-200 px-2 py-1 text-xs font-semibold text-green-800'>{status}</span>,
    currentAmount: `${formatCurrency(currentAmount || 0, 'đ')}`,
    owner: owner?.fullName
  }
}

export const initEmptyDetailExpenditureFund = {
  id: '',
  name: '',
  description: '',
  status: EFundStatus.ACTIVE,
  currentAmount: 0,
  currency: ECurrencyUnit.VND,
  owner: {
    id: '',
    fullName: ''
  },
  participants: [],
  categories: [],
  time: new Date().toISOString(),
  transactions: [],
  countParticipants: 0
}
