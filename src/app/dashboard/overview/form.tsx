import React from 'react'
import CardInHeader from '@/components/dashboard/CardInHeader'

export default function DashboardMainForm() {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
      <div className='w-full md:col-span-1'>
        <div className='grid grid-cols-1 gap-4'>
          <CardInHeader className='w-full' />
          <CardInHeader className='w-full' />
        </div>
      </div>
      <div className='w-full md:col-span-2'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <CardInHeader className='w-full' />
          <CardInHeader className='w-full' />
        </div>
        <div className='mt-4'>
          <CardInHeader className='w-full' />
        </div>
      </div>
    </div>
  )
}
