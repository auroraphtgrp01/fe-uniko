'use client'

import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { formatCurrency, formatDateTimeVN } from '@/libraries/utils'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import Image from 'next/image'
import EmptyBox from '@/images/empty-box.png'
import { ITransactionTabsContentProps } from '@/core/expenditure-fund/models/expenditure-fund.interface'

export default function TransactionTabsContent({ detailData }: ITransactionTabsContentProps) {
  return (
    <ScrollArea className='h-[255px]'>
      <div className='space-y-2'>
        {detailData.transactions.length > 0 ? (
          detailData.transactions.map((transaction) => (
            <div
              style={{ userSelect: 'none' }}
              key={transaction.id}
              className='grid grid-cols-5 grid-rows-1 items-center gap-4 rounded bg-muted p-2 text-sm'
            >
              <div className='col-span-2 flex items-center gap-2'>
                {transaction.direction === ETypeOfTrackerTransactionType.INCOMING ? (
                  <ArrowUpIcon className='h-4 w-4 text-green-500' />
                ) : (
                  <ArrowDownIcon className='h-4 w-4 text-red-500' />
                )}
                <span>{transaction.TrackerTransaction ? transaction.TrackerTransaction.reasonName : 'N/A'}</span>
              </div>
              <div className='col-start-3 flex justify-center gap-2'>
                <div className='flex justify-center'>
                  <span
                    className={
                      transaction.direction === ETypeOfTrackerTransactionType.INCOMING
                        ? 'font-semibold text-green-500'
                        : 'font-semibold text-red-500'
                    }
                  >
                    {transaction.direction === ETypeOfTrackerTransactionType.INCOMING ? '+' : '-'}
                    {formatCurrency(transaction.amount, 'đ')}
                  </span>
                </div>
              </div>
              <div className='col-start-4 flex justify-end'>
                <div className='flex justify-end'>
                  <Badge
                    style={{ userSelect: 'none', pointerEvents: 'none', cursor: 'none' }}
                    className='text-nowrap'
                    variant={transaction.TrackerTransaction !== undefined ? 'outline' : 'greenPastel1'}
                  >
                    {transaction.TrackerTransaction ? transaction.TrackerTransaction.TrackerType.name : 'Unclassified'}
                  </Badge>
                </div>
              </div>

              <div className='col-start-5 flex justify-start gap-2'>
                <div className='flex justify-start'>
                  <span className='text-nowrap text-muted-foreground'>
                    {formatDateTimeVN(transaction.transactionDateTime, true)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='flex items-center justify-center p-4'>
            <div className='text-center'>
              <Image priority src={EmptyBox} alt='' height={60} width={60} className='mx-auto' />
              <span className='mt-2 block text-sm font-semibold text-foreground'>No data available</span>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
