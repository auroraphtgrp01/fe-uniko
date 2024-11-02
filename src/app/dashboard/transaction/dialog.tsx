import { DataTable } from '@/components/dashboard/DataTable'
import CustomDialog from '@/components/dashboard/Dialog'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { IClassifyTransactionFormData, IDataTransactionTable, IDialogTransaction } from '@/core/transaction/models'
import { IDataTableConfig, IDialogConfig } from '@/types/common.i'
import { Separator } from '@radix-ui/react-select'
import { ColumnDef } from '@tanstack/react-table'
import React, { useRef, useState } from 'react'
import {
  ITrackerTransactionType,
  ITrackerTransactionTypeBody
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import ClassifyForm from '@/components/dashboard/transaction/ClassifyForm'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { initTableConfig } from '@/constants/data-table'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'

export interface ITransactionDialogProps {
  dataTable: {
    columns: ColumnDef<any>[]
    data: IDataTransactionTable[]
    transactionTodayData: IDataTransactionTable[]
    unclassifiedTransactionData: IDataTransactionTable[]
    setConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
    config: IDataTableConfig
    setUncConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
    uncConfig: IDataTableConfig
    setTodayConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
    todayConfig: IDataTableConfig
    dataDetail: IDataTransactionTable
    setDataDetail: React.Dispatch<React.SetStateAction<IDataTransactionTable>>
  }
  dialogState: {
    isDialogOpen: IDialogTransaction
    setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTransaction>>
  }
  classifyDialog: {
    incomeTrackerTransactionType: ITrackerTransactionType[]
    expenseTrackerTransactionType: ITrackerTransactionType[]
    handleClassify: (data: IClassifyTransactionFormData) => void
  }
  dialogEditTrackerType: {
    handleCreateTrackerType: (
      data: ITrackerTransactionTypeBody,
      setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
    ) => void
    handleUpdateTrackerType: (data: ITrackerTransactionTypeBody) => void
  }
}

export default function TransactionDialog(params: ITransactionDialogProps) {
  const { t } = useTranslation(['transaction', 'common'])
  const formClassifyRef = useRef<HTMLFormElement>(null)
  // useStates
  const [openEditTrackerTxTypeDialog, setOpenEditTrackerTxTypeDialog] = useState<boolean>(false)
  const { dataTable, dialogState, classifyDialog, dialogEditTrackerType } = params
  const [typeOfTrackerType, setTypeOfTrackerType] = useState<ETypeOfTrackerTransactionType>(
    ETypeOfTrackerTransactionType.INCOMING
  )

  const detailsConfigDialog: IDialogConfig = {
    content: (
      <div className='py-4'>
        <div className='mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between'>
          <div className='mb-2 w-full sm:mb-0'>
            <p className='text-sm text-muted-foreground'>
              {t('transaction:TransactionType.detailsConfigDialog.amount')}
            </p>
            <div className='flex w-full items-center justify-between'>
              <p className='text-xl font-bold'>{dataTable.dataDetail.amount}</p>
              {dataTable.dataDetail.accountNo ? (
                dataTable.dataDetail.TrackerTransaction ? (
                  <span
                    className='border-collapse rounded-md bg-green-100 px-4 py-2 text-lg text-green-600'
                    style={{ userSelect: 'none' }}
                  >
                    Classified
                  </span>
                ) : (
                  <Button
                    variant={'greenPastel1'}
                    type='button'
                    onClick={() => {
                      dialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogClassifyTransactionOpen: true }))
                    }}
                  >
                    {t('transaction:TransactionType.detailsConfigDialog.trackerTransaction')}
                  </Button>
                )
              ) : (
                ''
              )}
            </div>
          </div>
        </div>

        <Separator className='my-2' />
        <div className='overflow-x-auto'>
          <Table className=''>
            <TableBody>
              <TableRow>
                <TableCell> {t('transaction:TransactionType.detailsConfigDialog.direction')}</TableCell>
                <TableCell>{dataTable.dataDetail.direction}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('transaction:TransactionType.detailsConfigDialog.currency')}</TableCell>
                <TableCell>{dataTable.dataDetail.currency}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('transaction:TransactionType.detailsConfigDialog.accountBank')}</TableCell>
                <TableCell>{dataTable.dataDetail.accountNo}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('transaction:TransactionType.detailsConfigDialog.description')}</TableCell>
                <TableCell>{dataTable.dataDetail.description}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    ),
    description: t('transaction:TransactionType.detailsDialog.description'),
    title: t('transaction:TransactionType.detailsDialog.title'),
    isOpen: dialogState.isDialogOpen.isDialogDetailOpen,
    onClose: () => {
      dialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogDetailOpen: false }))
    }
  }
  const transactionsTodayConfigDialog: IDialogConfig = {
    content: (
      <div className='overflow-x-auto'>
        <DataTable
          columns={dataTable.columns}
          data={dataTable.transactionTodayData}
          onRowClick={(rowData) => {
            dataTable.setDataDetail(rowData)
            dialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogDetailOpen: true }))
          }}
          setConfig={dataTable.setTodayConfig}
          config={dataTable.todayConfig}
        />
      </div>
    ),
    className: 'sm:max-w-[425px] md:max-w-[1080px]',
    description: t('transaction:TransactionType.transactionsTodayDialog.description'),
    title: t('transaction:TransactionType.transactionsTodayDialog.title'),
    isOpen: dialogState.isDialogOpen.isDialogTransactionTodayOpen,
    onClose: () => {
      dialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogTransactionTodayOpen: false }))
      dataTable.setTodayConfig({
        ...initTableConfig,
        isVisibleSortType: false,
        classNameOfScroll: 'h-[calc(100vh-35rem)]'
      })
    }
  }
  const unclassifiedTransactionsConfigDialog: IDialogConfig = {
    content: (
      <div className='overflow-x-auto'>
        <DataTable
          columns={dataTable.columns}
          data={dataTable.unclassifiedTransactionData}
          onRowClick={(rowData) => {
            dataTable.setDataDetail(rowData)
            dialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogDetailOpen: true }))
            setTypeOfTrackerType(rowData.direction)
          }}
          setConfig={dataTable.setUncConfig}
          config={dataTable.uncConfig}
        />
      </div>
    ),
    className: 'sm:max-w-[425px] md:max-w-[1080px]',
    description: t('transaction:TransactionType.unclassifiedTransactionsDialog.description'),
    title: t('transaction:TransactionType.unclassifiedTransactionsDialog.title'),
    isOpen: dialogState.isDialogOpen.isDialogUnclassifiedTransactionOpen,
    onClose: () => {
      dialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogUnclassifiedTransactionOpen: false }))
      dataTable.setUncConfig({
        ...initTableConfig,
        isVisibleSortType: false,
        classNameOfScroll: 'h-[calc(100vh-35rem)]'
      })
    }
  }
  const classifyingTransactionConfigDialog: IDialogConfig = {
    content: ClassifyForm({
      transactionId: dataTable.dataDetail.id,
      incomeTrackerType: classifyDialog.incomeTrackerTransactionType,
      expenseTrackerType: classifyDialog.expenseTrackerTransactionType,
      openEditTrackerTxTypeDialog,
      setOpenEditTrackerTxTypeDialog,
      typeOfTrackerType,
      formClassifyRef,
      handleClassify: classifyDialog.handleClassify,
      handleCreateTrackerType: dialogEditTrackerType.handleCreateTrackerType,
      handleUpdateTrackerType: dialogEditTrackerType.handleUpdateTrackerType
    }),
    footer: (
      <Button onClick={() => formClassifyRef.current?.requestSubmit()} type='button'>
        {t('common:button.save_changes')}
      </Button>
    ),
    description: t('transaction:TransactionType.classifyingTransactionDialog.description'),
    title: t('transaction:TransactionType.classifyingTransactionDialog.title'),
    isOpen: dialogState.isDialogOpen.isDialogClassifyTransactionOpen,
    onClose: () => {
      dialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogClassifyTransactionOpen: false }))
      setTypeOfTrackerType(ETypeOfTrackerTransactionType.INCOMING)
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
