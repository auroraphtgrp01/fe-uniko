import FormZod from '@/components/core/FormZod'
import {
  defineInviteParticipantFormBody,
  inviteParticipantSchema
} from '@/core/expenditure-fund/constants/invite-participant.constant'
import { IInviteParticipantFormProps } from '@/core/expenditure-fund/models/expenditure-fund.interface'

export function InviteParticipantForm({ handleInvite, formInviteRef }: IInviteParticipantFormProps) {
  return (
    <FormZod
      formSchema={inviteParticipantSchema}
      formFieldBody={defineInviteParticipantFormBody({})}
      onSubmit={(data: any) => {
        handleInvite(data.userInfoValues)
      }}
      submitRef={formInviteRef}
    />
  )
}
