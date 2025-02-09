'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/DataTable'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import { IChartData } from '@/components/core/charts/DonutChart'
import {
  ArrowDownIcon,
  ArrowDownToLineIcon,
  ArrowUpIcon,
  CloudDownload,
  HandCoins,
  HardDriveDownload,
  PcCase,
  Layers2Icon
} from 'lucide-react'
import { formatCurrency, formatDateTimeVN, getCurrentMonthDateRange, mergeQueryParams } from '@/libraries/utils'
import { IDataTableConfig } from '@/types/common.i'
import { IQueryOptions } from '@/types/query.interface'
import {
  IDateRange,
  IAdvancedTrackerTransactionResponse,
  ICustomTrackerTransaction,
  IDialogTrackerTransaction,
  ITrackerTransaction,
  IUpdateTrackerTransactionBody,
  TTrackerTransactionActions
} from '@/core/tracker-transaction/models/tracker-transaction.interface'
import {
  initButtonInDataTableHeader,
  initDialogFlag,
  initEmptyDetailTrackerTransaction,
  initTrackerTransactionTab,
  EPaymentEvents
} from './constants'
import TrackerTransactionDialog from './dialog'
import { initTableConfig } from '@/constants/data-table'
import { initQueryOptions } from '@/constants/init-query-options'
import {
  IClassifyTransactionBody,
  ICreateTrackerTransactionBody,
  IDataTransactionTable,
  IGetTransactionResponse,
  ITransaction,
  IUpdateTransactionBody
} from '@/core/transaction/models'
import { useTrackerTransaction } from '@/core/tracker-transaction/hooks'
import { useTrackerTransactionType } from '@/core/tracker-transaction-type/hooks'
import { initEmptyDetailTransactionData, initTrackerTypeForm, transactionHeaders } from '../transaction/constants'
import { useAccountSource } from '@/core/account-source/hooks'
import { useTransaction } from '@/core/transaction/hooks'
import { modifyTransactionHandler, updateCacheDataTransactionForClassify } from '../transaction/handler'
import {
  GET_ADVANCED_TRACKER_TRANSACTION_KEY,
  GET_ALL_TRACKER_TRANSACTION_TYPE_KEY,
  STATISTIC_TRACKER_TRANSACTION_KEY
} from '@/core/tracker-transaction/constants'
import { useUpdateModel } from '@/hooks/useQueryModel'
import {
  filterTrackerTransactionWithType,
  initTrackerTransactionDataTable,
  initTrackerTypeData,
  updateCacheDataCreateClassify,
  handleClassifyTransaction,
  handleCreateTrackerTxType,
  handleCreateTrackerTransaction,
  handleUpdateTrackerTxType,
  handleUpdateTrackerTransaction,
  modifyFlatListData,
  handleDeleteTrackerTransaction,
  handleDeleteMultipleTrackerTransaction,
  modifiedTrackerTypeForComboBox
} from './handlers'
import {
  GET_ADVANCED_TRANSACTION_KEY,
  GET_TODAY_TRANSACTION_KEY,
  GET_UNCLASSIFIED_TRANSACTION_KEY
} from '@/core/transaction/constants'
import {
  ITrackerTransactionType,
  ITrackerTransactionTypeBody
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import TrackerTransactionChart, { ITabConfig } from '@/components/dashboard/TrackerTransactionChart'
import { useTranslation } from 'react-i18next'
import { GET_ADVANCED_ACCOUNT_SOURCE_KEY } from '@/core/account-source/constants'
import FlatList, { IFlatListData } from '@/components/core/FlatList'
import { Button } from '@/components/ui/button'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import toast from 'react-hot-toast'
import DeleteDialog from '@/components/dashboard/DeleteDialog'
import { useSocket } from '@/libraries/useSocketIo'
import { getTimeCountRefetchLimit, setTimeCountRefetchLimit } from '@/libraries/helpers'
import { useUser } from '@/core/users/hooks'
import { EUserStatus, IUserPayloadForSocket } from '@/types/user.i'
import { useStoreLocal } from '@/hooks/useStoreLocal'
import { DetailTransactionDialog } from '@/components/dashboard/transaction/Detail'
import { useExpenditureFund } from '@/core/expenditure-fund/hooks'
import {
  GET_ADVANCED_EXPENDITURE_FUND_KEY,
  GET_STATISTIC_EXPENDITURE_FUND_KEY
} from '@/core/expenditure-fund/constants'
import { useOverviewPage } from '@/core/overview/hooks'

export default function TrackerTransactionForm() {
  // states
  const [heightDonut, setHeightDonut] = useState<string>('')
  const [queryOptions, setQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const [uncTableQueryOptions, setUncTableQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const [tableData, setTableData] = useState<ICustomTrackerTransaction[]>([])
  const [unclassifiedTxTableData, setUnclassifiedTxTableData] = useState<IDataTransactionTable[]>([])
  const [formDataCreateTrackerTxType, setFormDataCreateTrackerTxType] =
    useState<ITrackerTransactionTypeBody>(initTrackerTypeForm)
  const [dataTableConfig, setDataTableConfig] = useState<IDataTableConfig>({
    ...initTableConfig
  })
  const [dataTableUnclassifiedConfig, setDataTableUnclassifiedConfig] = useState<IDataTableConfig>({
    ...initTableConfig,
    classNameOfScroll: 'h-[calc(100vh-35rem)]'
  })
  const [isPendingRefetch, setIsPendingRefetch] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState<IDialogTrackerTransaction>(initDialogFlag)
  const [chartData, setChartData] = useState<IChartData>()
  const [dates, setDates] = useState<IDateRange>(getCurrentMonthDateRange())
  const [incomingTrackerType, setIncomingTrackerType] = useState<ITrackerTransactionType[]>([])
  const [expenseTrackerType, setExpenseTrackerType] = useState<ITrackerTransactionType[]>([])
  const [dataDetail, setDataDetail] = useState<ITrackerTransaction>(initEmptyDetailTrackerTransaction)
  const [dataDetailTransaction, setDataDetailTransaction] = useState<ITransaction>(initEmptyDetailTransactionData)
  const [typeOfTrackerType, setTypeOfTrackerType] = useState<ETypeOfTrackerTransactionType>(
    ETypeOfTrackerTransactionType.INCOMING
  )
  const [idDeletes, setIdDeletes] = useState<string[]>([])
  // hooks
  const socket = useSocket()
  const { user, fundId, checkHeightRange, viewportHeight } = useStoreLocal()
  const { getMe } = useUser()
  const { t } = useTranslation(['trackerTransaction', 'common'])
  const { isGetMeUserPending } = getMe(true)
  const { getAllAccountSource } = useAccountSource()
  const {
    getAdvancedData,
    getStatisticData,
    createTrackerTransaction,
    classifyTransaction,
    statusUpdating: statusUpdateTrackerTransaction,
    updateTrackerTransaction,
    deleteAnTrackerTransaction,
    deleteMultipleTrackerTransaction
  } = useTrackerTransaction()
  const { getStatisticOverviewPage } = useOverviewPage()
  const { refetchGetStatisticOverviewPageData } = getStatisticOverviewPage(
    {
      daysToSubtract: 90
    },
    fundId
  )
  const { getAllTrackerTransactionType, createTrackerTxType, updateTrackerTxType } = useTrackerTransactionType()
  const { getUnclassifiedTransactions, updateTransaction, statusUpdate: statusUpdateTransaction } = useTransaction()
  const { dataTrackerTransactionType, refetchTrackerTransactionType } = getAllTrackerTransactionType(fundId)
  const { statisticData } = getStatisticData(dates || {}, fundId)
  const { advancedTrackerTxData, isGetAdvancedPending } = getAdvancedData({
    query: queryOptions,
    fundId
  })
  const { getAllExpenditureFund } = useExpenditureFund()

  // fetch data
  const { dataUnclassifiedTxs } = getUnclassifiedTransactions({
    query: uncTableQueryOptions,
    fundId
  })
  const { getAllData: getAllAccountSourceData, refetchAllData: refetchAllAccountSourceData } =
    getAllAccountSource(fundId)
  const { getAllExpenditureFundData } = getAllExpenditureFund()
  // custom hooks
  const { resetData: resetCacheExpenditureFund } = useUpdateModel([GET_ADVANCED_EXPENDITURE_FUND_KEY], () => { })
  const { resetData: resetCacheStatisticExpenditureFund } = useUpdateModel(
    [GET_STATISTIC_EXPENDITURE_FUND_KEY],
    () => { }
  )
  const { resetData: resetCacheTrackerTx } = useUpdateModel<IAdvancedTrackerTransactionResponse>(
    [GET_ADVANCED_TRACKER_TRANSACTION_KEY, mergeQueryParams(queryOptions)],
    updateCacheDataCreateClassify
  )
  const { resetData: resetCacheStatistic } = useUpdateModel([STATISTIC_TRACKER_TRANSACTION_KEY], () => { })
  const { resetData: resetCacheUnclassifiedTxs } = useUpdateModel([GET_UNCLASSIFIED_TRANSACTION_KEY], () => { })
  const { resetData: resetCacheTodayTxs } = useUpdateModel(
    [GET_TODAY_TRANSACTION_KEY, mergeQueryParams(initQueryOptions)],
    () => { }
  )
  const { setData: setCacheTrackerTxTypeCreate } = useUpdateModel<any>(
    [GET_ALL_TRACKER_TRANSACTION_TYPE_KEY],
    (oldData, newData) => {
      return { ...oldData, data: [...oldData.data, newData] }
    }
  )

  const { resetData: resetAccountSource } = useUpdateModel([GET_ADVANCED_ACCOUNT_SOURCE_KEY], () => { })
  const { resetData: resetCacheTransaction } = useUpdateModel<IGetTransactionResponse>(
    [GET_ADVANCED_TRANSACTION_KEY],
    updateCacheDataTransactionForClassify
  )

  // functions
  const actionMap: Record<TTrackerTransactionActions, () => void> = {
    getTransactions: resetCacheTransaction,
    getTodayTransactions: resetCacheTodayTxs,
    getUnclassifiedTransactions: resetCacheUnclassifiedTxs,
    getAllAccountSource: resetAccountSource,
    getStatistic: resetCacheStatistic,
    getAllTrackerTransactionType: refetchTrackerTransactionType,
    getTrackerTransaction: resetCacheTrackerTx,
    getStatisticExpenditureFund: resetCacheStatisticExpenditureFund,
    getExpenditureFund: resetCacheExpenditureFund,
    getStatisticOverview: refetchGetStatisticOverviewPageData
  }
  const callBackRefetchTrackerTransactionPage = (actionMaps: TTrackerTransactionActions[]) => {
    actionMaps.forEach((action) => {
      if (actionMap[action]) {
        actionMap[action]()
      }
    })
  }

  const titles = ['Reason Name', 'Category', 'Amount', 'Transaction Date', 'Account Source']
  // memos
  const columns = useMemo(() => {
    if (tableData.length === 0) return []
    return getColumns<ICustomTrackerTransaction>({
      headers: titles,
      isSort: true
    })
  }, [tableData])
  const columnUnclassifiedTxTables = useMemo(() => {
    if (unclassifiedTxTableData.length === 0) return []
    return getColumns<IDataTransactionTable>({ headers: transactionHeaders, isSort: true })
  }, [unclassifiedTxTableData])

  // effects
  useEffect(() => {
    setUncTableQueryOptions((prev) => ({
      ...prev,
      page: dataTableUnclassifiedConfig.currentPage,
      limit: dataTableUnclassifiedConfig.limit
    }))
  }, [dataTableUnclassifiedConfig])

  useEffect(() => {
    if (dataTrackerTransactionType)
      initTrackerTypeData(dataTrackerTransactionType.data, setIncomingTrackerType, setExpenseTrackerType)
  }, [dataTrackerTransactionType])

  useEffect(() => {
    setTableData(
      filterTrackerTransactionWithType(dataTableConfig.selectedTypes || [], advancedTrackerTxData?.data || [])
    )
  }, [dataTableConfig.selectedTypes])

  useEffect(() => {
    setQueryOptions((prev) => ({ ...prev, page: dataTableConfig.currentPage, limit: dataTableConfig.limit }))
  }, [dataTableConfig])

  useEffect(() => {
    initTrackerTransactionDataTable(isGetAdvancedPending, advancedTrackerTxData, setDataTableConfig, setTableData)
  }, [isGetAdvancedPending, advancedTrackerTxData])

  useEffect(() => {
    if (dataUnclassifiedTxs) {
      setUnclassifiedTxTableData(modifyTransactionHandler(dataUnclassifiedTxs.data))
      setDataTableUnclassifiedConfig((prev) => ({
        ...prev,
        totalPage: Number(dataUnclassifiedTxs.pagination?.totalPage)
      }))
    }
  }, [dataUnclassifiedTxs])

  useEffect(() => {
    if (advancedTrackerTxData && statisticData?.data) {
      setTableData((prev) =>
        prev.map((item) => {
          const transactionDate =
            item?.transactionDate && !isNaN(new Date(item.transactionDate).getTime())
              ? item.transactionDate
              : new Date().toISOString()
          return {
            ...item,
            transactionDate: formatDateTimeVN(transactionDate, true)
          }
        })
      )
    }
  }, [advancedTrackerTxData, statisticData])

  useEffect(() => {
    if (statisticData) {
      setChartData(statisticData.data)
    }
  }, [statisticData])

  const tabConfig: ITabConfig = useMemo(() => initTrackerTransactionTab(chartData, t, heightDonut, checkHeightRange), [chartData, t, heightDonut, checkHeightRange])
  const dataTableButtons = initButtonInDataTableHeader({ setIsDialogOpen })

  const refetchTransactionBySocket = () => {
    const lastCalled = getTimeCountRefetchLimit()
    const now = Date.now()
    const timeLimit = 10000
    if (now - lastCalled >= timeLimit) {
      if (!isGetMeUserPending) {
        const userPayload: IUserPayloadForSocket = {
          userId: user?.id ?? '',
          roleId: user?.roleId ?? '',
          email: user?.email ?? '',
          fullName: user?.fullName ?? '',
          status: (user?.status as EUserStatus) ?? EUserStatus.ACTIVE,
          fundId
        }
        if (socket) {
          setTimeCountRefetchLimit()
          setIsPendingRefetch(true)
          toast.loading('Sending request... Please wait until it is completed!')
          socket.emit(EPaymentEvents.REFETCH_STARTED, {
            user: userPayload
          })
        }
      }
    } else {
      toast.error('Please wait for a while before refetching the transaction!')
      return
    }
  }

  useEffect(() => {
    if (!socket) return

    const handleRefetchComplete = (data: { messages: string; status: string }) => {
      setIsPendingRefetch(false)
      switch (data.status) {
        case 'NO_NEW_TRANSACTION':
          toast.success(`${data.messages}`, {
            duration: 2000,
            id: 'no-new-transaction'
          })
          break

        case 'NEW_TRANSACTION':
          resetCacheUnclassifiedTxs()
          resetCacheStatistic()
          setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
          toast.success(`${data.messages}`, {
            duration: 2000,
            id: 'new-transaction-success'
          })
          break

        default:
          toast.error(`${data.messages}`, {
            duration: 2000,
            id: 'refetch-failed'
          })
      }
    }

    const handleRefetchFailed = (message: string) => {
      setIsPendingRefetch(false)
      toast.error(message, {
        id: 'refetch-failed',
        duration: 2000
      })
    }

    socket.off(EPaymentEvents.REFETCH_COMPLETE)
    socket.off(EPaymentEvents.REFETCH_FAILED)

    socket.on(EPaymentEvents.REFETCH_COMPLETE, handleRefetchComplete)
    socket.on(EPaymentEvents.REFETCH_FAILED, handleRefetchFailed)

    return () => {
      socket.off(EPaymentEvents.REFETCH_COMPLETE, handleRefetchComplete)
      socket.off(EPaymentEvents.REFETCH_FAILED, handleRefetchFailed)
    }
  }, [socket])

  useEffect(() => {
    if (viewportHeight > 600 && viewportHeight <= 700) {
      setHeightDonut("h-[14.5rem]")
    } else if (viewportHeight > 700 && viewportHeight <= 800) {
      setHeightDonut("h-[18rem]")
    } else if (viewportHeight > 800 && viewportHeight <= 900) {
      setHeightDonut("h-[17rem]")
    } else {
      setHeightDonut("h-[20rem]")
    }
  }, [viewportHeight])

  return (
    <div className='grid select-none grid-cols-1 gap-4 max-[1300px]:grid-cols-1 xl:grid-cols-3'>
      {/* Left Section */}
      <div className='flex w-full h-full flex-col md:col-span-2'>
        <div className='grid grid-cols-1 gap-4 max-[1280px]:grid-cols-1 md:grid-cols-1 lg:grid-cols-3'>
          {/* Total Balance Card */}
          <Card className='group relative overflow-hidden transition-all duration-300 hover:shadow-lg'>
            <div className='absolute inset-0 bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-600 opacity-95'></div>
            <div className='absolute inset-0 bg-[url("/patterns/circuit-board.svg")] opacity-20'></div>
            <CardHeader className='relative pb-1'>
              <CardTitle className='text-md flex items-center text-nowrap text-base font-medium text-white 2xl:text-lg'>
                <PcCase className='mr-2 h-5 w-5 animate-pulse' />
                {t('totalBalance')}
              </CardTitle>
            </CardHeader>
            <CardContent className='relative pt-1'>
              <div className='flex items-center justify-between'>
                <div className='rounded-lg bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20'>
                  <Layers2Icon className='h-7 w-7 text-white' />
                </div>
                <div className='text-right'>
                  <p className='text-2xl font-bold text-white transition-all duration-300 group-hover:scale-105'>
                    {formatCurrency(statisticData?.data?.total?.totalBalance ?? 0, 'đ', 'vi-vn')}
                  </p>
                  <p className='mt-1 flex items-center text-sm text-blue-100'>
                    {statisticData?.data?.total?.rate?.[0] !== '-' || !statisticData.data.income.rate ? (
                      <ArrowUpIcon className='mr-1 h-4 w-4 animate-bounce' />
                    ) : (
                      <ArrowDownIcon className='mr-1 h-4 w-4 animate-bounce' />
                    )}
                    <span>
                      {`${statisticData?.data?.total?.rate && statisticData.data.total.rate !== 'none'
                        ? (statisticData.data.total.rate.startsWith('-') ? '' : '+') + statisticData.data.total.rate
                        : '0'
                        }% left this month`}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Income Card */}
          <Card className='group relative overflow-hidden transition-all duration-300 hover:shadow-lg'>
            <div className='absolute inset-0 bg-gradient-to-br from-teal-400 via-emerald-500 to-green-600 opacity-95'></div>
            <div className='absolute inset-0 bg-[url("/patterns/plus.svg")] opacity-20'></div>
            <CardHeader className='relative pb-1'>
              <CardTitle className='text-md flex items-center text-nowrap text-base font-medium text-white 2xl:text-lg'>
                <ArrowDownToLineIcon className='mr-2 h-5 w-5 animate-pulse' />
                {t('incomingTransaction')}
              </CardTitle>
            </CardHeader>
            <CardContent className='relative pt-1'>
              <div className='flex items-center justify-between'>
                <div className='rounded-lg bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20'>
                  <HandCoins className='h-7 w-7 text-white' />
                </div>
                <div className='text-right'>
                  <p className='text-2xl font-bold text-white transition-all duration-300 group-hover:scale-105'>
                    {formatCurrency(statisticData?.data?.income.totalIncomeToday ?? 0, 'đ', 'vi-vn')}
                  </p>
                  <p className='mt-1 flex h-[50%] items-center text-sm text-emerald-100'>
                    {statisticData?.data?.income?.rate?.[0] !== '-' || !statisticData.data.income.rate ? (
                      <ArrowUpIcon className='mr-1 h-4 w-4 animate-bounce' />
                    ) : (
                      <ArrowDownIcon className='mr-1 h-4 w-4 animate-bounce' />
                    )}
                    {(statisticData?.data?.income?.rate?.[0] === '-' ? '' : '+') +
                      (statisticData?.data?.income.rate || '0') +
                      '% from last week'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expense Card */}
          <Card className='group relative overflow-hidden transition-all duration-300 hover:shadow-lg'>
            <div className='absolute inset-0 bg-gradient-to-br from-orange-500 via-rose-500 to-red-600 opacity-95'></div>
            <div className='absolute inset-0 bg-[url("/patterns/minus.svg")] opacity-20'></div>
            <CardHeader className='relative pb-1'>
              <CardTitle className='text-md flex items-center text-nowrap text-base font-medium text-white 2xl:text-lg'>
                <CloudDownload className='mr-2 h-5 w-5 animate-pulse' />
                {t('expenseTransaction')}
              </CardTitle>
            </CardHeader>
            <CardContent className='relative pt-1'>
              <div className='flex items-center justify-between'>
                <div className='rounded-lg bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20'>
                  <ArrowUpIcon className='h-7 w-7 text-white' />
                </div>
                <div className='text-right'>
                  <p className='text-2xl font-bold text-white transition-all duration-300 group-hover:scale-105'>
                    {formatCurrency(statisticData?.data?.expense.totalExpenseToday ?? 0, 'đ', 'vi-vn')}
                  </p>
                  <p className='mt-1 flex items-center text-sm text-red-100'>
                    {statisticData?.data?.income?.rate?.[0] !== '-' || !statisticData.data.income.rate ? (
                      <ArrowUpIcon className='mr-1 h-4 w-4 animate-bounce' />
                    ) : (
                      <ArrowDownIcon className='mr-1 h-4 w-4 animate-bounce' />
                    )}
                    {/* <span>{t('notiExpense', { percentage: 15 })}</span> */}
                    {(statisticData?.data?.expense?.rate?.[0] === '-' ? '' : '+') +
                      (statisticData?.data?.expense.rate || '0') +
                      '% from last week'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* DataTable Section */}
        <div className='mt-4 flex h-full flex-1'>
          <Card className='h-full w-full'>
            <CardContent className='h-full'>
              <DataTable
                columns={columns}
                data={tableData}
                config={dataTableConfig}
                setConfig={setDataTableConfig}
                buttons={dataTableButtons}
                onRowClick={(rowData) => {
                  const find =
                    advancedTrackerTxData?.data.find((item) => item.id === rowData.id) ||
                    initEmptyDetailTrackerTransaction
                  setTypeOfTrackerType(find.Transaction?.direction as ETypeOfTrackerTransactionType)
                  setDataDetail(find)
                  setIsDialogOpen((prev) => ({ ...prev, isDialogDetailOpen: true }))
                }}
                isLoading={isGetAdvancedPending}
                onOpenDeleteAll={(ids: string[]) => {
                  setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteAllOpen: true }))
                  setIdDeletes(ids)
                }}
                onOpenDelete={(id: string) => {
                  setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteOpen: true }))
                  setIdDeletes([id])
                }}
                deleteProps={{
                  isDialogOpen: isDialogOpen.isDialogDeleteOpen,
                  onDelete: () => {
                    if (idDeletes.length > 0)
                      handleDeleteTrackerTransaction({
                        hookDelete: deleteAnTrackerTransaction,
                        id: idDeletes[0],
                        callBackOnSuccess: callBackRefetchTrackerTransactionPage,
                        setIdDeletes,
                        setIsDialogOpen,
                        setDataTableConfig
                      })
                  },
                  onOpen: (rowData: any) => {
                    setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteOpen: true }))
                    setIdDeletes((prev) => [...prev, rowData.id])
                  },
                  onClose: () => {
                    setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteOpen: false }))
                    setIdDeletes([])
                  }
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Right Section */}
      <div className='flex h-full w-full flex-col space-y-4 md:col-span-2 min-[1280px]:col-span-1'>
        <div className='h-[55%]'>
          <TrackerTransactionChart tabConfig={tabConfig} statisticDateRange={{ dates, setDates }} />
        </div>
        <div className='h-[calc(45%)]'>
          <Card className='flex h-full flex-col'>
            <CardHeader className='flex-none py-4'>
              <div className='flex flex-row items-center justify-between gap-3'>
                <CardTitle>{t('unclassifiedForm.title')}</CardTitle>
                <div className='flex flex-wrap items-center gap-2'>
                  <Button
                    variant={'secondary'}
                    className='w-full flex-1 items-center justify-center whitespace-nowrap sm:w-auto sm:flex-none'
                    onClick={() => {
                      setIsDialogOpen((prev) => ({ ...prev, isDialogUnclassifiedOpen: true }))
                    }}
                  >
                    <span className='mr-2 truncate max-[1280px]:hidden max-[420px]:hidden'>
                      {t('common:button.classify')}
                    </span>
                    <Layers2Icon className='h-4 w-4' />
                  </Button>
                  <Button
                    variant={'default'}
                    className='flex w-full flex-1 items-center justify-center gap-1 whitespace-nowrap sm:w-auto sm:flex-none'
                    isLoading={isPendingRefetch}
                    onClick={refetchTransactionBySocket}
                  >
                    <span className='mr-1 truncate max-[1580px]:hidden'>{t('unclassifiedForm.button')}</span>
                    {!isPendingRefetch && <HardDriveDownload className='h-4 w-4 shrink-0' />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            {/* className='flex-1 overflow-hidden' */}
            <CardContent >
              <FlatList
                checkHeightRange={checkHeightRange}
                data={modifyFlatListData(dataUnclassifiedTxs?.data || [])}
                onClick={(data: IFlatListData) => {
                  const item =
                    dataUnclassifiedTxs?.data.find((item) => item.id === data.id) || initEmptyDetailTransactionData
                  setDataDetailTransaction(item)
                  setTypeOfTrackerType(item.direction as ETypeOfTrackerTransactionType)
                  setIsDialogOpen((prev) => ({ ...prev, isDialogDetailTransactionOpen: true }))
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <TrackerTransactionDialog
        detailUpdateTrackerTransactionDialog={{
          handleUpdateTransaction: (
            data: IUpdateTransactionBody,
            setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
          ) => {
            updateTransaction(data)
          },
          statusUpdateTransaction,
          dataDetail,
          setDataDetail,
          handleUpdateTrackerTransaction: (
            data: IUpdateTrackerTransactionBody,
            setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
          ) =>
            handleUpdateTrackerTransaction({
              data,
              setIsEditing,
              hookUpdate: updateTrackerTransaction,
              callBackOnSuccess: callBackRefetchTrackerTransactionPage,
              setDataTableConfig,
              setIsDialogOpen,
              refetchAllAccountSourceData
            }),
          statusUpdateTrackerTransaction
        }}
        classifyTransactionDialog={{
          classifyTransaction,
          handleClassify: (data: IClassifyTransactionBody) => {
            handleClassifyTransaction({
              payload: {
                ...data,
                fundId
              },
              callBackOnSuccess: callBackRefetchTrackerTransactionPage,
              hookClassify: classifyTransaction,
              setIsDialogOpen,
              setUncDataTableConfig: setDataTableUnclassifiedConfig,
              setDataTableConfig: setDataTableConfig
            })
          }
        }}
        createTrackerTransactionDialog={{
          handleCreate: (data: ICreateTrackerTransactionBody) =>
            handleCreateTrackerTransaction({
              payload: {
                ...data,
                fundId
              },
              callbackOnSuccess: callBackRefetchTrackerTransactionPage,
              hookCreate: createTrackerTransaction,
              setIsDialogOpen: setIsDialogOpen,
              setUncDataTableConfig: setDataTableUnclassifiedConfig,
              setDataTableConfig: setDataTableConfig,
              refetchAllAccountSourceData
            })
        }}
        sharedDialogElements={{
          transactionId: dataDetailTransaction.id,
          isDialogOpen,
          setIsDialogOpen,
          incomeTrackerType: incomingTrackerType,
          expenseTrackerType: expenseTrackerType,
          hookResetCacheStatistic: resetCacheStatistic,
          handleCreateTrackerType: (
            data: ITrackerTransactionTypeBody,
            setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
          ) => {
            handleCreateTrackerTxType({
              payload: data,
              hookCreate: createTrackerTxType,
              callBackOnSuccess: callBackRefetchTrackerTransactionPage,
              setIsCreating
            })
          },
          handleUpdateTrackerType: (data: ITrackerTransactionTypeBody) => {
            handleUpdateTrackerTxType({
              payload: data,
              hookUpdate: updateTrackerTxType,
              callBackOnSuccess: callBackRefetchTrackerTransactionPage
            })
          },
          accountSourceData: getAllAccountSourceData?.data || [],
          typeOfTrackerType,
          setTypeOfTrackerType,
          expenditureFund: modifiedTrackerTypeForComboBox(getAllExpenditureFundData?.data || [])
        }}
        unclassifiedTxDialog={{
          columns: columnUnclassifiedTxTables,
          unclassifiedTxTableData,
          setTableConfig: setDataTableUnclassifiedConfig,
          tableConfig: dataTableUnclassifiedConfig
        }}
        createTrackerTransactionTypeDialog={{
          formData: formDataCreateTrackerTxType,
          setFormData: setFormDataCreateTrackerTxType,
          createTrackerTransactionType: createTrackerTxType,
          hookUpdateCache: setCacheTrackerTxTypeCreate
        }}
      />
      <DeleteDialog
        customDescription='Bạn chắc chắn muốn xóa tất cả dữ liệu này?'
        onDelete={() => {
          if (idDeletes.length > 0)
            handleDeleteMultipleTrackerTransaction({
              hookDelete: deleteMultipleTrackerTransaction,
              ids: idDeletes,
              callBackOnSuccess: callBackRefetchTrackerTransactionPage,
              setIdDeletes,
              setIsDialogOpen,
              setDataTableConfig,
              setTodayDataTableConfig: setDataTableUnclassifiedConfig,
              setUncDataTableConfig: setDataTableUnclassifiedConfig
            })
        }}
        onClose={() => {
          setIdDeletes([])
          setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteAllOpen: false }))
        }}
        isDialogOpen={isDialogOpen.isDialogDeleteAllOpen}
      />
      <DetailTransactionDialog
        detailData={dataDetailTransaction || initEmptyDetailTransactionData}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </div>
  )
}
