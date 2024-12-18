'use client'
import React from 'react'
import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'
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
          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
            <Card className='overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 p-4 shadow-sm transition-all hover:shadow-md dark:from-green-900/20 dark:to-emerald-900/10'>
              <div className='flex items-center justify-between'>
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-muted-foreground'>Total Income</p>
                  <h3 className='text-2xl font-bold tracking-tight'>$12,500</h3>
                  <div className='flex items-center gap-1 text-sm font-medium text-green-600'>
                    <motion.div initial={{ rotate: -45 }} animate={{ rotate: 0 }} transition={{ duration: 0.3 }}>
                      <TrendingUp className='h-4 w-4' />
                    </motion.div>
                    +12% from last month
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className='rounded-full bg-green-100 p-3 dark:bg-green-900/20'
                >
                  <TrendingUp className='h-8 w-8 text-green-600 dark:text-green-400' />
                </motion.div>
              </div>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
            <Card className='overflow-hidden bg-gradient-to-br from-red-50 to-rose-50 p-4 shadow-sm transition-all hover:shadow-md dark:from-red-900/20 dark:to-rose-900/10'>
              <div className='flex items-center justify-between'>
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-muted-foreground'>Total Expenses</p>
                  <h3 className='text-2xl font-bold tracking-tight'>$8,250</h3>
                  <div className='flex items-center gap-1 text-sm font-medium text-red-600'>
                    <motion.div initial={{ rotate: 45 }} animate={{ rotate: 0 }} transition={{ duration: 0.3 }}>
                      <TrendingDown className='h-4 w-4' />
                    </motion.div>
                    +5% from last month
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className='rounded-full bg-red-100 p-3 dark:bg-red-900/20'
                >
                  <TrendingDown className='h-8 w-8 text-red-600 dark:text-red-400' />
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>
        <div className='mt-4 flex-1'>
        <LineChart></LineChart>
        </div>
      </div>
      <div className='flex w-full gap-4 md:col-span-3'>
        <div className='w-[60%]'>
         
        </div>
        <div className='w-[40%]'></div>
      </div>
    </div>
  )
}
