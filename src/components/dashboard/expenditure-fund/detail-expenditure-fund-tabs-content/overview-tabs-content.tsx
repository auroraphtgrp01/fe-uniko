'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IOverviewTabsContentProps } from '@/core/expenditure-fund/models/expenditure-fund.interface'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { formatCurrency, formatDateTimeVN, translate } from '@/libraries/utils'
import { CalendarDays, Users2Icon } from 'lucide-react'

export default function OverviewTabsContent({ detailData, setIsDialogOpen }: IOverviewTabsContentProps) {
  const t = translate(['expenditureFundDetails', 'common'])

  return (
    <div className='space-y-4'>
      {/* Current Balance Section */}
      <div className='rounded-lg bg-muted p-4'>
        <div className='grid grid-cols-1 grid-rows-1 gap-2 sm:grid-cols-10'>
          {/* Balance Info */}
          <div className='col-span-6'>
            <div className='flex flex-col'>
              <span className='mb-1 text-sm font-medium'>Current Balance</span>
              <div className='text-2xl font-bold'>{formatCurrency(detailData.currentAmount, 'đ')}</div>
            </div>
          </div>

          {/* Date and Participants */}
          <div className='col-span-4 flex flex-col justify-center space-y-2 text-sm md:col-start-7'>
            <div className='flex items-center'>
              <CalendarDays className='mr-2 h-4 w-4 text-muted-foreground' />
              {formatDateTimeVN(detailData.time, true)}
            </div>
            <div className='flex items-center'>
              <Users2Icon className='mr-2 h-4 w-4 text-muted-foreground' />
              {detailData.participants.length} Participants
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div>
        <h3 className='mb-2 mt-2 text-sm font-medium'>{t('overview.description')}</h3>
        <p className='text-sm text-muted-foreground'>
          {!detailData.description || detailData.description === '' ? 'N/A' : detailData.description}
        </p>
      </div>

      {/* Categories Section */}
      <div>
        <h3 className='mb-2 mt-2 text-sm font-medium'>{t('overview.categories')}</h3>
        <div className='flex flex-wrap gap-2'>
          {detailData.categories.length > 0 ? (
            detailData.categories.map((category, index) => (
              <Badge
                style={{ userSelect: 'none', pointerEvents: 'none', cursor: 'none' }}
                key={index}
                variant={category.type === ETypeOfTrackerTransactionType.INCOMING ? 'secondary' : 'destructive'}
              >
                {category.name}
              </Badge>
            ))
          ) : (
            <p className='text-sm text-muted-foreground'>N/A</p>
          )}
        </div>
      </div>

      {/* Participants Section */}
      <div>
        <h3 className='mb-2 mt-2 text-sm font-medium'>{t('overview.participants')}</h3>
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

      {/* Update Button */}
      <div className='flex justify-end'>
        <Button
          onClick={() => {
            setIsDialogOpen((prev) => ({ ...prev, isDialogUpdateOpen: true }))
          }}
        >
          {t('common:button.update')}
        </Button>
      </div>
    </div>
  )
}
