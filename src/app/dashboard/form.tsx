'use client'
import React, { useState } from 'react'
import CardInHeader from '@/components/dashboard/CardInHeader'
import { useAuth } from '@/core/auth/hooks'
import { getRefreshTokenFromLocalStorage } from '@/libraries/helpers'
import { Combobox } from '@/components/core/Combobox'
import { Button } from '@/components/ui/button'

export default function DashboardMainForm() {
  const [value, setValue] = useState('1')
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
      <div className='flex w-full flex-col md:col-span-1'>
        <div className='grid flex-1 grid-cols-1 gap-4'>
          <CardInHeader className='h-full w-full' />
          <Button onClick={() => setValue('')}>Click</Button>
          <Combobox
            value={value}
            onChange={setValue}
            dataArr={[
              {
                value: '1',
                label: '1'
              },
              {
                value: '2',
                label: '2'
              }
            ]}
          />
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
