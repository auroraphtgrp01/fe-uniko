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
import { formatCurrency } from '@/libraries/utils'
import { IButtonInDataTableHeader } from '@/types/core.i'
import { PlusIcon } from 'lucide-react'
import React, { SetStateAction } from 'react'

export const initEmptyExpenditureFundDialogOpen = {
  isDialogCreateOpen: false,
  isDialogDetailUpdateOpen: false,
  isDialogDeleteOpen: false,
  isDialogDeleteAllOpen: false
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
  const { id, currency, currentAmount, description, name, ownerName, status } = data
  return {
    id,
    name,
    description,
    status: <span className='rounded-full bg-green-200 px-2 py-1 text-xs font-semibold text-green-800'>{status}</span>,
    currentAmount: `${formatCurrency(currentAmount || 0, 'đ')}`,
    currency,
    owner: ownerName
  }
}

export const initEmptyDetailExpenditureFund = {
  id: '',
  name: '',
  description: '',
  status: EFundStatus.ACTIVE,
  currentAmount: 0,
  currency: ECurrencyUnit.VND,
  ownerName: ''
}
