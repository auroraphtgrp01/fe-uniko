'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/DataTable'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import { IChartData } from '@/components/core/charts/DonutChart'
import { Icons } from '../../../components/ui/icons'
import { ArrowDownIcon, ArrowUpIcon, ArrowRight } from 'lucide-react'
import { formatCurrency, formatDateTimeVN, getConvertedKeysToTitleCase, mergeQueryParams } from '@/libraries/utils'
import { IDataTableConfig } from '@/types/common.i'
import { IQueryOptions } from '@/types/query.interface'
import {
  DateRange,
  IAdvancedTrackerTransactionResponse,
  ICustomTrackerTransaction,
  IDialogTrackerTransaction,
  ITrackerTransaction
} from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { initButtonInDataTableHeader, initDialogFlag } from './constants'
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
import { initTrackerTransactionDataTable, updateCacheDataCreate, updateCacheDataUpdate } from './handlers'
import { TRANSACTION_MODEL_KEY } from '@/core/transaction/constants'
import { DateTimePicker } from '@/components/core/DateTimePicker'
import ChartCard from '@/app/dashboard/tracker-transaction/Chartcard'

export default function TrackerTransactionForm() {
  const queryTransaction = [TRANSACTION_MODEL_KEY, '', '']
  const queryStatisticTrackerTx = [STATISTIC_TRACKER_TRANSACTION_KEY, '', '']
  const queryTrackerTxType = [TRACKER_TRANSACTION_TYPE_MODEL_KEY, '', '']

  // states
  const [fetchedData, setFetchedData] = useState<ITrackerTransaction[]>([]) // State để lưu dữ liệu đã fetch
  const [queryOptions, setQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const [tableData, setTableData] = useState<ICustomTrackerTransaction[]>([])
  const [unclassifiedTxTableData, setUnclassifiedTxTableData] = useState<IDataTransactionTable[]>([])
  const [formDataClassify, setFormDataClassify] = useState<IClassifyTransactionFormData>(initClassifyTransactionForm)
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
  const [dates, setDates] = useState<DateRange>({})

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

  // hooks
  const { getAdvancedAccountSource } = useAccountSource()
  const { getAdvancedData, getStatisticData, createTransaction } = useTrackerTransaction()
  const { getAllTrackerTransactionType, createTrackerTxType } = useTrackerTransactionType()
  const { getUnclassifiedTransactions } = useTransaction()
  const { dataTrackerTransactionType } = getAllTrackerTransactionType()
  const { statisticData } = getStatisticData(dates || {}) //--
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
    console.log('dataTableConfig.currentPage : ', dataTableConfig.currentPage)

    setQueryOptions((prev) => ({ ...prev, page: dataTableConfig.currentPage, limit: dataTableConfig.limit }))
  }, [dataTableConfig])

  useEffect(() => {
    initTrackerTransactionDataTable(
      isGetAdvancedPending,
      advancedTrackerTxData,
      setDataTableConfig,
      setFetchedData,
      setTableData
    )
  }, [isGetAdvancedPending, advancedTrackerTxData])

  useEffect(() => {
    if (dataUnclassifiedTxs) setUnclassifiedTxTableData(modifyTransactionHandler(dataUnclassifiedTxs.data))
  }, [dataUnclassifiedTxs])

  useEffect(() => {
    if (advancedTrackerTxData && statisticData?.data) {
      console.log('querioption: ', queryOptions)
      const transformedData: ICustomTrackerTransaction[] = advancedTrackerTxData.data.map((item) => {
        return {
          id: item.id,
          trackerTypeId: item.trackerTypeId ?? '',
          type: item.TrackerType?.name ?? '',
          amount: `${new Intl.NumberFormat('en-US').format(item.Transaction?.amount || 0)} ${item.Transaction?.currency}`,
          transactionDate: item.time ? formatDateTimeVN(item.time, false) : '',
          source: item.Transaction?.accountSource.name ?? ''
        }
      })
      setTableData(transformedData)
    }
  }, [advancedTrackerTxData, statisticData])

  useEffect(() => {
    if (statisticData) {
      setChartData(statisticData.data)
    }
  }, [statisticData])

  const dataTableButtons = initButtonInDataTableHeader({ setIsDialogOpen })
  const onRowClick = (rowData: ICustomTrackerTransaction) => {
    if (advancedTrackerTxData) {
      const transactionData = advancedTrackerTxData.data.find((item) => item.id === rowData.id)
      setFormDataClassify((prev) => ({
        ...prev,
        transactionId: transactionData?.transactionId || '',
        trackerTypeId: transactionData?.trackerTypeId || '',
        reasonName: transactionData?.reasonName || '',
        description: transactionData?.description || ''
      }))
      setIsDialogOpen((prev) => ({ ...prev, isDialogClassifyTransactionOpen: true }))
    }
  }

  return (
    <div>
      <div className='mb-2 flex flex-col items-center gap-4 space-y-1 md:flex-row md:space-y-0'>
        <div>
          <DateTimePicker
            value={dates.startDay ? new Date(dates.startDay) : new Date()}
            onChange={(date: Date) =>
              setDates((prev) => ({
                ...prev,
                startDay: date.toISOString().split('T')[0]
              }))
            }
            showTime={false}
          />
        </div>
        <ArrowRight className='stroke-slate-400 font-extralight' />
        <div>
          <DateTimePicker
            value={dates.endDay ? new Date(dates.endDay) : new Date()}
            onChange={(date: Date) =>
              setDates((prev) => ({
                ...prev,
                endDay: date.toISOString().split('T')[0]
              }))
            }
            showTime={false}
          />
        </div>
      </div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {/* Left Section */}

        <div className='flex w-full flex-col md:col-span-2'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
            {/* Total Spending Card */}

            <Card className='col-span-1 h-full w-full overflow-hidden sm:col-span-2 md:w-full lg:w-full xl:col-span-1'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <div className='space-y-2'>
                  <CardTitle className='text-nowrap text-sm sm:text-base lg:text-lg'>Total spending today</CardTitle>
                  <CardDescription>
                    <span className='text-nowrap text-lg font-semibold sm:text-xl lg:text-2xl'>
                      {formatCurrency(statisticData?.data.totalSpendingToday ?? 0, 'VND', 'vi-vn')}
                    </span>
                  </CardDescription>
                </div>
                <Icons.banknote className='hidden text-green-500 lg:h-8 lg:w-8 2xl:block' />
              </CardHeader>
            </Card>

            {/* Incoming vs Expense Transaction Card */}
            <Card className='col-span-1 w-full overflow-hidden sm:col-span-2 lg:w-full'>
              <div className='flex flex-col md:flex-row'>
                {/* Incoming Transaction */}
                <div className='flex-1 bg-gradient-to-br from-green-100 to-green-200 p-4 dark:from-green-700 dark:to-green-800 sm:p-6'>
                  <CardHeader className='p-0 lg:w-full'>
                    <div className='flex items-center space-x-2 text-green-600 dark:text-green-100'>
                      <ArrowDownIcon className='h-4 w-4 sm:h-5 sm:w-5' />
                      <h3 className='text-nowrap text-sm font-semibold sm:text-base lg:text-lg'>
                        Incoming Transaction
                      </h3>
                    </div>
                  </CardHeader>
                  <p className='mt-2 text-nowrap text-lg font-bold text-green-700 dark:text-green-100 sm:mt-4 sm:text-xl lg:text-2xl'>
                    {formatCurrency(statisticData?.data.totalIncomeToday ?? 0, 'VND', 'vi-vn')}
                  </p>
                </div>

                {/* Expense Transaction */}
                <div className='flex-1 bg-gradient-to-br from-rose-100 to-rose-200 p-4 dark:from-rose-700 dark:to-rose-800 sm:p-6'>
                  <CardHeader className='p-0'>
                    <div className='flex items-center space-x-2 text-rose-500 dark:text-rose-100'>
                      <ArrowUpIcon className='h-4 w-4 sm:h-5 sm:w-5' />
                      <h3 className='text-nowrap text-sm font-semibold sm:text-base lg:text-lg'>Expense Transaction</h3>
                    </div>
                  </CardHeader>
                  <p className='mt-2 text-nowrap text-lg font-bold text-rose-500 dark:text-rose-100 sm:mt-4 sm:text-xl lg:text-2xl'>
                    {formatCurrency(statisticData?.data.totalExpenseToday ?? 0, 'VND', 'vi-vn')}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* DataTable Section */}
          <div className='mt-4 flex-1'>
            <Card className='h-full w-full'>
              <CardContent>
                <DataTable
                  columns={columns}
                  data={tableData}
                  config={dataTableConfig}
                  setConfig={setDataTableConfig}
                  buttons={dataTableButtons}
                  onRowClick={onRowClick}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Section */}
        <div className='flex w-full flex-col md:col-span-2 lg:col-span-1'>
          <ChartCard
            defaultValue='incomingChart'
            incomingChartData={chartData?.incomingTransactionTypeStats ?? []}
            expenseChartData={chartData?.expenseTransactionTypeStats ?? []}
            incomingLabel='Incoming Chart'
            expenseLabel='Expense Chart'
            incomingChartHeight='h-[490px]'
            expenseChartHeight='h-[490px]'
          />

          <div className='flex items-center justify-center p-0'>
            <ChartCard
              defaultValue='incomingChart'
              incomingChartData={chartData?.incomingTransactionAccountTypeStats ?? []}
              expenseChartData={chartData?.expenseTransactionAccountTypeStats ?? []}
              incomingLabel='Income Account Chart'
              expenseLabel='Expense Account Chart'
              incomingChartHeight='h-[350px]'
              expenseChartHeight='h-[350px]'
              className='mt-4'
            />
          </div>
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
            hookResetCacheStatistic: resetCacheStatistic,
            hookCreateTrackerTxType: createTrackerTxType,
            hookSetCacheTrackerTxType: setCacheTrackerTxType
          }}
          unclassifiedTxDialog={{
            columns: columnUnclassifiedTxTables,
            unclassifiedTxTableData,
            setTableConfig: setDataTableUnclassifiedConfig,
            tableConfig: dataTableUnclassifiedConfig
          }}
        />
      </div>
    </div>
  )
}
