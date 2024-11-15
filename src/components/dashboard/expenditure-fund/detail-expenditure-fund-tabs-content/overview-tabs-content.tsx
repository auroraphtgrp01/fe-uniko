'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IOverviewTabsContentProps } from '@/core/expenditure-fund/models/expenditure-fund.interface'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { formatCurrency, formatDateTimeVN } from '@/libraries/utils'
import { CalendarDays, Tag, Users2Icon } from 'lucide-react'

export default function OverviewTabsContent({ detailData, setIsDialogOpen }: IOverviewTabsContentProps) {
  return (
    <div>
      <div className='rounded-lg bg-muted p-3'>
        <div className='grid grid-cols-10 grid-rows-1 gap-2'>
          <div className='col-span-6'>
            <div className='flex flex-col justify-between'>
              <div>
                <span className='mb-1 text-sm font-medium'>Current Balance</span>
                <div className='text-2xl font-bold'>{formatCurrency(detailData.currentAmount, 'đ')}</div>
              </div>
            </div>
          </div>
          <div className='col-span-4 col-start-8 items-start'>
            <div className='flex h-full flex-col justify-center space-y-2 text-sm'>
              <div className='flex h-4'>
                <CalendarDays className='mr-2 h-4 w-4 text-muted-foreground' />
                {formatDateTimeVN(detailData.time, true)}
              </div>
              <div className='flex h-4'>
                <Users2Icon className='mr-2 h-4 w-4 text-muted-foreground' />
                {detailData.participants.length} Participants
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className='mb-2 mt-2 text-sm font-medium'>Description</h3>
        <p className='text-sm text-muted-foreground'>
          {!detailData.description || detailData.description === '' ? 'N/A' : detailData.description}
        </p>
      </div>
      <div>
        <h3 className='mb-2 mt-2 text-sm font-medium'>Expense Categories</h3>
        <div className='flex flex-wrap gap-2'>
          {detailData.categories.length > 0 ? (
            detailData.categories.map((category, index) => (
              <Badge
                style={{ userSelect: 'none', pointerEvents: 'none', cursor: 'none' }}
                key={index}
                variant={category.type === ETypeOfTrackerTransactionType.INCOMING ? 'secondary' : 'destructive'}
              >
                <Tag className='mr-1 h-3 w-3' />
                {category.name}
              </Badge>
            ))
          ) : (
            <p className='text-sm text-muted-foreground'>N/A</p>
          )}
        </div>
      </div>
      <div>
        <h3 className='mb-2 mt-2 text-sm font-medium'>Participants</h3>
        <div className='flex gap-2'>
          {detailData.participants.map((participant, index) => (
            <Badge
              style={{ userSelect: 'none', pointerEvents: 'none', cursor: 'none' }}
              key={index}
              variant='outline'
              className={participant.role === 'OWNER' ? 'bg-yellow-500 text-yellow-900' : 'bg-gray-500 text-gray-900'}
            >
              {participant.user?.fullName ?? 'N/A'}
            </Badge>
          ))}
        </div>
      </div>
      <div className='flex justify-end'>
        <Button
          onClick={() => {
            setIsDialogOpen((prev) => ({ ...prev, isDialogUpdateOpen: true }))
          }}
        >
          Update
        </Button>
      </div>
    </div>
  )
}
