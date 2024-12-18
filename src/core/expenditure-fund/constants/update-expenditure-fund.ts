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
        label: '',
        dataSelector: [
          {
            value: 'ACTIVE',
            label: t('update.form.selectActive.active')
          },
          {
            value: 'CLOSED',
            label: t('update.form.selectActive.closed')
          },
          {
            value: 'PENDING',
            label: t('update.form.selectActive.pending')
          }
        ],
        placeHolder: 'Select status *'
      },
      {
        name: 'description',
        type: EFieldType.Textarea,
        label: t('update.form.selectActive.label'),
        placeHolder: t('update.form.selectActive.description')
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
