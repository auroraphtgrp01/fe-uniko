'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import Image from 'next/image'
import NoDataPlaceHolder from '@/images/2.png'
import { cn } from '@/libraries/utils'
import { Atom } from 'react-loading-indicators'
import { emptyStateItemVariants, emptyStateVariants } from '../dashboard/DataTable'
import EmptyBox from '@/images/empty-box.png'
import { t } from 'i18next'
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
  isLoading?: boolean
}

export default function FlatList({ data, onClick, isLoading }: IFlatListProps) {
  return (
    <Card className='mx-auto w-full to-muted/20'>
      {data?.length > 0 ? (
        <ScrollArea className='h-[200px] w-full rounded-md p-4'>
          {data.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Card
                onClick={(e) => {
                  e.stopPropagation()
                  if (onClick) onClick(item)
                }}
                className={cn(
                  'mb-4 cursor-pointer border-l-4 bg-card/50 bg-gradient-to-b from-background transition-all duration-300 hover:scale-[1.01]',
                  `${item.direction === ETypeOfTrackerTransactionType.EXPENSE ? 'border-l-rose-600 dark:border-l-rose-800' : 'border-l-[#047858]'}`
                )}
              >
                <CardHeader className='py-3'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`${
                          item.direction === ETypeOfTrackerTransactionType.EXPENSE
                            ? 'text-destructive'
                            : 'text-secondary'
                        }`}
                      >
                        {item.direction === ETypeOfTrackerTransactionType.EXPENSE ? '↓' : '↑'}
                      </div>
                      <div className='flex flex-col'>
                        <CardTitle className='text-xl font-bold tracking-tight'>
                          {item.direction === ETypeOfTrackerTransactionType.EXPENSE ? '- ' : '+ '}
                          {item.amount}
                        </CardTitle>
                        <span className='text-xs text-muted-foreground'>
                          {item.direction === ETypeOfTrackerTransactionType.INCOMING ? 'To' : 'From'}:{' '}
                          {item.accountNo ? item.accountNo : 'N/A'}{' '}
                        </span>
                      </div>
                    </div>
                    <div className='flex flex-col items-end gap-1.5'>
                      <Badge
                        variant={item.direction === ETypeOfTrackerTransactionType.EXPENSE ? 'default' : 'secondary'}
                        className='font-sm'
                      >
                        {item.direction}
                      </Badge>
                      <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                        <Clock className='h-3 w-3' />
                        <span>{item.transactionDateTime}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </ScrollArea>
      ) : isLoading ? (
        <motion.div
          initial='hidden'
          animate='visible'
          variants={emptyStateVariants}
          className='flex flex-col items-center justify-center gap-2'
        >
          <motion.div variants={emptyStateItemVariants}>
            <Atom color='#be123c' size='small' textColor='#be123c' />
          </motion.div>
          <motion.span variants={emptyStateItemVariants} className='font-semibold'>
            Loading
          </motion.span>
        </motion.div>
      ) : (
        <div className='flex h-[200px] flex-col items-center justify-center space-y-4'>
          <div className='relative'>
            <Image
              priority
              src={NoDataPlaceHolder}
              alt='No data available'
              width={120}
              height={120}
              className='opacity-80'
            />
          </div>
          <p className='text-sm text-muted-foreground'>No transactions available at the moment</p>
        </div>
      )}
    </Card>
  )
}
