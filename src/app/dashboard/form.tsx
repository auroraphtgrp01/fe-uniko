'use client'
import React from 'react'
import CardInHeader from '@/components/dashboard/CardInHeader'
import { DateTimePicker } from '../../components/core/DateTimePicker'

export default function DashboardMainForm() {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
      <div className='flex w-full flex-col md:col-span-1'>
        <div className='grid flex-1 grid-cols-1 gap-4'>
          <DateTimePicker onChange={() => {}} value={new Date('2024-10-22T01:25:55.239Z')} showTime={false} />
          <CardInHeader className='h-full w-full' />
        </div>
      </div>
      <div className='flex w-full flex-col md:col-span-2'>
        <div className='grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2'>
          <CardInHeader className='h-full w-full' />
          <CardInHeader className='h-full w-full' />
        </div>
        <div className='mt-4 flex-1'>
          <CardInHeader className='h-full w-full' />
        </div>
      </div>
    </div>
  )
}
