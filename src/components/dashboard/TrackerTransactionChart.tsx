import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DateRangePicker } from '../core/DateRangePicker'
import { IDateRange } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { TrendingDown, TrendingUp } from 'lucide-react'
interface ITabContent {
  labels: string
  value: string
  content: JSX.Element
}

export interface ITabConfig {
  tabContents: ITabContent[]
  default: string
}

export interface IStatisticDateRange {
  dates: IDateRange
  setDates: React.Dispatch<React.SetStateAction<IDateRange>>
}

interface ITrackerTransactionChartProps {
  tabConfig: ITabConfig
  statisticDateRange: IStatisticDateRange
}

export default function TrackerTransactionChart({ tabConfig, statisticDateRange }: ITrackerTransactionChartProps) {
  const [currentTab, setCurrentTab] = useState(tabConfig.default)

  return (
    <Tabs value={currentTab} onValueChange={setCurrentTab} className='h-full flex-1 rounded-md'>
      <Card className='h-full w-full'>
        <CardContent className='items-center justify-center'>
          <TabsList className='col-span-2 mt-5 grid w-full grid-cols-2'>
            {tabConfig.tabContents.length > 0
              ? tabConfig.tabContents.map((tabContent: ITabContent, index: number) => (
                  <>
                    <TabsTrigger value={tabContent.value} className='flex items-center gap-2'>
                      {index === 0 && <TrendingDown width={15} height={15} />}
                      {tabContent.labels} {index === 1 && <TrendingUp width={15} height={15} />}
                    </TabsTrigger>
                  </>
                ))
              : ''}
          </TabsList>
          <div className='mt-4'>
            <DateRangePicker
              value={{ from: statisticDateRange.dates.startDay, to: statisticDateRange.dates.endDay }}
              onChange={(range) => {
                if (range) statisticDateRange.setDates({ startDay: range.from, endDay: range.to })
              }}
            />
          </div>
          {tabConfig.tabContents.length > 0
            ? tabConfig.tabContents.map((tabContent: ITabContent) => (
                <>
                  <TabsContent value={tabContent.value} className='h-fit'>
                    {tabContent.content}
                  </TabsContent>
                </>
              ))
            : ''}
        </CardContent>
      </Card>
    </Tabs>
  )
}
