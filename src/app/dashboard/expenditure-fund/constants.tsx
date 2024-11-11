import {
  ICreateExpenditureFundBody,
  IExpenditureFundDialogOpen,
  IInitButtonInHeaderProps
} from '@/core/expenditure-fund/models/expenditure-fund.interface'
import { IButtonInDataTableHeader } from '@/types/core.i'
import { PlusIcon } from 'lucide-react'
import React from 'react'

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

export interface IExpenditureFundDialogProps {
  commonDialogState: {
    isDialogOpen: IExpenditureFundDialogOpen
    setIsDialogOpen: React.Dispatch<React.SetStateAction<IExpenditureFundDialogOpen>>
  }
  createDialog: {
    handleCreate: (data: ICreateExpenditureFundBody) => void
    status: 'error' | 'idle' | 'pending' | 'success'
  }
}
