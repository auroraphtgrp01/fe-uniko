'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/dashboard/DataTable'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import { formatCurrencyVND, formatDateTimeVN } from '@/constants/functions'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

export default function page() {
  const headers = [
    'Transaction Id',
    'Amount',
    'Direction',
    'Currency',
    'Account Bank',
    'Tracker Transaction',
    'Created At'
  ]
  const columns = getColumns(headers)
  const data = [
    {
      transactionId: 'TXN123456',
      amount: formatCurrencyVND(1000000),
      direction: 'inflow',
      currency: 'VND',
      accountBank: 'Vietcombank',
      trackerTransaction: 'Tracker001',
      createdAt: formatDateTimeVN('2024-09-04T10:10:00.000Z')
    },
    {
      transactionId: 'TXN123457',
      amount: formatCurrencyVND(2000000),
      direction: 'outflow',
      currency: 'USD',
      accountBank: 'Techcombank',
      trackerTransaction: undefined,
      createdAt: formatDateTimeVN('2024-09-05T11:20:00.000Z')
    },
    {
      transactionId: 'TXN123458',
      amount: formatCurrencyVND(1500000),
      direction: 'inflow',
      currency: 'EUR',
      accountBank: 'BIDV',
      trackerTransaction: null,
      createdAt: formatDateTimeVN('2024-09-06T12:30:00.000Z')
    },
    {
      transactionId: 'TXN123459',
      amount: formatCurrencyVND(2500000),
      direction: 'outflow',
      currency: 'JPY',
      accountBank: 'Agribank',
      trackerTransaction: '',
      createdAt: formatDateTimeVN('2024-09-07T13:40:00.000Z')
    },
    {
      transactionId: 'TXN123460',
      amount: formatCurrencyVND(3000000),
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
      amount: formatCurrencyVND(1000000),
      direction: 'inflow',
      currency: 'VND',
      accountBank: 'Vietcombank',
      trackerTransaction: 'Tracker001',
      createdAt: formatDateTimeVN('2024-09-04T10:10:00.000Z')
    },
    {
      transactionId: 'TXN123457',
      amount: formatCurrencyVND(2000000),
      direction: 'outflow',
      currency: 'USD',
      accountBank: 'Techcombank',
      trackerTransaction: 'Tracker002',
      createdAt: formatDateTimeVN('2024-09-05T11:20:00.000Z')
    },
    {
      transactionId: 'TXN123458',
      amount: formatCurrencyVND(1500000),
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
      amount: formatCurrencyVND(3000000),
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
  }
  const onRowDoubleClick = (rowData: any) => {
    console.log('Double clicked row:', rowData)
  }

  return (
    <div className='mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-2'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span>Transaction Today</span>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='outline'>View all</Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[1000px]'>
                <DialogHeader>
                  <DialogTitle>Transaction Today</DialogTitle>
                  <DialogDescription>Overview of today`s transactions</DialogDescription>
                </DialogHeader>
                <DataTable columns={columns} data={transactionTodayData} isPaginate={false} />
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>Overview of today`s transactions</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <div className='flex items-center justify-between'>
            <div className='font-medium'>Total Transactions</div>
            <div className='text-2xl font-bold'>5</div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='font-medium'>Total Amount</div>
            <div className='text-2xl font-bold'>{formatCurrencyVND(1234567)} </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span>Unclassified Transaction</span>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='outline'>Classify</Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[1000px]'>
                <DialogHeader>
                  <DialogTitle>Unclassified Transaction</DialogTitle>
                  <DialogDescription>Overview of today`s transactions</DialogDescription>
                </DialogHeader>
                <DataTable columns={columns} data={unclassifiedTransactionData} isPaginate={false} />
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>Transactions without a tracker</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <div className='flex items-center justify-between'>
            <div className='font-medium'>Total Transactions</div>
            <div className='text-2xl font-bold'>1</div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='font-medium'>Total Amount</div>
            <div className='text-2xl font-bold'>{formatCurrencyVND(220000)}</div>
          </div>
        </CardContent>
      </Card>
      <div className='col-span-2'>
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>All financial transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={data}
              isPaginate={false}
              getRowClassName={getRowClassName}
              onRowClick={onRowClick}
              onRowDoubleClick={onRowDoubleClick}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
