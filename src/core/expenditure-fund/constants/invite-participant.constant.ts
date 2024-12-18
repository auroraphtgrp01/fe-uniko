import { translate } from '@/libraries/utils'
import { EFieldType, IBodyFormField } from '@/types/formZod.interface'
import { z } from 'zod'

interface IDefineInviteParticipantFormBodyProps {}

export const defineInviteParticipantFormBody = ({}: IDefineInviteParticipantFormBodyProps): IBodyFormField[] => {
  const t = translate(['expenditureFundDetails'])

  return [
    {
      name: 'userInfoValues',
      type: EFieldType.MultiInput,
      placeHolder: t('transactionTabsContent.placeHolder'),
      props: {
        placeholder: t('transactionTabsContent.placeHolder')
      }
    }
  ]
}

export const inviteParticipantSchema = z
  .object({
    userInfoValues: z.array(z.string()).min(1)
  })
  .strict()
