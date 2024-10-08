'use client'
import React, { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/DataTable'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import DonutChart, { IPayloadDataChart } from '@/components/core/charts/DonutChart'
import { Icons } from '../../../components/ui/icons'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import { getConvertedKeysToTitleCase } from '@/libraries/utils'
import { IDataTableConfig } from '@/types/common.i'
import { IQueryOptions } from '@/types/query.interface'
import {
  IDialogTrackerTransaction,
  ITrackerTransaction,
  ITrackerTransactionDataFormat
} from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { initButtonInDataTableHeader, initDialogFlag } from './constants'
import TrackerTransactionDialog from './dialog'
import { initTableConfig } from '@/constants/data-table'
import { initQueryOptions } from '@/constants/init-query-options'
import { IDataTransactionTable, Transaction } from '@/core/transaction/models'

export default function TrackerTransactionForm() {
  const [fetchedData, setFetchedData] = useState<ITrackerTransaction[]>([])
  const [fetchedTransactionData, setFetchedTransactionData] = useState<Transaction[]>([])
  const [idRowClicked, setIdRowClicked] = useState<string>('')
  const [queryOptions, setQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const [tableData, setTableData] = useState<ITrackerTransactionDataFormat[]>([])
  const [tableClassifyData, setTableClassifyData] = useState<IDataTransactionTable[]>([])
  // const [formData, setFormData] = useState<IAccountSourceBody>(initAccountSourceFormData)
  const [dataTableConfig, setDataTableConfig] = useState<IDataTableConfig>(initTableConfig)
  const [dataTableClassifyConfig, setDataTableClassifyConfig] = useState<IDataTableConfig>(initTableConfig)
  const [isDialogOpen, setIsDialogOpen] = useState<IDialogTrackerTransaction>(initDialogFlag)

  // memos
  const titles = useMemo(() => getConvertedKeysToTitleCase(tableData[0]), [tableData])
  const columns = useMemo(() => {
    if (tableData.length === 0) return []
    return getColumns<ITrackerTransactionDataFormat>(titles, true)
  }, [tableData])
  const tableClassifyTitles = useMemo(() => getConvertedKeysToTitleCase(tableClassifyData[0]), [tableClassifyData])
  const tableClassifyColumns = useMemo(() => {
    if (tableData.length === 0) return []
    return getColumns<ITrackerTransactionDataFormat>(titles, true)
  }, [tableData])

  const data = [
    {
      id: '68ed37c0-9861-4599-8ee6-9b20bff47cce',
      transactionName: 'Mỳ xíu mại',
      type: 'Con cái',
      amount: '500000 VND',
      fromAccount: <Button variant={'outline'}>TP Bank</Button>,
      date: format('2024-09-04T10:10:00.000Z', 'HH:mm dd/MM/yyyy'),
      description: 'Mua mỳ xíu mại ở quán gần nhà'
    }
  ]

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

  const dataTableButtons = initButtonInDataTableHeader({ setIsDialogOpen })

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {/* Left Section */}
      <div className='flex w-full flex-col md:col-span-2'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
          {/* Total Spending Card */}
          <Card className='col-span-1 h-full w-full overflow-hidden sm:col-span-2 md:w-full lg:w-full xl:col-span-1'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <div className='space-y-2'>
                <CardTitle className='text-nowrap text-sm sm:text-base lg:text-lg'>Total spending today</CardTitle>
                <CardDescription>
                  <span className='text-nowrap text-lg font-semibold sm:text-xl lg:text-2xl'>1,000,000 VND</span>
                </CardDescription>
              </div>
              <Icons.banknote className='hidden text-green-500 lg:h-8 lg:w-8 2xl:block' />
            </CardHeader>
          </Card>

          {/* Incoming vs Expense Transaction Card */}
          <Card className='col-span-1 w-full overflow-hidden sm:col-span-2 lg:w-full'>
            <div className='flex flex-col md:flex-row'>
              {/* Incoming Transaction */}
              <div className='flex-1 bg-gradient-to-br from-green-100 to-green-200 p-4 dark:from-green-700 dark:to-green-800 sm:p-6'>
                <CardHeader className='p-0 lg:w-full'>
                  <div className='flex items-center space-x-2 text-green-600 dark:text-green-100'>
                    <ArrowDownIcon className='h-4 w-4 sm:h-5 sm:w-5' />
                    <h3 className='text-nowrap text-sm font-semibold sm:text-base lg:text-lg'>Incoming Transaction</h3>
                  </div>
                </CardHeader>
                <p className='mt-2 text-nowrap text-lg font-bold text-green-700 dark:text-green-100 sm:mt-4 sm:text-xl lg:text-2xl'>
                  10,000,000 VND
                </p>
              </div>

              {/* Expense Transaction */}
              <div className='flex-1 bg-gradient-to-br from-rose-100 to-rose-200 p-4 dark:from-rose-700 dark:to-rose-800 sm:p-6'>
                <CardHeader className='p-0'>
                  <div className='flex items-center space-x-2 text-rose-500 dark:text-rose-100'>
                    <ArrowUpIcon className='h-4 w-4 sm:h-5 sm:w-5' />
                    <h3 className='text-nowrap text-sm font-semibold sm:text-base lg:text-lg'>Expense Transaction</h3>
                  </div>
                </CardHeader>
                <p className='mt-2 text-nowrap text-lg font-bold text-rose-500 dark:text-rose-100 sm:mt-4 sm:text-xl lg:text-2xl'>
                  5,000,000 VND
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* DataTable Section */}
        <div className='mt-4 flex-1'>
          <Card className='h-full w-full'>
            <CardContent>
              <DataTable
                columns={columns}
                data={tableData}
                config={dataTableConfig}
                setConfig={setDataTableConfig}
                buttons={dataTableButtons}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Section */}
      <div className='flex w-full flex-col md:col-span-2 lg:col-span-1'>
        {/* DonutChart 1 */}
        <Card className='w-full'>
          <CardContent className='flex items-center justify-center'>
            <DonutChart
              data={chartData}
              className={'mt-[2%] h-[490px] w-full lg:mt-[2%] xl:h-[450px]'}
              types='nightingale'
            />
          </CardContent>
        </Card>

        {/* DonutChart 2 with Total */}
        <div className='flex items-center justify-center p-0'>
          <Card className='mt-4 w-full'>
            <DonutChart
              data={accountData}
              className='mb-[5%] mt-[-8%] h-[350px] w-full sm:mt-[-1%] md:h-[300px] lg:mt-[-5%] xl:h-[300px]'
              types='donut'
            />
            {/* <div className='h-full ms-[-60px]'>
                <div>Total: 1.000.000 VND</div>
              </div> */}
          </Card>
        </div>
      </div>
      <TrackerTransactionDialog
        columns={tableClassifyColumns}
        dataTable={tableClassifyData}
        setDataTable={setTableClassifyData}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        setTableConfig={setDataTableClassifyConfig}
        tableConfig={dataTableClassifyConfig}
      />
    </div>
  )
}
