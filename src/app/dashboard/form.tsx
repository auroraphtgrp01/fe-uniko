'use client'
import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'
import { LineChart } from '@/components/core/charts/LineChart'
import { BalanceChart } from '@/components/core/charts/BalanceChart'
import { useOverviewPage } from '@/core/overview/hooks'
import { useStoreLocal } from '@/hooks/useStoreLocal'
import { ICashFlowAnalysisStatistic, ITotalAmount, ITotalBalanceChart } from '@/core/overview/models/overview.interface'
import { initDataStatisticAccountBalance, initDataStatisticCashFlowAnalysis } from './handler'
import { initEmptyBalanceChartConfig, initEmptyTotalAmount } from './constants'
import { formatCurrency } from '@/libraries/utils'
import { ChartConfig } from '@/components/ui/chart'
import { useAccountSource } from '@/core/account-source/hooks'

export default function DashboardMainForm() {
  const { fundId } = useStoreLocal()
  // states
  const [daysToSubtract, setDaysToSubtract] = useState(90)
  const [cashFlowAnalysisChartData, setCashFlowAnalysisChartData] = useState<ICashFlowAnalysisStatistic[]>([])
  const [balanceChartData, setBalanceChartData] = useState<ITotalBalanceChart[]>([])
  const [balanceChartConfig, setBalanceChartConfig] = useState<ChartConfig>(initEmptyBalanceChartConfig)
  const [totalIncome, setTotalIncome] = useState<ITotalAmount>(initEmptyTotalAmount)
  const [totalExpenses, setTotalExpenses] = useState<ITotalAmount>(initEmptyTotalAmount)

  // hooks
  // declare hooks
  const { getStatisticOverviewPage } = useOverviewPage()
  const { getStatisticAccountBalance } = useAccountSource()

  // use hooks
  const { getStatisticAccountBalanceData } = getStatisticAccountBalance(fundId)
  const { getStatisticOverviewPageData } = getStatisticOverviewPage(
    {
      daysToSubtract
    },
    fundId
  )

  // effects
  useEffect(() => {
    if (getStatisticOverviewPageData)
      initDataStatisticCashFlowAnalysis({
        data: getStatisticOverviewPageData.data,
        setCashFlowAnalysisChartData,
        setTotalIncome,
        setTotalExpenses
      })
  }, [getStatisticOverviewPageData])
  useEffect(() => {
    if (getStatisticAccountBalanceData && getStatisticAccountBalanceData.data.length > 0)
      initDataStatisticAccountBalance({
        data: getStatisticAccountBalanceData.data,
        setBalanceChartConfig,
        setBalanceChartData
      })
  }, [getStatisticAccountBalanceData])

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
      <div className='flex w-full flex-col md:col-span-1'>
        <div className='grid flex-1 grid-cols-1 gap-4'>
          <Card className='p-4'>
            <BalanceChart chartConfig={balanceChartConfig} chartData={balanceChartData} />
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
                  <h3 className='text-2xl font-bold tracking-tight'>
                    {formatCurrency(totalIncome.amount ?? 0, 'đ', 'vi-vn')}
                  </h3>
                  <div
                    // Nếu như tăng/thu nhiều hơn hoặc không đổi (true) => green ngược lại red
                    className={`flex items-center gap-1 text-sm font-medium ${totalIncome.rate?.[0] !== '-' || totalIncome.rate === undefined ? 'text-green-600' : 'text-red-600'}`}
                    style={{ userSelect: 'none' }}
                  >
                    <motion.div initial={{ rotate: -45 }} animate={{ rotate: 0 }} transition={{ duration: 0.3 }}>
                      {totalIncome.rate?.[0] !== '-' || totalIncome.rate === undefined ? (
                        <TrendingUp className='h-4 w-4' />
                      ) : (
                        <TrendingDown className='h-4 w-4' />
                      )}
                    </motion.div>
                    {(totalIncome.rate?.[0] === '-' ? '' : '+') + (totalIncome.rate || '0') + '% from last week'}
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
                  <h3 className='text-2xl font-bold tracking-tight'>
                    {formatCurrency(totalExpenses.amount ?? 0, 'đ', 'vi-vn')}
                  </h3>
                  <div
                    // Nếu như tăng/tiêu nhiều hơn (true) => red ngược lại green
                    className={`flex items-center gap-1 text-sm font-medium ${totalExpenses.rate?.[0] !== '-' || totalExpenses.rate === undefined ? 'text-red-600' : 'text-green-600'}`}
                    style={{ userSelect: 'none' }}
                  >
                    <motion.div initial={{ rotate: 45 }} animate={{ rotate: 0 }} transition={{ duration: 0.3 }}>
                      {totalExpenses.rate?.[0] !== '-' || totalExpenses.rate === undefined ? (
                        <TrendingUp className='h-4 w-4' />
                      ) : (
                        <TrendingDown className='h-4 w-4' />
                      )}
                    </motion.div>
                    {(totalExpenses.rate?.[0] === '-' ? '' : '+') + (totalExpenses.rate || '0') + '% from last week'}
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
          <LineChart chartData={cashFlowAnalysisChartData} setDaysToSubtract={setDaysToSubtract} />
        </div>
      </div>
      <div className='flex w-full gap-4 md:col-span-3'>
        <div className='w-[60%]'></div>
        <div className='w-[40%]'></div>
      </div>
    </div>
  )
}
