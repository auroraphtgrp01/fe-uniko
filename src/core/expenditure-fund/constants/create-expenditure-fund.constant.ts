import { translate } from '@/libraries/utils'
import { EFieldType, IBodyFormField } from '@/types/formZod.interface'
import { z } from 'zod'

interface IDefineCreateExpenditureFundFormBodyProps {}

export const defineCreateExpenditureFundFormBody =
  ({}: IDefineCreateExpenditureFundFormBodyProps): IBodyFormField[] => {
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
        name: 'description',
        type: EFieldType.Textarea,
        label: t('form.direction.label'),
        placeHolder: t('form.direction.placeholder')
      }
    ]
  }

export const createExpenditureFundSchema = z
  .object({
    name: z.string().trim().min(2).max(256),
    // currency: z.enum(['USD', 'VND', 'EUR']),
    description: z.any()
  })
  .strict()
