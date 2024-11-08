import React from 'react'
import AccountSourceForm from './form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UNIKO - Account Source',
  description: '',
  icons: 'favicon.ico'
}

export default function page() {
  return (
    <div>
      <AccountSourceForm />
    </div>
  )
}
