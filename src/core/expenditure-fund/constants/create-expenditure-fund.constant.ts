import { translate } from '@/libraries/utils'
import { EFieldType, IBodyFormField } from '@/types/formZod.interface'
import { z } from 'zod'

interface IDefineCreateExpenditureFundFormBodyProps {}

export const defineCreateExpenditureFundFormBody =
  ({}: IDefineCreateExpenditureFundFormBodyProps): IBodyFormField[] => {
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
      {
        name: 'currency',
        type: EFieldType.Select,
        label: 'Currency',
        dataSelector: [
          {
            value: 'USD',
            label: 'USD'
          },
          {
            value: 'VND',
            label: 'VND'
          },
          {
            value: 'EUR',
            label: 'EUR'
          }
        ],
        placeHolder: 'Select currency *'
      }
    ]
  }

export const createExpenditureFundSchema = z
  .object({
    name: z.string().trim().min(2).max(256),
    currency: z.enum(['USD', 'VND', 'EUR'])
  })
  .strict()
