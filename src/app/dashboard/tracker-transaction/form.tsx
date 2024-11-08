'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/DataTable'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import { IChartData } from '@/components/core/charts/DonutChart'
import { ArrowDownIcon, ArrowUpIcon, HandCoins } from 'lucide-react'
import { formatArrayData, formatCurrency, getCurrentMonthDateRange, mergeQueryParams } from '@/libraries/utils'
import { IDataTableConfig } from '@/types/common.i'
import { IQueryOptions } from '@/types/query.interface'
import {
  IDateRange,
  IAdvancedTrackerTransactionResponse,
  ICustomTrackerTransaction,
  IDialogTrackerTransaction,
  ITrackerTransaction,
  IUpdateTrackerTransactionBody
} from '@/core/tracker-transaction/models/tracker-transaction.interface'
import {
  initButtonInDataTableHeader,
  initDialogFlag,
  initEmptyDetailTrackerTransaction,
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
  IUpdateTransactionBody
} from '@/core/transaction/models'
import { useTrackerTransaction } from '@/core/tracker-transaction/hooks'
import { useTrackerTransactionType } from '@/core/tracker-transaction-type/hooks'
import { initCreateTrackerTransactionForm, initTrackerTypeForm, transactionHeaders } from '../transaction/constants'
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
  formatTrackerTransactionData,
  initTrackerTransactionDataTable,
  initTrackerTypeData,
  updateCacheDataCreateClassify,
  handleClassifyTransaction,
  handleCreateTrackerTxType,
  handleCreateTrackerTransaction,
  handleUpdateTrackerTxType,
  handleUpdateTrackerTransaction,
  updateCacheDataDeleteFeat
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
import FlatList from '@/components/core/FlatList'
import { Button } from '@/components/ui/button'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import toast from 'react-hot-toast'
import DeleteDialog from '@/components/dashboard/DeleteDialog'

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
  const [isDialogOpen, setIsDialogOpen] = useState<IDialogTrackerTransaction>(initDialogFlag)
  const [chartData, setChartData] = useState<IChartData>()
  const [dates, setDates] = useState<IDateRange>(getCurrentMonthDateRange())
  const [incomingTrackerType, setIncomingTrackerType] = useState<ITrackerTransactionType[]>([])
  const [expenseTrackerType, setExpenseTrackerType] = useState<ITrackerTransactionType[]>([])
  const [dataDetail, setDataDetail] = useState<ITrackerTransaction>(initEmptyDetailTrackerTransaction)
  const [typeOfTrackerType, setTypeOfTrackerType] = useState<ETypeOfTrackerTransactionType>(
    ETypeOfTrackerTransactionType.INCOMING
  )
  const [idDeletes, setIdDeletes] = useState<string[]>([])

  // hooks
  const { t } = useTranslation(['trackerTransaction', 'common'])
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
  const { dataTrackerTransactionType } = getAllTrackerTransactionType()
  const { statisticData } = getStatisticData(dates || {})
  const { advancedTrackerTxData, isGetAdvancedPending } = getAdvancedData({ query: queryOptions })
  const { dataUnclassifiedTxs } = getUnclassifiedTransactions({ query: uncTableQueryOptions })
  const { getAllData: getAllAccountSourceData } = getAllAccountSource()
  const { setData: setCacheTrackerTxCreateClassify, resetData: resetCacheTrackerTx } =
    useUpdateModel<IAdvancedTrackerTransactionResponse>(
      [GET_ADVANCED_TRACKER_TRANSACTION_KEY, mergeQueryParams(queryOptions)],
      updateCacheDataCreateClassify
    )

  const { setData: setCacheTrackerTxDelete } = useUpdateModel<IAdvancedTrackerTransactionResponse>(
    [GET_ADVANCED_TRACKER_TRANSACTION_KEY, mergeQueryParams(queryOptions)],
    updateCacheDataDeleteFeat
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
  const { setData: setCacheTodayTxsDeleteFeat } = useUpdateModel(
    [GET_TODAY_TRANSACTION_KEY, mergeQueryParams(initQueryOptions)],
    updateCacheDataDeleteFeat
  )
  const { setData: setCacheTrackerTxTypeCreate } = useUpdateModel<any>(
    [GET_ALL_TRACKER_TRANSACTION_TYPE_KEY],
    (oldData, newData) => {
      return { ...oldData, data: [...oldData.data, newData] }
    }
  )
  const { setData: setCacheTrackerTxTypeUpdate } = useUpdateModel<any>(
    [GET_ALL_TRACKER_TRANSACTION_TYPE_KEY],
    (oldData: any, newData: any) => {
      const updatedData = oldData.data.map((item: any) => {
        return item.id === newData.id ? { ...item, ...newData } : item
      })
      return { ...oldData, data: updatedData }
    }
  )
  const { resetData: resetAccountSource } = useUpdateModel([GET_ADVANCED_ACCOUNT_SOURCE_KEY], () => {})
  const { resetData: resetTransaction } = useUpdateModel<IGetTransactionResponse>(
    [GET_ADVANCED_TRANSACTION_KEY],
    updateCacheDataTransactionForClassify
  )

  // memos
  const titles = ['Reason Name', 'Type', 'Tracker Type', 'Amount', 'Transaction Date', 'Account Source']

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
    if (advancedTrackerTxData && statisticData?.data)
      setTableData(
        formatArrayData<ITrackerTransaction, ICustomTrackerTransaction>(
          advancedTrackerTxData.data,
          formatTrackerTransactionData
        )
      )
  }, [advancedTrackerTxData, statisticData])

  useEffect(() => {
    if (statisticData) {
      setChartData(statisticData.data)
    }
  }, [statisticData])

  const tabConfig: ITabConfig = useMemo(() => initTrackerTransactionTab(chartData, t), [chartData, t])
  const dataTableButtons = initButtonInDataTableHeader({ setIsDialogOpen })

  return (
    <div className='grid h-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {/* Left Section */}
      <div className='flex w-full flex-col md:col-span-2'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
          <Card className='bg-gradient-to-br from-purple-500 to-indigo-600'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg font-medium text-white'>{t('totalBalance')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <HandCoins className='h-12 w-12 text-white opacity-75' />
                <div className='text-right'>
                  <p className='text-2xl font-bold text-white'>
                    {formatCurrency(statisticData?.data.totalBalance ?? 0, 'đ', 'vi-vn')}
                  </p>
                  <p className='text-sm text-purple-200'>{t('increaseFromLastMonth', { percentage: 2.5 })}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className='bg-gradient-to-br from-green-400 to-emerald-600'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg font-medium text-white'>{t('incomingTransaction')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <ArrowDownIcon className='h-12 w-12 text-white opacity-75' />
                <div className='text-right'>
                  <p className='text-2xl font-bold text-white'>
                    {formatCurrency(statisticData?.data.totalIncomeToday ?? 0, 'đ', 'vi-vn')}
                  </p>
                  <p className='text-sm text-green-200'>{t('noChangeFromYesterday')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className='bg-gradient-to-br from-red-400 to-rose-600'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg font-medium text-white'>{t('expenseTransaction')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <ArrowUpIcon className='h-12 w-12 text-white opacity-75' />
                <div className='text-right'>
                  <p className='text-2xl font-bold text-white'>
                    {formatCurrency(statisticData?.data.totalExpenseToday ?? 0, 'đ', 'vi-vn')}
                  </p>
                  <p className='text-sm text-red-200'>{t('increaseFromLastMonth', { percentage: 15 })}</p>
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
                      deleteAnTrackerTransaction(
                        { id: idDeletes[0] },
                        {
                          onSuccess: (res: any) => {
                            if (res.statusCode === 200 || res.statusCode === 201) {
                              resetCacheTodayTxs()
                              setCacheTrackerTxDelete(res.data)
                              resetCacheUnclassifiedTxs()
                              resetCacheStatistic()
                              setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
                              resetTransaction()
                              setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteOpen: false }))
                              setIdDeletes([])
                              toast.success('Delete transaction successfully')
                            }
                          }
                        }
                      )
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
        <div className='h-auto'>
          <Card>
            <CardHeader className='py-4'>
              <div className='flex items-center justify-between'>
                <CardTitle>Unclassified </CardTitle>
                <div className='flex gap-2'>
                  <Button variant={'secondary'}>Classify</Button>
                  <Button variant={'default'}>Refetch</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='h-auto'>
                <FlatList></FlatList>
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
              hookResetTransactions: resetTransaction,
              hookResetAccountSource: resetAccountSource,
              hookResetCacheStatistic: resetCacheStatistic,
              hookResetTodayTxs: resetCacheTodayTxs,
              hookResetCacheTrackerTransaction: resetCacheTrackerTx,
              setDataTableConfig,
              setIsDialogOpen
            }),
          statusUpdateTrackerTransaction
        }}
        classifyTransactionDialog={{
          classifyTransaction,
          handleClassify: (data: IClassifyTransactionBody) => {
            handleClassifyTransaction({
              payload: data,
              hookCreate: classifyTransaction,
              hookResetCacheUnclassified: resetCacheUnclassifiedTxs,
              hookResetCacheStatistic: resetCacheStatistic,
              hookSetTrackerTx: setCacheTrackerTxCreateClassify,
              hookSetCacheToday: resetCacheTodayTxs,
              hookResetCacheTransaction: resetTransaction,
              setIsDialogOpen,
              setUncDataTableConfig: setDataTableUnclassifiedConfig
            })
          }
        }}
        createTrackerTransactionDialog={{
          handleCreate: (data: ICreateTrackerTransactionBody) =>
            handleCreateTrackerTransaction({
              payload: data,
              hookCreate: createTrackerTransaction,
              setIsDialogOpen: setIsDialogOpen,
              hookResetCacheStatistic: resetCacheStatistic,
              hookResetTodayTxs: resetCacheTodayTxs,
              hookSetTransactions: setCacheTrackerTxCreateClassify,
              setUncDataTableConfig: setDataTableUnclassifiedConfig,
              setDataTableConfig: setDataTableConfig,
              resetAccountSource: resetAccountSource,
              resetTransaction: resetTransaction
            })
        }}
        sharedDialogElements={{
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
              hookUpdateCache: setCacheTrackerTxTypeCreate,
              setIsCreating
            })
          },
          handleUpdateTrackerType: (data: ITrackerTransactionTypeBody) => {
            handleUpdateTrackerTxType({
              payload: data,
              hookUpdate: updateTrackerTxType,
              hookUpdateCache: setCacheTrackerTxTypeUpdate
            })
          },
          accountSourceData: getAllAccountSourceData?.data || [],
          typeOfTrackerType,
          setTypeOfTrackerType
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
            deleteMultipleTrackerTransaction(
              { ids: idDeletes },
              {
                onSuccess: (res: any) => {
                  if (res.statusCode === 200 || res.statusCode === 201) {
                    resetCacheTrackerTx()
                    resetTransaction()
                    resetCacheUnclassifiedTxs()
                    resetCacheTodayTxs()
                    resetCacheStatistic()
                    setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
                    setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteAllOpen: false }))
                    setIdDeletes([])
                    toast.success('Delete all tracker transaction successfully')
                  }
                }
              }
            )
        }}
        onClose={() => {
          setIdDeletes([])
          setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteAllOpen: false }))
        }}
        isDialogOpen={isDialogOpen.isDialogDeleteAllOpen}
      />
    </div>
  )
}
