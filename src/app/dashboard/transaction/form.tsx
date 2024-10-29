'use client'
import React, { useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/dashboard/DataTable'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import { formatCurrency } from '@/libraries/utils'
import { useState } from 'react'
import { IDataTableConfig } from '@/types/common.i'
import { initTableConfig } from '@/constants/data-table'
import TransactionDialog from '@/app/dashboard/transaction/dialog'
import {
  handleAccountBankRefetching,
  modifyTransactionHandler,
  updateCacheDataUpdate
} from '@/app/dashboard/transaction/handler'
import { IQueryOptions } from '@/types/query.interface'
import { useTransaction } from '@/core/transaction/hooks'
import {
  IClassifyTransactionFormData,
  IDataTransactionTable,
  IDialogTransaction,
  IGetTransactionResponse,
  ITransactionSummary
} from '@/core/transaction/models'
import {
  initButtonInDataTableHeader,
  initClassifyTransactionForm,
  initDialogFlag,
  initEmptyDetailTransaction,
  initEmptyTransactionSummaryData,
  transactionHeaders
} from './constants'
import { IAccountBank } from '@/core/account-bank/models'
import { initQueryOptions } from '@/constants/init-query-options'
import { useUpdateModel } from '@/hooks/useQueryModel'
import { useTrackerTransaction } from '@/core/tracker-transaction/hooks'
import toast from 'react-hot-toast'
import { useTrackerTransactionType } from '@/core/tracker-transaction-type/hooks'
import {
  initDataTableTransaction,
  initTrackerTypeData,
  updateCacheDataClassifyFeat,
  updateCacheDataCreate as updateCacheDataClassify
} from '../tracker-transaction/handlers'
import { ITrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { useSocket } from '@/libraries/useSocketIo'
import { useStoreLocal } from '@/hooks/useStoreLocal'
import { EUserStatus, IUserPayloadForSocket } from '@/types/user.i'
import { useUser } from '@/core/users/hooks'
import { getTimeCountRefetchLimit, setTimeCountRefetchLimit } from '@/libraries/helpers'
import { GET_ADVANCED_TRANSACTION_KEY, GET_UNCLASSIFIED_TRANSACTION_KEY } from '@/core/transaction/constants'
import {
  GET_ADVANCED_TRACKER_TRANSACTION_KEY,
  GET_ALL_TRACKER_TRANSACTION_TYPE_KEY
} from '@/core/tracker-transaction/constants'
import { IAdvancedTrackerTransactionResponse } from '@/core/tracker-transaction/models/tracker-transaction.interface'

export default function TransactionForm() {
  // states
  const [dataTableConfig, setDataTableConfig] = useState<IDataTableConfig>({
    ...initTableConfig,
    isVisibleSortType: false,
    classNameOfScroll: 'h-[calc(100vh-35rem)]'
  })
  const [isPendingRefetch, setIsPendingRefetch] = useState(false)
  const [dataDetail, setDataDetail] = useState<IDataTransactionTable>()
  const [dataTable, setDataTable] = useState<IDataTransactionTable[]>([])
  const [queryOptions, setQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const [isDialogOpen, setIsDialogOpen] = useState<IDialogTransaction>(initDialogFlag)
  const [accountBankRefetching, setAccountBankRefetching] = useState<IAccountBank>()
  const [accountBankRefetchingQueue, setAccountBankRefetchingQueue] = useState<IAccountBank[]>([])
  const [formData, setFormData] = useState<IClassifyTransactionFormData>(initClassifyTransactionForm)
  const [transactionSummary, setTransactionSummary] = useState<ITransactionSummary>(initEmptyTransactionSummaryData)
  const [incomingTrackerType, setIncomingTrackerType] = useState<ITrackerTransactionType[]>([])
  const [expenseTrackerType, setExpenseTrackerType] = useState<ITrackerTransactionType[]>([])

  // hooks
  const { classifyTransaction } = useTrackerTransaction()
  const { getMe } = useUser()
  const { user } = useStoreLocal()
  const socket = useSocket()
  const { getAllTrackerTransactionType, createTrackerTxType } = useTrackerTransactionType()
  const { dataTrackerTransactionType } = getAllTrackerTransactionType()
  const { getTransactions, refetchPayment, getPayments } = useTransaction()
  const { dataTransaction, isGetTransaction } = getTransactions(queryOptions)
  const { resetData, setData } = useUpdateModel<IGetTransactionResponse>(
    GET_ADVANCED_TRANSACTION_KEY,
    updateCacheDataUpdate
  )
  const { setData: setCacheTrackerTxType } = useUpdateModel<any>(
    [GET_ALL_TRACKER_TRANSACTION_TYPE_KEY],
    (oldData, newData) => {
      return { ...oldData, data: [...oldData.data, newData] }
    }
  )
  const { setData: setCacheUnclassifiedTxs, resetData: resetCacheUnclassifiedTxs } = useUpdateModel(
    [GET_UNCLASSIFIED_TRANSACTION_KEY],
    updateCacheDataClassifyFeat
  )
  const { getUnclassifiedTransactions } = useTransaction()
  const { dataUnclassifiedTxs } = getUnclassifiedTransactions()
  const { isGetMeUserPending } = getMe(true)
  const { setData: setDataTrackerTxs } = useUpdateModel<IAdvancedTrackerTransactionResponse>(
    [GET_ADVANCED_TRACKER_TRANSACTION_KEY],
    updateCacheDataClassify
  )

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
          status: (user?.status as EUserStatus) ?? EUserStatus.ACTIVE
        }
        if (socket) {
          setTimeCountRefetchLimit()
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

  // effects
  useEffect(() => {
    if (dataUnclassifiedTxs)
      setTransactionSummary((prev) => ({
        ...prev,
        unclassifiedTransaction: {
          data: modifyTransactionHandler(dataUnclassifiedTxs.data),
          count: dataUnclassifiedTxs.data.length,
          amount: dataUnclassifiedTxs.data.reduce((acc, cur) => {
            return acc + cur.amount
          }, 0)
        }
      }))
  }, [dataUnclassifiedTxs])

  useEffect(() => {
    if (socket) {
      socket.off('refetchComplete')
      socket.on('refetchComplete', (data: { message: string; status: string }) => {
        if (data.status == 'NO_NEW_TRANSACTION') {
          toast.success('No new transaction to fetch!', {
            duration: 2000
          })
        } else if (data.status == 'NEW_TRANSACTION') {
          reloadDataFunction()
          resetCacheUnclassifiedTxs()
          toast.success('Refetch transaction successfully - Found new transaction!', {
            duration: 2000
          })
        }
        setIsPendingRefetch(false)
      })
    }
    return () => {
      socket?.off('refetchComplete')
    }
  }, [socket])

  useEffect(() => {
    if (dataTrackerTransactionType)
      initTrackerTypeData(dataTrackerTransactionType.data, setIncomingTrackerType, setExpenseTrackerType)
  }, [dataTrackerTransactionType])
  useEffect(() => {
    if (dataTransaction) {
      initDataTableTransaction(dataTransaction.data, setDataTable, setTransactionSummary)
      setDataTableConfig((prev) => ({ ...prev, totalPage: Number(dataTransaction?.pagination?.totalPage) }))
    }
  }, [dataTransaction])
  useEffect(() => {
    setQueryOptions((prev) => ({ ...prev, page: dataTableConfig.currentPage, limit: dataTableConfig.limit }))
  }, [dataTableConfig])
  useEffect(() => {
    handleAccountBankRefetching(accountBankRefetchingQueue, accountBankRefetching, setAccountBankRefetching)
  }, [accountBankRefetchingQueue])

  const reloadDataFunction = () => {
    resetData()
    while (!isGetTransaction) {
      if (dataTransaction?.statusCode === 200) toast.success('Reload data successfully!')
      else toast.error('Failed to get transaction !')
      break
    }
  }

  // memos
  const columns = useMemo(() => {
    if (dataTable.length === 0) return []
    return getColumns<IDataTransactionTable>(transactionHeaders, true)
  }, [dataTable])
  const dataTableButtons = initButtonInDataTableHeader({
    refetchTransactionBySocket,
    isPendingRefetch,
    reloadDataFunction
  })

  const onRowClick = (rowData: any) => {
    setDataDetail(rowData)
    setIsDialogOpen((prev) => ({ ...prev, isDialogDetailOpen: true }))
    setFormData((prev) => ({ ...prev, transactionId: rowData.id }))
  }

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <span>Transaction Today</span>
              <Button
                variant='outline'
                onClick={() => setIsDialogOpen((prev) => ({ ...prev, isDialogTransactionTodayOpen: true }))}
              >
                View all
              </Button>
            </CardTitle>
            <CardDescription className='text-nowrap text-xs sm:text-sm'>
              Overview of today`s transactions
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-2 p-4 text-sm sm:text-base'>
            <div className='flex items-center justify-between'>
              <div className='truncate'>Total Transactions</div>
              <div className='text-lg font-bold sm:text-xl'>{transactionSummary.transactionToday.count}</div>
            </div>
            <div className='flex items-center justify-between'>
              <div>Total Amount</div>
              <div className='text-xl font-bold'>
                {formatCurrency(transactionSummary.transactionToday.amount, 'VND', 'vi-vn')}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <span>Unclassified Transaction</span>
              <Button
                variant='outline'
                onClick={() => setIsDialogOpen((prev) => ({ ...prev, isDialogUnclassifiedTransactionOpen: true }))}
              >
                Classify
              </Button>
            </CardTitle>
            <CardDescription className='text-xs sm:text-sm'>Transactions without a tracker</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-2 p-4 text-sm sm:text-base'>
            <div className='flex items-center justify-between'>
              <div className='truncate'>Total Transactions</div>
              <div className='text-lg font-bold sm:text-xl'>{transactionSummary.unclassifiedTransaction.count}</div>
            </div>
            <div className='flex items-center justify-between'>
              <div>Total Amount</div>
              <div className='text-xl font-bold'>
                {formatCurrency(transactionSummary.unclassifiedTransaction.amount, 'VND', 'vi-vn')}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent>
          <div>
            <DataTable
              columns={columns}
              data={dataTable}
              config={dataTableConfig}
              setConfig={setDataTableConfig}
              onRowClick={onRowClick}
              isLoading={isGetTransaction}
              // isLoading={isGetTransaction}
              buttons={dataTableButtons}
            />
          </div>
        </CardContent>
        <TransactionDialog
          dataTable={{
            columns: columns,
            data: dataTable,
            transactionTodayData: transactionSummary.transactionToday.data,
            unclassifiedTransactionData: transactionSummary.unclassifiedTransaction.data,
            onRowClick: onRowClick,
            setConfig: setDataTableConfig,
            config: dataTableConfig,
            dataDetail: dataDetail || initEmptyDetailTransaction
          }}
          dialogState={{
            isDialogOpen: isDialogOpen,
            setIsDialogOpen: setIsDialogOpen
          }}
          classifyDialog={{
            formData,
            setFormData,
            classifyTransaction,
            incomeTrackerTransactionType: incomingTrackerType,
            expenseTrackerTransactionType: expenseTrackerType,
            hookUpdateCache: setData,
            hookUpdateCacheUnclassified: setCacheUnclassifiedTxs,
            hookCreateTrackerTxType: createTrackerTxType,
            hookSetCacheTrackerTxType: setCacheTrackerTxType,
            hookSetDataTrackerTxs: setDataTrackerTxs
          }}
        />
      </Card>
    </div>
  )
}
