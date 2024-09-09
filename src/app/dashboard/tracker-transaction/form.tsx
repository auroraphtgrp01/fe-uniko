'use client'
import React, { useState } from 'react'
import CardInHeader from '@/components/dashboard/CardInHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/DataTable'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import BadgeType from '@/components/common/BadgeType'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import DonutChart, { IPayloadDataChart } from '@/components/core/charts/DonutChart'
import { Icons } from '../../../components/ui/icons'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import { getTypes } from '@/libraries/utils'
import { ISelectFields } from '@/types/common.i'

export default function TrackerTransactionForm() {
  const [totalPage, setTotalPage] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [condition, setCondition] = useState<string>()
  const [isExactly, setIsExactly] = useState<boolean>()
  const [sort, setSort] = useState<string>()
  const [includePopulate, setIncludePopulate] = useState<boolean>(true)
  const [selectFields, setSelectFields] = useState<ISelectFields[]>([])
  const titles: string[] = ['Transaction Name', 'Type', 'Amount', 'Date', 'From Account', 'Description']
  const columns = getColumns(titles, true)
  const data = [
    {
      id: '68ed37c0-9861-4599-8ee6-9b20bff47cce',
      transactionName: 'Mỳ xíu mại',
      type: 'Con cái',
      amount: '500000 VND',
      fromAccount: <Button variant={'outline'}>TP Bank</Button>,
      date: format('2024-09-04T10:10:00.000Z', 'HH:mm dd/MM/yyyy'),
      description: 'Mua mỳ xíu mại ở quán gần nhà'
    },
    {
      id: '68ed37c0-9861-4599-8ee6-9b20bff47cce',
      transactionName: 'Mỳ xíu mại',
      type: 'Ăn uống',
      amount: '500000 VND',
      fromAccount: <Button variant={'outline'}>TP Bank</Button>,
      date: format('2024-09-04T10:10:00.000Z', 'HH:mm dd/MM/yyyy'),
      description: 'Mua mỳ xíu mại ở quán gần nhà'
    },
    {
      id: '68ed37c0-9861-4599-8ee6-9b20bff47cce',
      transactionName: 'Mỳ xíu mại',
      type: 'Ăn uống',
      amount: '500000 VND',
      fromAccount: <Button variant={'outline'}>TP Bank</Button>,
      date: format('2024-09-04T10:10:00.000Z', 'HH:mm dd/MM/yyyy'),
      description: 'Mua mỳ xíu mại ở quán gần nhà'
    },
    {
      id: '68ed37c0-9861-4599-8ee6-9b20bff47cce',
      transactionName: 'Mỳ xíu mại',
      type: 'Thể thao',
      amount: '500000 VND',
      fromAccount: <Button variant={'outline'}>TP Bank</Button>,
      date: format('2024-09-04T10:10:00.000Z', 'HH:mm dd/MM/yyyy'),
      description: 'Mua mỳ xíu mại ở quán gần nhà'
    },
    {
      id: '68ed37c0-9861-4599-8ee6-9b20bff47cce',
      transactionName: 'Mỳ xíu mại',
      type: 'Điện thoại',
      amount: '500000 VND',
      fromAccount: <Button variant={'outline'}>TP Bank</Button>,
      date: format('2024-09-04T10:10:00.000Z', 'HH:mm dd/MM/yyyy'),
      description: 'Mua mỳ xíu mại ở quán gần nhà'
    },
    {
      id: '68ed37c0-9861-4599-8ee6-9b20bff47cce',
      transactionName: 'Mỳ xíu mại',
      type: 'Con cái',
      amount: '500000 VND',
      fromAccount: <Button variant={'outline'}>TP Bank</Button>,
      date: format('2024-09-04T10:10:00.000Z', 'HH:mm dd/MM/yyyy'),
      description: 'Mua mỳ xíu mại ở quán gần nhà'
    },
    {
      id: '68ed37c0-9861-4599-8ee6-9b20bff47cce',
      transactionName: 'Mỳ xíu mại',
      type: 'Con cái',
      amount: '500000 VND',
      fromAccount: <Button variant={'outline'}>TP Bank</Button>,
      date: format('2024-09-04T10:10:00.000Z', 'HH:mm dd/MM/yyyy'),
      description: 'Mua mỳ xíu mại ở quán gần nhà'
    },

    {
      id: '4c7a5fbd-3d8d-4a88-9c5e-1a3f7b742de1',
      transactionName: 'Bàn phím mới',
      type: 'Con cái',
      amount: '750000 VND',
      fromAccount: <Button variant={'outline'}>TP Bank</Button>,
      date: format('2024-09-05T11:15:00.000Z', 'HH:mm dd/MM/yyyy'),
      description: 'Mua mỳ xíu mại ở quán gần nhà'
    },
    {
      id: '9a7c3a7b-52d9-4f62-98d4-c0c4b98a0e64',
      transactionName: 'Thay nhớt',
      type: 'Con cái',
      amount: '300000 VND',
      fromAccount: <Button variant={'outline'}>TP Bank</Button>,
      date: format('2024-09-06T12:20:00.000Z', 'HH:mm dd/MM/yyyy'),
      description: 'Mua mỳ xíu mại ở quán gần nhà'
    },
    {
      id: 'e8d4c1d0-4528-4c13-8bcd-1cfd5d2c6ad5',
      transactionName: 'Đổ xăng',
      type: 'Di chuyển',
      amount: '600000 VND',
      fromAccount: <Button variant={'outline'}>TP Bank</Button>,
      date: format('2024-09-07T13:25:00.000Z', 'HH:mm dd/MM/yyyy'),
      description: 'Mua mỳ xíu mại ở quán gần nhà'
    }
  ]

  const types = getTypes(data)

  const chartData: IPayloadDataChart[] = [
    {
      name: 'Food & Drink',
      value: 20
    },
    {
      name: 'Transport',
      value: 30
    },
    {
      name: 'Shopping',
      value: 10
    },
    {
      name: 'Health',
      value: 40
    },
    {
      name: 'Entertainment',
      value: 25
    },
    {
      name: 'Housing',
      value: 35
    },
    {
      name: 'Education',
      value: 15
    },
    {
      name: 'Travel',
      value: 50
    },
    {
      name: 'Utilities',
      value: 22
    },
    {
      name: 'Miscellaneous',
      value: 18
    }
  ]

  const accountData: IPayloadDataChart[] = [
    {
      name: 'TP Bank',
      value: '500.000'
    },
    {
      name: 'Wallet',
      value: '700.000'
    },
    {
      name: 'Vietcombank',
      value: '700.000'
    },
    {
      name: 'Techcombank',
      value: '700.000'
    }
  ]

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {/* Left Section */}
      <div className='flex w-full flex-col md:col-span-2'>
        <div className='grid flex-1 grid-cols-1 gap-4 md:grid-cols-[4fr,6fr]'>
          {/* Total Spending Card */}
          <Card className='h-full w-full'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <div className='space-y-2'>
                <CardTitle>Total spending today</CardTitle>
                <CardDescription>
                  <span className='text-2xl font-semibold'>1,000,000 VND</span>
                </CardDescription>
              </div>
              <Icons.banknote className='h-8 w-8 text-green-500' />
            </CardHeader>
          </Card>

          {/* Incoming vs Expense Transaction Card */}
          <Card className='w-full overflow-hidden'>
            <div className='flex flex-col sm:flex-row'>
              {/* Incoming Transaction */}
              <div className='flex-1 bg-gradient-to-br from-green-100 to-green-200 p-6 dark:from-green-700 dark:to-green-800'>
                <CardHeader className='p-0'>
                  <div className='flex items-center space-x-2 text-green-600 dark:text-green-100'>
                    <ArrowDownIcon className='h-5 w-5' />
                    <h3 className='text-lg font-semibold'>Incoming Transaction</h3>
                  </div>
                </CardHeader>
                <p className='mt-4 text-2xl font-bold text-green-700 dark:text-green-100'>10,000,000 VND</p>
              </div>

              {/* Expense Transaction */}
              <div className='flex-1 bg-gradient-to-br from-rose-100 to-rose-200 p-6 dark:from-rose-700 dark:to-rose-800'>
                <CardHeader className='p-0'>
                  <div className='flex items-center space-x-2 text-rose-500 dark:text-rose-100'>
                    <ArrowUpIcon className='h-5 w-5' />
                    <h3 className='text-lg font-semibold'>Expense Transaction</h3>
                  </div>
                </CardHeader>
                <p className='mt-4 text-2xl font-bold text-rose-500 dark:text-rose-100'>5,000,000 VND</p>
              </div>
            </div>
          </Card>
        </div>

        {/* DataTable Section */}
        <div className='mt-4 flex-1'>
          <Card className='h-full w-full'>
            <CardContent>
              <DataTable
                isVisibleSortType={true}
                types={types}
                classNameOfScroll='h-[calc(100vh-30rem)]'
                columns={columns}
                data={data}
                isPaginate={true}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                limit={limit}
                setLimit={setLimit}
                totalPage={totalPage}
                setTotalPage={setTotalPage}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Section */}
      <div className='flex w-full flex-col md:col-span-1'>
        <div className='grid flex-1 grid-cols-1 gap-4'>
          {/* DonutChart 1 */}
          <Card className='w-full'>
            <CardContent className='flex items-center justify-center'>
              <DonutChart data={chartData} className={'mb-[-20px] mt-[-60px] h-[500px] w-full'} types='donut' />
            </CardContent>
          </Card>

          {/* DonutChart 2 with Total */}
          <Card className='w-full p-0'>
            <div className='flex items-center justify-center p-0'>
              <div className=''>
                <DonutChart data={accountData} className='mt-[-30px] h-[250px] w-[500px]' types='donut' />
              </div>
              {/* <div className='h-full ms-[-60px]'>
                <div>Total: 1.000.000 VND</div>
              </div> */}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
