import CustomDialog from '@/components/dashboard/Dialog'
import { IExpenditureFundDialogProps } from './constants'
import { IDialogConfig } from '@/types/common.i'
import CreateExpenditureFundForm from '@/components/dashboard/expenditure-fund/create-expenditure-fund'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { t } from 'i18next'

export default function ExpenditureFundDialog(params: IExpenditureFundDialogProps) {
  const formCreateExpenditureFundRef = useRef<HTMLFormElement>(null)

  const { commonDialogState, createDialog } = params
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
  return (
    <div>
      <CustomDialog config={createExpenditureFundDialog} />
    </div>
  )
}
