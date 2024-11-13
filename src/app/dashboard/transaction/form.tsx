'use client'
import React, { useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/dashboard/DataTable'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import { formatCurrency, mergeQueryParams, replaceParams } from '@/libraries/utils'
import { useState } from 'react'
import { IDataTableConfig } from '@/types/common.i'
import { initTableConfig } from '@/constants/data-table'
import TransactionDialog from '@/app/dashboard/transaction/dialog'
import {
  handleAccountBankRefetching,
  handleDeleteMultipleTransaction,
  handleDeleteTransaction,
  handleUpdateTransaction,
  modifyTransactionHandler,
  updateCacheDataTransactionForClassify,
  updateCacheDataTransactionForDelete,
  updateCacheDataTransactionForUpdate
} from '@/app/dashboard/transaction/handler'
import { IQueryOptions } from '@/types/query.interface'
import { useTransaction } from '@/core/transaction/hooks'
import {
  IClassifyTransactionBody,
  IDataTransactionTable,
  IDialogTransaction,
  IGetTransactionResponse,
  ITransaction,
  ITransactionSummary,
  IUpdateTransactionBody,
  TTransactionActions
} from '@/core/transaction/models'
import {
  initButtonInDataTableHeader,
  initEmptyDetailTransactionData,
  initDialogFlag,
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
  initTrackerTypeData,
  updateCacheDataClassifyFeat,
  handleClassifyTransaction,
  handleCreateTrackerTxType,
  updateCacheDataTodayTxClassifyFeat
} from '../tracker-transaction/handlers'
import {
  ITrackerTransactionType,
  ITrackerTransactionTypeBody
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { useSocket } from '@/libraries/useSocketIo'
import { useStoreLocal } from '@/hooks/useStoreLocal'
import { EUserStatus, IUserPayloadForSocket } from '@/types/user.i'
import { useUser } from '@/core/users/hooks'
import { getTimeCountRefetchLimit, setTimeCountRefetchLimit } from '@/libraries/helpers'
import {
  GET_ADVANCED_TRANSACTION_KEY,
  GET_TODAY_TRANSACTION_KEY,
  GET_UNCLASSIFIED_TRANSACTION_KEY
} from '@/core/transaction/constants'
import {
  GET_ADVANCED_TRACKER_TRANSACTION_KEY,
  GET_ALL_TRACKER_TRANSACTION_TYPE_KEY,
  STATISTIC_TRACKER_TRANSACTION_KEY
} from '@/core/tracker-transaction/constants'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { useTranslation } from 'react-i18next'
import { useAccountSource } from '@/core/account-source/hooks'
import { GET_ADVANCED_ACCOUNT_SOURCE_KEY } from '@/core/account-source/constants'
import DeleteDialog from '@/components/dashboard/DeleteDialog'

export default function TransactionForm() {
  // states
  const [idDeletes, setIdDeletes] = useState<string[]>([])
  const [typeOfTrackerType, setTypeOfTrackerType] = useState<ETypeOfTrackerTransactionType>(
    ETypeOfTrackerTransactionType.INCOMING
  )
  const [dataTableConfig, setDataTableConfig] = useState<IDataTableConfig>({
    ...initTableConfig,
    isVisibleSortType: false,
    classNameOfScroll: 'h-[calc(100vh-35rem)]'
  })
  const [uncDataTableConfig, setUncDataTableConfig] = useState<IDataTableConfig>({
    ...initTableConfig,
    isVisibleSortType: false,
    classNameOfScroll: 'h-[calc(100vh-35rem)]'
  })
  const [todayDataTableConfig, setTodayDataTableConfig] = useState<IDataTableConfig>({
    ...initTableConfig,
    isVisibleSortType: false,
    classNameOfScroll: 'h-[calc(100vh-35rem)]'
  })
  const [isPendingRefetch, setIsPendingRefetch] = useState(false)
  const [dataDetail, setDataDetail] = useState<ITransaction>(initEmptyDetailTransactionData)
  const [dataTable, setDataTable] = useState<IDataTransactionTable[]>([])
  const [queryOptions, setQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const [uncTableQueryOptions, setUncTableQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const [todayTableQueryOptions, setTodayTableQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const [isDialogOpen, setIsDialogOpen] = useState<IDialogTransaction>(initDialogFlag)
  const [accountBankRefetching, setAccountBankRefetching] = useState<IAccountBank>()
  const [accountBankRefetchingQueue, setAccountBankRefetchingQueue] = useState<IAccountBank[]>([])
  const [transactionSummary, setTransactionSummary] = useState<ITransactionSummary>(initEmptyTransactionSummaryData)
  const [incomingTrackerType, setIncomingTrackerType] = useState<ITrackerTransactionType[]>([])
  const [expenseTrackerType, setExpenseTrackerType] = useState<ITrackerTransactionType[]>([])

  // hooks
  // declare hooks
  const { t } = useTranslation(['transaction'])
  const {
    getTransactions,
    getUnclassifiedTransactions,
    getTodayTransactions,
    updateTransaction,
    statusUpdate,
    deleteAnTransaction,
    deleteMultipleTransaction
  } = useTransaction()
  const { getAllAccountSource } = useAccountSource()
  const { classifyTransaction } = useTrackerTransaction()
  const { getAllTrackerTransactionType, createTrackerTxType } = useTrackerTransactionType()
  const { user, fundId } = useStoreLocal()
  const { getMe } = useUser()
  const socket = useSocket()

  // fetch data
  const { getAllData: accountSourceData } = getAllAccountSource(fundId)
  const { dataTrackerTransactionType } = getAllTrackerTransactionType(fundId)
  const { dataTransaction, isGetTransaction } = getTransactions({ query: queryOptions, fundId })
  const { dataUnclassifiedTxs } = getUnclassifiedTransactions({
    query: uncTableQueryOptions,
    fundId
  })
  const { dataTodayTxs } = getTodayTransactions({ query: todayTableQueryOptions, fundId })
  const { isGetMeUserPending } = getMe(true)

  // custom hooks
  const { resetData: resetCacheTransaction } = useUpdateModel<IGetTransactionResponse>(
    [GET_ADVANCED_TRANSACTION_KEY, mergeQueryParams(queryOptions)],
    updateCacheDataTransactionForUpdate
  )
  const { resetData: resetCacheTrackerTxType } = useUpdateModel<any>(
    [GET_ALL_TRACKER_TRANSACTION_TYPE_KEY],
    (oldData, newData) => {
      return { ...oldData, data: [...oldData.data, newData] }
    }
  )
  const { resetData: resetCacheUnclassifiedTxs } = useUpdateModel(
    [GET_UNCLASSIFIED_TRANSACTION_KEY, mergeQueryParams(uncTableQueryOptions)],
    updateCacheDataClassifyFeat
  )
  const { resetData: resetCacheStatistic } = useUpdateModel([STATISTIC_TRACKER_TRANSACTION_KEY], () => {})
  const { resetData: resetCacheAccountSource } = useUpdateModel([GET_ADVANCED_ACCOUNT_SOURCE_KEY], () => {})
  const { resetData: resetCacheDataTrackerTx } = useUpdateModel([GET_ADVANCED_TRACKER_TRANSACTION_KEY], () => {})
  const { resetData: resetCacheTodayTx } = useUpdateModel(
    [GET_TODAY_TRANSACTION_KEY, mergeQueryParams(todayTableQueryOptions)],
    updateCacheDataTodayTxClassifyFeat
  )

  const actionMap: Record<TTransactionActions, () => void> = {
    getTransactions: resetCacheTransaction,
    getTodayTransactions: resetCacheTodayTx,
    getUnclassifiedTransactions: resetCacheUnclassifiedTxs,
    getAllAccountSource: resetCacheAccountSource,
    getStatistic: resetCacheStatistic,
    getAllTrackerTransactionType: resetCacheTrackerTxType,
    getTrackerTransaction: resetCacheDataTrackerTx
  }

  const callBackRefetchTransactionPage = (actions: TTransactionActions[]) => {
    actions.forEach((action) => {
      if (actionMap[action]) {
        actionMap[action]()
      }
    })
  }

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
    if (dataUnclassifiedTxs) {
      setTransactionSummary((prev) => ({
        ...prev,
        unclassifiedTransaction: {
          data: modifyTransactionHandler(dataUnclassifiedTxs.data),
          count: dataUnclassifiedTxs.data.length,
          incomeAmount: dataUnclassifiedTxs.data
            .filter((e) => e.direction === ETypeOfTrackerTransactionType.INCOMING)
            .reduce((acc, cur) => {
              return acc + cur.amount
            }, 0),
          expenseAmount: dataUnclassifiedTxs.data
            .filter((e) => e.direction === ETypeOfTrackerTransactionType.EXPENSE)
            .reduce((acc, cur) => {
              return acc + cur.amount
            }, 0)
        }
      }))
      setUncDataTableConfig((prev) => ({ ...prev, totalPage: Number(dataUnclassifiedTxs.pagination?.totalPage) }))
    }
  }, [dataUnclassifiedTxs])

  useEffect(() => {
    if (dataTodayTxs) {
      setTransactionSummary((prev) => ({
        ...prev,
        transactionToday: {
          data: modifyTransactionHandler(dataTodayTxs.data),
          count: dataTodayTxs.data.length,
          incomeAmount: dataTodayTxs.data
            .filter((e) => e.direction === ETypeOfTrackerTransactionType.INCOMING)
            .reduce((acc, cur) => {
              return acc + cur.amount
            }, 0),
          expenseAmount: dataTodayTxs.data
            .filter((e) => e.direction === ETypeOfTrackerTransactionType.EXPENSE)
            .reduce((acc, cur) => {
              return acc + cur.amount
            }, 0)
        }
      }))
      setTodayDataTableConfig((prev) => ({ ...prev, totalPage: Number(dataTodayTxs.pagination?.totalPage) }))
    }
  }, [dataTodayTxs])

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
          resetCacheStatistic()
          resetCacheTodayTx()
          resetCacheAccountSource()
          setUncDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
          setTodayDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
          setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
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
      setDataTable(modifyTransactionHandler(dataTransaction.data))
      setDataTableConfig((prev) => ({ ...prev, totalPage: Number(dataTransaction?.pagination?.totalPage) }))
    }
  }, [dataTransaction])
  useEffect(() => {
    setQueryOptions((prev) => ({ ...prev, page: dataTableConfig.currentPage, limit: dataTableConfig.limit }))
  }, [dataTableConfig])
  useEffect(() => {
    setUncTableQueryOptions((prev) => ({
      ...prev,
      page: uncDataTableConfig.currentPage,
      limit: uncDataTableConfig.limit
    }))
  }, [uncDataTableConfig])
  useEffect(() => {
    setTodayTableQueryOptions((prev) => ({
      ...prev,
      page: todayDataTableConfig.currentPage,
      limit: todayDataTableConfig.limit
    }))
  }, [todayDataTableConfig])
  useEffect(() => {
    // set today data here
  }, [todayDataTableConfig])
  useEffect(() => {
    handleAccountBankRefetching(accountBankRefetchingQueue, accountBankRefetching, setAccountBankRefetching)
  }, [accountBankRefetchingQueue])

  const reloadDataFunction = () => {
    callBackRefetchTransactionPage([
      'getTransactions',
      'getTodayTransactions',
      'getUnclassifiedTransactions',
      'getAllAccountSource',
      'getStatistic'
    ])
    while (!isGetTransaction) {
      if (dataTransaction?.statusCode === 200) toast.success('Reload data successfully!')
      else toast.error('Failed to get transaction !')
      break
    }
  }

  // memos

  const columns = useMemo(() => {
    if (dataTable.length === 0) return []
    return getColumns<IDataTransactionTable>({
      headers: transactionHeaders,
      isSort: true
    })
  }, [dataTable])
  const dataTableButtons = initButtonInDataTableHeader({
    refetchTransactionBySocket,
    isPendingRefetch,
    reloadDataFunction
  })

  const deleteAnTransactionProps = {
    isDialogOpen: isDialogOpen.isDialogDeleteOpen,
    onDelete: () => {
      if (idDeletes.length > 0)
        handleDeleteTransaction({
          id: idDeletes[0],
          hookDelete: deleteAnTransaction,
          callBackOnSuccess: callBackRefetchTransactionPage,
          setDataTableConfig,
          setIsDialogOpen,
          setUncDataTableConfig,
          setTodayDataTableConfig,
          setIdDeletes
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
  }

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <span>{t('transactionToday')}</span>
              <Button
                variant='outline'
                onClick={() => setIsDialogOpen((prev) => ({ ...prev, isDialogTransactionTodayOpen: true }))}
              >
                {t('viewAll')}
              </Button>
            </CardTitle>
            <CardDescription className='text-nowrap text-xs sm:text-sm'>
              {t('transactionTodayDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className='grid gap-2 p-4 text-sm sm:text-base'>
            <div className='flex items-center justify-between'>
              <div className='truncate'>{t('totalTransactions')}</div>
              <div className='text-lg font-bold sm:text-xl'>{transactionSummary.transactionToday.count}</div>
            </div>
            <div className='flex items-center justify-between'>
              <div>Total Income Amount</div>
              <div className='text-xl font-bold'>
                {formatCurrency(transactionSummary.transactionToday.incomeAmount, 'đ', 'vi-vn')}
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <div>Total Expense Amount</div>
              <div className='text-xl font-bold'>
                {formatCurrency(transactionSummary.transactionToday.expenseAmount, 'đ', 'vi-vn')}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <span>{t('unclassifiedTransaction')}</span>
              <Button
                variant='outline'
                onClick={() => setIsDialogOpen((prev) => ({ ...prev, isDialogUnclassifiedTransactionOpen: true }))}
              >
                {t('classify')}
              </Button>
            </CardTitle>
            <CardDescription className='text-xs sm:text-sm'>{t('unclassifiedTransactionDescription')}</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-2 p-4 text-sm sm:text-base'>
            <div className='flex items-center justify-between'>
              <div className='truncate'>{t('totalTransactions')}</div>
              <div className='text-lg font-bold sm:text-xl'>{transactionSummary.unclassifiedTransaction.count}</div>
            </div>
            <div className='flex items-center justify-between'>
              <div>Total Income Amount</div>
              <div className='text-xl font-bold'>
                {formatCurrency(transactionSummary.unclassifiedTransaction.incomeAmount, 'đ', 'vi-vn')}
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <div>Total Expense Amount</div>
              <div className='text-xl font-bold'>
                {formatCurrency(transactionSummary.unclassifiedTransaction.expenseAmount, 'đ', 'vi-vn')}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent>
          <div>
            <DataTable
              key={'transactionTable'}
              columns={columns}
              data={dataTable}
              config={dataTableConfig}
              setConfig={setDataTableConfig}
              onRowClick={(rowData) => {
                setTypeOfTrackerType(rowData.direction as ETypeOfTrackerTransactionType)
                setDataDetail(dataTransaction?.data.find((e) => e.id === rowData.id) || initEmptyDetailTransactionData)
                setIsDialogOpen((prev) => ({ ...prev, isDialogDetailOpen: true }))
              }}
              isLoading={isGetTransaction}
              buttons={dataTableButtons}
              onOpenDeleteAll={(ids: string[]) => {
                setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteAllOpen: true }))
                setIdDeletes(ids)
              }}
              onOpenDelete={(id: string) => {
                setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteOpen: true }))
                setIdDeletes([id])
              }}
              deleteProps={deleteAnTransactionProps}
            />
          </div>
        </CardContent>
        <TransactionDialog
          dataTable={{
            columns,
            advancedData: dataTransaction?.data || [],
            transactionTodayData: transactionSummary.transactionToday.data,
            unclassifiedTransactionData: transactionSummary.unclassifiedTransaction.data,
            setConfig: setDataTableConfig,
            config: dataTableConfig,
            setUncConfig: setUncDataTableConfig,
            uncConfig: uncDataTableConfig,
            setTodayConfig: setTodayDataTableConfig,
            todayConfig: todayDataTableConfig
          }}
          dialogDetailUpdate={{
            dataDetail,
            setDataDetail,
            accountSourceData: accountSourceData?.data ?? [],
            handleUpdate: (data: IUpdateTransactionBody, setIsEditing: React.Dispatch<React.SetStateAction<boolean>>) =>
              handleUpdateTransaction({
                data,
                setIsEditing,
                hookUpdate: updateTransaction,
                setDataTableConfig: setDataTableConfig,
                setDetailDialog: setDataDetail,
                callBackOnSuccess: callBackRefetchTransactionPage
              }),
            statusUpdateTransaction: statusUpdate
          }}
          dialogState={{
            isDialogOpen: isDialogOpen,
            setIsDialogOpen: setIsDialogOpen
          }}
          classifyDialog={{
            incomeTrackerTransactionType: incomingTrackerType,
            expenseTrackerTransactionType: expenseTrackerType,
            handleClassify: (
              data: IClassifyTransactionBody,
              setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
            ) => {
              handleClassifyTransaction({
                payload: { ...data, fundId },
                hookClassify: classifyTransaction,
                setUncDataTableConfig: setUncDataTableConfig,
                setTodayDataTableConfig: setTodayDataTableConfig,
                setDataTableConfig: setDataTableConfig,
                setIsDialogOpen: setIsDialogOpen,
                setIsEditing,
                callBackOnSuccess: callBackRefetchTransactionPage
              })
            },
            typeOfTrackerType,
            setTypeOfTrackerType
          }}
          dialogEditTrackerType={{
            handleCreateTrackerType: (
              data: ITrackerTransactionTypeBody,
              setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
            ) => {
              handleCreateTrackerTxType({
                payload: data,
                hookCreate: createTrackerTxType,
                callBackOnSuccess: callBackRefetchTransactionPage,
                setIsCreating
              })
            },
            handleUpdateTrackerType: (data: ITrackerTransactionTypeBody) => {}
          }}
          deleteProps={{
            deleteAnTransactionProps
          }}
        />
      </Card>
      <DeleteDialog
        customDescription='Bạn chắc chắn muốn xóa tất cả dữ liệu này?'
        onDelete={() => {
          if (idDeletes.length > 0)
            handleDeleteMultipleTransaction({
              ids: idDeletes,
              hookDelete: deleteMultipleTransaction,
              callBackOnSuccess: callBackRefetchTransactionPage,
              setDataTableConfig,
              setIsDialogOpen,
              setUncDataTableConfig,
              setTodayDataTableConfig,
              setIdDeletes
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
