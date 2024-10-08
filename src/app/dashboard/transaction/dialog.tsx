import { IDataTransactionTable } from '@/app/dashboard/transaction/handler'
import { DataTable } from '@/components/dashboard/DataTable'
import CustomDialog from '@/components/dashboard/Dialog'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { IDialogTransaction } from '@/core/transaction/models'
import { IDataTableConfig, IDialogConfig } from '@/types/common.i'
import { Separator } from '@radix-ui/react-select'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'

export interface ITransactionDialogProps {
  dataTable: {
    columns: ColumnDef<any>[]
    data: any[]
    onRowClick: (row: any) => void
    setConfig: React.Dispatch<React.SetStateAction<IDataTableConfig>>
    config: IDataTableConfig
    dataDetail: IDataTransactionTable
  }
  dialogState: {
    isDialogOpen: IDialogTransaction
    setIsDialogOpen: React.Dispatch<React.SetStateAction<IDialogTransaction>>
  }
}

export default function TransactionDialog(params: ITransactionDialogProps) {
  const { dataTable, dialogState } = params
  const detailsConfigDialog: IDialogConfig = {
    content: (
      <div className='py-4'>
        <div className='mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between'>
          <div className='mb-2 w-full sm:mb-0'>
            <p className='text-sm text-muted-foreground'>Amount</p>
            <div className='flex w-full items-center justify-between'>
              <p className='text-xl font-bold'>{dataTable.dataDetail.amount}</p>
              <Button variant={'greenPastel1'}>Tracker Transaction</Button>
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
    }
  }
  const transactionsTodayConfigDialog: IDialogConfig = {
    content: (
      <div className='overflow-x-auto'>
        <DataTable
          columns={dataTable.columns}
          data={dataTable.data}
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
          data={dataTable.data}
          onRowClick={dataTable.onRowClick}
          setConfig={dataTable.setConfig}
          config={dataTable.config}
        />
      </div>
    ),
    className: 'sm:max-w-[425px] md:max-w-[1080px]',
    description: 'Overview of today`s transactions',
    title: 'Unclassified Transaction',
    isOpen: dialogState.isDialogOpen.isDialogUnclassifiedTransactionOpen,
    onClose: () => {
      dialogState.setIsDialogOpen((prev) => ({ ...prev, isDialogUnclassifiedTransactionOpen: false }))
    }
  }
  return (
    <div>
      <CustomDialog config={detailsConfigDialog} />
      <CustomDialog config={transactionsTodayConfigDialog} />
      <CustomDialog config={unclassifiedTransactionsConfigDialog} />
    </div>
  )
}
