'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/DataTable'

import React, { useEffect, useMemo, useState } from 'react'
import { IDataTableConfig } from '@/types/common.i'
import { IQueryOptions } from '@/types/query.interface'
import {
  gradientClasses,
  initAccountSourceFormData,
  initButtonInDataTableHeader,
  initDialogFlag,
  initEmptyDetailAccountSource
} from '@/app/dashboard/account-source/constants'
import {
  handleShowDetailAccountSource,
  initDataTable,
  onRowClick,
  updateCacheDataCreate,
  updateCacheDataUpdate
} from '@/app/dashboard/account-source/handler'
import { initTableConfig } from '@/constants/data-table'
import { useAccountSource } from '@/core/account-source/hooks'
import { formatCurrency, getConvertedKeysToTitleCase, getTypes, mergeQueryParams } from '@/libraries/utils'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import {
  IAccountSource,
  IAccountSourceBody,
  IAccountSourceDataFormat,
  IAdvancedAccountSourceResponse,
  IDialogAccountSource
} from '@/core/account-source/models'
import { initQueryOptions } from '@/constants/init-query-options'
import { useUpdateModel } from '@/hooks/useQueryModel'
import AccountSourceDialog from '@/app/dashboard/account-source/dialog'
import { useStoreLocal } from '@/hooks/useStoreLocal'
import { GET_ADVANCED_ACCOUNT_SOURCE_KEY, GET_ALL_ACCOUNT_SOURCE_KEY } from '@/core/account-source/constants'
import { useTranslation } from 'react-i18next'
import { STATISTIC_TRACKER_TRANSACTION_KEY } from '@/core/tracker-transaction/constants'
import toast from 'react-hot-toast'
import DeleteDialog from '@/components/dashboard/DeleteDialog'
import { useTrackerTransaction } from '@/core/tracker-transaction/hooks'
import {
  ArrowUpRight,
  BadgeCent,
  ChevronRight,
  CreditCard,
  Landmark,
  PiggyBank,
  Plus,
  TrendingUp,
  Wallet,
  WalletMinimal
} from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { Button } from '@/components/ui/button'
import { Progress } from '@radix-ui/react-progress'
import DonutChart from '@/components/core/charts/DonutChart'

export default function AccountSourceForm() {
  const { t } = useTranslation(['common'])
  // States
  const [dataDetail, setDataDetail] = useState<IAccountSourceDataFormat>(initEmptyDetailAccountSource)
  const [dataTableConfig, setDataTableConfig] = useState<IDataTableConfig>(initTableConfig)
  const [idDeletes, setIdDeletes] = useState<string[]>([])
  const [idRowClicked, setIdRowClicked] = useState<string>('')
  const [queryOptions, setQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const [tableData, setTableData] = useState<IAccountSourceDataFormat[]>([])
  const [formData, setFormData] = useState<IAccountSourceBody>(initAccountSourceFormData)
  const [isDialogOpen, setIsDialogOpen] = useState<IDialogAccountSource>(initDialogFlag)

  const refetchPage = () => {
    refetchGetAdvanced()
    resetAccountSource()
    resetDataUpdate()
  }

  // Hooks
  const {
    createAccountSource,
    updateAccountSource,
    getAdvancedAccountSource,
    deleteAnAccountSource,
    deleteMultipleAccountSource
  } = useAccountSource()
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([])
  const { getStatisticData } = useTrackerTransaction()
  const { setAccountSourceData, accountSourceData, fundId } = useStoreLocal()
  const { getAdvancedData, refetchGetAdvanced } = getAdvancedAccountSource({ query: queryOptions, fundId })
  const { setData: setDataCreate, resetData: resetAccountSource } = useUpdateModel<IAdvancedAccountSourceResponse>(
    [GET_ADVANCED_ACCOUNT_SOURCE_KEY, mergeQueryParams(queryOptions), fundId],
    updateCacheDataCreate
  )
  const { setData: setDataUpdate, resetData: resetDataUpdate } = useUpdateModel<IAdvancedAccountSourceResponse>(
    [GET_ADVANCED_ACCOUNT_SOURCE_KEY, mergeQueryParams(queryOptions), fundId],
    updateCacheDataUpdate
  )
  const { resetData: resetCacheStatistic } = useUpdateModel([STATISTIC_TRACKER_TRANSACTION_KEY], () => {})
  const { resetData: resetCacheGetAllAccount } = useUpdateModel([GET_ALL_ACCOUNT_SOURCE_KEY], () => {})

  // Memos
  const titles = useMemo(() => getConvertedKeysToTitleCase(tableData[0]), [tableData])
  const columns = useMemo(() => {
    if (tableData.length === 0) return []
    return getColumns<IAccountSourceDataFormat>({
      headers: titles,
      isSort: true
    })
  }, [tableData])

  // Effects
  useEffect(() => {
    if (getAdvancedData) {
      const data = getAdvancedData.data.map((item) => item)
      setAccountSourceData(data)
      setDataTableConfig((prev) => ({
        ...prev,
        types: getTypes(accountSourceData, 'type'),
        totalPage: Number(getAdvancedData.pagination?.totalPage)
      }))
    }
  }, [getAdvancedData])

  useEffect(() => {
    initDataTable(setTableData, accountSourceData)
  }, [accountSourceData])

  useEffect(() => {
    if (tableData !== undefined && idRowClicked !== '') {
      const getDetailAccountSource = tableData.find((row) => row.id === idRowClicked)
      handleShowDetailAccountSource(setFormData, setIsDialogOpen, getDetailAccountSource)
    }
  }, [tableData, idRowClicked])

  useEffect(() => {
    setQueryOptions((prev) => ({ ...prev, page: dataTableConfig.currentPage, limit: dataTableConfig.limit }))
  }, [dataTableConfig])

  // Other components
  const dataTableButtons = initButtonInDataTableHeader({ setIsDialogOpen })
  const totalBalance = tableData.reduce(
    (sum, account) => sum + parseFloat(account.currentAmount.replace(/[^0-9.-]+/g, '')),
    0
  )
  const totalWallet = tableData
    .filter((account) => account.checkType === 'WALLET')
    .reduce((sum, account) => sum + parseFloat(account.currentAmount.replace(/[^0-9.-]+/g, '')), 0)

  const totalBanking = tableData
    .filter((account) => account.checkType === 'BANKING')
    .reduce((sum, account) => sum + parseFloat(account.currentAmount.replace(/[^0-9.-]+/g, '')), 0)

  useEffect(() => {
    if (getAdvancedData) {
      setChartData(
        getAdvancedData?.data.map((item: IAccountSource) => ({
          name: item.name,
          value: item.currentAmount
        }))
      )
    }
  }, [getAdvancedData])
  return (
    <div className='w-full space-y-8 rounded-lg bg-gradient-to-br shadow-xl sm:grid'>
      <div className='sm grid grid-cols-2 gap-6 sm:mt-0 lg:order-none lg:grid-cols-4'>
        <Card className='transition-shadow duration-300 hover:shadow-xl'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Accounts</CardTitle>
            <Wallet className='h-4 w-4 text-blue-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{tableData.length}</div>
            <Progress value={(tableData.length / 100) * 100} className='mt-2' />
            <p className='mt-2 text-xs text-gray-500'>Total number of accounts being tracked</p>
          </CardContent>
        </Card>
        <Card className='transition-shadow duration-300 hover:shadow-xl'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Banking</CardTitle>
            <Landmark className='h-4 w-4 text-red-400' />
          </CardHeader>
          <CardContent>
            <div className='block w-[300px] items-center overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-bold'>
              {formatCurrency(totalBanking, 'VND')}
            </div>
            <Progress value={(totalBalance / 1000000) * 100} className='mt-2' />
            <p className='mt-2 text-xs text-gray-500'>Total balance from all banking accounts</p>
          </CardContent>
        </Card>
        <Card className='transition-shadow duration-300 hover:shadow-xl'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Wallet</CardTitle>
            <WalletMinimal className='h-4 w-4 text-amber-800' />
          </CardHeader>
          <CardContent>
            <div className='block w-[300px] items-center overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-bold'>
              {formatCurrency(totalWallet, 'VND')}
            </div>
            <Progress value={(totalBalance / 1000000) * 100} className='mt-2' />
            <p className='mt-2 text-xs text-gray-500'> Total balance from all wallet accounts</p>
          </CardContent>
        </Card>
        <Card className='transition-shadow duration-300 hover:shadow-xl'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Balance</CardTitle>
            <BadgeCent className='h-4 w-4 text-green-600' />
          </CardHeader>
          <CardContent>
            <div className='block w-[300px] items-center overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-bold'>
              {formatCurrency(totalBalance, 'VND ')}
            </div>
            <Progress value={(totalBalance / 1000000) * 100} className='mt-2' />
            <p className='mt-2 text-xs text-gray-500'> Combined balance across all accounts and wallets</p>
          </CardContent>
        </Card>
      </div>
      <Carousel
        opts={{
          align: 'start',
          loop: true
        }}
        className='grid sm:space-y-6 lg:order-none'
      >
        <CarouselContent>
          {tableData.map((data, index) => (
            <CarouselItem key={data.id} className='md:basis-1/2 lg:basis-1/3'>
              <Card
                className={`${gradientClasses[index % gradientClasses.length]} transition-all duration-300 hover:shadow-lg`}
              >
                <CardHeader className=''>
                  <CardTitle className='flex items-center justify-between text-lg font-medium text-white'>
                    <div>{data.name}</div>
                    <div>{data.type}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex items-center justify-between'>
                    {data.checkType === 'BANKING' ? (
                      <Landmark className='h-12 w-12 text-white opacity-75' />
                    ) : (
                      <Wallet className='h-12 w-12 text-white opacity-75' />
                    )}
                    <div className='text-right'>
                      <p className='text-2xl font-bold text-white'>{data.accountBank}</p>
                      <p className='text-sm text-blue-100'>Current Amount: {data.currentAmount}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      const selectedData = tableData.find((item) => item.id === data.id)
                      if (selectedData) {
                        onRowClick(selectedData, getAdvancedData, setIsDialogOpen, setDataDetail)
                      }
                    }}
                    variant='secondary'
                    className='mt-4 w-full bg-white/10 text-white hover:bg-white/20'
                  >
                    View Details <ChevronRight className='ml-2 h-4 w-4' />
                  </Button>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        <Card className='order-2 col-span-1 lg:col-span-2'>
          <CardContent>
            <DataTable
              data={tableData}
              config={dataTableConfig}
              setConfig={setDataTableConfig}
              columns={columns}
              onRowClick={(rowData) => onRowClick(rowData, getAdvancedData, setIsDialogOpen, setDataDetail)}
              buttons={dataTableButtons}
              onOpenDeleteAll={(ids: string[]) => {
                setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteAllOpen: true }))
                setIdDeletes(ids)
              }}
              onOpenDelete={(id: string) => {
                setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteOpen: true }))
                setIdDeletes([id])
              }}
              deleteProps={{
                isDialogOpen: isDialogOpen.isDialogDeleteOpen,
                onDelete: () => {
                  if (idDeletes.length > 0)
                    deleteAnAccountSource(
                      { id: idDeletes[0] },
                      {
                        onSuccess: (res: any) => {
                          if (res.statusCode === 200 || res.statusCode === 201) {
                            refetchPage()
                            resetCacheStatistic()
                            setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
                            setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteOpen: false }))
                            setIdDeletes([])
                            toast.success('Delete account source successfully')
                          }
                        }
                      }
                    )
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
        <Card className='order-1 col-span-1'>
          <CardHeader className='mb-5 py-4'>
            <CardTitle>Account Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='mx-auto'>
              <DonutChart data={chartData} className='mt-[-2rem] h-[20rem] w-full' types='donut' />
            </div>
          </CardContent>
        </Card>
      </div>
      <AccountSourceDialog
        onSuccessCallback={refetchPage}
        fundId={fundId}
        sharedDialogElements={{
          isDialogOpen,
          setIsDialogOpen,
          hookResetCacheStatistic: resetCacheStatistic,
          hookResetCacheGetAllAccount: resetCacheGetAllAccount
        }}
        createAccountSourceDialog={{ createAccountSource, setDataCreate }}
        UpdateAccountSourceDialog={{
          setDataUpdate,
          updateAccountSource,
          setIdRowClicked,
          dataDetail
        }}
        detailAccountSourceDialog={{
          dataDetail,
          setIdRowClicked
        }}
      />

      <DeleteDialog
        customDescription='Are you sure you want to delete all selected data?'
        onDelete={() => {
          if (idDeletes.length > 0)
            deleteMultipleAccountSource(
              { ids: idDeletes },
              {
                onSuccess: (res: any) => {
                  if (res.statusCode === 200 || res.statusCode === 201) {
                    resetAccountSource()
                    resetCacheStatistic()
                    setDataTableConfig((prev) => ({ ...prev, currentPage: 1 }))
                    setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteOpen: false }))
                    setIdDeletes([])
                    setIsDialogOpen((prev) => ({ ...prev, isDialogDeleteAllOpen: false }))
                    toast.success('Delete all account sources successfully')
                  }
                }
              }
            )
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
