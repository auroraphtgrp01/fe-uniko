import CustomDialog from '@/components/dashboard/Dialog'
import { initEmptyDetailExpenditureFund } from './constants'
import { IDialogConfig } from '@/types/common.i'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { t } from 'i18next'
import {
  IExpenditureFundDialogProps,
  IUpdateExpenditureFundBody
} from '@/core/expenditure-fund/models/expenditure-fund.interface'
import CreateExpenditureFundForm from '@/components/dashboard/expenditure-fund/create-expenditure-fund'
import UpdateExpenditureFundForm from '@/components/dashboard/expenditure-fund/update-expenditure-fund'

export default function ExpenditureFundDialog(params: IExpenditureFundDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
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

  const detailUpdatesConfigDialog: IDialogConfig = {
    content: UpdateExpenditureFundForm({
      formUpdateRef: formUpdateExpenditureFundRef,
      handleUpdate: detailUpdateDialog.handleUpdate,
      defaultValues: {
        currency: detailUpdateDialog.data.currency,
        description: detailUpdateDialog.data.description,
        name: detailUpdateDialog.data.name,
        status: detailUpdateDialog.data.status
      },
      detailData: detailUpdateDialog.data,
      isEditing,
      setIsEditing
    }),
    description: 'Detail information of the expenditure fund.',
    title: 'Expenditure Fund Details',
    isOpen: commonDialogState.isDialogOpen.isDialogDetailUpdateOpen,
    onClose: () => {
      detailUpdateDialog.setDetailData(initEmptyDetailExpenditureFund)
      // setIsEditing(false)
      commonDialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogDetailUpdateOpen: false }))
    },
    footer: (
      <div className='flex'>
        {isEditing === true ? (
          <>
            <Button variant='outline' onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => formUpdateExpenditureFundRef.current?.requestSubmit()}
              className='ml-2'
              type='button'
            >
              {t('common:button.save')}
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Update</Button>
        )}
      </div>
    )
  }

  return (
    <div>
      <CustomDialog config={createExpenditureFundDialog} />
      <CustomDialog config={detailUpdatesConfigDialog} />
    </div>
  )
}
