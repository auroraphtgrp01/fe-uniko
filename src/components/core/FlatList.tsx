'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, Star, Clock, ThumbsUp } from 'lucide-react'
import { formatCurrency, formatDateTimeVN } from '@/libraries/utils'

const data = [
  {
    id: '1',
    amount: formatCurrency(500000, 'VND'),
    accountNo: 5877979779,
    direction: 'Income',
    transactionDateTime: formatDateTimeVN('2024-09-11T16:23:26.000Z', true)
  },
  {
    id: '2',
    amount: formatCurrency(200000, 'VND'),
    accountNo: 5877979779,
    direction: 'Expense',
    transactionDateTime: formatDateTimeVN('2024-09-11T16:23:26.000Z', true)
  },
  {
    id: '2',
    amount: formatCurrency(200000, 'VND'),
    accountNo: 5877979779,
    direction: 'Expense',
    transactionDateTime: formatDateTimeVN('2024-09-11T16:23:26.000Z', true)
  },
  {
    id: '2',
    amount: formatCurrency(200000, 'VND'),
    accountNo: 5877979779,
    direction: 'Expense',
    transactionDateTime: formatDateTimeVN('2024-09-11T16:23:26.000Z', true)
  },
  {
    id: '2',
    amount: formatCurrency(200000, 'VND'),
    accountNo: 5877979779,
    direction: 'Expense',
    transactionDateTime: formatDateTimeVN('2024-09-11T16:23:26.000Z', true)
  }
]

export default function FlatList() {
  return (
    <Card className='mx-auto w-full max-w-3xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800'>
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
                    <Badge variant='secondary' className='text-xs'>
                      {item.direction}
                    </Badge>
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
