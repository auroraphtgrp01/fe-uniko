import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EFundStatus, IDetailExpenditureFundProps } from '@/core/expenditure-fund/models/expenditure-fund.interface'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import OverviewTabsContent from './detail-expenditure-fund-tabs-content/overview-tabs-content'
import TransactionTabsContent from './detail-expenditure-fund-tabs-content/transaction-tabs-content'
import StatisticTabsContent from './detail-expenditure-fund-tabs-content/statistic-tabs-content'
import ParticipantTabsContent from './detail-expenditure-fund-tabs-content/participant-tabs-content'
import CategoryTabsContent from './detail-expenditure-fund-tabs-content/category-tabs-content'
import { ChevronDown, ChevronUp, LayoutDashboard, Users, Tags, Receipt, BarChart3 } from 'lucide-react'

// Add variants for stagger animation
const menuVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.07,
      duration: 0.2
    }
  },
  closed: {
    opacity: 0,
    y: -10,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
}

const itemVariants = {
  open: {
    opacity: 1,
    y: 0
  },
  closed: {
    opacity: 0,
    y: -10
  }
}

// Add menu items array
const menuItems = [
  {
    value: 'overview',
    title: 'Overview',
    icon: LayoutDashboard
  },
  {
    value: 'participants',
    title: 'Participants',
    icon: Users
  },
  {
    value: 'categories',
    title: 'Categories',
    icon: Tags
  },
  {
    value: 'transactions',
    title: 'Transactions',
    icon: Receipt
  },
  {
    value: 'statistics',
    title: 'Statistics',
    icon: BarChart3
  }
]
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
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [titleMenu, setTitleMenu] = useState<string>('Overview')

  // Add ref
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Add click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  const handleMenuOpen = (event: React.MouseEvent, { title, status }: { title: string; status: boolean }) => {
    event.preventDefault()
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
        <TabsList className='w-full !px-0'>
          <div className='relative w-full' ref={dropdownRef}>
            {/* Button Toggle Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='flex w-full items-center justify-between rounded-md border bg-background px-4 py-2 text-sm font-medium'
            >
              <span>{titleMenu}</span>
              {isMenuOpen ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  className='absolute left-0 z-10 mt-2 w-full max-w-md divide-y divide-border overflow-hidden rounded-md border bg-background/95 px-2 shadow-lg backdrop-blur-sm'
                  variants={menuVariants}
                  initial='closed'
                  animate='open'
                  exit='closed'
                >
                  {menuItems.map((item) => (
                    <motion.div key={item.value} variants={itemVariants}>
                      <TabsTrigger
                        value={item.value}
                        className='group mt-2 flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted focus:outline-none'
                        onClick={(e) => {
                          handleMenuOpen(e, { title: item.title, status: false })
                          setIsMenuOpen(false)
                        }}
                      >
                        <item.icon className='h-4 w-4 transition-transform group-hover:scale-110' />
                        <span>{item.title}</span>
                      </TabsTrigger>
                    </motion.div>
                  ))}
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
