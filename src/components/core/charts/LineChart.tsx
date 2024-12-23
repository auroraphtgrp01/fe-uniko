'use client'

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ICashFlowAnalysisStatistic } from '@/core/overview/models/overview.interface'
const chartData = [
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

const chartConfig = {
  transactions: {
    label: 'Transactions'
  },
  incoming: {
    label: 'Incoming',
    color: 'hsl(142.1 76.2% 36.3%)' // Green
  },
  outgoing: {
    label: 'Outgoing',
    color: 'hsl(346.8 77.2% 49.8%)' // Red
  }
} satisfies ChartConfig

export function LineChart({
  chartData,
  setDaysToSubtract
}: {
  chartData: ICashFlowAnalysisStatistic[]
  setDaysToSubtract: React.Dispatch<React.SetStateAction<number>>
}) {
  const [timeRange, setTimeRange] = React.useState('90d')
  React.useEffect(() => {
    if (timeRange === '30d') {
      setDaysToSubtract(30)
    } else if (timeRange === '7d') {
      setDaysToSubtract(7)
    } else {
      setDaysToSubtract(90)
    }
  }, [timeRange])

  return (
    <Card>
      <CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
        <div className='grid flex-1 gap-1 text-center sm:text-left'>
          <CardTitle>Cash Flow Analysis</CardTitle>
          <CardDescription>Monitoring incoming and outgoing transactions</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className='w-[160px] rounded-lg sm:ml-auto' aria-label='Select a value'>
            <SelectValue placeholder='Last 3 months' />
          </SelectTrigger>
          <SelectContent className='rounded-xl'>
            <SelectItem value='90d' className='rounded-lg'>
              Last 3 months
            </SelectItem>
            <SelectItem value='30d' className='rounded-lg'>
              Last 30 days
            </SelectItem>
            <SelectItem value='7d' className='rounded-lg'>
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer config={chartConfig} className='aspect-auto h-[250px] w-full'>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id='fillIncoming' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='hsl(142.1 76.2% 36.3%)' stopOpacity={0.8} />
                <stop offset='95%' stopColor='hsl(142.1 76.2% 36.3%)' stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id='fillOutgoing' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='hsl(346.8 77.2% 49.8%)' stopOpacity={0.8} />
                <stop offset='95%' stopColor='hsl(346.8 77.2% 49.8%)' stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })
                  }}
                  formatter={(value) => `$${value.toLocaleString()}`}
                  indicator='dot'
                />
              }
            />
            <Area
              dataKey='incoming'
              type='natural'
              fill='url(#fillIncoming)'
              stroke='hsl(142.1 76.2% 36.3%)'
              stackId='a'
            />
            <Area
              dataKey='outgoing'
              type='natural'
              fill='url(#fillOutgoing)'
              stroke='hsl(346.8 77.2% 49.8%)'
              stackId='a'
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
