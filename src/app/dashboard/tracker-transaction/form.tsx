'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/DataTable'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import DonutChart, { IPayloadDataChart } from '@/components/core/charts/DonutChart'
import { Icons } from '../../../components/ui/icons'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import { formatCurrency, getConvertedKeysToTitleCase, mergeQueryParams } from '@/libraries/utils'
import { IDataTableConfig } from '@/types/common.i'
import { IQueryOptions } from '@/types/query.interface'
import {
  IAdvancedTrackerTransactionResponse,
  IDialogTrackerTransaction,
  ITrackerTransaction,
  ITrackerTransactionDataFormat,
  ITrackerTransactionResponse
} from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { initButtonInDataTableHeader, initDialogFlag } from './constants'
import TrackerTransactionDialog from './dialog'
import { initTableConfig } from '@/constants/data-table'
import { initQueryOptions } from '@/constants/init-query-options'
import {
  IClassifyTransactionFormData,
  ICreateTrackerTransactionFormData,
  IDataTransactionTable,
  Transaction
} from '@/core/transaction/models'
import { useTrackerTransaction } from '@/core/tracker-transaction/hooks'
import { useTrackerTransactionType } from '@/core/tracker-transaction/tracker-transaction-type/hooks'
import {
  initClassifyTransactionForm,
  initCreateTrackerTransactionForm,
  transactionHeaders
} from '../transaction/constants'
import { useAccountSource } from '@/core/account-source/hooks'
import { useTransaction } from '@/core/transaction/hooks'
import { modifyTransactionHandler } from '../transaction/handler'
import { STATISTIC_TRACKER_TRANSACTION_KEY, TRACKER_TRANSACTION_MODEL_KEY } from '@/core/tracker-transaction/constants'
import { useUpdateModel } from '@/hooks/useQueryModel'
import { updateCacheDataCreate, updateCacheDataUpdate } from './handlers'
import { TRANSACTION_MODEL_KEY } from '@/core/transaction/constants'

export default function TrackerTransactionForm() {
  const queryTransaction = [TRANSACTION_MODEL_KEY, '', '']
  const queryStatisticTrackerTx = [STATISTIC_TRACKER_TRANSACTION_KEY, '', '']

  // states
  const [queryOptions, setQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const [tableData, setTableData] = useState<ITrackerTransaction[]>([]) // ITrackerTransactionDataFormat[]
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
  const [chartData, setChartData] = useState<IPayloadDataChart[]>([])
  const [accountChartData, setAccountChartData] = useState<IPayloadDataChart[]>([])

  // memos
  const queryTrackerTransaction = useMemo(
    () => [TRACKER_TRANSACTION_MODEL_KEY, '', mergeQueryParams(queryOptions)],
    [queryOptions]
  )
  const titles = useMemo(() => getConvertedKeysToTitleCase(tableData[0]), [tableData])
  const columns = useMemo(() => {
    if (tableData.length === 0) return []
    return getColumns<ITrackerTransaction>(titles, true) // ITrackerTransactionDataFormat
  }, [tableData])
  const columnUnclassifiedTxTables = useMemo(() => {
    if (tableData.length === 0) return []
    return getColumns<IDataTransactionTable>(transactionHeaders, true)
  }, [tableData])

  // hooks
  const { getAdvancedAccountSource } = useAccountSource()
  const { getAdvancedData, getStatisticData, createTransaction } = useTrackerTransaction()
  const { getAllTrackerTransactionType } = useTrackerTransactionType()
  const { getUnclassifiedTransactions } = useTransaction()
  const { dataTrackerTransactionType } = getAllTrackerTransactionType()
  const { statisticData } = getStatisticData()
  const { advancedTrackerTxData } = getAdvancedData({ query: queryOptions })
  const { dataUnclassifiedTxs } = getUnclassifiedTransactions()
  const { getAdvancedData: dataAdvancedAccountSource } = getAdvancedAccountSource({ query: { page: 1, limit: 10 } })
  const { classifyTransaction } = useTrackerTransaction()
  const { resetData: resetCacheTrackerTx, setData } = useUpdateModel<IAdvancedTrackerTransactionResponse>(
    queryTrackerTransaction,
    updateCacheDataCreate
  )
  const { resetData: resetCacheStatistic } = useUpdateModel<any>(queryStatisticTrackerTx, () => {})
  const { setData: setCacheUnclassifiedTxs } = useUpdateModel<any>(queryTransaction, updateCacheDataUpdate)

  // effects
  useEffect(() => {
    if (dataUnclassifiedTxs) setUnclassifiedTxTableData(modifyTransactionHandler(dataUnclassifiedTxs.data))
  }, [dataUnclassifiedTxs])

  useEffect(() => {
    if (advancedTrackerTxData) {
      setTableData(advancedTrackerTxData.data)
    }
  }, [advancedTrackerTxData])

  useEffect(() => {
    if (statisticData) {
      setChartData(statisticData.data.trackerTypeStats)
      setAccountChartData(statisticData.data.trackerAccStats)
    }
  }, [statisticData])

  const dataTableButtons = initButtonInDataTableHeader({ setIsDialogOpen })

  return (
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
                    <h3 className='text-nowrap text-sm font-semibold sm:text-base lg:text-lg'>Incoming Transaction</h3>
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
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Section */}
      <div className='flex w-full flex-col md:col-span-2 lg:col-span-1'>
        {/* DonutChart 1 */}
        <Card className='w-full'>
          <CardContent className='flex items-center justify-center'>
            <DonutChart
              data={chartData}
              className={'mt-[2%] h-[490px] w-full lg:mt-[2%] xl:h-[450px]'}
              types='nightingale'
            />
          </CardContent>
        </Card>

        {/* DonutChart 2 with Total */}
        <div className='flex items-center justify-center p-0'>
          <Card className='mt-4 w-full'>
            <DonutChart
              data={accountChartData}
              className='mb-[5%] mt-[-8%] h-[350px] w-full sm:mt-[-1%] md:h-[300px] lg:mt-[-5%] xl:h-[300px]'
              types='donut'
            />
            {/* <div className='h-full ms-[-60px]'>
                <div>Total: 1.000.000 VND</div>
              </div> */}
          </Card>
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
          hookResetCacheStatistic: resetCacheStatistic
        }}
        unclassifiedTxDialog={{
          columns: columnUnclassifiedTxTables,
          unclassifiedTxTableData,
          setTableConfig: setDataTableUnclassifiedConfig,
          tableConfig: dataTableUnclassifiedConfig
        }}
      />
    </div>
  )
}
