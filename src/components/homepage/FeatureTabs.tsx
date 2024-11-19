'use client'

import Image from 'next/image'
import { TabStack } from '@/components/homepage/TabStack'

export function FeatureTabs() {
  const tabs = [
    {
      title: 'Theo dõi giao dịch',
      value: 'tracker',
      content: (
        <div className='relative h-full w-full overflow-hidden rounded-2xl p-5 px-5 text-xl font-bold text-gray-700 dark:text-white md:text-4xl lg:px-2'>
          <p>Theo dõi giao dịch</p>
          <Image
            src={'/screen/tracker-screen.webp'}
            alt='dummy image'
            width='2500'
            height='2500'
            className='mx-auto mt-4 rounded-xl object-cover'
          />
        </div>
      )
    },
    {
      title: 'Services',
      value: 'services',
      content: (
        <div className='relative h-full w-full overflow-hidden rounded-2xl p-10 text-xl font-bold text-gray-700 backdrop-blur-md backdrop-filter md:text-4xl'>
          <p>Services tab</p>
        </div>
      )
    }
  ]

  return (
    <div
      id='features'
      className='b relative mx-auto flex h-[20rem] w-full max-w-7xl flex-col items-start justify-start md:h-[30rem]'
    >
      <TabStack tabs={tabs} />
    </div>
  )
}
