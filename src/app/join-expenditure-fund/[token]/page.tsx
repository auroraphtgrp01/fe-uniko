import React from 'react'
import JoinExpenditureFund from './form'

export default function page({ params }: { params: { token: string } }) {
  return (
    <div>
      <JoinExpenditureFund token={params.token} />
    </div>
  )
}
