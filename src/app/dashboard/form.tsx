'use client'
import React from 'react'
import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import DonutChart from '@/components/core/charts/DonutChart'
import { LineChart } from '@/components/core/charts/LineChart'
import CardInHeader from '../../components/dashboard/CardInHeader'
import { BarChartBasic } from '@/components/core/charts/BarChart'
import { BalanceChart } from '@/components/core/charts/BalanceChart'

export default function DashboardMainForm() {
  const chartData = [
    {
      name: 'MB BANK',
      value: '40'
    },
    {
      name: 'Ví tiền mặt',
      value: '60'
    }
  ]
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
      <div className='flex w-full flex-col md:col-span-1'>
        <div className='grid flex-1 grid-cols-1 gap-4'>
          <Card className='p-4'>
            <BalanceChart></BalanceChart>
          </Card>
        </div>
      </div>
      <div className='flex w-full flex-col md:col-span-2'>
        <div className='grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2'>
          <Card className='bg-green-50 p-4 dark:bg-green-900/10'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>Total Income</p>
                <h3 className='text-2xl font-bold'>$12,500</h3>
                <p className='text-sm text-green-600'>+12% from last month</p>
              </div>
              <TrendingUp className='h-8 w-8 text-green-500' />
            </div>
          </Card>
          <Card className='bg-red-50 p-4 dark:bg-red-900/10'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>Total Expenses</p>
                <h3 className='text-2xl font-bold'>$8,250</h3>
                <p className='text-sm text-red-600'>+5% from last month</p>
              </div>
              <TrendingDown className='h-8 w-8 text-red-500' />
            </div>
          </Card>
        </div>
        <div className='mt-4 flex-1'>
          <Card className='p-4'>
            <h3 className='mb-4 text-lg font-semibold'>Recent Transactions</h3>
            <div className='space-y-4'>
              {[1, 2, 3].map((_, i) => (
                <div key={i} className='flex items-center justify-between border-b pb-2'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100'>
                      <DollarSign className='h-5 w-5' />
                    </div>
                    <div>
                      <p className='font-medium'>Online Payment</p>
                      <p className='text-sm text-muted-foreground'>Apr 23, 2024</p>
                    </div>
                  </div>
                  <p className='font-semibold'>-$250.00</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <div className='flex w-full gap-4 md:col-span-3'>
        <div className='w-[60%]'>
          <LineChart></LineChart>
        </div>
        <div className='w-[40%]'>
        </div>
      </div>
    </div>
  )
}
