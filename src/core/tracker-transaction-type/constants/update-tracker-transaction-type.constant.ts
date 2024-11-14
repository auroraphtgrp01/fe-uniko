import { EFieldType, IBodyFormField } from '@/types/formZod.interface'
import { z } from 'zod'
import { ETypeOfTrackerTransactionType } from '../models/tracker-transaction-type.enum'

export const defineEditTrackerTypeBody = (isUpdate: boolean, type: string): IBodyFormField[] => {
  return [
    {
      name: 'name',
      type: EFieldType.Input,
      label: 'Name',
      placeHolder: 'Enter tracker transaction type name',
      props: {
        autoComplete: 'name',
        disabled: !isUpdate
      }
    },
    {
      name: 'type',
      type: EFieldType.Select,
      label: 'Type',
      placeHolder: 'Select type for tracker transaction type',
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
      label: 'Description',
      placeHolder: 'Enter tracker transaction type description',
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
