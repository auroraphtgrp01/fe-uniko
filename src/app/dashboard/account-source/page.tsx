import React from 'react'
import { Payment, columns } from './columns'
import { DataTable } from './data-table'

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: '728ed52f',
      name: 'abc',
      amount: 3555,
      initAmount: 3333,
      currentAmount: 3233,
      userId: 'we1',
      status: 'pending'
    }
    // ...
  ]
}

export default async function page() {
  const data = await getData()

  return (
    <div className='mx-auto'>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
