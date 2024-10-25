import { DataTable } from '@/components/dashboard/DataTable'
import CustomDialog from '@/components/dashboard/Dialog'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { IClassifyTransactionFormData, IDataTransactionTable, IDialogTransaction } from '@/core/transaction/models'
import { IDataTableConfig, IDialogConfig } from '@/types/common.i'
import { Separator } from '@radix-ui/react-select'
import { ColumnDef } from '@tanstack/react-table'
import React, { useState } from 'react'
import {
  defineContentClassifyingTransactionDialog,
  initClassifyTransactionForm,
  initCreateTrackerTxTypeForm
} from './constants'
import {
  ITrackerTransactionType,
  ITrackerTransactionTypeBody
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { handleClassifyTransaction } from './handler'

export interface ITransactionDialogProps {
  dataTable: {
    columns: ColumnDef<any>[]
    data: IDataTransactionTable[]
    transactionTodayData: IDataTransactionTable[]
    unclassifiedTransactionData: IDataTransactionTable[]
    onRowClick: (row: any) => void
    setConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
    config: IDataTableConfig
    dataDetail: IDataTransactionTable
  }
  dialogState: {
    isDialogOpen: IDialogTransaction
    setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTransaction>>
  }
  classifyDialog: {
    formData: IClassifyTransactionFormData
    setFormData: React.Dispatch<React.SetStateAction<IClassifyTransactionFormData>>
    classifyTransaction: any
    incomeTrackerTransactionType: ITrackerTransactionType[]
    expenseTrackerTransactionType: ITrackerTransactionType[]
    hookUpdateCache: any
    hookCreateTrackerTxType: any
    hookSetCacheTrackerTxType: any
  }
}

export default function TransactionDialog(params: ITransactionDialogProps) {
  // useStates
  const [formDataCreateTrackerTxType, setFormDataCreateTrackerTxType] =
    useState<ITrackerTransactionTypeBody>(initCreateTrackerTxTypeForm)
  const [isAddingNewTrackerType, setIsAddingNewTrackerType] = useState<boolean>(false)
  const [openEditTrackerTxTypeDialog, setOpenEditTrackerTxTypeDialog] = useState<boolean>(false)
  const [classifyTrackerTransactionType, setClassifyTrackerTransactionType] = useState<ITrackerTransactionType[]>([])

  const { dataTable, dialogState, classifyDialog } = params
  const { formData, setFormData } = classifyDialog
  const detailsConfigDialog: IDialogConfig = {
    content: (
      <div className='py-4'>
        <div className='mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between'>
          <div className='mb-2 w-full sm:mb-0'>
            <p className='text-sm text-muted-foreground'>Amount</p>
            <div className='flex w-full items-center justify-between'>
              <p className='text-xl font-bold'>{dataTable.dataDetail.amount}</p>
              <Button
                disabled={!dataTable.dataDetail.accountNo && !dataTable.dataDetail.accountBank}
                variant={'greenPastel1'}
                type='button'
                onClick={() => {
                  if (dataTable.dataDetail.direction === 'INCOMING')
                    setClassifyTrackerTransactionType(classifyDialog.incomeTrackerTransactionType)
                  else setClassifyTrackerTransactionType(classifyDialog.expenseTrackerTransactionType)
                  dialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogClassifyTransactionOpen: true }))
                }}
              >
                Tracker Transaction
              </Button>
            </div>
          </div>
        </div>

        <Separator className='my-2' />
        <div className='overflow-x-auto'>
          <Table className=''>
            <TableBody>
              <TableRow>
                <TableCell>Transaction Id</TableCell>
                <TableCell>{dataTable.dataDetail.transactionId}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Direction</TableCell>
                <TableCell>{dataTable.dataDetail.direction}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Currency</TableCell>
                <TableCell>{dataTable.dataDetail.currency}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Account Bank</TableCell>
                <TableCell>{dataTable.dataDetail.accountBank}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Account No</TableCell>
                <TableCell>{dataTable.dataDetail.accountNo}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{dataTable.dataDetail.description}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    ),
    description: 'Detail information of the transaction',
    title: 'Transaction detail',
    isOpen: dialogState.isDialogOpen.isDialogDetailOpen,
    onClose: () => {
      dialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogDetailOpen: false }))
      classifyDialog.setFormData(initClassifyTransactionForm)
    }
  }
  const transactionsTodayConfigDialog: IDialogConfig = {
    content: (
      <div className='overflow-x-auto'>
        <DataTable
          columns={dataTable.columns}
          data={dataTable.transactionTodayData}
          onRowClick={dataTable.onRowClick}
          setConfig={dataTable.setConfig}
          config={dataTable.config}
        />
      </div>
    ),
    className: 'sm:max-w-[425px] md:max-w-[1080px]',
    description: 'Overview of today`s transactions',
    title: 'Transaction Today',
    isOpen: dialogState.isDialogOpen.isDialogTransactionTodayOpen,
    onClose: () => {
      dialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogTransactionTodayOpen: false }))
    }
  }
  const unclassifiedTransactionsConfigDialog: IDialogConfig = {
    content: (
      <div className='overflow-x-auto'>
        <DataTable
          columns={dataTable.columns}
          data={dataTable.unclassifiedTransactionData}
          onRowClick={dataTable.onRowClick}
          setConfig={dataTable.setConfig}
          config={dataTable.config}
        />
      </div>
    ),
    className: 'sm:max-w-[425px] md:max-w-[1080px]',
    description: 'Overview of unclassified`s transactions',
    title: 'Unclassified Transaction',
    isOpen: dialogState.isDialogOpen.isDialogUnclassifiedTransactionOpen,
    onClose: () => {
      dialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogUnclassifiedTransactionOpen: false }))
    }
  }
  const classifyingTransactionConfigDialogContent = defineContentClassifyingTransactionDialog({
    formData,
    setFormData,
    trackerTransactionType: classifyTrackerTransactionType,
    openEditTrackerTxTypeDialog,
    setOpenEditTrackerTxTypeDialog
  })
  const classifyingTransactionConfigDialog: IDialogConfig = {
    content: classifyingTransactionConfigDialogContent,
    footer: (
      <Button
        onClick={() =>
          handleClassifyTransaction({
            formData,
            setFormData,
            hookCreate: classifyDialog.classifyTransaction,
            hookUpdateCache: classifyDialog.hookUpdateCache,
            setIsDialogOpen: dialogState.setIsDialogOpen
          })
        }
        type='button'
      >
        Save changes
      </Button>
    ),
    description: 'Please fill in the information below to classify transaction.',
    title: 'Classify Transaction',
    isOpen: dialogState.isDialogOpen.isDialogClassifyTransactionOpen,
    onClose: () => {
      dialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogClassifyTransactionOpen: false }))
      setFormData(initClassifyTransactionForm)
    }
  }
  return (
    <div>
      <CustomDialog config={detailsConfigDialog} />
      <CustomDialog config={transactionsTodayConfigDialog} />
      <CustomDialog config={unclassifiedTransactionsConfigDialog} />
      <CustomDialog config={classifyingTransactionConfigDialog} />
    </div>
  )
}
