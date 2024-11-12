import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  EFundStatus,
  IDetailExpenditureFundProps,
  IUpdateExpenditureFundFormProps
} from '@/core/expenditure-fund/models/expenditure-fund.interface'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { formatCurrency, formatDateTimeVN } from '@/libraries/utils'
import { ArrowDownIcon, ArrowUpIcon, CalendarDays, PlusCircleIcon, Tag, Users2Icon } from 'lucide-react'
import Image from 'next/image'
import EmptyBox from '@/images/empty-box.png'
import NoDataPlaceHolder from '@/images/2.png'

export function DetailExpenditureFund({ detailData }: IDetailExpenditureFundProps) {
  const getStatusColor = (status: EFundStatus) => {
    switch (status) {
      case EFundStatus.ACTIVE:
        return 'bg-green-100 text-green-800'
      case EFundStatus.CLOSED:
        return 'bg-gray-700'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <>
      <div className='flex items-center justify-between text-2xl font-bold'>
        <span>{detailData.name}</span>
        <Badge className={getStatusColor(detailData.status)}>{detailData.status}</Badge>
      </div>
      <Tabs defaultValue='overview' className='w-full'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='transactions'>Transactions</TabsTrigger>
          <TabsTrigger value='statistics'>Statistics</TabsTrigger>
        </TabsList>
        <TabsContent value='overview' className='space-y-4'>
          <div className='mt-3 rounded-lg bg-muted p-4'>
            <div className='mb-2 flex items-center justify-between'>
              <span className='text-sm font-medium'>Current Balance</span>
              <span className='text-2xl font-bold'>{formatCurrency(detailData.currentAmount, 'đ')}</span>
            </div>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div className='flex items-center gap-2'>
                <CalendarDays className='h-4 w-4 text-muted-foreground' />
                <span className='mt-1'>{formatDateTimeVN(detailData.time, true)}</span>
              </div>
              <div className='flex items-center gap-2'>
                <Users2Icon className='h-4 w-4 text-muted-foreground' />
                <span className='mt-1'>{detailData.participants.length} Participants</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className='mb-2 text-sm font-medium'>Description</h3>
            <p className='text-sm text-muted-foreground'>
              {!detailData.description || detailData.description === ''
                ? 'Description content...'
                : detailData.description}
            </p>
          </div>
          <div>
            <h3 className='mb-2 text-sm font-medium'>Expense Categories</h3>
            <div className='flex flex-wrap gap-2'>
              {detailData.categories.length > 0 ? (
                detailData.categories.map((category, index) => (
                  <Badge key={index} variant='secondary'>
                    <Tag className='mr-1 h-3 w-3' />
                    {category.name}
                  </Badge>
                ))
              ) : (
                <p className='text-sm text-muted-foreground'>Categories...</p>
              )}
            </div>
          </div>
          <div>
            <h3 className='mb-2 text-sm font-medium'>Participants</h3>
            <div className='flex flex-wrap gap-2'>
              {detailData.participants.map((participant, index) => (
                <Badge key={index} variant='outline'>
                  {participant.user.fullName}
                </Badge>
              ))}
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <span className='font-medium'>Fund Owner:</span>
              <span className='ml-2'>{detailData.ownerName}</span>
            </div>
          </div>
        </TabsContent>
        <TabsContent value='transactions' className='space-y-4'>
          <h3 className='mb-2 text-lg font-semibold'>Recent Transactions</h3>
          <div className='space-y-2'>
            {detailData.transactions.length > 0 ? (
              detailData.transactions.map((transaction) => (
                <div key={transaction.id} className='flex items-center justify-between rounded bg-muted p-2 text-sm'>
                  <div className='flex items-center gap-2'>
                    {transaction.direction === ETypeOfTrackerTransactionType.INCOMING ? (
                      <ArrowUpIcon className='h-4 w-4 text-green-500' />
                    ) : (
                      <ArrowDownIcon className='h-4 w-4 text-red-500' />
                    )}
                    <span>{transaction.TrackerTransaction ? transaction.TrackerTransaction.reasonName : 'N/A'}</span>
                  </div>
                  <div className='flex items-center gap-4'>
                    <Badge variant={transaction.TrackerTransaction !== undefined ? 'outline' : 'greenPastel1'}>
                      {transaction.TrackerTransaction
                        ? transaction.TrackerTransaction.TrackerType.name
                        : 'Unclassified'}
                    </Badge>
                    <span
                      className={
                        transaction.direction === ETypeOfTrackerTransactionType.INCOMING
                          ? 'text-green-500'
                          : 'text-red-500'
                      }
                    >
                      {transaction.direction === ETypeOfTrackerTransactionType.INCOMING ? '+' : '-'}
                      {formatCurrency(transaction.amount, 'đ')}
                    </span>
                    <span className='text-muted-foreground'>
                      {/* {formatDateTimeVN(transaction.transactionDateTime, false)} */}
                    </span>
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
        </TabsContent>
        <TabsContent value='statistics' className='space-y-4'>
          {true ? (
            <div className='mt-12 flex flex-col items-center justify-center'>
              <Image priority src={NoDataPlaceHolder} alt='No data available' width={150} height={150} />
              <span className='mt-2 text-sm font-semibold text-foreground'>No data available</span>
            </div>
          ) : (
            <>
              <h3 className='mb-2 text-lg font-semibold'>Monthly Spending</h3>
              {/* Chart */}
            </>
          )}
        </TabsContent>
      </Tabs>
    </>
  )
}
