'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'

export interface IFlatListData {
  id: string
  amount: string
  accountNo: string
  direction: ETypeOfTrackerTransactionType
  transactionDateTime: string
}
interface IFlatListProps {
  data: IFlatListData[]
  onClick?: (item: IFlatListData) => void
}

export default function FlatList({ data, onClick }: IFlatListProps) {
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
              <Card
                onClick={(e) => {
                  e.stopPropagation()
                  if (onClick) onClick(item)
                }}
                className='mb-3 overflow-hidden bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800'
              >
                <CardHeader className='py-2'>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-sm font-bold'>
                      <div className='flex items-center justify-between space-x-4'>
                        <div className='flex items-baseline gap-2'>
                          <span className='text-xl font-bold tracking-tight'>{item.amount}</span>
                        </div>
                      </div>
                    </CardTitle>
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
                <CardContent className='px-4 pb-4 pt-0'>
                  <div className='flex flex-col space-y-1 text-sm text-muted-foreground'>
                    <div className='flex items-center justify-between'>
                      <span>From: {item.accountNo}</span>
                      <div className='flex items-center gap-1.5'>
                        <span>{item.transactionDateTime}</span>
                        <Clock className='h-4 w-4' />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>
    </Card>
  )
}
