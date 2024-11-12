import CustomDialog from '@/components/dashboard/Dialog'
import { initEmptyDetailExpenditureFund } from './constants'
import { IDialogConfig } from '@/types/common.i'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { t } from 'i18next'
import { IExpenditureFundDialogProps } from '@/core/expenditure-fund/models/expenditure-fund.interface'
import CreateExpenditureFundForm from '@/components/dashboard/expenditure-fund/create-expenditure-fund'
import { DetailExpenditureFund } from '@/components/dashboard/expenditure-fund/detail-expenditure-fund'
import UpdateExpenditureFundForm from '@/components/dashboard/expenditure-fund/update-expenditure-fund'

export default function ExpenditureFundDialog(params: IExpenditureFundDialogProps) {
  const formCreateExpenditureFundRef = useRef<HTMLFormElement>(null)
  const formUpdateExpenditureFundRef = useRef<HTMLFormElement>(null)

  const { commonDialogState, createDialog, detailUpdateDialog } = params
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
    className: 'sm:max-w-[325px] md:max-w-[900px]',
    content: DetailExpenditureFund({
      detailData: detailUpdateDialog.data
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

  return (
    <div>
      <CustomDialog config={createExpenditureFundDialog} />
      <CustomDialog config={detailConfigDialog} />
      <CustomDialog config={updateConfigDialog} />
    </div>
  )
}
