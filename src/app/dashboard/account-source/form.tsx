'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/DataTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DonutChart from '@/components/core/charts/DonutChart'
import { ArrowDownRight, ArrowUpRight, DollarSign, TrendingDown, TrendingUp } from 'lucide-react'
import { IDataTableConfig } from '@/types/common.i'
import { IQueryOptions } from '@/types/query.interface'
import { initTableConfig } from '@/constants/data-table'
import { initQueryOptions } from '@/constants/init-query-options'
import { getConvertedKeysToTitleCase, getTypes } from '@/libraries/utils'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import { IAccountSourceDataFormat } from '@/core/account-source/models'
import TrackerTransactionChart from '@/components/dashboard/TrackerTransactionChart'
import { Button } from '@/components/ui/button'
import FlatList from '@/components/core/FlatList'
import { Progress } from '@/components/ui/progress'

export default function AccountSourceForm() {
  // States
  const [dataTableConfig, setDataTableConfig] = useState<IDataTableConfig>(initTableConfig)
  const [queryOptions, setQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const [tableData, setTableData] = useState<IAccountSourceDataFormat[]>([])

  // Memos
  const titles = useMemo(() => getConvertedKeysToTitleCase(tableData[0]), [tableData])
  const columns = useMemo(() => {
    if (tableData.length === 0) return []
    return getColumns<IAccountSourceDataFormat>(titles, true)
  }, [tableData])

  // Effects
  useEffect(() => {
    setQueryOptions((prev) => ({ ...prev, page: dataTableConfig.currentPage, limit: dataTableConfig.limit }))
  }, [dataTableConfig])

  const [chartData] = useState({
    expenseTransactionTypeStats: [
      { name: 'item1', value: 10 },
      { name: 'item2', value: 20 },
      { name: 'item3', value: 30 },
      { name: 'item4', value: 40 },
      { name: 'item5', value: 50 }
    ]
  })

  return (
    <div className='w-full space-y-5'>
      <div className='grid grid-cols-1 gap-5 md:grid-cols-4'>
        <div className='space-y-5 md:col-span-1'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-base font-medium md:text-xl'>Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='mt-2'>
                <p className='text-xl font-bold md:text-2xl'>120.000.000 VND</p>
                <p className='flex items-center text-xs text-green-500 md:text-sm'>
                  <TrendingUp className='mr-1 h-4 w-4 md:h-5 md:w-5' />
                  +2.5% so với tháng trước
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-base font-medium md:text-xl'>Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='mt-2'>
                <p className='text-xl font-bold md:text-2xl'>12.000.000 VND</p>
                <p className='flex items-center text-xs text-red-500 md:text-sm'>
                  <TrendingUp className='mr-1 h-4 w-4 md:h-5 md:w-5' />
                  +2.5% so với tháng trước
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-base font-medium md:text-xl'>Net Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='mt-2'>
                <p className='text-xl font-bold md:text-2xl'>12.000.000 VND</p>
                <p className='flex items-center text-xs text-yellow-500 md:text-sm'>
                  <TrendingDown className='mr-1 h-4 w-4 md:h-5 md:w-5' />
                  +2.5% so với tháng trước
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className='flex flex-col md:col-span-3'>
          <CardContent>
            <DataTable
              data={tableData}
              config={dataTableConfig}
              setConfig={setDataTableConfig}
              columns={columns}
              onRowClick={(data) => {}}
            />
          </CardContent>
        </Card>
      </div>
      <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
        <Card className='col-span-1 h-full flex-1 rounded-md p-4 md:col-span-2 md:p-5'>
          <Tabs defaultValue='account'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='account'>Account</TabsTrigger>
              <TabsTrigger value='password'>Password</TabsTrigger>
            </TabsList>
            <TabsContent value='account'>
              <div className='h-[250px] md:h-[400px]'>
                <DonutChart data={chartData.expenseTransactionTypeStats} className='h-full w-full' types='multiple' />
              </div>
            </TabsContent>
            <TabsContent value='password'>
              <div className='h-[250px] md:h-[400px]'>
                <DonutChart data={chartData.expenseTransactionTypeStats} className='h-full w-full' types='donut' />
              </div>
            </TabsContent>
          </Tabs>
        </Card>
        <Card className='col-span-1'>
          <CardHeader className='py-4'>
            <div className='flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
              <CardTitle className='text-lg'>Unclassified</CardTitle>
              <div className='flex gap-2'>
                <Button variant='secondary' className='flex-1 sm:flex-none'>
                  Classify
                </Button>
                <Button variant='default' className='flex-1 sm:flex-none'>
                  Refetch
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='max-h-[300px] overflow-y-auto'>
              <FlatList />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
