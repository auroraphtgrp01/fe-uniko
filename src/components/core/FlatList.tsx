'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'
import { formatCurrency, formatDateTimeVN } from '@/libraries/utils'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'

const data = [
  {
    id: '1',
    amount: formatCurrency(500000, 'VND'),
    accountNo: 5877979779,
    direction: ETypeOfTrackerTransactionType.EXPENSE,
    transactionDateTime: formatDateTimeVN('2024-09-11T16:23:26.000Z', true)
  },
  {
    id: '2',
    amount: formatCurrency(200000, 'VND'),
    accountNo: 5877979779,
    direction: ETypeOfTrackerTransactionType.INCOMING,
    transactionDateTime: formatDateTimeVN('2024-09-11T16:23:26.000Z', true)
  },
  {
    id: '2',
    amount: formatCurrency(200000, 'VND'),
    accountNo: 5877979779,
    direction: ETypeOfTrackerTransactionType.INCOMING,
    transactionDateTime: formatDateTimeVN('2024-09-11T16:23:26.000Z', true)
  },
  {
    id: '2',
    amount: formatCurrency(200000, 'VND'),
    accountNo: 5877979779,
    direction: ETypeOfTrackerTransactionType.INCOMING,
    transactionDateTime: formatDateTimeVN('2024-09-11T16:23:26.000Z', true)
  }
]

export default function FlatList() {
  return (
    <Card className='mx-auto w-full max-w-3xl'>
      <ScrollArea className='h-[200px] w-full rounded-md border-none p-4'>
        <AnimatePresence>
          {data.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className='mb-3 overflow-hidden bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800'>
                <CardHeader className='py-2'>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-sm font-bold'>{item.amount}</CardTitle>
                    {item.direction === ETypeOfTrackerTransactionType.EXPENSE ? (
                      <Badge variant='default' className='text-xs text-white'>
                        {item.direction}
                      </Badge>
                    ) : (
                      <Badge variant='secondary' className='text-xs'>
                        {item.direction}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className='py-1'>
                  <CardDescription className='mb-2 text-sm'>
                    <div className='flex justify-between gap-2'>
                      From: {item.accountNo}
                      <div className='flex gap-1'>
                        <span>{item.transactionDateTime}</span>
                        <Clock className='mt-[0.2px] h-4 w-4' />
                      </div>
                    </div>
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>
    </Card>
  )
}
