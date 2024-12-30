import { translate } from '@/libraries/utils'
import { EFieldType } from '@/types/formZod.interface'
import { type } from 'os'
import { z } from 'zod'

export const updateAccountBankSchema = z.object({
  type: z.enum(['MB_BANK']),
  login_id: z.string().min(5),
  password: z.string().min(5),
  accounts: z.array(z.string().min(5)).min(1)
})
const t = translate(['accountSource'])
export const updateAccountBankFormBody = [
  {
    name: 'type',
    type: EFieldType.Select,
    label: t('form.createAccountSourceFormBody.bankType.label'),
    dataSelector: [
      {
        value: 'MB_BANK',
        label: 'MB BANK'
      }
    ],
    placeHolder: t('form.createAccountSourceFormBody.bankType.placeholder')
  },
  {
    name: 'login_id',
    type: EFieldType.Input,
    label: t('form.createAccountSourceFormBody.loginId.label'),
    placeHolder: t('form.createAccountSourceFormBody.bankType.placeholder'),
    props: {
      autoComplete: 'login_id'
    }
  },
  {
    name: 'password',
    type: EFieldType.Input,
    label: t('form.createAccountSourceFormBody.password.label'),
    placeHolder: t('form.createAccountSourceFormBody.password.placeholder'),
    props: {
      type: 'password',
      autoComplete: 'password'
    }
  },
  {
    name: 'accounts',
    type: EFieldType.MultiInput,
    label: t('form.createAccountSourceFormBody.accounts.label'),
    placeHolder: t('form.createAccountSourceFormBody.accounts.placeholder'),
    props: {
      autoComplete: 'accounts',
      placeholder: t('form.createAccountSourceFormBody.accounts.placeholder')
    }
  }
]
