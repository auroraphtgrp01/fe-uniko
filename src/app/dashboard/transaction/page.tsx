import React from 'react'
import TransactionForm from './form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UNIKO - Transaction',
  description: '',
  icons: 'favicon.ico'
}

export default function page() {
  return (
    <div>
      <TransactionForm />
    </div>
  )
}
