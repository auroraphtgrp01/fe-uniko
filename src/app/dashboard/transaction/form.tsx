'use client'
import React, { use, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/dashboard/DataTable'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import { formatCurrency } from '@/libraries/utils'
import { useState } from 'react'
import { IDataTableConfig, IDialogConfig } from '@/types/common.i'
import { initTableConfig } from '@/constants/data-table'
import TransactionDialog from '@/app/dashboard/transaction/dialog'
import { transactionHeaders } from '@/app/dashboard/transaction/constants'
import { IDataTransactionTable, modifyTransactionHandler } from '@/app/dashboard/transaction/handler'
import { IQueryOptions } from '@/types/query.interface'
import { useTransaction } from '@/core/transaction/hooks'

export default function TransactionForm() {
  const [dataTableConfig, setDataTableConfig] = useState<IDataTableConfig>({
    ...initTableConfig,
    classNameOfScroll: 'h-[calc(100vh-35rem)]'
  })

  const [dataDetail, setDataDetail] = useState<IDataTransactionTable>()

  const [dataTable, setDataTable] = useState<IDataTransactionTable[]>()

  const [queryOptions, setQueryOptions] = useState<IQueryOptions>({
    page: dataTableConfig.currentPage,
    limit: dataTableConfig.limit
  })

  const { getTransactions } = useTransaction()
  const { dataTransaction, isGetTransaction } = getTransactions(queryOptions)

  useEffect(() => {
    if (dataTransaction) {
      setDataTable(modifyTransactionHandler(dataTransaction))
    }
  }, [dataTransaction])

  const [isDialogOpen, setIsDialogOpen] = useState({
    isDialogDetailOpen: false,
    isDialogTransactionTodayOpen: false,
    isDialogUnclassifiedTransactionOpen: false
  })

  const columns = getColumns(transactionHeaders, true)

  const onRowClick = (rowData: any) => {
    setDataDetail(rowData)
    setIsDialogOpen((prev) => ({ ...prev, isDialogDetailOpen: true }))
  }

  useEffect(() => {
    setQueryOptions((prev) => ({ ...prev, page: dataTableConfig.currentPage, limit: dataTableConfig.limit }))
  }, [dataTableConfig])

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
              data={dataTable || []}
              config={dataTableConfig}
              setConfig={setDataTableConfig}
              onRowClick={onRowClick}
              isLoading={isGetTransaction}
            />
          </div>
        </CardContent>
        <TransactionDialog
          dataTable={{
            columns: columns,
            data: dataTable || [],
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
