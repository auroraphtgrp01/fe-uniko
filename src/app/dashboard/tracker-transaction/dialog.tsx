import CustomDialog from '@/components/dashboard/Dialog'
import { Button } from '@/components/ui/button'
import { IDataTableConfig, IDialogConfig } from '@/types/common.i'
import { IDialogTrackerTransaction } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { DataTable } from '@/components/dashboard/DataTable'
import {
  ITrackerTransactionType,
  ITrackerTransactionTypeBody
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { initClassifyTransactionForm, initCreateTrackerTransactionForm } from '../transaction/constants'
import { handleClassifyTransaction, handleCreateTrackerTransaction, handleCreateTrackerTxType } from './handlers'
import {
  IClassifyTransactionFormData,
  ICreateTrackerTransactionFormData,
  IDataTransactionTable
} from '@/core/transaction/models'
import { defineContentCreateTrackerTxTypeDialog } from './constants'
import { IAccountSource } from '@/core/account-source/models'
import { useState } from 'react'
import ClassifyForm from '@/components/dashboard/transaction/ClassifyForm'
import CreateTrackerTransactionForm from '@/components/dashboard/tracker-trasaction/CreateForm'

interface IUnclassifiedTxDialog {
  columns: any[]
  unclassifiedTxTableData: IDataTransactionTable[]
  tableConfig: IDataTableConfig
  setTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
}
interface IClassifyTransactionDialog {
  formData: IClassifyTransactionFormData
  setFormData: React.Dispatch<React.SetStateAction<IClassifyTransactionFormData>>
  classifyTransaction: any
  hookUpdateCache: any
  resetCacheTrackerTx: any
}
interface ICreateTrackerTransactionDialog {
  formData: ICreateTrackerTransactionFormData
  setFormData: React.Dispatch<React.SetStateAction<ICreateTrackerTransactionFormData>>
  accountSourceData: IAccountSource[]
  createTrackerTransaction: any
  hookUpdateCache: any
}

interface ICreateTrackerTransactionTypeDialog {
  formData: ITrackerTransactionTypeBody
  setFormData: React.Dispatch<React.SetStateAction<ITrackerTransactionTypeBody>>
  createTrackerTransactionType: any
  hookUpdateCache: any
}

interface ISharedDialogElements {
  incomeTrackerType: ITrackerTransactionType[]
  expenseTrackerType: ITrackerTransactionType[]
  isDialogOpen: IDialogTrackerTransaction
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTrackerTransaction>>
  hookResetCacheStatistic: any
}

interface ITrackerTransactionDialogProps {
  unclassifiedTxDialog: IUnclassifiedTxDialog
  classifyTransactionDialog: IClassifyTransactionDialog
  createTrackerTransactionDialog: ICreateTrackerTransactionDialog
  sharedDialogElements: ISharedDialogElements
  createTrackerTransactionTypeDialog: ICreateTrackerTransactionTypeDialog
}

export default function TrackerTransactionDialog({
  unclassifiedTxDialog,
  classifyTransactionDialog,
  createTrackerTransactionDialog,
  sharedDialogElements,
  createTrackerTransactionTypeDialog
}: ITrackerTransactionDialogProps) {
  // states
  const [openEditTrackerTxTypeDialog, setOpenEditTrackerTxTypeDialog] = useState<boolean>(false)
  const [classifyTrackerTransactionType, setClassifyTrackerTransactionType] = useState<ITrackerTransactionType[]>([])
  const [dataEditTrackerType, setDataEditTrackerType] = useState<{ value: string; label: string }[]>([])

  const contentCreateTrackerTxTypeDialog = defineContentCreateTrackerTxTypeDialog({
    formData: createTrackerTransactionTypeDialog.formData,
    setFormData: createTrackerTransactionTypeDialog.setFormData
  })

  const classifyingTransactionConfigDialog: IDialogConfig = {
    content: ClassifyForm({
      formData: classifyTransactionDialog.formData,
      setFormData: classifyTransactionDialog.setFormData,
      trackerTransactionType: classifyTrackerTransactionType,
      openEditTrackerTxTypeDialog,
      setOpenEditTrackerTxTypeDialog
    }),
    footer: (
      <Button
        onClick={() =>
          handleClassifyTransaction({
            formData: classifyTransactionDialog.formData,
            setFormData: classifyTransactionDialog.setFormData,
            hookCreate: classifyTransactionDialog.classifyTransaction,
            hookUpdateCache: classifyTransactionDialog.hookUpdateCache,
            setIsDialogOpen: sharedDialogElements.setIsDialogOpen,
            hookResetCacheStatistic: sharedDialogElements.hookResetCacheStatistic,
            hookResetTrackerTx: classifyTransactionDialog.resetCacheTrackerTx
          })
        }
        type='button'
      >
        Save changes
      </Button>
    ),
    description: 'Please fill in the information below to classify transaction.',
    title: 'Classify Transaction',
    isOpen: sharedDialogElements.isDialogOpen.isDialogClassifyTransactionOpen,
    onClose: () => {
      sharedDialogElements.setIsDialogOpen((prev) => ({ ...prev, isDialogClassifyTransactionOpen: false }))
      classifyTransactionDialog.setFormData(initClassifyTransactionForm)
    }
  }

  const createConfigDialog: IDialogConfig = {
    content: CreateTrackerTransactionForm({
      formData: createTrackerTransactionDialog.formData,
      setFormData: createTrackerTransactionDialog.setFormData,
      incomeTrackerType: sharedDialogElements.incomeTrackerType,
      expenseTrackerType: sharedDialogElements.expenseTrackerType,
      accountSourceData: createTrackerTransactionDialog.accountSourceData,
      openEditTrackerTxTypeDialog,
      setOpenEditTrackerTxTypeDialog,
      dataEditTrackerType,
      setDataEditTrackerType
    }),
    footer: (
      <Button
        type='button'
        onClick={() =>
          handleCreateTrackerTransaction({
            formData: createTrackerTransactionDialog.formData,
            setFormData: createTrackerTransactionDialog.setFormData,
            hookCreate: createTrackerTransactionDialog.createTrackerTransaction,
            hookUpdateCache: createTrackerTransactionDialog.hookUpdateCache,
            setIsDialogOpen: sharedDialogElements.setIsDialogOpen,
            hookResetCacheStatistic: sharedDialogElements.hookResetCacheStatistic
          })
        }
      >
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
            if (rowData.direction === 'INCOME')
              setClassifyTrackerTransactionType(sharedDialogElements.incomeTrackerType)
            else setClassifyTrackerTransactionType(sharedDialogElements.expenseTrackerType)
            classifyTransactionDialog.setFormData((prev) => ({ ...prev, transactionId: rowData.id }))
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

  // const createTrackerTransactionTypeConfigDialog: IDialogConfig = {
  //   content: contentCreateTrackerTxTypeDialog,
  //   description: 'Please fill in the information below to create a new tracker transaction type.',
  //   title: 'Create Tracker Transaction Type',
  //   isOpen: sharedDialogElements.isDialogOpen.isDialogCreateTrackerTxTypeOpen,
  //   onClose: () => {
  //     sharedDialogElements.setIsDialogOpen((prev) => ({ ...prev, isDialogCreateTrackerTxTypeOpen: false }))
  //   },
  //   footer: (
  //     <Button
  //       onClick={() =>
  //         handleCreateTrackerTxType({
  //           formData: createTrackerTransactionTypeDialog.formData,
  //           setFormData: createTrackerTransactionTypeDialog.setFormData,
  //           hookCreateTrackerTxType: createTrackerTransactionTypeDialog.createTrackerTransactionType,
  //           hookSetCacheTrackerTxType: createTrackerTransactionTypeDialog.hookUpdateCache,
  //           setIsDialogOpen: sharedDialogElements.setIsDialogOpen
  //         })
  //       }
  //       type='button'
  //     >
  //       Save changes
  //     </Button>
  //   )
  // }

  return (
    <div>
      <CustomDialog config={createConfigDialog} />
      <CustomDialog config={unclassifiedConfigDialog} />
      <CustomDialog config={classifyingTransactionConfigDialog} />
      {/* <CustomDialog config={createTrackerTransactionTypeConfigDialog} /> */}
    </div>
  )
}
