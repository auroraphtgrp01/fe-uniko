import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EFundStatus, IDetailExpenditureFundProps } from '@/core/expenditure-fund/models/expenditure-fund.interface'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import OverviewTabsContent from './detail-expenditure-fund-tabs-content/overview-tabs-content'
import TransactionTabsContent from './detail-expenditure-fund-tabs-content/transaction-tabs-content'
import StatisticTabsContent from './detail-expenditure-fund-tabs-content/statistic-tabs-content'
import ParticipantTabsContent from './detail-expenditure-fund-tabs-content/participant-tabs-content'
import CategoryTabsContent from './detail-expenditure-fund-tabs-content/category-tabs-content'

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
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [titleMenu, setTitleMenu] = useState<string>('Overview')

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

  const handleMenuOpen = (event: React.MouseEvent, { title, status }: { title: string; status: boolean }) => {
    event.preventDefault()
    setIsMenuOpen(status)
    setTitleMenu(title)
  }

  return (
    <>
      <div className='flex items-center justify-between text-sm font-bold md:text-2xl'>
        <span>{detailData.name}</span>
        <Badge
          style={{ userSelect: 'none', pointerEvents: 'none', cursor: 'none' }}
          className={getStatusColor(detailData.status)}
        >
          {detailData.status}
        </Badge>
      </div>

      <Tabs defaultValue='overview' className='relative w-full sm:hidden'>
        <TabsList className='w-full'>
          <div className='relative w-full'>
            {/* Button Toggle Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='flex w-full items-center justify-between rounded-md border bg-background px-4 py-2 text-sm font-medium'
            >
              <span>{titleMenu}</span>
              <span>{isMenuOpen ? '▲' : '▼'}</span>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  className='absolute left-0 z-10 w-full max-w-md rounded-md border bg-background shadow-md'
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsTrigger
                    value='overview'
                    className='block w-full px-4 py-2 text-left focus:outline-none focus:ring focus:ring-offset-2'
                    onClick={(e) => {
                      handleMenuOpen(e, { title: 'Overview', status: false })
                    }}
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value='participants'
                    className='block w-full px-4 py-2 text-left focus:outline-none focus:ring focus:ring-offset-2'
                    onClick={(e) => {
                      handleMenuOpen(e, { title: 'Participants', status: false })
                    }}
                  >
                    Participants
                  </TabsTrigger>
                  <TabsTrigger
                    value='categories'
                    className='block w-full px-4 py-2 text-left focus:outline-none focus:ring focus:ring-offset-2'
                    onClick={(e) => {
                      handleMenuOpen(e, { title: 'Categories', status: false })
                    }}
                  >
                    Categories
                  </TabsTrigger>
                  <TabsTrigger
                    value='transactions'
                    className='block w-full px-4 py-2 text-left focus:outline-none focus:ring focus:ring-offset-2'
                    onClick={(e) => {
                      handleMenuOpen(e, { title: 'Transactions', status: false })
                    }}
                  >
                    Transactions
                  </TabsTrigger>
                  <TabsTrigger
                    value='statistics'
                    className='block w-full px-4 py-2 text-left focus:outline-none focus:ring focus:ring-offset-2'
                    onClick={(e) => {
                      handleMenuOpen(e, { title: 'Statistics', status: false })
                    }}
                  >
                    Statistics
                  </TabsTrigger>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </TabsList>

        {/* Tabs Content */}
        <TabsContent value='overview' className='space-y-6'>
          <OverviewTabsContent detailData={detailData} setIsDialogOpen={setIsDialogOpen} />
        </TabsContent>
        <TabsContent value='transactions' className='space-y-6'>
          <TransactionTabsContent detailData={detailData} />
        </TabsContent>
        <TabsContent value='statistics' className='space-y-6'>
          <StatisticTabsContent chartData={statisticProps.data ? statisticProps.data : []} />
        </TabsContent>
        <TabsContent value='participants' className='flex flex-col space-y-6 overflow-hidden'>
          <ParticipantTabsContent
            detailData={detailData}
            inviteTabProps={inviteTabProps}
            participantProps={participantProps}
          />
        </TabsContent>
        <TabsContent value='categories' className='space-y-6'>
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

      <Tabs defaultValue='overview' className='hidden h-[23rem] w-full sm:grid'>
        <TabsList className='md:text-md grid w-full grid-cols-5 pb-10 text-xs sm:text-sm'>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='participants'>Participants</TabsTrigger>
          <TabsTrigger value='categories'>Categories</TabsTrigger>
          <TabsTrigger value='transactions'>Transactions</TabsTrigger>
          <TabsTrigger value='statistics'>Statistics</TabsTrigger>
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
