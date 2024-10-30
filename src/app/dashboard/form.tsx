'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import DonutChart from '@/components/core/charts/DonutChart'
import { ArrowDownIcon, HandCoins, Info } from 'lucide-react'
import Money1 from '@/images/money.png'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { Select } from 'react-day-picker'
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import {
  Home,
  PieChart as PieChartIcon,
  Wallet,
  CreditCard,
  Settings,
  Bell,
  User,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign
} from 'lucide-react'
import { Progress } from '@radix-ui/react-progress'
const monthlyData = [
  { name: 'Jan', income: 4000, expenses: 2400 },
  { name: 'Feb', income: 3000, expenses: 1398 },
  { name: 'Mar', income: 2000, expenses: 9800 },
  { name: 'Apr', income: 2780, expenses: 3908 },
  { name: 'May', income: 1890, expenses: 4800 },
  { name: 'Jun', income: 2390, expenses: 3800 },
  { name: 'Jul', income: 3490, expenses: 4300 }
]

const expenseData = [
  { name: 'Food', value: 400 },
  { name: 'Transport', value: 300 },
  { name: 'Shopping', value: 300 },
  { name: 'Bills', value: 200 },
  { name: 'Entertainment', value: 100 }
]

const savingsGoalData = [
  { name: 'Jan', actual: 1000, goal: 1200 },
  { name: 'Feb', actual: 2200, goal: 2400 },
  { name: 'Mar', actual: 3600, goal: 3600 },
  { name: 'Apr', actual: 4800, goal: 4800 },
  { name: 'May', actual: 5500, goal: 6000 },
  { name: 'Jun', actual: 7000, goal: 7200 }
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']
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
    <div className='flex-1'>
      <div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6'>
        <Card className='bg-gradient-to-br from-green-400 to-emerald-600 text-white'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-lg font-medium text-white'>Bank Account</CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground text-white' />
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-between'>
              <CreditCard className='h-12 w-12 text-white opacity-75' />
              <div className='text-right'>
                <p className='text-2xl font-bold text-white'>120.000.000 VND</p>
                <p className='text-sm text-green-200'>+2.5% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className='bg-gradient-to-br from-red-400 to-rose-600 text-white'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-lg font-medium text-white'>Wallet</CardTitle>
            <ArrowUpRight className='h-4 w-4 text-muted-foreground text-white' />
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-between'>
              <Wallet className='h-12 w-12 text-white opacity-75' />
              <div className='text-right'>
                <p className='text-2xl font-bold text-white'>12.000.000 VND</p>
                <p className='text-sm text-red-200'>+2.5% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-purple-500 to-indigo-600 text-white'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-lg font-medium text-white'>Chi Tiêu Tháng 10</CardTitle>
            <ArrowDownRight className='h-4 w-4 text-muted-foreground text-white' />
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-between'>
              <DollarSign className='h-12 w-12 text-white opacity-75' />
              <div className='text-right'>
                <p className='text-2xl font-bold text-white'>12.000.000 VND</p>
                <p className='text-sm text-red-200'>+2.5% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className='group relative cursor-pointer overflow-hidden shadow-lg'>
          <div className='relative h-32 sm:h-40 lg:h-full'>
            <Image
              src={Money1}
              alt='Spending Jar'
              layout='fill'
              objectFit='cover'
              className='transition-transform duration-300 group-hover:scale-105'
            />
            <div className='absolute inset-0 flex items-center bg-gradient-to-r from-black/60 to-transparent p-4'>
              <h2 className='text-lg font-bold text-white transition-transform duration-300 group-hover:scale-110 sm:text-xl'>
                SPENDING JAR
              </h2>
            </div>
          </div>
        </Card>
      </div>
      {/* Charts */}
      <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Mục Tiêu Tiết Kiệm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-[200px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={savingsGoalData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip />
                  <Line type='monotone' dataKey='actual' stroke='#8884d8' name='Thực Tế' />
                  <Line type='monotone' dataKey='goal' stroke='#82ca9d' name='Mục Tiêu' strokeDasharray='5 5' />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className='mt-4'>
              <Progress value={75} className='w-full' />
              <p className='mt-2 text-sm text-muted-foreground'>Bạn đã đạt 75% mục tiêu tiết kiệm năm nay</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Phân Bổ Chi Tiêu</CardTitle>
          </CardHeader>
          <CardContent className='h-[250px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx='50%'
                  cy='50%'
                  outerRadius={90}
                  fill='#8884d8'
                  dataKey='value'
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      {/* Savings Goal */}
      <Card className='mb-6 h-[35rem]'>
        <CardHeader>
          <CardTitle className='text-xl'>Total chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[200px]'>
            <DonutChart
              data={chartData ? chartData.expenseTransactionTypeStats : []}
              className={`h-[30rem] w-full`}
              types='prettier'
            />
          </div>
          <div className='mt-[15rem]'>
            <Progress value={75} className='w-full' />
            <p className='mt-2 text-sm text-muted-foreground'>Bạn đã đạt 75% mục tiêu tiết kiệm năm nay</p>
          </div>
        </CardContent>
      </Card>
      {/* Recent Transactions and Budget */}
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
      </div>
    </div>
  )
}
