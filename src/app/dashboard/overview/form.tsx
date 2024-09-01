import React from 'react'
import CardInHeader from '@/components/dashboard/CardInHeader'

export default function DashboardMainForm() {
  return (
    <div>
      <div className='flex'>
        <CardInHeader className='me-4' />
        <CardInHeader />
      </div>
    </div>
  )
}
