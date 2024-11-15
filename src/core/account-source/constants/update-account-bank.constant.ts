import { EFieldType } from '@/types/formZod.interface'
import { z } from 'zod'

export const updateAccountBankSchema = z.object({
  type: z.enum(['MB_BANK']),
  login_id: z.string().min(5),
  password: z.string().min(5),
  accounts: z.array(z.string().min(5)).min(1)
})

export const updateAccountBankFormBody = [
  {
    name: 'type',
    type: EFieldType.Select,
    label: 'Bank Type',
    dataSelector: [
      {
        value: 'MB_BANK',
        label: 'MB BANK'
      }
    ],
    placeHolder: 'Enter your type'
  },
  {
    name: 'login_id',
    type: EFieldType.Input,
    label: 'Login Id',
    placeHolder: 'Enter your login id',
    props: {
      autoComplete: 'login_id'
    }
  },
  {
    name: 'password',
    type: EFieldType.Input,
    label: 'Password',
    placeHolder: 'Enter your password',
    props: {
      autoComplete: 'password'
    }
  },
  {
    name: 'accounts',
    type: EFieldType.MultiInput,
    label: 'Accounts',
    placeHolder: 'Enter your accounts',
    props: {
      placeholder: 'Enter your accounts'
    }
  }
]
