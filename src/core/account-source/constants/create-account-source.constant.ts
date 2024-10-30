import { EFieldType } from '@/types/formZod.interface'
import { z } from 'zod'

export const createAccountSourceSchema = z.object({
  accountSourceName: z.string().min(2, { message: 'Source Name is required' }),
  accountSourceType: z.enum(['WALLET', 'BANKING']),
  initAmount: z.string().min(0, { message: 'Initial Amount is required' })
})

export const createAccountSourceFormBody = (setTypeState: any) => {
  return [
    {
      name: 'accountSourceName',
      type: EFieldType.Input,
      label: 'Source Name',
      placeHolder: 'Enter your source name',
      props: {
        autoComplete: 'name'
      }
    },
    {
      name: 'accountSourceType',
      type: EFieldType.Select,
      label: 'Type',
      dataSelector: [
        {
          value: 'WALLET',
          label: 'WALLET'
        },
        {
          value: 'BANKING',
          label: 'BANKING'
        }
      ],
      placeHolder: 'Enter your type',
      props: {
        onchange: (value: string) => {
          setTypeState(value)
        }
      }
    },
    {
      name: 'initAmount',
      type: EFieldType.Input,
      label: 'Initial Amount',
      placeHolder: 'Enter your initial amount',
      props: {
        type: 'number',
        autoComplete: 'initialAmount'
      }
    }
  ]
}
