import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EFundStatus, IDetailExpenditureFundProps } from '@/core/expenditure-fund/models/expenditure-fund.interface'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'

import { useState } from 'react'
import OverviewTabsContent from './detail-expenditure-fund-tabs-content/overview-tabs-content'
import TransactionTabsContent from './detail-expenditure-fund-tabs-content/transaction-tabs-content'
import StatisticTabsContent from './detail-expenditure-fund-tabs-content/statistic-tabs-content'
import ParticipantTabsContent from './detail-expenditure-fund-tabs-content/participant-tabs-content'
import CategoryTabsContent from './detail-expenditure-fund-tabs-content/category-tabs-content'
import { useTranslation } from 'react-i18next'

export function DetailExpenditureFund({
  detailData,
  inviteTabProps,
  categoryTabProps,
  statisticProps,
  setIsDialogOpen,
  participantProps
}: IDetailExpenditureFundProps) {
  const [type, setType] = useState<ETypeOfTrackerTransactionType>(ETypeOfTrackerTransactionType.INCOMING)
  const [isCreating, setIsCreating] = useState<boolean>(false)

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
  const { t } = useTranslation(['expenditureFundDetails', 'common'])
  return (
    <>
      <div className='flex items-center justify-between text-2xl font-bold'>
        <span>{detailData.name}</span>
        <Badge
          style={{ userSelect: 'none', pointerEvents: 'none', cursor: 'none' }}
          className={getStatusColor(detailData.status)}
        >
          {detailData.status}
        </Badge>
      </div>
      <Tabs defaultValue='overview' className='h-[23rem] w-full'>
        <TabsList className='grid w-full grid-cols-5 pb-10'>
          <TabsTrigger value='overview'>{t('tabs.overview')}</TabsTrigger>
          <TabsTrigger value='participants'>{t('tabs.participants')}</TabsTrigger>
          <TabsTrigger value='categories'>{t('tabs.categories')}</TabsTrigger>
          <TabsTrigger value='transactions'>{t('tabs.transactions')}</TabsTrigger>
          <TabsTrigger value='statistics'>{t('tabs.statistics')}</TabsTrigger>
        </TabsList>
        <TabsContent value='overview' className='h-[23rem] space-y-4'>
          <OverviewTabsContent detailData={detailData} setIsDialogOpen={setIsDialogOpen} />
        </TabsContent>
        <TabsContent value='transactions' className='h-[23rem] space-y-4'>
          <TransactionTabsContent detailData={detailData} />
        </TabsContent>
        <TabsContent value='statistics' className='h-[23rem] space-y-4'>
          <StatisticTabsContent chartData={statisticProps.data ? statisticProps.data : []} />
        </TabsContent>
        <TabsContent value='participants' className='flex h-[23rem] flex-col space-y-4 overflow-hidden'>
          <ParticipantTabsContent
            detailData={detailData}
            inviteTabProps={inviteTabProps}
            participantProps={participantProps}
          />
        </TabsContent>
        <TabsContent value='categories' className='h-[23rem] space-y-4'>
          <CategoryTabsContent
            detailData={detailData}
            type={type}
            setType={setType}
            categoryTabProps={categoryTabProps}
            setIsCreating={setIsCreating}
            setIsDialogOpen={setIsDialogOpen}
            isCreating={isCreating}
          />
        </TabsContent>
      </Tabs>
    </>
  )
}
