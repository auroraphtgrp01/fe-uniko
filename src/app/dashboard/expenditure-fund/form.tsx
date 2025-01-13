'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, translate } from '@/libraries/utils'
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
  handleDeleteMultipleExpenditureFund,
  handleDeleteParticipant,
  handleInviteParticipant,
  handleUpdateExpenditureFund,
  initExpenditureFundDataTable
} from './handler'
import { initQueryOptions } from '@/constants/init-query-options'
import { IQueryOptions } from '@/types/query.interface'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import { ITrackerTransactionTypeBody } from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import {
  handleCreateTrackerTxType,
  handleUpdateTrackerTxType,
  modifiedTrackerTypeForComboBox
} from '../tracker-transaction/handlers'
import { useTrackerTransactionType } from '@/core/tracker-transaction-type/hooks'
import { useUpdateModel } from '@/hooks/useQueryModel'
import {
  GET_ADVANCED_TRACKER_TRANSACTION_KEY,
  GET_ALL_TRACKER_TRANSACTION_TYPE_KEY
} from '@/core/tracker-transaction/constants'
import { useStoreLocal } from '@/hooks/useStoreLocal'
import { IFundOfUser } from '@/core/tracker-transaction/models/tracker-transaction.interface'
import { IDataTableConfig } from '@/types/common.i'
import { useTranslation } from 'react-i18next'
import DeleteDialog from '@/components/dashboard/DeleteDialog'

export default function ExpenditureFundForm() {
  // states
  const [isDialogOpen, setIsDialogOpen] = useState<IExpenditureFundDialogOpen>(initEmptyExpenditureFundDialogOpen)
  const [dataTableConfig, setDataTableConfig] = useState<IDataTableConfig>({
    ...initTableConfig,
    isVisibleSortType: false
  })
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
  const { fundId, setCheckHeightRange, checkHeightRange } = useStoreLocal()
  const { createTrackerTxType, updateTrackerTxType } = useTrackerTransactionType()
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
    getStatisticDetailOfFund,
    deleteAnParticipant,
    getAllExpenditureFund,
    deleteMultipleExpenditureFund
  } = useExpenditureFund()
  const { advancedExpenditureFundData, isGetAdvancedPending, refetchAdvancedExpendingFund } =
    getAdvancedExpenditureFund({ query: queryOptions })
  const { getStatisticExpenditureFundData, isGetStatisticPending, refetchGetStatisticExpendingFund } =
    getStatisticExpenditureFund()
  const { refetchGetStatisticDetailOfFund, getStatisticDetailOfFundData } = getStatisticDetailOfFund(
    detailData.id,
    dateRange
  )
  const { getAllExpenditureFundData, refetchAllExpendingFund } = getAllExpenditureFund()
  const { setFundArr } = useStoreLocal()

  useEffect(() => {
    if (getAllExpenditureFundData && getAllExpenditureFundData.data) {
      setFundArr(
        getAllExpenditureFundData.data.map(
          (fund): IFundOfUser => ({
            id: fund.id,
            name: fund.name,
            description: fund.description,
            status: fund.status,
            currentAmount: fund.currentAmount.toString(),
            currency: fund.currency
          })
        )
      )
    }
  }, [getAllExpenditureFundData])

  const { resetData: resetCacheTrackerTxType } = useUpdateModel([GET_ADVANCED_TRACKER_TRANSACTION_KEY], () => { })

  const actionMap: Record<TExpenditureFundActions, () => void> = {
    getExpenditureFund: refetchAdvancedExpendingFund,
    getStatisticExpenditureFund: refetchGetStatisticExpendingFund,
    getAllTrackerTransactionType: resetCacheTrackerTxType,
    getAllStatisticDetailOfFund: refetchGetStatisticDetailOfFund,
    getAllExpendingFund: refetchAllExpendingFund
  }

  const callBackRefetchExpenditureFundPage = (actions: TExpenditureFundActions[]) => {
    actions.forEach((action) => {
      if (actionMap[action]) {
        actionMap[action]()
      }
    })
  }
  const { t } = useTranslation(['expenditureFund', 'common'])

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
    <div className='grid h-full w-full grid-cols-1 gap-4'>
      <div className='grid h-full grid-cols-1 gap-4 md:col-span-2 md:w-full md:flex-1 md:flex-col lg:grid-cols-3'>
        <div className='order-2 flex h-full w-full flex-1 flex-col space-y-4 lg:order-none'>
          <Card className='flex-shrink-0'>
            <CardHeader className='py-4'>
              <div className='flex w-full items-center justify-between'>
                <CardTitle>{t('summaryRecentTransactions')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <FlatList data={summaryRecentTransactions} isLoading={isGetStatisticPending} />
              </div>
            </CardContent>
          </Card>

          <Card className='flex-1'>
            <CardHeader className='mb-5 py-4'>
              <CardTitle>{t('balanceSummary')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex h-auto w-full justify-center'>
                <DonutChart data={chartData} checkHeightRange={checkHeightRange} className={` w-full max-w-[50rem] ${checkHeightRange ? 'h-[15rem]' : 'h-[19rem]'}`} types='donut' />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className='order-1 flex h-full w-full flex-1 flex-col lg:order-none lg:col-span-2'>
          <div className='grid w-full grid-cols-1 gap-4 max-[1280px]:grid-cols-1 md:grid-cols-1 lg:grid-cols-3'>
            <Card className='group relative overflow-hidden bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 transition-all duration-300 hover:shadow-lg'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-md text-nowrap font-medium text-white 2xl:text-lg'>
                  {t('totalBalanceSummary')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-between'>
                  <PiggyBank className='h-12 w-12 animate-pulse text-white opacity-75' />
                  <div className='text-right'>
                    <p className='text-2xl font-bold text-white'>
                      {formatCurrency(getStatisticExpenditureFundData?.data.totalBalanceSummary || 0, 'đ', 'vi-VN')}
                    </p>
                    <p className='text-sm text-blue-100'>{t('notiTotalBalanceSummary', { percentage: 2.5 })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='group relative overflow-hidden bg-gradient-to-br from-teal-400 via-emerald-500 to-green-600 transition-all duration-300 hover:shadow-lg'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-md text-nowrap font-medium text-white 2xl:text-lg'>
                  {t('incomingTransactionSummary')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-between'>
                  <TrendingUp className='h-12 w-12 rotate-45 transform animate-pulse text-white opacity-75' />
                  <div className='text-right'>
                    <p className='text-2xl font-bold text-white'>
                      {formatCurrency(
                        getStatisticExpenditureFundData?.data.totalAmountIncomingTransaction || 0,
                        'đ',
                        'vi-VN'
                      )}
                    </p>
                    <p className='text-sm text-emerald-100'>
                      {t('notiIncomingTransactionSummary', { percentage: 2.5 })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='group relative overflow-hidden bg-gradient-to-br from-orange-400 via-pink-500 to-rose-600 transition-all duration-300 hover:shadow-lg'>
              <CardHeader className='pb-2'>
                <CardTitle className='text-md text-nowrap font-medium text-white 2xl:text-lg'>
                  {t('expenseTransactionSummary')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-between'>
                  <CreditCard className='h-12 w-12 -rotate-12 transform animate-pulse text-white opacity-75' />
                  <div className='text-right'>
                    <p className='text-2xl font-bold text-white'>
                      {formatCurrency(
                        getStatisticExpenditureFundData?.data.totalAmountExpenseTransaction || 0,
                        'đ',
                        'vi-VN'
                      )}
                    </p>
                    <p className='text-sm text-orange-100'>{t('notiExpenseTransactionSummary', { percentage: 2.5 })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* DataTable moved here */}
          <div className='mt-4 flex h-full flex-1'>
            <Card className='h-full w-full'>
              <CardContent className='h-full'>
                <DataTable
                  buttons={buttons}
                  columns={columns}
                  data={dataTable}
                  config={dataTableConfig}
                  setConfig={setDataTableConfig}
                  onRowClick={(data) => {
                    const detail = advancedExpenditureFundData?.data.find((item) => item.id === data.id)
                    if (detail) {
                      setDetailData(detail)
                      setIsDialogOpen((prev) => ({ ...prev, isDialogDetailOpen: true }))
                    }
                  }}
                  onOpenDelete={(id: string) => {
                    setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteOpen: true }))
                    setIdDeletes([id])
                  }}
                  onOpenDeleteAll={(ids: string[]) => {
                    setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteAllOpen: true }))
                    setIdDeletes(ids)
                  }}
                  deleteProps={{
                    isDialogOpen: isDialogOpen.isDialogDeleteOpen,
                    onDelete: () => {
                      if (idDeletes.length > 0)
                        handleDeleteAnExpenditureFund({
                          id: idDeletes[0],
                          hookDelete: deleteAnExpenditureFund,
                          setIsDialogOpen,
                          callBackRefetchAPI: callBackRefetchExpenditureFundPage,
                          setDataTableConfig,
                          setIdDeletes,
                          fundId
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
      </div>
      <ExpenditureFundDialog
        createDialog={{
          handleCreate: (data: ICreateExpenditureFundBody) => {
            handleCreateExpenditureFund({
              data,
              setIsDialogOpen,
              hookCreate: createExpenditureFund,
              callBackRefetchAPI: callBackRefetchExpenditureFundPage,
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
              callBackRefetchAPI: callBackRefetchExpenditureFundPage,
              setIsDialogOpen,
              setDetailData,
              setDataTableConfig
            })
          },
          data: detailData,
          setDetailData,
          status: statusUpdate,
          handleDeleteParticipant: (id: string) => {
            handleDeleteParticipant({
              callBackOnSuccess: callBackRefetchExpenditureFundPage,
              hookDelete: deleteAnParticipant,
              setIsDialogOpen,
              id
            })
          }
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
          handleUpdateTrackerType: (data: ITrackerTransactionTypeBody) => {
            handleUpdateTrackerTxType({
              payload: data,
              hookUpdate: updateTrackerTxType,
              callBackOnSuccess: callBackRefetchExpenditureFundPage
            })
          },
          expenditureFund: modifiedTrackerTypeForComboBox(getAllExpenditureFundData?.data || [])
        }}
        statisticProps={{ data: getStatisticDetailOfFundData?.data || [], dateRange, setDateRange }}
      />
      <DeleteDialog
        customDescription='Bạn chắc chắn muốn xóa tất cả dữ liệu này?'
        onDelete={() => {
          if (idDeletes.length > 0)
            handleDeleteMultipleExpenditureFund({
              ids: idDeletes,
              setDataTableConfig,
              setIsDialogOpen,
              hookDelete: deleteMultipleExpenditureFund,
              setIdDeletes,
              callBackRefetchAPI: callBackRefetchExpenditureFundPage,
              fundId
            })
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
