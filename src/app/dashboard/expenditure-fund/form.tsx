'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/libraries/utils'
import FlatList, { IFlatListData } from '@/components/core/FlatList'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { DataTable } from '@/components/dashboard/DataTable'
import { initTableConfig } from '@/constants/data-table'
import DonutChart from '../../../components/core/charts/DonutChart'
import { TrendingUp, PiggyBank, CreditCard } from 'lucide-react'
import {
  ICreateExpenditureFundBody,
  IExpenditureFund,
  IExpenditureFundDataFormat,
  IExpenditureFundDialogOpen,
  IUpdateExpenditureFundBody,
  TExpenditureFundActions
} from '@/core/expenditure-fund/models/expenditure-fund.interface'
import { initButtonInHeaders, initEmptyDetailExpenditureFund, initEmptyExpenditureFundDialogOpen } from './constants'
import ExpenditureFundDialog from './dialog'
import { useExpenditureFund } from '@/core/expenditure-fund/hooks'
import {
  handleCreateExpenditureFund,
  handleDeleteAnExpenditureFund,
  handleInviteParticipant,
  handleUpdateExpenditureFund,
  initExpenditureFundDataTable
} from './handler'
import { initQueryOptions } from '@/constants/init-query-options'
import { IQueryOptions } from '@/types/query.interface'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import { ITrackerTransactionTypeBody } from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { handleCreateTrackerTxType } from '../tracker-transaction/handlers'
import { useTrackerTransactionType } from '@/core/tracker-transaction-type/hooks'
import { useUpdateModel } from '@/hooks/useQueryModel'
import { GET_ALL_TRACKER_TRANSACTION_TYPE_KEY } from '@/core/tracker-transaction/constants'

export default function ExpenditureFundForm() {
  // states
  const [isDialogOpen, setIsDialogOpen] = useState<IExpenditureFundDialogOpen>(initEmptyExpenditureFundDialogOpen)
  const [dataTableConfig, setDataTableConfig] = useState({ ...initTableConfig, isVisibleSortType: false })
  const [dataTable, setDataTable] = useState<IExpenditureFundDataFormat[]>([])
  const [queryOptions, setQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const [detailData, setDetailData] = useState<IExpenditureFund>(initEmptyDetailExpenditureFund)
  const [idDeletes, setIdDeletes] = useState<string[]>([])
  const [summaryRecentTransactions, setSummaryRecentTransactions] = useState<IFlatListData[]>([])
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([])
  const [dateRange, setDateRange] = useState<string>('1-week')

  // memos
  const titles = ['Name', 'Status', 'Current Amount', 'Owner']

  const columns = useMemo(() => {
    if (dataTable.length === 0) return []
    return getColumns<IExpenditureFundDataFormat>({
      headers: titles,
      isSort: true
    })
  }, [dataTable])

  // hooks
  const { createTrackerTxType } = useTrackerTransactionType()
  const {
    createExpenditureFund,
    statusCreate,
    getAdvancedExpenditureFund,
    updateExpenditureFund,
    statusUpdate,
    deleteAnExpenditureFund,
    statusDeleteAnExpenditureFund,
    getStatisticExpenditureFund,
    inviteParticipantToExpenditureFund,
    statusInviteParticipant,
    getStatisticDetailOfFund
  } = useExpenditureFund()
  const { advancedExpenditureFundData, isGetAdvancedPending, refetchAdvancedExpendingFund } =
    getAdvancedExpenditureFund({ query: queryOptions })
  const { getStatisticExpenditureFundData, isGetStatisticPending, refetchGetStatisticExpendingFund } =
    getStatisticExpenditureFund()
  const { refetchGetStatisticDetailOfFund, getStatisticDetailOfFundData } = getStatisticDetailOfFund(
    detailData.id,
    dateRange
  )

  const { resetData: resetCacheTrackerTxType } = useUpdateModel([GET_ALL_TRACKER_TRANSACTION_TYPE_KEY], () => {})

  const actionMap: Record<TExpenditureFundActions, () => void> = {
    getExpenditureFund: refetchAdvancedExpendingFund,
    getStatisticExpenditureFund: refetchGetStatisticExpendingFund,
    getAllTrackerTransactionType: resetCacheTrackerTxType,
    getAllStatisticDetailOfFund: refetchGetStatisticDetailOfFund
  }

  const callBackRefetchExpenditureFundPage = (actions: TExpenditureFundActions[]) => {
    actions.forEach((action) => {
      if (actionMap[action]) {
        actionMap[action]()
      }
    })
  }

  // effects
  useEffect(() => {
    if (getStatisticExpenditureFundData) {
      setChartData(
        getStatisticExpenditureFundData.data.expenditureFunds.map((item: IExpenditureFund) => ({
          name: item.name,
          value: item.currentAmount
        }))
      )
      setSummaryRecentTransactions(
        getStatisticExpenditureFundData.data.summaryRecentTransactions.map(
          (item): IFlatListData => ({
            id: item.id,
            amount: formatCurrency(item.amount, 'đ', 'vi-VN'),
            accountNo: item.ofAccount?.accountNo || 'N/A',
            direction: item.direction as ETypeOfTrackerTransactionType,
            transactionDateTime: item.transactionDateTime
          })
        )
      )
    }
  }, [getStatisticExpenditureFundData])
  useEffect(() => {
    if (advancedExpenditureFundData)
      initExpenditureFundDataTable(isGetAdvancedPending, advancedExpenditureFundData, setDataTableConfig, setDataTable)
    if (detailData !== initEmptyDetailExpenditureFund) {
      setDetailData(
        advancedExpenditureFundData?.data.find((item) => item.id === detailData.id) || initEmptyDetailExpenditureFund
      )
    }
  }, [advancedExpenditureFundData])
  useEffect(() => {
    setQueryOptions((prev) => ({ ...prev, page: dataTableConfig.currentPage, limit: dataTableConfig.limit }))
  }, [dataTableConfig])

  const buttons = initButtonInHeaders({ setIsDialogOpen })
  return (
    <div className="grid h-full grid-cols-1 gap-4">
      <div className="grid h-full grid-cols-1 gap-4 xl:col-span-2 lg:grid-cols-3">
        <div className="flex h-full w-full lg:col-span-3 xl:col-span-1 flex-col space-y-4">
          {/* Summary Recent Transactions Card */}
          <Card className="flex-shrink-0">
            <CardHeader className="py-4">
              <div className="flex items-center md:justify-center justify-between ">
                <CardTitle>Summary Recent Transactions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-auto">
                <FlatList
                  data={summaryRecentTransactions}
                  onClick={(data) => {
                    console.log('Clicked transaction:', data);
                  }}
                  isLoading={isGetStatisticPending}
                />
              </div>
            </CardContent>
          </Card>
  
          {/* Balance Summary Card */}
          <Card className="flex-1">
            <CardHeader className="py-4">
              <CardTitle>Balance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <DonutChart data={chartData} className="mt-[-2rem] h-[20rem] w-full" types="donut" />
              </div>
            </CardContent>
          </Card>
        </div>
  
        {/* Right Side Section for Transaction Summaries */}
        <div className="flex w-full flex-col lg:col-span-3 xl:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 xl:grid-cols-3">
            {/* Total Balance Summary Card */}
            <Card className="bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-white">Total Balance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <PiggyBank className="h-12 w-12 text-white opacity-75" />
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(getStatisticExpenditureFundData?.data.totalBalanceSummary || 0, 'đ', 'vi-VN')}
                    </p>
                    <p className="text-sm text-blue-100">+2.5% from last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
  
            {/* Incoming Transaction Summary Card */}
            <Card className="bg-gradient-to-br from-teal-400 via-emerald-500 to-green-600 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-white">Incoming Transaction Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <TrendingUp className="h-12 w-12 rotate-45 transform text-white opacity-75" />
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(
                        getStatisticExpenditureFundData?.data.totalAmountIncomingTransaction || 0,
                        'đ',
                        'vi-VN'
                      )}
                    </p>
                    <p className="text-sm text-emerald-100">No change from yesterday</p>
                  </div>
                </div>
              </CardContent>
            </Card>
  
            {/* Expense Transaction Summary Card */}
            <Card className="bg-gradient-to-br from-orange-400 via-pink-500 to-rose-600 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-white">Expense Transaction Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <CreditCard className="h-12 w-12 -rotate-12 transform text-white opacity-75" />
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(
                        getStatisticExpenditureFundData?.data.totalAmountExpenseTransaction || 0,
                        'đ',
                        'vi-VN'
                      )}
                    </p>
                    <p className="text-sm text-orange-100">+15% from last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='mt-4'>
          <Card className="w-full sm:w-full  md:w-full">
  <CardContent className='sm:col-span-2'>
    <div className="overflow-x-auto">  
      <DataTable
        buttons={buttons}
        columns={columns}
        data={dataTable}
        config={dataTableConfig}
        setConfig={setDataTableConfig}
        onRowClick={(data) => {
          const detail = advancedExpenditureFundData?.data.find((item) => item.id === data.id);
          if (detail) {
            setDetailData(detail);
            setIsDialogOpen((prev) => ({ ...prev, isDialogDetailOpen: true }));
          }
        }}
        onOpenDelete={(id: string) => {
          setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteOpen: true }));
          setIdDeletes([id]);
        }}
        onOpenDeleteAll={(ids: string[]) => {
          setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteAllOpen: true }));
          setIdDeletes(ids);
        }}
        deleteProps={{
          isDialogOpen: isDialogOpen.isDialogDeleteOpen,
          onDelete: () => {
            if (idDeletes.length > 0)
              handleDeleteAnExpenditureFund({
                id: idDeletes[0],
                hookDelete: deleteAnExpenditureFund,
                setIsDialogOpen,
                callBackRefetchAPI: refetchAdvancedExpendingFund,
                setDataTableConfig,
                setIdDeletes,
              });
          },
          onOpen: (rowData: any) => {
            setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteOpen: true }));
            setIdDeletes((prev) => [...prev, rowData.id]);
          },
          onClose: () => {
            setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteOpen: false }));
            setIdDeletes([]);
          },
        }}
      />
    </div>
  </CardContent>
</Card>
          </div>
        </div>
      </div>
      <ExpenditureFundDialog
        createDialog={{
          handleCreate: (data: ICreateExpenditureFundBody) => {
            handleCreateExpenditureFund({
              data,
              setIsDialogOpen,
              hookCreate: createExpenditureFund,
              callBackRefetchAPI: refetchAdvancedExpendingFund,
              setDataTableConfig
            })
          },
          status: statusCreate
        }}
        detailUpdateDialog={{
          handleUpdate: (data: IUpdateExpenditureFundBody) => {
            handleUpdateExpenditureFund({
              data,
              hookUpdate: updateExpenditureFund,
              callBackRefetchAPI: refetchAdvancedExpendingFund,
              setIsDialogOpen,
              setDetailData,
              setDataTableConfig
            })
          },
          data: detailData,
          setDetailData,
          status: statusUpdate
        }}
        commonDialogState={{ setIsDialogOpen, isDialogOpen }}
        inviteParticipantDialog={{
          handleInvite: (data: string[]) => {
            handleInviteParticipant({
              data: {
                fundId: detailData.id,
                userInfoValues: data
              },
              hookInvite: inviteParticipantToExpenditureFund,
              setIsDialogOpen,
              callBackOnSuccess: callBackRefetchExpenditureFundPage
            })
          },
          status: statusInviteParticipant
        }}
        createUpdateCategory={{
          handleCreateTrackerType: (
            data: ITrackerTransactionTypeBody,
            setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
          ) => {
            handleCreateTrackerTxType({
              payload: data,
              hookCreate: createTrackerTxType,
              callBackOnSuccess: callBackRefetchExpenditureFundPage,
              setIsCreating
            })
          },
          handleUpdateTrackerType: (data: ITrackerTransactionTypeBody) => {}
        }}
        statisticProps={{ data: getStatisticDetailOfFundData?.data || [], dateRange, setDateRange }}
      />
    </div>
  )
}
