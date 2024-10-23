import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DonutChart, { IPayloadDataChart } from '@/components/core/charts/DonutChart'
import { DateRangePicker } from '../core/DateRangePicker'

interface TrackerTransactionChartProps {
  defaultValue: string
  incomingChartData: IPayloadDataChart[]
  expenseChartData: IPayloadDataChart[]
  incomingLabel: string
  expenseLabel: string
  incomingChartHeight?: string
  expenseChartHeight?: string
  className?: string
}

export default function TrackerTransactionChart({
  defaultValue,
  incomingChartData,
  expenseChartData,
  incomingLabel,
  expenseLabel,
  incomingChartHeight,
  expenseChartHeight,
  className = ''
}: TrackerTransactionChartProps) {
  const [currentTab, setCurrentTab] = useState(defaultValue)
  useEffect(() => {
    setCurrentTab(defaultValue)
  }, [defaultValue])

  return (
    <Tabs value={currentTab} onValueChange={setCurrentTab} className='h-full flex-1 rounded-md'>
      <Card className={`w-full ${className}`}>
        <CardContent className='items-center justify-center'>
          <TabsList className='col-span-2 mt-5 grid w-full grid-cols-2'>
            <TabsTrigger className='me-2' value='incomingChart'>
              {incomingLabel}
            </TabsTrigger>
            <TabsTrigger value='expenseChart'>{expenseLabel}</TabsTrigger>
          </TabsList>
          <div className='mt-2'>
            <DateRangePicker onChange={(range) => {}}></DateRangePicker>
          </div>
          <TabsContent value='incomingChart' className='h-fit'>
            <DonutChart
              data={incomingChartData ? incomingChartData : []}
              className={`mt-[2%] h-[300px] w-full`}
              types='donut'
            />
          </TabsContent>
          <TabsContent value='expenseChart' className='h-fit'>
            <DonutChart
              data={expenseChartData ? expenseChartData : []}
              className={`mt-[2%] h-[300px] w-full`}
              types='donut'
            />
          </TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  )
}
