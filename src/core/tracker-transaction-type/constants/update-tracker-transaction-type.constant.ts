import { EFieldType, IBodyFormField } from '@/types/formZod.interface'
import { z } from 'zod'
import { ETypeOfTrackerTransactionType } from '../models/tracker-transaction-type.enum'
import { translate } from '@/libraries/utils'

export const defineEditTrackerTypeBody = (isUpdate: boolean, type: string): IBodyFormField[] => {
  const t = translate(['trackerTransaction'])
  return [
    {
      name: 'name',
      type: EFieldType.Input,
      label: t('defineEditTrackerTypeBody.name.label'),
      placeHolder: t('defineEditTrackerTypeBody.name.placeholder'),
      props: {
        autoComplete: 'name',
        disabled: !isUpdate
      }
    },
    {
      name: 'type',
      type: EFieldType.Select,
      label: t('defineEditTrackerTypeBody.type.label'),
      placeHolder: t('defineEditTrackerTypeBody.type.placeholder'),
      props: {
        autoComplete: 'type',
        disabled: !isUpdate,
        value: type
      },
      dataSelector: [
        { value: 'INCOMING', label: 'Incoming' },
        { value: 'EXPENSE', label: 'Expense' }
      ]
    },
    {
      name: 'description',
      type: EFieldType.Textarea,
      label: t('defineEditTrackerTypeBody.description.label'),
      placeHolder: t('defineEditTrackerTypeBody.description.placeholder'),
      props: {
        disabled: !isUpdate
      }
    }
  ]
}
export const editTrackerTypeSchema = z
  .object({
    name: z.string().trim().min(2).max(256),
    type: z.nativeEnum(ETypeOfTrackerTransactionType),
    description: z.string().min(10).max(256).nullable()
  })
  .strict()
