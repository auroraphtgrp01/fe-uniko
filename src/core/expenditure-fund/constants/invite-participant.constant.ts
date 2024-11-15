import { EFieldType, IBodyFormField } from '@/types/formZod.interface'
import { z } from 'zod'

interface IDefineInviteParticipantFormBodyProps {}

export const defineInviteParticipantFormBody = ({}: IDefineInviteParticipantFormBodyProps): IBodyFormField[] => {
  return [
    {
      name: 'userInfoValues',
      type: EFieldType.MultiInput,
      placeHolder: 'Enter email addresses or phone numbers',
      props: {
        placeholder: 'Enter email addresses or phone numbers'
      }
    }
  ]
}

export const inviteParticipantSchema = z
  .object({
    userInfoValues: z.array(z.string()).min(1)
  })
  .strict()
