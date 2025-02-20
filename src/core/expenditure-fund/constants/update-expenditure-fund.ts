import { translate } from '@/libraries/utils'
import { EFieldType, IBodyFormField } from '@/types/formZod.interface'
import { z } from 'zod'

interface IDefineUpdateExpenditureFundFormBodyProps {}

export const defineUpdateExpenditureFundFormBody =
  ({}: IDefineUpdateExpenditureFundFormBodyProps): IBodyFormField[] => {
    const t = translate(['expenditureFund', 'common'])
    return [
      {
        name: 'name',
        type: EFieldType.Input,
        label: t('form.name.label'),
        placeHolder: t('form.name.placeholder'),
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
        label: t('form.status.label'),
        dataSelector: [
          {
            value: 'ACTIVE',
            label: t('form.status.active')
          },
          {
            value: 'CLOSED',
            label: t('form.status.closed')
          },
          {
            value: 'PENDING',
            label: t('form.status.pending')
          }
        ],
        placeHolder: 'Select status *'
      },
      {
        name: 'description',
        type: EFieldType.Textarea,
        label: t('form.description.label'),
        placeHolder: t('form.description.placeholder')
      }
    ]
  }

export const updateExpenditureFundSchema = z
  .object({
    name: z
      .string({ message: 'Name is required' })
      .trim()
      .min(5, { message: 'Name must be at least 5 characters long.' })
      .max(50, { message: 'Name must be at most 50 characters long.' }),
    // currency: z.enum(['USD', 'VND', 'EUR']),
    status: z.enum(['ACTIVE', 'CLOSED', 'PENDING'], {
      message: 'Status must be either "Active" or "Closed" or "Pending"'
    }),
    description: z.any()
  })
  .strict()
