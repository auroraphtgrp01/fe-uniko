'use client'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/dashboard/DataTable'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import { formatCurrency, formatDateTimeVN } from '@/libraries/utils'
import { useState } from 'react'
import CustomDialog from '@/components/dashboard/Dialog'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { IDataTableConfig, IDialogConfig } from '@/types/common.i'
import { IQueryOptions } from '@/types/query.interface'

export default function TransactionForm() {
  const [dataTableConfig, setDataTableConfig] = useState<IDataTableConfig>({
    totalPage: 0,
    currentPage: 1,
    limit: 10,
    types: [],
    selectedTypes: [],
    isPaginate: true,
    isVisibleSortType: true,
    classNameOfScroll: 'h-[calc(100vh-30rem)]'
  })
  const [queryOptions, setQueryOptions] = useState<IQueryOptions>({
    page: dataTableConfig.currentPage,
    limit: dataTableConfig.limit,
    condition: '',
    isExactly: false,
    sort: '',
    includePopulate: true
  })
  const [isDialogOpen, setIsDialogOpen] = useState({
    isDialogDetailOpen: false,
    isDialogTransactionTodayOpen: false,
    isDialogUnclassifiedTransactionOpen: false
  })
  const headers = [
    'Transaction Id',
    'Amount',
    'Direction',
    'Currency',
    'Account Bank',
    'Tracker Transaction',
    'Created At'
  ]
  const columns = getColumns(headers, true)
  const data = [
    {
      transactionId: 'TXN123456',
      amount: formatCurrency(1000000, 'VND', 'vi-VN'),
      direction: 'inflow',
      currency: 'VND',
      accountBank: 'Vietcombank',
      trackerTransaction: 'Tracker001',
      createdAt: formatDateTimeVN('2024-09-04T10:10:00.000Z')
    },
    {
      transactionId: 'TXN123457',
      amount: formatCurrency(2000000, 'VND', 'vi-VN'),
      direction: 'outflow',
      currency: 'USD',
      accountBank: 'Techcombank',
      trackerTransaction: undefined,
      createdAt: formatDateTimeVN('2024-09-05T11:20:00.000Z')
    },
    {
      transactionId: 'TXN123458',
      amount: formatCurrency(1500000, 'VND', 'vi-VN'),
      direction: 'inflow',
      currency: 'EUR',
      accountBank: 'BIDV',
      trackerTransaction: null,
      createdAt: formatDateTimeVN('2024-09-06T12:30:00.000Z')
    },
    {
      transactionId: 'TXN123459',
      amount: formatCurrency(2500000, 'VND', 'vi-VN'),
      direction: 'outflow',
      currency: 'JPY',
      accountBank: 'Agribank',
      trackerTransaction: '',
      createdAt: formatDateTimeVN('2024-09-07T13:40:00.000Z')
    },
    {
      transactionId: 'TXN123460',
      amount: formatCurrency(3000000, 'VND', 'vi-VN'),
      direction: 'inflow',
      currency: 'GBP',
      accountBank: 'ACB',
      trackerTransaction: 'Tracker005',
      createdAt: formatDateTimeVN('2024-09-08T14:50:00.000Z')
    }
  ]
  const transactionTodayData = [
    {
      transactionId: 'TXN123456',
      amount: formatCurrency(1000000, 'VND', 'vi-VN'),
      direction: 'inflow',
      currency: 'VND',
      accountBank: 'Vietcombank',
      trackerTransaction: 'Tracker001',
      createdAt: formatDateTimeVN('2024-09-04T10:10:00.000Z')
    },
    {
      transactionId: 'TXN123457',
      amount: formatCurrency(2000000, 'VND', 'vi-VN'),
      direction: 'outflow',
      currency: 'USD',
      accountBank: 'Techcombank',
      trackerTransaction: 'Tracker002',
      createdAt: formatDateTimeVN('2024-09-05T11:20:00.000Z')
    },
    {
      transactionId: 'TXN123458',
      amount: formatCurrency(1500000, 'VND', 'vi-VN'),
      direction: 'inflow',
      currency: 'EUR',
      accountBank: 'BIDV',
      trackerTransaction: 'Tracker003',
      createdAt: formatDateTimeVN('2024-09-06T12:30:00.000Z')
    }
  ]
  const unclassifiedTransactionData = [
    {
      transactionId: 'TXN123460',
      amount: formatCurrency(3000000),
      direction: 'inflow',
      currency: 'GBP',
      accountBank: 'ACB',
      trackerTransaction: 'Tracker005',
      createdAt: formatDateTimeVN('2024-09-08T14:50:00.000Z')
    }
  ]
  const getRowClassName = (rowData: any): string => {
    return !rowData.trackerTransaction || rowData.trackerTransaction === ''
      ? 'bg-[#75A47F] text-white hover:bg-[#75A47F]/90'
      : ''
  }

  const onRowClick = (rowData: any) => {
    console.log('Clicked row:', rowData)
    setIsDialogOpen((prev) => ({ ...prev, isDialogDetailOpen: true }))
  }
  const detailsConfigDialog: IDialogConfig = {
    content: (
      <div className='py-4'>
        <div className='mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between'>
          <div className='mb-2 sm:mb-0'>
            <p className='text-sm text-muted-foreground'>Amount</p>
            <p className='text-xl font-bold'>${1200000}</p>
          </div>
        </div>
        <Separator className='my-4' />
        <div className='overflow-x-auto'>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Transaction ID</TableCell>
                <TableCell>id</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>{new Date().toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>
                  <Badge variant={'default'}>status</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Sender</TableCell>
                <TableCell>sender</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Recipient</TableCell>
                <TableCell>recipient</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>description</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Fee</TableCell>
                <TableCell>fee</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    ),

    description: 'Detail information of the transaction',
    title: 'Transaction detail',
    isOpen: isDialogOpen.isDialogDetailOpen,
    onClose: () => {
      setIsDialogOpen((prev) => ({ ...prev, isDialogDetailOpen: false }))
    }
  }
  const transactionsTodayConfigDialog: IDialogConfig = {
    content: (
      <div className='overflow-x-auto'>
        <DataTable
          columns={columns}
          data={transactionTodayData}
          config={dataTableConfig}
          setConfig={setDataTableConfig}
          getRowClassName={getRowClassName}
          onRowClick={onRowClick}
        />
      </div>
    ),
    className: 'sm:max-w-[425px] md:max-w-[1080px]',
    description: 'Overview of today`s transactions',
    title: 'Transaction Today',
    isOpen: isDialogOpen.isDialogTransactionTodayOpen,
    onClose: () => {
      setIsDialogOpen((prev) => ({ ...prev, isDialogTransactionTodayOpen: false }))
    }
  }
  const unclassifiedTransactionsConfigDialog: IDialogConfig = {
    content: (
      <div className='overflow-x-auto'>
        <DataTable
          columns={columns}
          data={unclassifiedTransactionData}
          onRowClick={onRowClick}
          setConfig={setDataTableConfig}
          config={dataTableConfig}
          getRowClassName={getRowClassName}
        />
      </div>
    ),
    className: 'sm:max-w-[425px] md:max-w-[1080px]',
    description: 'Overview of today`s transactions',
    title: 'Unclassified Transaction',
    isOpen: isDialogOpen.isDialogUnclassifiedTransactionOpen,
    onClose: () => {
      setIsDialogOpen((prev) => ({ ...prev, isDialogUnclassifiedTransactionOpen: false }))
    }
  }

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <span>Transaction Today</span>
              <Button
                variant='outline'
                onClick={() => setIsDialogOpen((prev) => ({ ...prev, isDialogTransactionTodayOpen: true }))}
              >
                View all
              </Button>
            </CardTitle>
            <CardDescription>Overview of today`s transactions</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4'>
            <div className='flex items-center justify-between'>
              <div>Total Transactions</div>
              <div className='text-xl font-bold'>5</div>
            </div>
            <div className='flex items-center justify-between'>
              <div>Total Amount</div>
              <div className='text-xl font-bold'>{formatCurrency(1234567)}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <span>Unclassified Transaction</span>
              <Button
                variant='outline'
                onClick={() => setIsDialogOpen((prev) => ({ ...prev, isDialogUnclassifiedTransactionOpen: true }))}
              >
                Classify
              </Button>
            </CardTitle>
            <CardDescription>Transactions without a tracker</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4'>
            <div className='flex items-center justify-between'>
              <div>Total Transactions</div>
              <div className='text-xl font-bold'>1</div>
            </div>
            <div className='flex items-center justify-between'>
              <div>Total Amount</div>
              <div className='text-xl font-bold'>{formatCurrency(220000)}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>All financial transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <DataTable
              columns={columns}
              data={data}
              config={dataTableConfig}
              setConfig={setDataTableConfig}
              getRowClassName={getRowClassName}
              onRowClick={onRowClick}
            />
          </div>
          <CustomDialog config={detailsConfigDialog} />
          <CustomDialog config={transactionsTodayConfigDialog} />
          <CustomDialog config={unclassifiedTransactionsConfigDialog} />
        </CardContent>
      </Card>
    </div>
  )
}
