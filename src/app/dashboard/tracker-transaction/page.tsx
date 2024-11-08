import React from 'react'
import TrackerTransactionForm from './form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UNIKO - Tracker Transaction',
  description: '',
  icons: 'favicon.ico'
}

export default function page() {
  return (
    <div>
      <TrackerTransactionForm />
    </div>
  )
}
