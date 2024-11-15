'use client'

import DonutChart from '@/components/core/charts/DonutChart'
import Image from 'next/image'
import NoDataPlaceHolder from '@/images/2.png'
import { IStatisticTabsContentProps } from '@/core/expenditure-fund/models/expenditure-fund.interface'

export default function StatisticTabsContent({ chartData }: IStatisticTabsContentProps) {
  return (
    <div>
      {chartData.length === 0 ? (
        <div className='flex flex-col items-center justify-center pt-20'>
          <Image priority src={NoDataPlaceHolder} alt='No data available' width={150} height={150} />
          <span className='mt-2 text-sm font-semibold text-foreground'>No data available</span>
        </div>
      ) : (
        <>
          {/* Input DateRange */}
          <DonutChart data={chartData} className='h-[23rem] w-full' types='line' />
        </>
      )}
    </div>
  )
}
