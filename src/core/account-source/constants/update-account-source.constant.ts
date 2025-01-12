import { translate } from '@/libraries/utils'
import { EFieldType } from '@/types/formZod.interface'
import { z } from 'zod'
import { EAccountSourceType } from '../models'

export const updateAccountSourceSchema = z.object({
  accountSourceName: z.string().min(2, { message: 'Source Name is required' }),
  accountSourceType: z.nativeEnum(EAccountSourceType),
  id: z.string().optional()
})

export const updateAccountSourceFormBody = (setTypeState: any) => {
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
    }
  ]
}
