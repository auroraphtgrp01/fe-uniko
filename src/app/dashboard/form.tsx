'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DonutChart from '@/components/core/charts/DonutChart'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'

import { Wallet, CreditCard, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react'
import { Progress } from '@radix-ui/react-progress'

export default function DashboardMainForm() {
  const [chartData] = useState({
    expenseTransactionTypeStats: [
      { name: 'item1', value: 10 },
      { name: 'item2', value: 20 },
      { name: 'item3', value: 30 },
      { name: 'item4', value: 40 },
      { name: 'item5', value: 50 },
      { name: 'item6', value: 60 },
      { name: 'item7', value: 70 },
      { name: 'item8', value: 80 },
      { name: 'item9', value: 90 },
      { name: 'item10', value: 100 }
    ],
    incomingTransactionTypeStats: [
      { name: 'item1', value: 10 },
      { name: 'item2', value: 20 },
      { name: 'item3', value: 30 },
      { name: 'item4', value: 40 },
      { name: 'item5', value: 50 },
      { name: 'item6', value: 60 },
      { name: 'item7', value: 70 },
      { name: 'item8', value: 80 },
      { name: 'item9', value: 90 },
      { name: 'item10', value: 100 }
    ]
  })

  return (
    <div>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-9'>
        <Card className='cursor-pointer bg-gradient-to-br from-green-400 to-emerald-600 text-white sm:col-span-1 xl:col-span-2'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-base font-medium text-white sm:text-lg'>Bank Account</CardTitle>
            <DollarSign className='h-4 w-4 text-white' />
          </CardHeader>
          <CardContent>
            <div className='flex flex-col items-start justify-between sm:flex-row sm:items-center'>
              <CreditCard className='mb-2 h-8 w-8 text-white opacity-75 sm:mb-0 sm:h-12 sm:w-12' />
              <div className='text-left sm:text-right'>
                <p className='text-xl font-bold text-white sm:text-2xl'>120.000.000 VND</p>
                <p className='text-xs text-green-200 sm:text-sm'>+2.5% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='cursor-pointer bg-gradient-to-br from-red-400 to-rose-600 text-white sm:col-span-1 xl:col-span-2'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-base font-medium text-white sm:text-lg'>Wallet</CardTitle>
            <ArrowUpRight className='h-4 w-4 text-white' />
          </CardHeader>
          <CardContent>
            <div className='flex flex-col items-start justify-between sm:flex-row sm:items-center'>
              <Wallet className='mb-2 h-8 w-8 text-white opacity-75 sm:mb-0 sm:h-12 sm:w-12' />
              <div className='text-left sm:text-right'>
                <p className='text-xl font-bold text-white sm:text-2xl'>12.000.000 VND</p>
                <p className='text-xs text-red-200 sm:text-sm'>+2.5% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='cursor-pointer bg-gradient-to-br from-purple-500 to-indigo-600 text-white sm:col-span-1 xl:col-span-2'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-base font-medium text-white sm:text-lg'>October spending</CardTitle>
            <ArrowUpRight className='h-4 w-4 text-white' />
          </CardHeader>
          <CardContent>
            <div className='flex flex-col items-start justify-between sm:flex-row sm:items-center'>
              <DollarSign className='mb-2 h-8 w-8 text-white opacity-75 sm:mb-0 sm:h-12 sm:w-12' />
              <div className='text-left sm:text-right'>
                <p className='text-xl font-bold text-white sm:text-2xl'>12.000.000 VND</p>
                <p className='text-xs text-red-200 sm:text-sm'>+2.5% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='sm:col-span-2 lg:col-span-4 xl:col-span-3 xl:row-span-2'>
          <CardHeader>
            <CardTitle className='text-lg sm:text-xl'>Phân Bổ Chi Tiêu</CardTitle>
          </CardHeader>
          <CardContent className='h-[300px] pt-[15%] sm:h-[400px]'>
            <DonutChart data={chartData.expenseTransactionTypeStats} className='h-full w-full' types='donut' />
          </CardContent>
        </Card>

        <Card className='sm:col-span-2 lg:col-span-4 xl:col-span-6'>
          <CardHeader>
            <CardTitle className='text-lg sm:text-xl'>Total </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-[280px] sm:h-[380px]'>
              <DonutChart data={chartData.expenseTransactionTypeStats} className='h-full w-full' types='prettier' />
            </div>
            <div className='mt-4 sm:mt-6'>
              <Progress value={75} className='w-full' />
              <p className='mt-2 text-xs text-muted-foreground sm:text-sm'>Bạn đã đạt 75% mục tiêu tiết kiệm năm nay</p>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* 
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <Card>
          <Tabs defaultValue='account' className='h-full flex-1 rounded-md'>
            <CardHeader>
              <CardTitle className='text-xl'>Giao Dịch Gần Đây</CardTitle>
            </CardHeader>
            <TabsList className='ml-5 grid w-[50%] grid-cols-3 rounded-sm bg-gray-100 dark:bg-gray-500 dark:text-white'>
              <TabsTrigger value='all'>All</TabsTrigger>
              <TabsTrigger value='ThuNhap'>Thu Nhập</TabsTrigger>
              <TabsTrigger value='ChiTieu'>Chi Tiêu</TabsTrigger>
            </TabsList>
            <TabsContent value='all' className='h-fit p-5 py-2'>
              <ul className='space-y-2'>
                <li className='flex items-center justify-between'>
                  <span>Lương tháng 7</span>
                  <span className='text-green-600'>+15,000,000 VND</span>
                </li>
                <li className='flex items-center justify-between'>
                  <span>Tiền điện</span>
                  <span className='text-red-600'>-500,000 VND</span>
                </li>
                <li className='flex items-center justify-between'>
                  <span>Đi chợ</span>
                  <span className='text-red-600'>-1,200,000 VND</span>
                </li>
              </ul>
            </TabsContent>
            <TabsContent value='ThuNhap' className='h-fit p-5 py-2'>
              <span>đây là của thu nhập</span>
            </TabsContent>
            <TabsContent value='ChiTieu' className='h-fit p-5 py-2'>
              <span>đây là của chi tiêu nhá</span>
            </TabsContent>
          </Tabs>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Ngân Sách Tháng Này</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2'>
              <li>
                <div className='mb-1 flex justify-between'>
                  <span>Ăn uống</span>
                  <span>70%</span>
                </div>
                <Progress value={70} className='w-full' />
              </li>
              <li>
                <div className='mb-1 flex justify-between'>
                  <span>Di chuyển</span>
                  <span>50%</span>
                </div>
                <Progress value={50} className='w-full' />
              </li>
              <li>
                <div className='mb-1 flex justify-between'>
                  <span>Mua sắm</span>
                  <span>30%</span>
                </div>
                <Progress value={30} className='w-full' />
              </li>
            </ul>
          </CardContent>
        </Card>
      </div> */}
    </div>
  )
}
