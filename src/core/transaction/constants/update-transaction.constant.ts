import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
import EditTrackerTypeDialog from '@/components/dashboard/EditTrackerType'
import { IAccountSource } from '@/core/account-source/models'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { EFieldType, IBodyFormField } from '@/types/formZod.interface'
import { t } from 'i18next'
import React from 'react'
import { z } from 'zod'

interface IUpdateTransactionFormBody {
  accountSourceData: IAccountSource[]
  handleSetTrackerTypeDefault: (value: string) => void
}

export const defineUpdateTransactionFormBody = ({
  accountSourceData,
  handleSetTrackerTypeDefault
}: IUpdateTransactionFormBody): any[] => {
  return [
    {
      name: 'amount',
      type: EFieldType.MoneyInput,
      label: 'Amount',
      placeHolder: 'Enter amount',
      props: {
        autoComplete: 'amount'
      }
    },
    {
      name: 'accountSourceId',
      type: EFieldType.Select,
      label: 'Account Source',
      placeHolder: 'Select account source',
      dataSelector: modifiedTrackerTypeForComboBox(accountSourceData)
    },
    {
      name: 'direction',
      type: EFieldType.Select,
      label: 'Direction',
      placeHolder: 'Select direction',
      props: {
        onchange: (value: string) => {
          handleSetTrackerTypeDefault(value)
        }
      },
      dataSelector: [
        {
          value: 'INCOMING',
          label: 'INCOMING'
        },
        {
          value: 'EXPENSE',
          label: 'EXPENSE'
        }
      ]
    }
  ]
}

export const updateTransactionSchema = z
  .object({
    amount: z.string(),
    accountSourceId: z.string().uuid(),
    direction: z.enum(['INCOMING', 'EXPENSE'])
  })
  .strict()
