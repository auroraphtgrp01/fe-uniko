'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/DataTable'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import { IChartData } from '@/components/core/charts/DonutChart'
import { ArrowDownIcon, ArrowUpIcon, HandCoins } from 'lucide-react'
import {
  formatArrayData,
  formatCurrency,
  formatDateTimeVN,
  getConvertedKeysToTitleCase,
  mergeQueryParams
} from '@/libraries/utils'
import { IDataTableConfig } from '@/types/common.i'
import { IQueryOptions } from '@/types/query.interface'
import {
  IDateRange,
  IAdvancedTrackerTransactionResponse,
  ICustomTrackerTransaction,
  IDialogTrackerTransaction,
  ITrackerTransaction
} from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { initButtonInDataTableHeader, initDialogFlag, initTrackerTransactionTab } from './constants'
import TrackerTransactionDialog from './dialog'
import { initTableConfig } from '@/constants/data-table'
import { initQueryOptions } from '@/constants/init-query-options'
import {
  IClassifyTransactionFormData,
  ICreateTrackerTransactionFormData,
  IDataTransactionTable
} from '@/core/transaction/models'
import { useTrackerTransaction } from '@/core/tracker-transaction/hooks'
import { useTrackerTransactionType } from '@/core/tracker-transaction-type/hooks'
import {
  initClassifyTransactionForm,
  initCreateTrackerTransactionForm,
  initCreateTrackerTxTypeForm,
  transactionHeaders
} from '../transaction/constants'
import { useAccountSource } from '@/core/account-source/hooks'
import { useTransaction } from '@/core/transaction/hooks'
import { modifyTransactionHandler } from '../transaction/handler'
import {
  STATISTIC_TRACKER_TRANSACTION_KEY,
  TRACKER_TRANSACTION_MODEL_KEY,
  TRACKER_TRANSACTION_TYPE_MODEL_KEY
} from '@/core/tracker-transaction/constants'
import { useUpdateModel } from '@/hooks/useQueryModel'
import {
  filterTrackerTransactionWithType,
  formatTrackerTransactionData,
  initTrackerTransactionDataTable,
  onRowClick,
  updateCacheDataCreate,
  updateCacheDataUpdate
} from './handlers'
import { TRANSACTION_MODEL_KEY } from '@/core/transaction/constants'
import { ITrackerTransactionTypeBody } from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import TrackerTransactionChart, { ITabConfig } from '@/components/dashboard/TrackerTransactionChart'

export default function TrackerTransactionForm() {
  const queryTransaction = [TRANSACTION_MODEL_KEY, '', '']
  const queryStatisticTrackerTx = [STATISTIC_TRACKER_TRANSACTION_KEY, '', '']
  const queryTrackerTxType = [TRACKER_TRANSACTION_TYPE_MODEL_KEY, '', '']

  // states
  const [queryOptions, setQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const [tableData, setTableData] = useState<ICustomTrackerTransaction[]>([])
  const [unclassifiedTxTableData, setUnclassifiedTxTableData] = useState<IDataTransactionTable[]>([])
  const [formDataClassify, setFormDataClassify] = useState<IClassifyTransactionFormData>(initClassifyTransactionForm)
  const [formDataCreateTrackerTxType, setFormDataCreateTrackerTxType] =
    useState<ITrackerTransactionTypeBody>(initCreateTrackerTxTypeForm)
  const [formDataCreate, setFormDataCreate] = useState<ICreateTrackerTransactionFormData>(
    initCreateTrackerTransactionForm
  )
  const [dataTableConfig, setDataTableConfig] = useState<IDataTableConfig>(initTableConfig)
  const [dataTableUnclassifiedConfig, setDataTableUnclassifiedConfig] = useState<IDataTableConfig>({
    ...initTableConfig,
    classNameOfScroll: 'h-[calc(100vh-35rem)]'
  })
  const [isDialogOpen, setIsDialogOpen] = useState<IDialogTrackerTransaction>(initDialogFlag)
  const [chartData, setChartData] = useState<IChartData>()
  const [dates, setDates] = useState<IDateRange>({})

  // memos
  const queryTrackerTransaction = useMemo(
    () => [TRACKER_TRANSACTION_MODEL_KEY, '', mergeQueryParams(queryOptions)],
    [queryOptions]
  )
  const titles = useMemo(() => getConvertedKeysToTitleCase(tableData[0]), [tableData])
  const columns = useMemo(() => {
    if (tableData.length === 0) return []
    return getColumns<ICustomTrackerTransaction>(titles, true)
  }, [tableData])
  const columnUnclassifiedTxTables = useMemo(() => {
    if (tableData.length === 0) return []
    return getColumns<IDataTransactionTable>(transactionHeaders, true)
  }, [tableData])
  const tabConfig: ITabConfig = useMemo(() => initTrackerTransactionTab(chartData), [chartData])

  // hooks
  const { getAdvancedAccountSource } = useAccountSource()
  const { getAdvancedData, getStatisticData, createTransaction } = useTrackerTransaction()
  const { getAllTrackerTransactionType, createTrackerTxType } = useTrackerTransactionType()
  const { getUnclassifiedTransactions } = useTransaction()
  const { dataTrackerTransactionType } = getAllTrackerTransactionType()
  const { statisticData } = getStatisticData(dates || {})
  const { advancedTrackerTxData, isGetAdvancedPending } = getAdvancedData({ query: queryOptions })
  const { dataUnclassifiedTxs } = getUnclassifiedTransactions()
  const { getAdvancedData: dataAdvancedAccountSource } = getAdvancedAccountSource({ query: { page: 1, limit: 10 } })
  const { classifyTransaction } = useTrackerTransaction()
  const { resetData: resetCacheTrackerTx, setData } = useUpdateModel<IAdvancedTrackerTransactionResponse>(
    queryTrackerTransaction,
    updateCacheDataCreate
  )
  const { resetData: resetCacheStatistic } = useUpdateModel<any>(queryStatisticTrackerTx, () => {})
  const { setData: setCacheUnclassifiedTxs } = useUpdateModel<any>(queryTransaction, updateCacheDataUpdate)
  const { setData: setCacheTrackerTxType } = useUpdateModel<any>(queryTrackerTxType, (oldData, newData) => {
    return { ...oldData, data: [...oldData.data, newData] }
  })

  // effects
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
    if (dataUnclassifiedTxs) setUnclassifiedTxTableData(modifyTransactionHandler(dataUnclassifiedTxs.data))
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

  const dataTableButtons = initButtonInDataTableHeader({ setIsDialogOpen })

  return (
    <div className='grid h-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {/* Left Section */}
      <div className='flex w-full flex-col md:col-span-2'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
          <Card className='bg-gradient-to-br from-purple-500 to-indigo-600'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg font-medium text-white'>Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <HandCoins className='h-12 w-12 text-white opacity-75' />
                <div className='text-right'>
                  <p className='text-2xl font-bold text-white'>
                    {formatCurrency(statisticData?.data.totalBalance ?? 0, 'VND', 'vi-vn')}
                  </p>
                  <p className='text-sm text-purple-200'>+2.5% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className='bg-gradient-to-br from-green-400 to-emerald-600'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg font-medium text-white'>Incoming Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <ArrowDownIcon className='h-12 w-12 text-white opacity-75' />
                <div className='text-right'>
                  <p className='text-2xl font-bold text-white'>
                    {formatCurrency(statisticData?.data.totalIncomeToday ?? 0, 'VND', 'vi-vn')}
                  </p>
                  <p className='text-sm text-green-200'>No change from yesterday</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className='bg-gradient-to-br from-red-400 to-rose-600'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg font-medium text-white'>Expense Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <ArrowUpIcon className='h-12 w-12 text-white opacity-75' />
                <div className='text-right'>
                  <p className='text-2xl font-bold text-white'>
                    {formatCurrency(statisticData?.data.totalExpenseToday ?? 0, 'VND', 'vi-vn')}
                  </p>
                  <p className='text-sm text-red-200'>+15% from yesterday</p>
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
                onRowClick={(rowData) =>
                  onRowClick(rowData, advancedTrackerTxData, setFormDataClassify, setIsDialogOpen)
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Section */}
      <div className='flex h-full w-full flex-col md:col-span-2 lg:col-span-1'>
        <TrackerTransactionChart tabConfig={tabConfig} statisticDateRange={{ dates, setDates }} />
      </div>

      <TrackerTransactionDialog
        classifyTransactionDialog={{
          formData: formDataClassify,
          setFormData: setFormDataClassify,
          classifyTransaction,
          hookUpdateCache: setCacheUnclassifiedTxs,
          resetCacheTrackerTx
        }}
        createTrackerTransactionDialog={{
          formData: formDataCreate,
          setFormData: setFormDataCreate,
          createTrackerTransaction: createTransaction,
          accountSourceData: dataAdvancedAccountSource?.data ?? [],
          hookUpdateCache: setData
        }}
        sharedDialogElements={{
          isDialogOpen,
          setIsDialogOpen,
          dataTrackerTransactionType: dataTrackerTransactionType?.data ?? [],
          hookResetCacheStatistic: resetCacheStatistic
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
          hookUpdateCache: setCacheTrackerTxType
        }}
      />
    </div>
  )
}
