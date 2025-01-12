'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/DataTable'

import React, { useEffect, useMemo, useState } from 'react'
import { IDataTableConfig } from '@/types/common.i'
import { IQueryOptions } from '@/types/query.interface'
import {
  initAccountSourceFormData,
  initAccountSourceTab,
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
import {
  formatCurrency,
  getConvertedKeysToTitleCase,
  getCurrentMonthDateRange,
  getTypes,
  mergeQueryParams
} from '@/libraries/utils'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import {
  EAccountSourceType,
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
  ArrowDownIcon,
  ArrowDownToLineIcon,
  ArrowUpIcon,
  BanknoteIcon,
  CloudDownload,
  Landmark,
  Layers2Icon,
  PcCase,
  TrendingDown,
  TrendingUp,
  Wallet

} from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import DonutChart from '@/components/core/charts/DonutChart'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { AnimatePresence, motion } from 'framer-motion'
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
  const [currentTypeAccount, setCurrentTypeAccount] = useState<EAccountSourceType>(EAccountSourceType.WALLET)
  const [isHovered, setIsHovered] = useState(false)
  const isWallet = currentTypeAccount === 'WALLET'

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
  const [chartData, setChartData] = useState<any>([])
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
  const { resetData: resetCacheStatistic } = useUpdateModel([STATISTIC_TRACKER_TRANSACTION_KEY], () => { })
  const { resetData: resetCacheGetAllAccount } = useUpdateModel([GET_ALL_ACCOUNT_SOURCE_KEY], () => { })

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

  const totalBalance = useMemo(
    () => tableData.reduce((sum, account) => sum + parseFloat(account.currentAmount.replace(/[^0-9.-]+/g, '')), 0),
    [tableData]
  )
  const totalBalanceWallet = useMemo(
    () =>
      tableData
        .filter((account) => account.checkType === EAccountSourceType.WALLET)
        .reduce((sum, account) => sum + parseFloat(account.currentAmount.replace(/[^0-9.-]+/g, '')), 0),
    [tableData]
  )
  const totalBalanceBanking = useMemo(
    () =>
      tableData
        .filter((account) => account.checkType === EAccountSourceType.BANKING)
        .reduce((sum, account) => sum + parseFloat(account.currentAmount.replace(/[^0-9.-]+/g, '')), 0),
    [tableData]
  )
  const totalAccountWallet = useMemo(
    () => tableData.filter((account) => account.checkType === EAccountSourceType.WALLET).length,
    [tableData]
  )
  const totalAccountBanking = useMemo(
    () => tableData.filter((account) => account.checkType === EAccountSourceType.BANKING).length,
    [tableData]
  )
  const accountBanks = useMemo(() => ({
    totalBalance,
    totalAccountWallet,
    totalAccountBanking,
    totalBalanceWallet,
    totalBalanceBanking
  }), [totalBalance, totalAccountWallet, totalAccountBanking, totalBalanceWallet, totalBalanceBanking])
  const previousBalance = useMemo(() => totalBalance * 0.95, [totalBalance]);
  const isIncreased = useMemo(() => totalBalance > previousBalance, [totalBalance, previousBalance]);

  useEffect(() => {
    if (getAdvancedData) {
      const data = getAdvancedData.data.map((item) => {
        return {
          name: item.name,
          value: item.currentAmount
        }
      })
      setChartData(data)
    }
  }, [getAdvancedData])

  return (
    <div className='grid h-full select-none grid-cols-1 gap-4 max-[1300px]:grid-cols-1 xl:grid-cols-3'>
      {/* Left Section */}
      <div className='flex w-full flex-1 flex-col md:col-span-2'>
        <div className='grid grid-cols-1 gap-4 max-[1280px]:grid-cols-1 md:grid-cols-1 lg:grid-cols-3'>
          {/* Total Balance Card */}
          <Card className='group relative overflow-hidden transition-all duration-300 hover:shadow-lg'>
            <div className='absolute inset-0 bg-gradient-to-br from-orange-500 via-rose-500 to-red-600 opacity-95'></div>
            <div className='absolute inset-0 bg-[url("/patterns/minus.svg")] opacity-20'></div>
            <CardHeader className='relative pb-1'>
              <CardTitle className='flex items-center text-base font-medium text-white'>
                <CloudDownload className='mr-2 h-5 w-5 animate-pulse' />
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent className='relative pt-1'>
              <div className='flex items-center justify-between'>
                <div className='rounded-lg bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20'>
                  <Layers2Icon className='h-7 w-7 text-white' />
                </div>
                <div className='text-right'>
                  <p className='overflow-hidden truncate whitespace-nowrap text-2xl font-bold text-white transition-all duration-300 group-hover:scale-105 md:w-[190px]'>
                    {formatCurrency(accountBanks.totalBalance, 'VND ')}
                  </p>
                  <p className='mt-1 flex items-center text-sm text-red-100'>
                    <ArrowUpIcon className='mr-1 h-4 w-4 animate-bounce' />
                    <span>increaseFromLastMonth</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='group relative overflow-hidden transition-all duration-300 hover:shadow-lg'>
            <div className='absolute inset-0 bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-600 opacity-95'></div>
            <div className='absolute inset-0 bg-[url("/patterns/circuit-board.svg")] opacity-20'></div>
            <CardHeader className='relative pb-1'>
              <CardTitle className='flex items-center text-base font-medium text-white'>
                <PcCase className='mr-2 h-5 w-5 animate-pulse' />
                Total Banking
              </CardTitle>
            </CardHeader>
            <CardContent className='relative pt-1'>
              <div className='flex items-center justify-between'>
                <div className='rounded-lg bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20'>
                  <Landmark className='h-7 w-7 text-white' />
                </div>
                <div className='text-right'>
                  <p className='overflow-hidden truncate whitespace-nowrap text-2xl font-bold text-white transition-all duration-300 group-hover:scale-105 md:w-[190px]'>
                    {formatCurrency(accountBanks.totalBalanceBanking, 'VND')}
                  </p>
                  <p className='mt-1 flex items-center text-sm text-blue-100'>
                    <ArrowUpIcon className='mr-1 h-4 w-4 animate-bounce' />
                    <span>increaseFromLastMonth</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Income Card */}
          <Card className='group relative overflow-hidden transition-all duration-300 hover:shadow-lg'>
            <div className='absolute inset-0 bg-gradient-to-br from-teal-400 via-emerald-500 to-green-600 opacity-95'></div>
            <div className='absolute inset-0 bg-[url("/patterns/plus.svg")] opacity-20'></div>
            <CardHeader className='relative pb-1'>
              <CardTitle className='flex items-center text-base font-medium text-white'>
                <ArrowDownToLineIcon className='mr-2 h-5 w-5 animate-pulse' />
                Total Wallet
              </CardTitle>
            </CardHeader>
            <CardContent className='relative pt-1'>
              <div className='flex items-center justify-between'>
                <div className='rounded-lg bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20'>
                  <Wallet className='h-7 w-7 text-white' />
                </div>
                <div className='text-right'>
                  <p className='overflow-hidden truncate whitespace-nowrap text-2xl font-bold text-white transition-all duration-300 group-hover:scale-105 md:w-[190px]'>
                    {formatCurrency(accountBanks.totalBalanceWallet, 'VND')}
                  </p>
                  <p className='mt-1 flex items-center text-sm text-emerald-100'>
                    <ArrowDownIcon className='mr-1 h-4 w-4 animate-bounce' />
                    <span>noChangeFromYesterday</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* DataTable Section */}
        <div className='mt-4 flex h-full flex-1'>
          <Card className='h-full w-full'>
            <CardContent className='h-full'>
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
        </div>
      </div>
      {/* Right Section */}
      <div className='flex h-full w-full flex-1 flex-col space-y-4 md:col-span-2 min-[1280px]:col-span-1'>
        <div className='h-[calc(45%)]'>
          <Card className="flex h-full flex-col shadow-lg rounded-lg ">
            <CardHeader className="flex-none py-4 px-6 border-b ">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <CardTitle className="text-lg font-semibold ">
                  Account Source
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <Select
                    value={currentTypeAccount}
                    onValueChange={(value: EAccountSourceType) => setCurrentTypeAccount(value)}
                  >
                    <SelectTrigger className="h-10 w-full md:w-56  rounded-lg px-4 ">
                      <SelectValue placeholder="Select type account" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value="WALLET">Wallet</SelectItem>
                      <SelectItem value="BANKING">Banking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-6 py-6">
              <div className="relative overflow-hidden ">
                <div className="mb-6 flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className="rounded-full  px-3 py-1 text-sm font-semibold"
                  >
                    {isWallet ? "WALLET" : "BANKING"}
                  </Badge>
                  <motion.div
                    whileHover={{ rotate: 20 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {isWallet ? <Wallet size={28} /> : <BanknoteIcon size={28} />}
                  </motion.div>
                </div>

                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute bottom-2 right-2 text-sm text-gray-500 dark:text-gray-400"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      Last updated: {new Date().toLocaleString()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-600 dark:text-gray-400">
                      Total Accounts
                    </span>
                    <motion.span
                      className="text-lg font-bold text-gray-800 dark:text-white"
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.3, times: [0, 0.5, 1] }}
                    >
                      {isWallet
                        ? accountBanks.totalAccountWallet
                        : accountBanks.totalAccountBanking}
                    </motion.span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-600 dark:text-gray-400">
                      Total Balance
                    </span>
                    <div className="flex items-center">
                      <motion.span
                        className={`text-lg font-bold ${isIncreased
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                          }`}
                        animate={{ scale: isHovered ? 1.1 : 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {isWallet
                          ? formatCurrency(accountBanks.totalBalanceWallet, "VND")
                          : formatCurrency(accountBanks.totalBalanceBanking, "VND")}
                      </motion.span>
                      <motion.div
                        className="ml-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {isIncreased ? (
                          <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
                        ) : (
                          <TrendingDown className="text-red-600 dark:text-red-400" size={20} />
                        )}
                      </motion.div>
                    </div>
                  </div>
                  <motion.div
                    className="text-base text-gray-500 dark:text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {isIncreased ? "Increased" : "Decreased"} from{" "}
                    {formatCurrency(previousBalance, "VND")}
                  </motion.div>
                </motion.div>
              </div>
            </CardContent>
          </Card>

        </div>
        <Card className='flex-1'>
          <CardHeader className='mb-5 py-4'>
          </CardHeader>
          <CardContent>
            <div>
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
        customDescription='Bạn chắc chắn muốn xóa tất cả dữ liệu này?'
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
                    toast.success('Delete all account source successfully')
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
