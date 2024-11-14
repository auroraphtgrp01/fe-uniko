import CustomDialog from '@/components/dashboard/Dialog'
import { initEmptyDetailExpenditureFund } from './constants'
import { IDialogConfig } from '@/types/common.i'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { t } from 'i18next'
import { IExpenditureFundDialogProps } from '@/core/expenditure-fund/models/expenditure-fund.interface'
import CreateExpenditureFundForm from '@/components/dashboard/expenditure-fund/create-expenditure-fund'
import { DetailExpenditureFund } from '@/components/dashboard/expenditure-fund/detail-expenditure-fund'
import UpdateExpenditureFundForm from '@/components/dashboard/expenditure-fund/update-expenditure-fund'
import DeleteDialog from '@/components/dashboard/DeleteDialog'
import { Input } from '@/components/ui/input'
import { Loader2Icon, UserPlus } from 'lucide-react'
import MultiInput from '@/components/core/MultiInput'
import { InviteParticipantForm } from '@/components/dashboard/expenditure-fund/invite-participant'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'

export default function ExpenditureFundDialog(params: IExpenditureFundDialogProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const formCreateExpenditureFundRef = useRef<HTMLFormElement>(null)
  const formUpdateExpenditureFundRef = useRef<HTMLFormElement>(null)
  const formInviteParticipantRef = useRef<HTMLFormElement>(null)
  const [emails, setEmails] = useState<string[]>([])

  const { commonDialogState, createDialog, detailUpdateDialog, inviteParticipantDialog, createUpdateCategory } = params
  const createExpenditureFundDialog: IDialogConfig = {
    content: CreateExpenditureFundForm({
      handleCreate: createDialog.handleCreate,
      formCreateRef: formCreateExpenditureFundRef
    }),
    isOpen: commonDialogState.isDialogOpen.isDialogCreateOpen,
    onClose: () => commonDialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: false })),
    title: 'Create Expenditure Fund',
    description: 'Create a new expenditure fund',
    footer: (
      <Button onClick={() => formCreateExpenditureFundRef.current?.requestSubmit()} type='button'>
        {t('common:button.save')}
      </Button>
    )
  }

  const detailConfigDialog: IDialogConfig = {
    className: 'sm:max-w-[325px] md:max-w-[650px]',
    content: DetailExpenditureFund({
      detailData: detailUpdateDialog.data,
      inviteTabProps: {
        formRef: formInviteParticipantRef,
        handleInvite: inviteParticipantDialog.handleInvite
      },
      categoryTabProps: {
        handleCreate: createUpdateCategory.handleCreateTrackerType,
        handleUpdate: createUpdateCategory.handleUpdateTrackerType,
        isEditing,
        setIsEditing
      }
    }),
    description: 'Detail information of the expenditure fund.',
    title: 'Expenditure Fund Details',
    isOpen: commonDialogState.isDialogOpen.isDialogDetailOpen,
    onClose: () => {
      detailUpdateDialog.setDetailData(initEmptyDetailExpenditureFund)
      commonDialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogDetailOpen: false }))
    },
    footer: (
      <Button onClick={() => commonDialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogUpdateOpen: true }))}>
        Update
      </Button>
    )
  }

  const updateConfigDialog: IDialogConfig = {
    content: UpdateExpenditureFundForm({
      handleUpdate: detailUpdateDialog.handleUpdate,
      formUpdateRef: formUpdateExpenditureFundRef,
      defaultValues: {
        id: detailUpdateDialog.data.id,
        description: detailUpdateDialog.data.description,
        name: detailUpdateDialog.data.name,
        status: detailUpdateDialog.data.status
      }
    }),
    isOpen: commonDialogState.isDialogOpen.isDialogUpdateOpen,
    onClose: () => commonDialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogUpdateOpen: false })),
    title: 'Update Expenditure Fund',
    description: 'Update a new expenditure fund',
    footer: (
      <Button onClick={() => formUpdateExpenditureFundRef.current?.requestSubmit()} type='button'>
        {t('common:button.save')}
      </Button>
    )
  }

  const inviteParticipantConfigDialog: IDialogConfig = {
    content: (
      <InviteParticipantForm
        formInviteRef={formInviteParticipantRef}
        handleInvite={inviteParticipantDialog.handleInvite}
      />
    ),
    isOpen: commonDialogState.isDialogOpen.isDialogInviteOpen,
    onClose: () => commonDialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogInviteOpen: false })),
    title: 'Invite Participant',
    description: 'Invite participant to the expenditure fund',
    footer: (
      <Button onClick={() => formInviteParticipantRef.current?.requestSubmit()} disabled={false}>
        {false ? <Loader2Icon className='h-4 w-4 animate-spin' /> : <UserPlus className='mr-2 h-4 w-4' />}
        Invite
      </Button>
    )
  }

  return (
    <div>
      <CustomDialog config={createExpenditureFundDialog} />
      <CustomDialog config={detailConfigDialog} />
      <CustomDialog config={updateConfigDialog} />
      <CustomDialog config={inviteParticipantConfigDialog} />
    </div>
  )
}
