'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/dashboard/DataTable'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import { formatCurrencyVND, formatDateTimeVN } from '@/constants/functions'
import { useState } from 'react'
import CustomDialog from '@/components/dashboard/Dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export default function TransactionPage() {
  const [isDialogDetailOpen, setDialogDetailOpen] = useState(false)
  const [isDialogCreateOpen, setDialogCreateOpen] = useState(false)
  const [isDialogTransactionTodayOpen, setDialogTransactionTodayOpen] = useState(false)
  const [isDialogUnclassifiedTransactionOpen, setDialogUnclassifiedTransactionOpen] = useState(false)

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

  const titleDialogCreate = 'Create new transaction'
  const descriptionDialogCreate = 'Please fill in the information below to create a new transaction'
  const contentDialogCreate = (
    <div className='grid gap-4 py-4'>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='name' className='text-right'>
          Name
        </Label>
        <Input id='name' className='col-span-3' />
      </div>
    </div>
  )

  const titleDialogDetail = 'Transaction detail'
  const descriptionDialogDetail = 'Please fill in the information below to update this transaction if you want'
  const contentDialogDetail = (
    <div className='grid gap-4 py-4'>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='name' className='text-right'>
          Name
        </Label>
        <Input id='name' className='col-span-3' />
      </div>
    </div>
  )
  const footerDialogDetail = (
    <>
      <Button variant='outline' onClick={() => closeDialogDetail}>
        Cancel
      </Button>
      <Button type='submit'>Save changes</Button>
    </>
  )
  const footerDialogCreate = (
    <>
      <Button variant='outline' onClick={() => closeDialogCreate}>
        Cancel
      </Button>
      <Button type='submit'>Save changes</Button>
    </>
  )

  const closeDialogDetail = () => {
    setDialogDetailOpen(false)
  }

  const closeDialogCreate = () => {
    setDialogCreateOpen(false)
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

  const onCreateTransaction = () => {
    console.log('Create new transaction')
    setDialogCreateOpen(true)
  }
  const contentDialogTransactionToday = <DataTable columns={columns} data={transactionTodayData} isPaginate={false} />
  const titleDialogTransactionToday = 'Transaction Today'
  const descriptionDialogTransactionToday = 'Overview of today`s transactions'
  const contentDialogUnclassifiedTransaction = (
    <DataTable columns={columns} data={unclassifiedTransactionData} isPaginate={false} />
  )
  const titleDialogUnclassifiedTransaction = 'Unclassified Transaction'
  const descriptionDialogUnclassifiedTransaction = 'Overview of today`s transactions'

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
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
            <Button variant='outline' onClick={() => setDialogUnclassifiedTransactionOpen(true)}>
              Classify
            </Button>
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
              createFunction={onCreateTransaction}
            />
            <CustomDialog
              content={contentDialogDetail}
              title={titleDialogDetail}
              description={descriptionDialogDetail}
              isOpen={isDialogDetailOpen}
              onClose={closeDialogDetail}
              footer={footerDialogDetail}
            />
            <CustomDialog
              content={contentDialogCreate}
              title={titleDialogCreate}
              description={descriptionDialogCreate}
              isOpen={isDialogCreateOpen}
              onClose={closeDialogCreate}
              footer={footerDialogCreate}
            />
            <CustomDialog
              className='sm:max-w-[1000px]'
              content={contentDialogTransactionToday}
              title={titleDialogTransactionToday}
              description={descriptionDialogTransactionToday}
              isOpen={isDialogTransactionTodayOpen}
              onClose={closeDialogTransactionToday}
            />
            <CustomDialog
              className='sm:max-w-[1000px]'
              content={contentDialogUnclassifiedTransaction}
              title={titleDialogUnclassifiedTransaction}
              description={descriptionDialogUnclassifiedTransaction}
              isOpen={isDialogUnclassifiedTransactionOpen}
              onClose={closeDialogUnclassifiedTransaction}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
