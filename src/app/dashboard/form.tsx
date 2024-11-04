'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DonutChart from '@/components/core/charts/DonutChart'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'

import { Wallet, CreditCard, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { Progress } from '@radix-ui/react-progress'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

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
      <div className='w-full space-y-5'>
        <div className='grid grid-cols-1 gap-5 md:grid-cols-4'>
          <div className='space-y-6 md:col-span-1'>
            <Card className=''>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-base font-medium md:text-xl'>Account Bank</CardTitle>
                <CreditCard className='h-4 w-4 opacity-75 md:h-5 md:w-5' />
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
                <CardTitle className='text-base font-medium md:text-xl'>Wallet</CardTitle>
                <Wallet className='h-4 w-4 opacity-75 md:h-5 md:w-5' />
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
                <CardTitle className='text-base font-medium md:text-xl'>Spending</CardTitle>
                <DollarSign className='h-4 w-4 opacity-75 md:h-5 md:w-5' />
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
            <CardHeader>
              <CardTitle className='text-xl font-bold'>Total</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-grow flex-col justify-between'>
              <div className='flex-grow'>
                <DonutChart data={chartData.expenseTransactionTypeStats} className='h-full w-full' types='referer' />
              </div>
              <div className='mt-4 md:mt-6'>
                <Progress value={80} className='w-full' />
                <p className='mt-2 text-xs text-muted-foreground md:text-sm'>
                  Bạn đã đạt 75% mục tiêu tiết kiệm năm nay
                </p>
              </div>
            </CardContent>
          </Card>
          <div className='md:col-span-4'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <Card>
                <Tabs defaultValue='all' className='flex h-full flex-col'>
                  <CardHeader>
                    <CardTitle className='text-lg font-bold md:text-xl'>Giao Dịch Gần Đây</CardTitle>
                  </CardHeader>
                  <div className='px-4 md:px-6'>
                    <TabsList className='grid w-full grid-cols-3 rounded-md bg-muted'>
                      <TabsTrigger value='all'>All</TabsTrigger>
                      <TabsTrigger value='ThuNhap'>Thu Nhập</TabsTrigger>
                      <TabsTrigger value='ChiTieu'>Chi Tiêu</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value='all' className='flex-grow overflow-auto px-4 py-2 md:px-6'>
                    <ul className='space-y-2'>
                      <li className='flex items-center justify-between'>
                        <span className='text-xs md:text-sm'>Lương tháng 7</span>
                        <span className='text-xs font-medium text-green-600 md:text-sm'>+15,000,000 VND</span>
                      </li>
                      <li className='flex items-center justify-between'>
                        <span className='text-xs md:text-sm'>Tiền điện</span>
                        <span className='text-xs font-medium text-red-600 md:text-sm'>-500,000 VND</span>
                      </li>
                      <li className='flex items-center justify-between'>
                        <span className='text-xs md:text-sm'>Đi chợ</span>
                        <span className='text-xs font-medium text-red-600 md:text-sm'>-1,200,000 VND</span>
                      </li>
                    </ul>
                  </TabsContent>
                  <TabsContent value='ThuNhap' className='flex-grow overflow-auto px-4 py-2 md:px-6'>
                    <span className='text-xs md:text-sm'>Đây là của thu nhập</span>
                  </TabsContent>
                  <TabsContent value='ChiTieu' className='flex-grow overflow-auto px-4 py-2 md:px-6'>
                    <span className='text-xs md:text-sm'>Đây là của chi tiêu nhá</span>
                  </TabsContent>
                </Tabs>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg md:text-xl'>Ngân Sách Tháng Này</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className='space-y-2'>
                    <li>
                      <div className='mb-1 flex justify-between'>
                        <span className='text-xs md:text-sm'>Ăn uống</span>
                        <span className='text-xs md:text-sm'>70%</span>
                      </div>
                      <Progress value={70} className='w-full' />
                    </li>
                    <li>
                      <div className='mb-1 flex justify-between'>
                        <span className='text-xs md:text-sm'>Di chuyển</span>
                        <span className='text-xs md:text-sm'>50%</span>
                      </div>
                      <Progress value={50} className='w-full' />
                    </li>
                    <li>
                      <div className='mb-1 flex justify-between'>
                        <span className='text-xs md:text-sm'>Mua sắm</span>
                        <span className='text-xs md:text-sm'>30%</span>
                      </div>
                      <Progress value={30} className='w-full' />
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <div className='col-span-2 mt-5 grid md:gap-6'>
        <Card className='col-span-1 flex flex-col md:col-span-2'>
          <CardHeader>
            <CardTitle className='text-xl font-bold'>Phân Bổ Chi Tiêu</CardTitle>
          </CardHeader>
          <CardContent className='flex-grow'>
            <div className='h-[300px] md:h-[400px]'>
              <DonutChart data={chartData.expenseTransactionTypeStats} className='h-full w-full' types='donut' />
            </div>
          </CardContent>
        </Card>
      </div>

      <footer>
        <div className='mt-4 text-center'>
          <p className='text-sm italic'>`Tiết kiệm hôm nay, thịnh vượng ngày mai`</p>
        </div>
      </footer>
    </div>
  )
}
