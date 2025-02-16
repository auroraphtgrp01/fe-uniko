import { translate } from '@/libraries/utils'
import { EFieldType } from '@/types/formZod.interface'
import { z } from 'zod'
import { EAccountSourceType } from '../models'

export const createAccountSourceSchema = z.object({
  accountSourceName: z
    .string({ message: 'Source Name is required' })
    .min(5, { message: 'Source Name must be at least 5 characters long' })
    .max(30, { message: 'Source Name must be at most 30 characters long' }),
  accountSourceType: z.nativeEnum(EAccountSourceType, {
    message: 'Account source type must be either "Wallet" or "Banking"'
  }),
  initAmount: z.string().min(0, { message: 'Initial Amount is required' })
})

export const createAccountSourceFormBody = (setTypeState: any) => {
  const t = translate(['accountSource'])
  return [
    {
      name: 'accountSourceName',
      type: EFieldType.Input,
      label: t('form.createAccountSourceFormBody.accountSourceName.label'),
      placeHolder: t('form.createAccountSourceFormBody.accountSourceName.placeholder'),
      props: {
        autoComplete: 'name'
      }
    },
    {
      name: 'accountSourceType',
      type: EFieldType.Select,
      label: t('form.createAccountSourceFormBody.accountSourceType.label'),
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
      placeHolder: t('form.createAccountSourceFormBody.accountSourceType.placeholder'),
      props: {
        onchange: (value: string) => {
          setTypeState(value)
        }
      }
    },
    {
      name: 'initAmount',
      type: EFieldType.MoneyInput,
      label: t('form.createAccountSourceFormBody.initAmount.label'),
      placeHolder: t('form.createAccountSourceFormBody.initAmount.placeholder'),
      props: {
        autoComplete: 'initialAmount'
      }
    }
  ]
}
