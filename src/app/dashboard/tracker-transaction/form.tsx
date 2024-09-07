'use client'
import React from 'react'
import CardInHeader from '@/components/dashboard/CardInHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/DataTable'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import BadgeType from '@/components/common/BadgeType'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'

export default function TrackerTransactionForm() {
  const titles: string[] = ['Transaction Name', 'Type', 'Amount', 'Date', 'From Account', 'Description']
  const columns = getColumns(titles, true)
  const data = [
    {
      id: '68ed37c0-9861-4599-8ee6-9b20bff47cce',
      transactionName: 'Mỳ xíu mại',
      type: <BadgeType />,
      amount: '500000 VND',
      fromAccount: <Button variant={'outline'}>TP Bank</Button>,
      date: format('2024-09-04T10:10:00.000Z', 'HH:mm dd/MM/yyyy'),
      description: 'Mua mỳ xíu mại ở quán gần nhà'
    },
    {
      id: '68ed37c0-9861-4599-8ee6-9b20bff47cce',
      transactionName: 'Mỳ xíu mại',
      type: <BadgeType />,
      amount: '500000 VND',
      fromAccount: <Button variant={'outline'}>TP Bank</Button>,
      date: format('2024-09-04T10:10:00.000Z', 'HH:mm dd/MM/yyyy'),
      description: 'Mua mỳ xíu mại ở quán gần nhà'
    },
    {
      id: '68ed37c0-9861-4599-8ee6-9b20bff47cce',
      transactionName: 'Mỳ xíu mại',
      type: <BadgeType />,
      amount: '500000 VND',
      fromAccount: <Button variant={'outline'}>TP Bank</Button>,
      date: format('2024-09-04T10:10:00.000Z', 'HH:mm dd/MM/yyyy'),
      description: 'Mua mỳ xíu mại ở quán gần nhà'
    },
    {
      id: '68ed37c0-9861-4599-8ee6-9b20bff47cce',
      transactionName: 'Mỳ xíu mại',
      type: <BadgeType />,
      amount: '500000 VND',
      fromAccount: <Button variant={'outline'}>TP Bank</Button>,
      date: format('2024-09-04T10:10:00.000Z', 'HH:mm dd/MM/yyyy'),
      description: 'Mua mỳ xíu mại ở quán gần nhà'
    },
    {
      id: '68ed37c0-9861-4599-8ee6-9b20bff47cce',
      transactionName: 'Mỳ xíu mại',
      type: <BadgeType />,
      amount: '500000 VND',
      fromAccount: <Button variant={'outline'}>TP Bank</Button>,
      date: format('2024-09-04T10:10:00.000Z', 'HH:mm dd/MM/yyyy'),
      description: 'Mua mỳ xíu mại ở quán gần nhà'
    },
    {
      id: '68ed37c0-9861-4599-8ee6-9b20bff47cce',
      transactionName: 'Mỳ xíu mại',
      type: <BadgeType />,
      amount: '500000 VND',
      fromAccount: <Button variant={'outline'}>TP Bank</Button>,
      date: format('2024-09-04T10:10:00.000Z', 'HH:mm dd/MM/yyyy'),
      description: 'Mua mỳ xíu mại ở quán gần nhà'
    },
    {
      id: '68ed37c0-9861-4599-8ee6-9b20bff47cce',
      transactionName: 'Mỳ xíu mại',
      type: <BadgeType />,
      amount: '500000 VND',
      fromAccount: <Button variant={'outline'}>TP Bank</Button>,
      date: format('2024-09-04T10:10:00.000Z', 'HH:mm dd/MM/yyyy'),
      description: 'Mua mỳ xíu mại ở quán gần nhà'
    },

    {
      id: '4c7a5fbd-3d8d-4a88-9c5e-1a3f7b742de1',
      transactionName: 'Bàn phím mới',
      type: <BadgeType />,
      amount: '750000 VND',
      fromAccount: <Button variant={'outline'}>TP Bank</Button>,
      date: format('2024-09-05T11:15:00.000Z', 'HH:mm dd/MM/yyyy'),
      description: 'Mua mỳ xíu mại ở quán gần nhà'
    },
    {
      id: '9a7c3a7b-52d9-4f62-98d4-c0c4b98a0e64',
      transactionName: 'Thay nhớt',
      type: <BadgeType />,
      amount: '300000 VND',
      fromAccount: <Button variant={'outline'}>TP Bank</Button>,
      date: format('2024-09-06T12:20:00.000Z', 'HH:mm dd/MM/yyyy'),
      description: 'Mua mỳ xíu mại ở quán gần nhà'
    },
    {
      id: 'e8d4c1d0-4528-4c13-8bcd-1cfd5d2c6ad5',
      transactionName: 'Đổ xăng',
      type: <BadgeType />,
      amount: '600000 VND',
      fromAccount: <Button variant={'outline'}>TP Bank</Button>,
      date: format('2024-09-07T13:25:00.000Z', 'HH:mm dd/MM/yyyy'),
      description: 'Mua mỳ xíu mại ở quán gần nhà'
    }
  ]
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
      <div className='flex w-full flex-col md:col-span-2'>
        <div className='grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2'>
          <Card className='h-full w-full'>
            <CardHeader>
              <CardTitle>Total</CardTitle>
            </CardHeader>
          </Card>
          <CardInHeader className='h-full w-full' />
        </div>
        <div className='mt-4 flex-1'>
          <Card className='h-full w-full'>
            <CardContent>
              <DataTable
                className='h-[400px]'
                columns={columns}
                data={data}
                isPaginate={true}
                // onRowClick={() => setIsDialogCreateOpen(true)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <div className='flex w-full flex-col md:col-span-1'>
        <div className='grid flex-1 grid-cols-1 gap-4'>
          <CardInHeader className='h-full w-full' />
          <CardInHeader className='h-full w-full' />
        </div>
      </div>
    </div>
  )
}
