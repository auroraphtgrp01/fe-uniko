'use client'

import { Card } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/DataTable'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import CardInHeader from '@/components/dashboard/CardInHeader'
const titles: string[] = ['Source Name', 'Type', 'Init Amount', 'Currency', 'Current Amount', 'Created At']

const data = [
  {
    id: '68ed37c0-9861-4599-8ee6-9b20bff47cce',
    sourceName: 'hello',
    type: 'Wallet',
    initAmount: 500000,
    currency: 400000,
    currentAmount: 100000,
    createdAt: '2024-09-04T10:10:00.000Z'
  },
  {
    id: '4c7a5fbd-3d8d-4a88-9c5e-1a3f7b742de1',
    sourceName: 'bbbb',
    type: 'Bank',
    initAmount: 750000,
    currency: 600000,
    currentAmount: 150000,
    createdAt: '2024-09-05T11:15:00.000Z'
  },
  {
    id: '9a7c3a7b-52d9-4f62-98d4-c0c4b98a0e64',
    sourceName: 'cccc',
    type: 'Cash',
    initAmount: 300000,
    currency: 250000,
    currentAmount: 50000,
    createdAt: '2024-09-06T12:20:00.000Z'
  },
  {
    id: 'e8d4c1d0-4528-4c13-8bcd-1cfd5d2c6ad5',
    sourceName: 'dddd',
    type: 'Card',
    initAmount: 600000,
    currency: 550000,
    currentAmount: 50000,
    createdAt: '2024-09-07T13:25:00.000Z'
  },
  {
    id: 'b6e7d510-8a1a-4c59-9f7d-4f90a6f52bd3',
    sourceName: 'eeee',
    type: 'Investment',
    initAmount: 900000,
    currency: 800000,
    currentAmount: 100000,
    createdAt: '2024-09-08T14:30:00.000Z'
  },
  {
    id: 'f2a1ed5e-826b-4c1d-9f7e-3e58b29f315b',
    sourceName: 'ffff',
    type: 'Savings',
    initAmount: 1200000,
    currency: 1000000,
    currentAmount: 200000,
    createdAt: '2024-09-09T15:35:00.000Z'
  }
]

const columns = getColumns(titles, false)

export type Task = (typeof data)[number]

export default function page() {
  return (
    <div className='w-full'>
      <div className='flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0'>
        <CardInHeader className='max-w-full sm:w-[330px] lg:w-full'></CardInHeader>
        <CardInHeader className='max-w-full sm:w-[330px] lg:w-full'></CardInHeader>
      </div>
      <Card className='mt-5'>
        <DataTable columns={columns} data={data} isPaginate={true} />
      </Card>
    </div>
  )
}
