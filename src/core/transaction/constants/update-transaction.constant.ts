import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
import EditTrackerTypeDialog from '@/components/dashboard/EditTrackerType'
import { IAccountSource } from '@/core/account-source/models'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { translate } from '@/libraries/utils'
import { EFieldType, IBodyFormField } from '@/types/formZod.interface'
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
  const t = translate(['transaction'])
  return [
    {
      name: 'amount',
      type: EFieldType.MoneyInput,
      label: t('IUpdateTransactionFormBody.amount.label'),
      placeHolder: t('IUpdateTransactionFormBody.amount.placeholder'),
      props: {
        autoComplete: 'amount'
      }
    },
    {
      name: 'accountSourceId',
      type: EFieldType.Select,
      label: t('IUpdateTransactionFormBody.accountSource.label'),
      placeHolder: t('IUpdateTransactionFormBody.accountSource.placeholder'),
      dataSelector: modifiedTrackerTypeForComboBox(accountSourceData)
    },
    {
      name: 'direction',
      type: EFieldType.Select,
      label: t('IUpdateTransactionFormBody.direction.label'),
      placeHolder: t('IUpdateTransactionFormBody.direction.placeholder'),
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
    direction: z.enum(['INCOMING', 'EXPENSE'], { message: 'Direction must be either "Incoming" or "Expense"' })
  })
  .strict()
