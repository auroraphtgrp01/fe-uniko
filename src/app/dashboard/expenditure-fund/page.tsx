import ExpenditureFundForm from '@/app/dashboard/expenditure-fund/form'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'UNIKO - Expenditure Fund',
  description: '',
  icons: 'favicon.ico'
}

export default function page() {
  return (
    <div>
      <ExpenditureFundForm />
    </div>
  )
}
