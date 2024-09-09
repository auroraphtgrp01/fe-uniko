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
import { ISelectFields } from '@/types/common.i'

export default function TransactionForm() {
  const [isDialogDetailOpen, setDialogDetailOpen] = useState(false)
  const [isDialogTransactionTodayOpen, setDialogTransactionTodayOpen] = useState(false)
  const [isDialogUnclassifiedTransactionOpen, setDialogUnclassifiedTransactionOpen] = useState(false)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [condition, setCondition] = useState<string>()
  const [isExactly, setIsExactly] = useState<boolean>()
  const [sort, setSort] = useState<string>()
  const [includePopulate, setIncludePopulate] = useState<boolean>(true)
  const [selectFields, setSelectFields] = useState<ISelectFields[]>([])
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
  const titleDialogDetail = 'Transaction detail'
  const descriptionDialogDetail = 'Detail information of the transaction'
  const contentDialogDetail = (
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
  )

  const closeDialogDetail = () => {
    setDialogDetailOpen(false)
  }

  const closeDialogTransactionToday = () => {
    setDialogTransactionTodayOpen(false)
  }

  const closeDialogUnclassifiedTransaction = () => {
    setDialogUnclassifiedTransactionOpen(false)
  }

  const getRowClassName = (rowData: any): string => {
    return !rowData.trackerTransaction || rowData.trackerTransaction === ''
      ? 'bg-[#75A47F] text-white hover:bg-[#75A47F]/90'
      : ''
  }

  const onRowClick = (rowData: any) => {
    console.log('Clicked row:', rowData)
    setDialogDetailOpen(true)
  }
  const contentDialogTransactionToday = (
    <div className='overflow-x-auto'>
      <DataTable
        isVisibleSortType={false}
        columns={columns}
        data={transactionTodayData}
        isPaginate={true}
        onRowClick={onRowClick}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        limit={limit}
        setLimit={setLimit}
        totalPage={totalPage}
        setTotalPage={setTotalPage}
      />
    </div>
  )
  const titleDialogTransactionToday = 'Transaction Today'
  const descriptionDialogTransactionToday = 'Overview of today`s transactions'
  const contentDialogUnclassifiedTransaction = (
    <div className='overflow-x-auto'>
      <DataTable
        isVisibleSortType={false}
        columns={columns}
        data={unclassifiedTransactionData}
        isPaginate={true}
        onRowClick={onRowClick}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        limit={limit}
        setLimit={setLimit}
        totalPage={totalPage}
        setTotalPage={setTotalPage}
      />
    </div>
  )
  const titleDialogUnclassifiedTransaction = 'Unclassified Transaction'
  const descriptionDialogUnclassifiedTransaction = 'Overview of today`s transactions'

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <span>Transaction Today</span>
              <Button variant='outline' onClick={() => setDialogTransactionTodayOpen(true)}>
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
              <Button variant='outline' onClick={() => setDialogUnclassifiedTransactionOpen(true)}>
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
              isVisibleSortType={false}
              columns={columns}
              data={data}
              isPaginate={true}
              getRowClassName={getRowClassName}
              onRowClick={onRowClick}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              limit={limit}
              setLimit={setLimit}
              totalPage={totalPage}
              setTotalPage={setTotalPage}
            />
          </div>
          <CustomDialog
            content={contentDialogDetail}
            title={titleDialogDetail}
            description={descriptionDialogDetail}
            isOpen={isDialogDetailOpen}
            onClose={closeDialogDetail}
          />
          <CustomDialog
            className='sm:max-w-[425px] md:max-w-[1080px]'
            content={contentDialogTransactionToday}
            title={titleDialogTransactionToday}
            description={descriptionDialogTransactionToday}
            isOpen={isDialogTransactionTodayOpen}
            onClose={closeDialogTransactionToday}
          />
          <CustomDialog
            className='sm:max-w-[425px] md:max-w-[1080px]'
            content={contentDialogUnclassifiedTransaction}
            title={titleDialogUnclassifiedTransaction}
            description={descriptionDialogUnclassifiedTransaction}
            isOpen={isDialogUnclassifiedTransactionOpen}
            onClose={closeDialogUnclassifiedTransaction}
          />
        </CardContent>
      </Card>
    </div>
  )
}
