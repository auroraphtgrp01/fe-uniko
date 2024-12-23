'use client'
import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'
import { LineChart } from '@/components/core/charts/LineChart'
import { BalanceChart } from '@/components/core/charts/BalanceChart'

export default function DashboardMainForm() {
  const [daysToSubtract, setDaysToSubtract] = useState(90)

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
  const chartData2 = [
    { date: '2024-04-01', incoming: 2200, outgoing: 1500 },
    { date: '2024-04-02', incoming: 1970, outgoing: 1800 },
    { date: '2024-04-03', incoming: 1670, outgoing: 1200 },
    { date: '2024-04-04', incoming: 2420, outgoing: 2600 },
    { date: '2024-04-05', incoming: 3730, outgoing: 2900 },
    { date: '2024-04-06', incoming: 3010, outgoing: 3400 },
    { date: '2024-04-07', incoming: 2450, outgoing: 1800 },
    { date: '2024-04-08', incoming: 4090, outgoing: 3200 },
    { date: '2024-04-09', incoming: 590, outgoing: 1100 },
    { date: '2024-04-10', incoming: 2610, outgoing: 1900 },
    { date: '2024-04-11', incoming: 3270, outgoing: 3500 },
    { date: '2024-04-12', incoming: 2920, outgoing: 2100 },
    { date: '2024-04-13', incoming: 3420, outgoing: 3800 },
    { date: '2024-04-14', incoming: 1370, outgoing: 2200 },
    { date: '2024-04-15', incoming: 1200, outgoing: 1700 },
    { date: '2024-04-16', incoming: 1380, outgoing: 1900 },
    { date: '2024-04-17', incoming: 4460, outgoing: 3600 },
    { date: '2024-04-18', incoming: 3640, outgoing: 4100 },
    { date: '2024-04-19', incoming: 2430, outgoing: 1800 },
    { date: '2024-04-20', incoming: 890, outgoing: 1500 },
    { date: '2024-04-21', incoming: 1370, outgoing: 2000 },
    { date: '2024-04-22', incoming: 2240, outgoing: 1700 },
    { date: '2024-04-23', incoming: 1380, outgoing: 2300 },
    { date: '2024-04-24', incoming: 3870, outgoing: 2900 },
    { date: '2024-04-25', incoming: 2150, outgoing: 2500 },
    { date: '2024-04-26', incoming: 750, outgoing: 1300 },
    { date: '2024-04-27', incoming: 3830, outgoing: 4200 },
    { date: '2024-04-28', incoming: 1220, outgoing: 1800 },
    { date: '2024-04-29', incoming: 3150, outgoing: 2400 },
    { date: '2024-04-30', incoming: 4540, outgoing: 3800 },
    { date: '2024-05-01', incoming: 1650, outgoing: 2200 },
    { date: '2024-05-02', incoming: 2930, outgoing: 3100 },
    { date: '2024-05-03', incoming: 2470, outgoing: 1900 },
    { date: '2024-05-04', incoming: 3850, outgoing: 4200 },
    { date: '2024-05-05', incoming: 4810, outgoing: 3900 },
    { date: '2024-05-06', incoming: 4980, outgoing: 5200 },
    { date: '2024-05-07', incoming: 3880, outgoing: 3000 },
    { date: '2024-05-08', incoming: 1490, outgoing: 2100 },
    { date: '2024-05-09', incoming: 2270, outgoing: 1800 },
    { date: '2024-05-10', incoming: 2930, outgoing: 3300 },
    { date: '2024-05-11', incoming: 3350, outgoing: 2700 },
    { date: '2024-05-12', incoming: 1970, outgoing: 2400 },
    { date: '2024-05-13', incoming: 1970, outgoing: 1600 },
    { date: '2024-05-14', incoming: 4480, outgoing: 4900 },
    { date: '2024-05-15', incoming: 4730, outgoing: 3800 },
    { date: '2024-05-16', incoming: 3380, outgoing: 4000 },
    { date: '2024-05-17', incoming: 4990, outgoing: 4200 },
    { date: '2024-05-18', incoming: 3150, outgoing: 3500 },
    { date: '2024-05-19', incoming: 2350, outgoing: 1800 },
    { date: '2024-05-20', incoming: 1770, outgoing: 2300 },
    { date: '2024-05-21', incoming: 820, outgoing: 1400 },
    { date: '2024-05-22', incoming: 810, outgoing: 1200 },
    { date: '2024-05-23', incoming: 2520, outgoing: 2900 },
    { date: '2024-05-24', incoming: 2940, outgoing: 2200 },
    { date: '2024-05-25', incoming: 2010, outgoing: 2500 },
    { date: '2024-05-26', incoming: 2130, outgoing: 1700 },
    { date: '2024-05-27', incoming: 4200, outgoing: 4600 },
    { date: '2024-05-28', incoming: 2330, outgoing: 1900 },
    { date: '2024-05-29', incoming: 780, outgoing: 1300 },
    { date: '2024-05-30', incoming: 3400, outgoing: 2800 },
    { date: '2024-05-31', incoming: 1780, outgoing: 2300 },
    { date: '2024-06-01', incoming: 1780, outgoing: 2000 },
    { date: '2024-06-02', incoming: 4700, outgoing: 4100 },
    { date: '2024-06-03', incoming: 1030, outgoing: 1600 },
    { date: '2024-06-04', incoming: 4390, outgoing: 3800 },
    { date: '2024-06-05', incoming: 880, outgoing: 1400 },
    { date: '2024-06-06', incoming: 2940, outgoing: 2500 },
    { date: '2024-06-07', incoming: 3230, outgoing: 3700 },
    { date: '2024-06-08', incoming: 3850, outgoing: 3200 },
    { date: '2024-06-09', incoming: 4380, outgoing: 4800 },
    { date: '2024-06-10', incoming: 1550, outgoing: 2000 },
    { date: '2024-06-11', incoming: 920, outgoing: 1500 },
    { date: '2024-06-12', incoming: 4920, outgoing: 4200 },
    { date: '2024-06-13', incoming: 810, outgoing: 1300 },
    { date: '2024-06-14', incoming: 4260, outgoing: 3800 },
    { date: '2024-06-15', incoming: 3070, outgoing: 3500 },
    { date: '2024-06-16', incoming: 3710, outgoing: 3100 },
    { date: '2024-06-17', incoming: 4750, outgoing: 5200 },
    { date: '2024-06-18', incoming: 1070, outgoing: 1700 },
    { date: '2024-06-19', incoming: 3410, outgoing: 2900 },
    { date: '2024-06-20', incoming: 4080, outgoing: 4500 },
    { date: '2024-06-21', incoming: 1690, outgoing: 2100 },
    { date: '2024-06-22', incoming: 3170, outgoing: 2700 },
    { date: '2024-06-23', incoming: 4800, outgoing: 5300 },
    { date: '2024-06-24', incoming: 1320, outgoing: 1800 },
    { date: '2024-06-25', incoming: 1410, outgoing: 1900 },
    { date: '2024-06-26', incoming: 4340, outgoing: 3800 },
    { date: '2024-06-27', incoming: 4480, outgoing: 4900 },
    { date: '2024-06-28', incoming: 1490, outgoing: 2000 },
    { date: '2024-06-29', incoming: 1030, outgoing: 1600 },
    { date: '2024-06-30', incoming: 4460, outgoing: 4000 }
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
          <LineChart chartData={chartData2} setDaysToSubtract={setDaysToSubtract} />
        </div>
      </div>
      <div className='flex w-full gap-4 md:col-span-3'>
        <div className='w-[60%]'></div>
        <div className='w-[40%]'></div>
      </div>
    </div>
  )
}
