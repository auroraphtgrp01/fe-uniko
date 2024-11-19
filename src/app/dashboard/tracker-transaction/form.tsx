'use client'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
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
  ExtendsJSXTrackerTransaction,
  initTrackerTransactionTab
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
  updateCacheDataDeleteFeat,
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

export default function TrackerTransactionForm() {
  // states
  const [queryOptions, setQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const [uncTableQueryOptions, setUncTableQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const [tableData, setTableData] = useState<ICustomTrackerTransaction[]>([])
  const [unclassifiedTxTableData, setUnclassifiedTxTableData] = useState<IDataTransactionTable[]>([])
  const [formDataCreateTrackerTxType, setFormDataCreateTrackerTxType] =
    useState<ITrackerTransactionTypeBody>(initTrackerTypeForm)
  const [dataTableConfig, setDataTableConfig] = useState<IDataTableConfig>(initTableConfig)
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
  // declare hooks
  const socket = useSocket()
  const { user, fundId } = useStoreLocal()
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
  const { dataUnclassifiedTxs, refetchGetUnclassifiedTxs } = getUnclassifiedTransactions({
    query: uncTableQueryOptions,
    fundId
  })
  const { getAllData: getAllAccountSourceData, refetchAllData: refetchAllAccountSourceData } =
    getAllAccountSource(fundId)
  const { getAllExpenditureFundData, refetchAllExpendingFund } = getAllExpenditureFund()
  // custom hooks
  const { resetData: resetCacheExpenditureFund } = useUpdateModel([GET_ADVANCED_EXPENDITURE_FUND_KEY], () => {})
  const { resetData: resetCacheStatisticExpenditureFund } = useUpdateModel(
    [GET_STATISTIC_EXPENDITURE_FUND_KEY],
    () => {}
  )
  const { setData: setCacheTrackerTxCreateClassify, resetData: resetCacheTrackerTx } =
    useUpdateModel<IAdvancedTrackerTransactionResponse>(
      [GET_ADVANCED_TRACKER_TRANSACTION_KEY, mergeQueryParams(queryOptions)],
      updateCacheDataCreateClassify
    )
  const { resetData: resetCacheStatistic } = useUpdateModel([STATISTIC_TRACKER_TRANSACTION_KEY], () => {})
  const { resetData: resetCacheUnclassifiedTxs } = useUpdateModel(
    [GET_UNCLASSIFIED_TRANSACTION_KEY, mergeQueryParams(uncTableQueryOptions)],
    () => {}
  )
  const { resetData: resetCacheTodayTxs } = useUpdateModel(
    [GET_TODAY_TRANSACTION_KEY, mergeQueryParams(initQueryOptions)],
    () => {}
  )
  const { setData: setCacheTrackerTxTypeCreate } = useUpdateModel<any>(
    [GET_ALL_TRACKER_TRANSACTION_TYPE_KEY],
    (oldData, newData) => {
      return { ...oldData, data: [...oldData.data, newData] }
    }
  )

  const { resetData: resetAccountSource } = useUpdateModel([GET_ADVANCED_ACCOUNT_SOURCE_KEY], () => {})
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
    getExpenditureFund: resetCacheExpenditureFund
  }
  const callBackRefetchTrackerTransactionPage = (actionMaps: TTrackerTransactionActions[]) => {
    actionMaps.forEach((action) => {
      if (actionMap[action]) {
        actionMap[action]()
      }
    })
  }

  const titles = ['Reason Name', 'Type', 'Category', 'Amount', 'Transaction Date', 'Account Source']
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
            transactionDate: formatDateTimeVN(transactionDate, false)
          }
        })
      )
    }
  }, [advancedTrackerTxData, statisticData])

  const tabConfig: ITabConfig = useMemo(() => initTrackerTransactionTab(chartData, t), [chartData, t])
  const dataTableButtons = initButtonInDataTableHeader({ setIsDialogOpen })

  // const handleFundIdChange = useCallback((value: string) => {
  //   setFundId(value)
  // }, [])

  // const extendsJSX = useMemo(
  //   () => <ExtendsJSXTrackerTransaction data={fundArr || []} setFundId={handleFundIdChange} fundId={fundId} />,
  //   [fundArr, handleFundIdChange]
  // )

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
          socket.emit('refetchTransaction', {
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
    if (socket) {
      socket.off('refetchComplete')
      socket.on('refetchComplete', (data: { message: string; status: string }) => {
        if (data.status === 'NO_NEW_TRANSACTION') {
          toast.success('No new transaction to fetch!', {
            duration: 2000,
            id: 'no-new-transaction'
          })
        } else if (data.status === 'NEW_TRANSACTION') {
          resetCacheUnclassifiedTxs()
          resetCacheStatistic()
          setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
          toast.success('Refetch transaction successfully - Found new transaction!', {
            duration: 2000,
            id: 'new-transaction-success'
          })
        } else if (data.status === 'UNAUTHORIZE') {
          // toast.error('You are not authorized to perform this action!', {
          //   duration: 2000,
          //   id: 'unauthorize'
          // })
        } else {
          toast.error('Refetch transaction failed - Please try again!', {
            duration: 2000,
            id: 'refetch-failed'
          })
        }

        setIsPendingRefetch(false)
      })

      return () => {
        socket?.off('refetchComplete')
      }
    }
  }, [socket])

  return (
    <div className='grid h-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {/* Left Section */}
      <div className='flex w-full flex-col md:col-span-2'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
          {/* Total Balance Card */}
          <Card className='bg-gradient-to-br from-indigo-500 to-blue-700 shadow-md'>
            <CardHeader className='pb-2'>
              <CardTitle className='flex items-center text-lg font-medium text-white'>
                <PcCase className='mr-2 h-5 w-5' />
                {t('totalBalance')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <div className='rounded-lg bg-white/10 p-3'>
                  <Layers2Icon className='h-8 w-8 text-white' />
                </div>
                <div className='text-right'>
                  <p className='text-2xl font-bold text-white'>
                    {formatCurrency(statisticData?.data?.totalBalance ?? 0, 'đ', 'vi-vn')}
                  </p>
                  <p className='flex items-center text-sm text-blue-100'>
                    <ArrowUpIcon className='mr-1 h-4 w-4' />
                    <span>{t('increaseFromLastMonth', { percentage: 2.5 })}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Income Card */}
          <Card className='bg-gradient-to-br from-teal-500 to-green-700 shadow-md'>
            <CardHeader className='pb-2'>
              <CardTitle className='flex items-center text-lg font-medium text-white'>
                <ArrowDownToLineIcon className='mr-2 h-5 w-5' />
                {t('incomingTransaction')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <div className='rounded-lg bg-white/10 p-3'>
                  <HandCoins className='h-8 w-8 text-white' />
                </div>
                <div className='text-right'>
                  <p className='text-2xl font-bold text-white'>
                    {formatCurrency(statisticData?.data?.totalIncomeToday ?? 0, 'đ', 'vi-vn')}
                  </p>
                  <p className='flex items-center text-sm text-emerald-100'>
                    <ArrowDownIcon className='mr-1 h-4 w-4' />
                    <span>{t('noChangeFromYesterday')}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expense Card */}
          <Card className='bg-gradient-to-br from-rose-500 to-red-700 shadow-md'>
            <CardHeader className='pb-2'>
              <CardTitle className='flex items-center text-lg font-medium text-white'>
                <CloudDownload className='mr-2 h-5 w-5' />
                {t('expenseTransaction')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <div className='rounded-lg bg-white/10 p-3'>
                  <ArrowUpIcon className='h-8 w-8 text-white' />
                </div>
                <div className='text-right'>
                  <p className='text-2xl font-bold text-white'>
                    {formatCurrency(statisticData?.data?.totalExpenseToday ?? 0, 'đ', 'vi-vn')}
                  </p>
                  <p className='flex items-center text-sm text-red-100'>
                    <ArrowUpIcon className='mr-1 h-4 w-4' />
                    <span>{t('increaseFromLastMonth', { percentage: 15 })}</span>
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
                // extendsJSX={extendsJSX}
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
      <div className='flex h-full w-full flex-col space-y-4 md:col-span-2 lg:col-span-1'>
        <div className='h-[60%]'>
          <TrackerTransactionChart tabConfig={tabConfig} statisticDateRange={{ dates, setDates }} />
        </div>
        <div className='h-[calc(40%-1rem)]'>
          <Card className='flex h-full flex-col'>
            <CardHeader className='py-4'>
              <div className='flex items-center justify-between'>
                <CardTitle>Unclassified</CardTitle>
                <div className='flex gap-2'>
                  {/* <Button
                    variant={'secondary'}
                    onClick={() => {
                      setIsDialogOpen((prev) => ({ ...prev, isDialogUnclassifiedOpen: true }))
                    }}
                  >
                    {t('common:button.classify')} <Layers2Icon className='ml-2 h-4 w-4' />
                  </Button> */}
                  <Button
                    variant={'default'}
                    className='flex items-center gap-1'
                    isLoading={isPendingRefetch}
                    onClick={refetchTransactionBySocket}
                  >
                    Refetch in bank {!isPendingRefetch && <HardDriveDownload className='ml-1 h-4 w-4' />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className='flex-1'>
              <div className='h-full w-full pb-2'>
                <FlatList
                  data={modifyFlatListData(dataUnclassifiedTxs?.data || [])}
                  onClick={(data: IFlatListData) => {
                    setDataDetailTransaction(
                      dataUnclassifiedTxs?.data.find((item) => item.id === data.id) || initEmptyDetailTransactionData
                    )
                    setIsDialogOpen((prev) => ({ ...prev, isDialogDetailTransactionOpen: true }))
                  }}
                />
              </div>
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
