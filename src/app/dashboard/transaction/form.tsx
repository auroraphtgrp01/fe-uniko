'use client'
import React, { useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/dashboard/DataTable'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import { formatCurrency, mergeQueryParams } from '@/libraries/utils'
import { useState } from 'react'
import { IDataTableConfig, IDialogConfig } from '@/types/common.i'
import { initTableConfig } from '@/constants/data-table'
import TransactionDialog from '@/app/dashboard/transaction/dialog'
import {
  defineOnRowClickFunction,
  handleAccountBankRefetching,
  handleRefetchPaymentCompletion,
  modifyTransactionHandler
} from '@/app/dashboard/transaction/handler'
import { IQueryOptions } from '@/types/query.interface'
import { useTransaction } from '@/core/transaction/hooks'
import { IDataTransactionTable, IDialogTransaction, IGetTransactionResponse } from '@/core/transaction/models'
import { initButtonInDataTableHeader, initDialogFlag, transactionHeaders } from './constants'
import { useAccountBank } from '@/core/account-bank/hooks'
import { IAccountBank } from '@/core/account-bank/models'
import { initQueryOptions } from '@/constants/init-query-options'
import { TRANSACTION_MODEL_KEY } from '@/core/transaction/constants'
import { useUpdateModel } from '@/hooks/useQueryModel'

export default function TransactionForm() {
  // states
  const [dataTableConfig, setDataTableConfig] = useState<IDataTableConfig>({
    ...initTableConfig,
    classNameOfScroll: 'h-[calc(100vh-35rem)]'
  })
  const [dataDetail, setDataDetail] = useState<IDataTransactionTable>()
  const [dataTable, setDataTable] = useState<IDataTransactionTable[]>([])
  const [queryOptions, setQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const [isDialogOpen, setIsDialogOpen] = useState<IDialogTransaction>(initDialogFlag)
  const [accountBankRefetching, setAccountBankRefetching] = useState<IAccountBank>()
  const [accountBankRefetchingQueue, setAccountBankRefetchingQueue] = useState<IAccountBank[]>([])
  const query = useMemo(() => [TRANSACTION_MODEL_KEY, '', mergeQueryParams(queryOptions)], [queryOptions])

  // hooks
  const { getTransactions, refetchPayment } = useTransaction()
  const { dataTransaction, isGetTransaction } = getTransactions(queryOptions)
  const { getAccountBank } = useAccountBank()
  const { dataAccountBank } = getAccountBank({ page: 1, limit: 100 })
  const { dataRefetchPayment } = refetchPayment(accountBankRefetching?.id ?? '')
  const { resetData } = useUpdateModel<IGetTransactionResponse>(query, (oldData, newData) => oldData)

  // effects
  useEffect(() => {
    if (dataTransaction) setDataTable(modifyTransactionHandler(dataTransaction))
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
      initButtonInDataTableHeader({ dataAccountBank, setAccountBankRefetchingQueue, reloadDataFunction: resetData }),
    [dataAccountBank]
  )

  const onRowClick = defineOnRowClickFunction(setDataDetail, setIsDialogOpen)

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
              <div className='text-lg font-bold sm:text-xl'>5</div>
            </div>
            <div className='flex items-center justify-between'>
              <div>Total Amount</div>
              <div className='text-xl font-bold'>{formatCurrency(1234567)}</div>
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
              <div className='text-lg font-bold sm:text-xl'>1</div>
            </div>
            <div className='flex items-center justify-between'>
              <div>Total Amount</div>
              <div className='text-xl font-bold'>{formatCurrency(220000)}</div>
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
              buttons={dataTableButtons}
            />
          </div>
        </CardContent>
        <TransactionDialog
          dataTable={{
            columns: columns,
            data: dataTable,
            onRowClick: onRowClick,
            setConfig: setDataTableConfig,
            config: dataTableConfig,
            dataDetail: dataDetail || {
              transactionId: '',
              amount: '',
              direction: '',
              accountBank: '',
              currency: '',
              accountNo: '',
              description: ''
            }
          }}
          dialogState={{
            isDialogOpen: isDialogOpen,
            setIsDialogOpen: setIsDialogOpen
          }}
        />
      </Card>
    </div>
  )
}
