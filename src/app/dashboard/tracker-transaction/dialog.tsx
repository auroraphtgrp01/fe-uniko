import CustomDialog from '@/components/dashboard/Dialog'
import { Button } from '@/components/ui/button'
import { IDialogConfig } from '@/types/common.i'
import { ITrackerTransactionDialogProps } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { DataTable } from '@/components/dashboard/DataTable'
import { initCreateTrackerTransactionForm } from '../transaction/constants'
import { useRef, useState } from 'react'
import ClassifyForm from '@/components/dashboard/transaction/ClassifyForm'
import CreateTrackerTransactionForm from '@/components/dashboard/tracker-transaction/CreateForm'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { useTranslation } from 'react-i18next'

export default function TrackerTransactionDialog({
  unclassifiedTxDialog,
  classifyTransactionDialog,
  createTrackerTransactionDialog,
  sharedDialogElements
}: ITrackerTransactionDialogProps) {
  const formClassifyRef = useRef<HTMLFormElement>(null)
  const formCreateRef = useRef<HTMLFormElement>(null)
  const { t } = useTranslation(['trackerTransaction', 'common'])
  // states
  const [transactionIdClassifying, setTransactionIdClassifying] = useState<string>()
  const [openEditTrackerTxTypeDialog, setOpenEditTrackerTxTypeDialog] = useState<boolean>(false)
  const [typeOfTrackerType, setTypeOfTrackerType] = useState<ETypeOfTrackerTransactionType>(
    ETypeOfTrackerTransactionType.INCOMING
  )

  const classifyingTransactionConfigDialog: IDialogConfig = {
    content: ClassifyForm({
      transactionId: transactionIdClassifying as string,
      incomeTrackerType: sharedDialogElements.incomeTrackerType,
      expenseTrackerType: sharedDialogElements.expenseTrackerType,
      openEditTrackerTxTypeDialog,
      setOpenEditTrackerTxTypeDialog,
      typeOfTrackerType,
      formClassifyRef,
      handleClassify: classifyTransactionDialog.handleClassify,
      handleCreateTrackerType: sharedDialogElements.handleCreateTrackerType,
      handleUpdateTrackerType: sharedDialogElements.handleUpdateTrackerType
    }),
    footer: (
      <Button onClick={() => formClassifyRef.current?.requestSubmit()} type='button'>
        {t('common:button.save')}
      </Button>
    ),
    description: t('trackerTransaction:trackerTransactionType.classifyDialog.description'),
    title: t('trackerTransaction:trackerTransactionType.classifyDialog.title'),
    isOpen: sharedDialogElements.isDialogOpen.isDialogClassifyTransactionOpen,
    onClose: () => {
      sharedDialogElements.setIsDialogOpen((prev) => ({ ...prev, isDialogClassifyTransactionOpen: false }))
      setTypeOfTrackerType(ETypeOfTrackerTransactionType.INCOMING)
    }
  }

  const createConfigDialog: IDialogConfig = {
    content: CreateTrackerTransactionForm({
      incomeTrackerType: sharedDialogElements.incomeTrackerType,
      expenseTrackerType: sharedDialogElements.expenseTrackerType,
      accountSourceData: createTrackerTransactionDialog.accountSourceData,
      openEditTrackerTxTypeDialog,
      setOpenEditTrackerTxTypeDialog,
      formCreateRef,
      handleCreateTrackerType: sharedDialogElements.handleCreateTrackerType,
      handleUpdateTrackerType: sharedDialogElements.handleUpdateTrackerType,
      handleCreate: createTrackerTransactionDialog.handleCreate
    }),
    footer: (
      <Button type='button' onClick={() => formCreateRef.current?.requestSubmit()}>
        {t('common:button.save')}
      </Button>
    ),
    description: t('trackerTransaction:trackerTransactionType.createDialog.description'),
    title: t('trackerTransaction:trackerTransactionType.createDialog.title'),
    isOpen: sharedDialogElements.isDialogOpen.isDialogCreateOpen,
    onClose: () => {
      sharedDialogElements.setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: false }))
      createTrackerTransactionDialog.setFormData(initCreateTrackerTransactionForm)
    }
  }
  const unclassifiedConfigDialog: IDialogConfig = {
    content: (
      <div className='overflow-x-auto'>
        <DataTable
          columns={unclassifiedTxDialog.columns}
          data={unclassifiedTxDialog.unclassifiedTxTableData}
          config={unclassifiedTxDialog.tableConfig}
          setConfig={unclassifiedTxDialog.setTableConfig}
          onRowClick={(rowData) => {
            setTransactionIdClassifying(rowData.id)
            setTypeOfTrackerType(rowData.direction as ETypeOfTrackerTransactionType)
            sharedDialogElements.setIsDialogOpen((prev) => ({ ...prev, isDialogClassifyTransactionOpen: true }))
          }}
        />
      </div>
    ),
    className: 'sm:max-w-[425px] md:max-w-[1080px]',
    description: t('trackerTransaction:trackerTransactionType.unclassifiedDialog.description'),
    title: t('trackerTransaction:trackerTransactionType.unclassifiedDialog.title'),
    isOpen: sharedDialogElements.isDialogOpen.isDialogUnclassifiedOpen,
    onClose: () => {
      sharedDialogElements.setIsDialogOpen((prev) => ({ ...prev, isDialogUnclassifiedOpen: false }))
    }
  }

  return (
    <div>
      <CustomDialog config={createConfigDialog} />
      <CustomDialog config={unclassifiedConfigDialog} />
      <CustomDialog config={classifyingTransactionConfigDialog} />
    </div>
  )
}
