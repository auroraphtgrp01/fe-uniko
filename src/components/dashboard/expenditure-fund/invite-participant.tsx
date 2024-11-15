import FormZod from '@/components/core/FormZod'
import {
  defineInviteParticipantFormBody,
  inviteParticipantSchema
} from '@/core/expenditure-fund/constants/invite-participant.constant'
import { IInviteParticipantFormProps } from '@/core/expenditure-fund/models/expenditure-fund.interface'
import { useRef } from 'react'

export function InviteParticipantForm({ handleInvite, formInviteRef }: IInviteParticipantFormProps) {
  const formRef = useRef<{ reset: (values: { userInfoValues: any[] }) => void } | null>(null)
  return (
    <FormZod
      formSchema={inviteParticipantSchema}
      formFieldBody={defineInviteParticipantFormBody({})}
      onSubmit={(data: any) => handleInvite(data.userInfoValues)}
      submitRef={formInviteRef}
      formRef={formRef}
    />
  )
}
