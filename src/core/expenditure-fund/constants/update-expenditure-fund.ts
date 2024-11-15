import { translate } from '@/libraries/utils'
import { EFieldType, IBodyFormField } from '@/types/formZod.interface'
import { z } from 'zod'

interface IDefineUpdateExpenditureFundFormBodyProps {}

export const defineUpdateExpenditureFundFormBody =
  ({}: IDefineUpdateExpenditureFundFormBodyProps): IBodyFormField[] => {
    const t = translate(['transaction', 'common'])
    return [
      {
        name: 'name',
        type: EFieldType.Input,
        label: 'Name',
        placeHolder: 'Enter name *',
        props: {
          autoComplete: 'name'
        }
      },
      // {
      //   name: 'currency',
      //   type: EFieldType.Select,
      //   label: 'Currency',
      //   dataSelector: [
      //     {
      //       value: 'USD',
      //       label: 'USD'
      //     },
      //     {
      //       value: 'VND',
      //       label: 'VND'
      //     },
      //     {
      //       value: 'EUR',
      //       label: 'EUR'
      //     }
      //   ],
      //   placeHolder: 'Select currency *'
      // },
      {
        name: 'status',
        type: EFieldType.Select,
        label: 'Status',
        dataSelector: [
          {
            value: 'ACTIVE',
            label: 'ACTIVE'
          },
          {
            value: 'CLOSED',
            label: 'CLOSED'
          },
          {
            value: 'PENDING',
            label: 'PENDING'
          }
        ],
        placeHolder: 'Select status *'
      },
      {
        name: 'description',
        type: EFieldType.Textarea,
        label: 'Description',
        placeHolder: 'Enter description'
      }
    ]
  }

export const updateExpenditureFundSchema = z
  .object({
    name: z.string().trim().min(2).max(256),
    // currency: z.enum(['USD', 'VND', 'EUR']),
    status: z.enum(['ACTIVE', 'CLOSED', 'PENDING']),
    description: z.any()
  })
  .strict()
