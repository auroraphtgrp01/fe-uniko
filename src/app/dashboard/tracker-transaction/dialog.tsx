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
import { handleCreateTrackerTransaction } from './handlers'
import { IClassifyTransactionFormData, ICreateTransactionFormData } from '@/core/transaction/models'
import { useMemo, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { defineContentCreateTransactionDialog } from './constants'
import { IAccountSource } from '@/core/account-source/models'

export interface ITrackerTransactionDialogProps {
  columns: any[]
  isDialogOpen: IDialogTrackerTransaction
  setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTrackerTransaction>>
  dataTable: any[]
  setDataTable: React.Dispatch<React.SetStateAction<any[]>>
  tableConfig: IDataTableConfig
  setTableConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
  dataTrackerTransactionType: ITrackerTransactionType[]
  formDataClassify: IClassifyTransactionFormData
  setFormDataClassify: React.Dispatch<React.SetStateAction<IClassifyTransactionFormData>>
  formDataCreate: ICreateTransactionFormData
  setFormDataCreate: React.Dispatch<React.SetStateAction<ICreateTransactionFormData>>
  hookUpdateCache: any
  createTrackerTransaction: any
  accountSourceData: IAccountSource[]
}
export default function TrackerTransactionDialog({
  columns,
  isDialogOpen,
  setIsDialogOpen,
  dataTable,
  setDataTable,
  tableConfig,
  setTableConfig,
  dataTrackerTransactionType,
  formDataClassify,
  setFormDataClassify,
  formDataCreate,
  setFormDataCreate,
  hookUpdateCache,
  createTrackerTransaction,
  accountSourceData
}: ITrackerTransactionDialogProps) {
  // useStates
  const [newItemTrackerType, setItemTrackerType] = useState<string>('')
  const [isAddingNewTrackerType, setIsAddingNewTrackerType] = useState<boolean>(false)

  const classifyingTransactionConfigDialogContent = useMemo(
    () =>
      defineContentClassifyingTransactionDialog({
        formData: formDataClassify,
        setFormData: setFormDataClassify,
        newItemTrackerType,
        setItemTrackerType,
        isAddingNewTrackerType,
        setIsAddingNewTrackerType,
        trackerTransactionType: dataTrackerTransactionType
      }),
    [dataTrackerTransactionType]
  )
  const classifyingTransactionConfigDialog: IDialogConfig = {
    content: classifyingTransactionConfigDialogContent,
    footer: (
      <Button
        onClick={() =>
          handleCreateTrackerTransaction({
            formData: formDataCreate,
            setFormData: setFormDataCreate,
            hookCreate: createTrackerTransaction,
            hookUpdateCache: hookUpdateCache,
            setIsDialogOpen
          })
        }
        type='button'
      >
        Save changes
      </Button>
    ),
    description: 'Please fill in the information below to classify transaction.',
    title: 'Classify Transaction',
    isOpen: isDialogOpen.isDialogClassifyOpen,
    onClose: () => {
      setIsDialogOpen((prev) => ({ ...prev, isDialogClassifyOpen: false }))
      setFormDataClassify(initClassifyTransactionForm)
    }
  }
  const contentDialogForm = useMemo(
    () =>
      defineContentCreateTransactionDialog({
        formData: formDataCreate,
        setFormData: setFormDataCreate,
        newItemTrackerType,
        setItemTrackerType,
        isAddingNewTrackerType,
        setIsAddingNewTrackerType,
        trackerTransactionType: dataTrackerTransactionType,
        accountSourceData
      }),
    [dataTrackerTransactionType, accountSourceData]
  )
  const createConfigDialog: IDialogConfig = {
    content: contentDialogForm,
    footer: <Button type='submit'>Save changes</Button>,
    description: 'Please fill in the information below to create a new transaction.',
    title: 'Create Transaction',
    isOpen: isDialogOpen.isDialogCreateOpen,
    onClose: () => {
      setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: false }))
      setFormDataCreate(initCreateTrackerTransactionForm)
    }
  }

  const classifyConfigDialog: IDialogConfig = {
    content: (
      <div className='overflow-x-auto'>
        <DataTable
          columns={columns}
          data={dataTable}
          config={tableConfig}
          setConfig={setTableConfig}
          onRowClick={() => {}}
        />
      </div>
    ),
    className: 'sm:max-w-[425px] md:max-w-[1080px]',
    description: 'Please fill in the information below to classify a transaction',
    title: 'Classify transactions',
    isOpen: isDialogOpen.isDialogClassifyOpen,
    onClose: () => {
      setIsDialogOpen((prev) => ({ ...prev, isDialogClassifyOpen: false }))
    }
  }

  return (
    <div>
      <CustomDialog config={createConfigDialog} />
      <CustomDialog config={classifyConfigDialog} />
      <CustomDialog config={classifyingTransactionConfigDialog} />
    </div>
  )
}
