import CustomDialog from '@/components/dashboard/Dialog'
import { Button } from '@/components/ui/button'
import { IDialogConfig } from '@/types/common.i'
import { ITrackerTransactionDialogProps } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { DataTable } from '@/components/dashboard/DataTable'
import {
  ITrackerTransactionType,
  ITrackerTransactionTypeBody
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { initCreateTrackerTransactionForm, initTrackerTypeForm } from '../transaction/constants'
import { handleCreateTrackerTransaction, modifiedTrackerTypeForComboBox } from './handlers'
import { useEffect, useRef, useState } from 'react'
import ClassifyForm from '@/components/dashboard/transaction/ClassifyForm'
import CreateTrackerTransactionForm from '@/components/dashboard/tracker-transaction/CreateForm'
import { IEditTrackerTypeDialogData } from '@/components/dashboard/EditTrackerType'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'

export default function TrackerTransactionDialog({
  unclassifiedTxDialog,
  classifyTransactionDialog,
  createTrackerTransactionDialog,
  sharedDialogElements
}: ITrackerTransactionDialogProps) {
  const formClassifyRef = useRef<HTMLFormElement>(null)
  const formCreateRef = useRef<HTMLFormElement>(null)
  // states
  const [openEditTrackerTxTypeDialog, setOpenEditTrackerTxTypeDialog] = useState<boolean>(false)
  const [typeOfTrackerType, setTypeOfTrackerType] = useState<ETypeOfTrackerTransactionType>(
    ETypeOfTrackerTransactionType.INCOMING
  )

  const classifyingTransactionConfigDialog: IDialogConfig = {
    content: ClassifyForm({
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
        Save changes
      </Button>
    ),
    description: 'Please fill in the information below to classify transaction.',
    title: 'Classify Transaction',
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
        Save changes
      </Button>
    ),
    description: 'Please fill in the information below to create a new tracker transaction.',
    title: 'Create Tracker Transaction',
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
            setTypeOfTrackerType(rowData.direction as ETypeOfTrackerTransactionType)
            sharedDialogElements.setIsDialogOpen((prev) => ({ ...prev, isDialogClassifyTransactionOpen: true }))
          }}
        />
      </div>
    ),
    className: 'sm:max-w-[425px] md:max-w-[1080px]',
    description: 'Overview of unclassified`s transactions',
    title: 'Unclassified transactions',
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
