'use client'
import React, { useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/dashboard/DataTable'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import { formatCurrency, mergeQueryParams } from '@/libraries/utils'
import { useState } from 'react'
import { IDataTableConfig } from '@/types/common.i'
import { initTableConfig } from '@/constants/data-table'
import TransactionDialog from '@/app/dashboard/transaction/dialog'
import {
  handleAccountBankRefetching,
  handleRefetchPaymentCompletion,
  updateCacheDataUpdate
} from '@/app/dashboard/transaction/handler'
import { IQueryOptions } from '@/types/query.interface'
import { useTransaction } from '@/core/transaction/hooks'
import {
  IClassifyTransactionFormData,
  IDataTransactionTable,
  IDialogTransaction,
  IGetTransactionResponse
} from '@/core/transaction/models'
import {
  initButtonInDataTableHeader,
  initClassifyTransactionForm,
  initDialogFlag,
  initEmptyDataTransactionTable,
  initEmptyDetailTransaction,
  transactionHeaders
} from './constants'
import { useAccountBank } from '@/core/account-bank/hooks'
import { IAccountBank } from '@/core/account-bank/models'
import { initQueryOptions } from '@/constants/init-query-options'
import { TRANSACTION_MODEL_KEY } from '@/core/transaction/constants'
import { useUpdateModel } from '@/hooks/useQueryModel'
import { useTrackerTransaction } from '@/core/tracker-transaction/hooks'
import toast from 'react-hot-toast'
import { useTrackerTransactionType } from '@/core/tracker-transaction-type/hooks'
import { initDataTableTransaction } from '../tracker-transaction/handlers'
import { TRACKER_TRANSACTION_TYPE_MODEL_KEY } from '@/core/tracker-transaction/constants'

export default function TransactionForm() {
  const queryTrackerTxType = [TRACKER_TRANSACTION_TYPE_MODEL_KEY, '', '']

  // states
  const [dataTableConfig, setDataTableConfig] = useState<IDataTableConfig>({
    ...initTableConfig,
    isVisibleSortType: false,
    classNameOfScroll: 'h-[calc(100vh-35rem)]'
  })
  const [dataDetail, setDataDetail] = useState<IDataTransactionTable>()
  const [dataTable, setDataTable] = useState<IDataTransactionTable[]>([])
  const [queryOptions, setQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const [isDialogOpen, setIsDialogOpen] = useState<IDialogTransaction>(initDialogFlag)
  const [accountBankRefetching, setAccountBankRefetching] = useState<IAccountBank>()
  const [accountBankRefetchingQueue, setAccountBankRefetchingQueue] = useState<IAccountBank[]>([])
  const [formData, setFormData] = useState<IClassifyTransactionFormData>(initClassifyTransactionForm)
  const [transactionTodayData, setTransactionTodayData] = useState<{
    totalTransaction: number
    totalAmount: number
    data: IDataTransactionTable[]
  }>(initEmptyDataTransactionTable)
  const [unclassifiedTransactionData, setUnclassifiedTransactionData] = useState<{
    totalTransaction: number
    totalAmount: number
    data: IDataTransactionTable[]
  }>(initEmptyDataTransactionTable)

  const query = useMemo(() => [TRANSACTION_MODEL_KEY, '', mergeQueryParams(queryOptions)], [queryOptions])

  // hooks
  const { classifyTransaction } = useTrackerTransaction()
  const { getAllTrackerTransactionType, createTrackerTxType } = useTrackerTransactionType()
  const { dataTrackerTransactionType } = getAllTrackerTransactionType()
  const { getTransactions, refetchPayment, getPayments } = useTransaction()
  const { dataTransaction, isGetTransaction } = getTransactions(queryOptions)
  const { getAccountBank } = useAccountBank()
  const { dataAccountBank } = getAccountBank({ page: 1, limit: 100 })
  const { dataRefetchPayment } = refetchPayment(accountBankRefetching?.id ?? '')
  const { resetData, setData } = useUpdateModel<IGetTransactionResponse>(query, updateCacheDataUpdate)
  const { setData: setCacheTrackerTxType } = useUpdateModel<any>(queryTrackerTxType, (oldData, newData) => {
    return { ...oldData, data: [...oldData.data, newData] }
  })

  // effects
  useEffect(() => {
    if (dataTransaction) {
      initDataTableTransaction(
        dataTransaction.data,
        setDataTable,
        setUnclassifiedTransactionData,
        setTransactionTodayData
      )
      setDataTableConfig((prev) => ({ ...prev, totalPage: Number(dataTransaction?.pagination?.totalPage) }))
    }
  }, [dataTransaction])
  useEffect(() => {
    setQueryOptions((prev) => ({ ...prev, page: dataTableConfig.currentPage, limit: dataTableConfig.limit }))
  }, [dataTableConfig])
  useEffect(() => {
    handleAccountBankRefetching(accountBankRefetchingQueue, accountBankRefetching, setAccountBankRefetching)
  }, [accountBankRefetchingQueue])
  useEffect(() => {
    handleRefetchPaymentCompletion({
      accountBankRefetching,
      dataRefetchPayment,
      setAccountBankRefetchingQueue,
      setAccountBankRefetching
    })
  }, [dataRefetchPayment])

  // memos
  const columns = useMemo(() => {
    if (dataTable.length === 0) return []
    return getColumns<IDataTransactionTable>(transactionHeaders, true)
  }, [dataTable])
  const dataTableButtons = useMemo(
    () =>
      initButtonInDataTableHeader({
        dataAccountBank,
        setAccountBankRefetchingQueue,
        reloadDataFunction: () => {
          resetData()
          while (!isGetTransaction) {
            if (dataTransaction?.statusCode === 200) toast.success('Reload data successfully!')
            else toast.error('Failed to get transaction !')
            break
          }
        }
      }),
    [dataAccountBank]
  )

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
              <div className='text-lg font-bold sm:text-xl'>{transactionTodayData.totalTransaction}</div>
            </div>
            <div className='flex items-center justify-between'>
              <div>Total Amount</div>
              <div className='text-xl font-bold'>
                {formatCurrency(transactionTodayData.totalAmount, 'VND', 'vi-vn')}
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
              <div className='text-lg font-bold sm:text-xl'>{unclassifiedTransactionData.totalTransaction}</div>
            </div>
            <div className='flex items-center justify-between'>
              <div>Total Amount</div>
              <div className='text-xl font-bold'>
                {formatCurrency(unclassifiedTransactionData.totalAmount, 'VND', 'vi-vn')}
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
            transactionTodayData: transactionTodayData.data,
            unclassifiedTransactionData: unclassifiedTransactionData.data,
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
            trackerTransactionType: dataTrackerTransactionType?.data ?? [],
            hookUpdateCache: setData,
            hookCreateTrackerTxType: createTrackerTxType,
            hookSetCacheTrackerTxType: setCacheTrackerTxType
          }}
        />
      </Card>
    </div>
  )
}
