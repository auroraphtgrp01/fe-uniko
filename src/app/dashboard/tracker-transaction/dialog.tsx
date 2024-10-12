import CustomDialog from '@/components/dashboard/Dialog'
import { Button } from '@/components/ui/button'
import { IDataTableConfig, IDialogConfig } from '@/types/common.i'
import { IDialogTrackerTransaction } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { DataTable } from '@/components/dashboard/DataTable'
import { ITrackerTransactionType } from '@/core/tracker-transaction/tracker-transaction-type/models/tracker-transaction-type.interface'
import {
  defineContentClassifyingTransactionDialog,
  initClassifyTransactionForm,
  initCreateTrackerTransactionForm
} from '../transaction/constants'
import { handleClassifyTransaction, handleCreateTrackerTransaction } from './handlers'
import {
  IClassifyTransactionFormData,
  ICreateTransactionFormData,
  IDataTransactionTable,
  Transaction
} from '@/core/transaction/models'
import { useMemo, useState } from 'react'
import { defineContentCreateTransactionDialog } from './constants'
import { IAccountSource } from '@/core/account-source/models'

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
  formData: ICreateTransactionFormData
  setFormData: React.Dispatch<React.SetStateAction<ICreateTransactionFormData>>
  accountSourceData: IAccountSource[]
  createTrackerTransaction: any
  hookUpdateCache: any
}
interface ISharedDialogElements {
  dataTrackerTransactionType: ITrackerTransactionType[]
  isDialogOpen: IDialogTrackerTransaction
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTrackerTransaction>>
  hookResetCacheStatistic: any
}

interface ITrackerTransactionDialogProps {
  unclassifiedTxDialog: IUnclassifiedTxDialog
  classifyTransactionDialog: IClassifyTransactionDialog
  createTrackerTransactionDialog: ICreateTrackerTransactionDialog
  sharedDialogElements: ISharedDialogElements
}
export default function TrackerTransactionDialog({
  unclassifiedTxDialog,
  classifyTransactionDialog,
  createTrackerTransactionDialog,
  sharedDialogElements
}: ITrackerTransactionDialogProps) {
  // useStates
  const [newItemTrackerType, setItemTrackerType] = useState<string>('')
  const [isAddingNewTrackerType, setIsAddingNewTrackerType] = useState<boolean>(false)
  const contentCreateTrackerTxDialogDialog = defineContentCreateTransactionDialog({
    formData: createTrackerTransactionDialog.formData,
    setFormData: createTrackerTransactionDialog.setFormData,
    newItemTrackerType,
    setItemTrackerType,
    isAddingNewTrackerType,
    setIsAddingNewTrackerType,
    trackerTransactionType: sharedDialogElements.dataTrackerTransactionType,
    accountSourceData: createTrackerTransactionDialog.accountSourceData
  })
  const classifyingTransactionConfigDialogContent = defineContentClassifyingTransactionDialog({
    formData: classifyTransactionDialog.formData,
    setFormData: classifyTransactionDialog.setFormData,
    newItemTrackerType,
    setItemTrackerType,
    isAddingNewTrackerType,
    setIsAddingNewTrackerType,
    trackerTransactionType: sharedDialogElements.dataTrackerTransactionType
  })

  const classifyingTransactionConfigDialog: IDialogConfig = {
    content: classifyingTransactionConfigDialogContent,
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
    content: contentCreateTrackerTxDialogDialog,
    footer: <Button type='button'>Save changes</Button>,
    description: 'Please fill in the information below to create a new transaction.',
    title: 'Create Transaction',
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

  return (
    <div>
      <CustomDialog config={createConfigDialog} />
      <CustomDialog config={unclassifiedConfigDialog} />
      <CustomDialog config={classifyingTransactionConfigDialog} />
    </div>
  )
}
