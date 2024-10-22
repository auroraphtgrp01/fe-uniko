import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DonutChart, { IPayloadDataChart } from '@/components/core/charts/DonutChart'

interface ChartCardProps {
  defaultValue: string
  incomingChartData: IPayloadDataChart[]
  expenseChartData: IPayloadDataChart[]
  incomingLabel: string
  expenseLabel: string
  incomingChartHeight?: string
  expenseChartHeight?: string
  className?: string
}

export default function ChartCard({
  defaultValue,
  incomingChartData,
  expenseChartData,
  incomingLabel,
  expenseLabel,
  incomingChartHeight,
  expenseChartHeight,
  className = ''
}: ChartCardProps) {
  const [currentTab, setCurrentTab] = useState(defaultValue)
  useEffect(() => {
    setCurrentTab(defaultValue)
  }, [defaultValue])

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className='flex items-center justify-center'>
        <Tabs value={currentTab} onValueChange={setCurrentTab} className='h-full flex-1 rounded-md'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='incomingChart'>{incomingLabel}</TabsTrigger>
            <TabsTrigger value='expenseChart'>{expenseLabel}</TabsTrigger>
          </TabsList>
          <TabsContent value='incomingChart' className='h-fit'>
            <DonutChart
              data={incomingChartData ? incomingChartData : []}
              className={`mt-[2%] w-full ${incomingChartHeight}`}
              types='donut'
            />
          </TabsContent>
          <TabsContent value='expenseChart' className='h-fit'>
            <DonutChart
              data={expenseChartData ? expenseChartData : []}
              className={`mt-[2%] w-full ${expenseChartHeight}`}
              types='donut'
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
