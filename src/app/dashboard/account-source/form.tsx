'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/DataTable'
import React, { useEffect, useMemo, useState } from 'react'
import { IDataTableConfig } from '@/types/common.i'
import { IQueryOptions } from '@/types/query.interface'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  initButtonInDataTableHeader,
  initDialogFlag,
  initEmptyAccountSource
} from '@/app/dashboard/account-source/constants'
import {
  filterDataAccountSource,
  handleDeleteMultipleAccountSource,
  handleSubmitAccountSource,
  initDataTable,
  updateCacheDataCreate,
  updateCacheDataUpdate
} from '@/app/dashboard/account-source/handler'
import { initTableConfig } from '@/constants/data-table'
import { useAccountSource } from '@/core/account-source/hooks'
import { formatCurrency, getTypes, mergeQueryParams } from '@/libraries/utils'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import {
  EAccountSourceType,
  IAccountSource,
  IAccountSourceBody,
  IAccountSourceDataFormat,
  IAdvancedAccountSourceResponse,
  IDialogAccountSource,
  TAccountSourceActions
} from '@/core/account-source/models'
import { initQueryOptions } from '@/constants/init-query-options'
import AccountSourceDialog from '@/app/dashboard/account-source/dialog'
import { useStoreLocal } from '@/hooks/useStoreLocal'
import { useTranslation } from 'react-i18next'
import DeleteDialog from '@/components/dashboard/DeleteDialog'
import {
  ArrowDownIcon,
  ArrowDownToLineIcon,
  ArrowUpIcon,
  BanknoteIcon,
  CloudDownload,
  Layers2Icon,
  PcCase,
  TrendingDown,
  TrendingUp,
  Wallet
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useUpdateModel } from '@/hooks/useQueryModel'
import { GET_ADVANCED_ACCOUNT_SOURCE_KEY } from '@/core/account-source/constants'
import { STATISTIC_TRACKER_TRANSACTION_KEY } from '@/core/tracker-transaction/constants'
import { Badge } from '@/components/ui/badge'
import DonutChart from '@/components/core/charts/DonutChart'

export default function AccountSourceForm() {
  const { t } = useTranslation(['common', 'accountSource'])
  // States
  const [dataDetail, setDataDetail] = useState<IAccountSource>(initEmptyAccountSource)
  const [dataTableConfig, setDataTableConfig] = useState<IDataTableConfig>(initTableConfig)
  const [idDeletes, setIdDeletes] = useState<string[]>([])
  const [queryOptions, setQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const [tableData, setTableData] = useState<IAccountSourceDataFormat[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState<IDialogAccountSource>(initDialogFlag)
  const [isHovered, setIsHovered] = useState(false)
  const [currentTypeAccount, setCurrentTypeAccount] = useState<EAccountSourceType>(EAccountSourceType.WALLET)
  const [chartData, setChartData] = useState<any>([])
  const [heightDonut, setHeightDonut] = useState<string>('')

  // Hooks
  // declare hooks
  const {
    createAccountSource,
    updateAccountSource,
    getAdvancedAccountSource,
    deleteAnAccountSource,
    deleteMultipleAccountSource,
    getStatisticAccountBalance,
    getAllAccountSource,
    isCreating,
    isUpdating,
    isDeletingOne,
    isDeletingMultiple
  } = useAccountSource()
  const { setAccountSourceData, accountSourceData, fundId, viewportHeight } = useStoreLocal()

  const { refetchGetStatisticAccountBalanceData } = getStatisticAccountBalance(fundId)
  const { refetchAllData } = getAllAccountSource(fundId)
  const { getAdvancedData, refetchGetAdvanced } = getAdvancedAccountSource({ query: queryOptions, fundId })

  const actionMap: Record<TAccountSourceActions, () => void> = {
    getAllAccountSource: refetchAllData,
    getStatisticAccountBalance: refetchGetStatisticAccountBalanceData,
    getAdvancedAccountSource: refetchGetAdvanced
  }

  const callBackRefetchAccountSourcePage = (actions: TAccountSourceActions[]) => {
    actions.forEach((action) => {
      if (actionMap[action]) {
        actionMap[action]()
      }
    })
  }

  // Hooks
  const { resetData: resetAccountSource } = useUpdateModel<IAdvancedAccountSourceResponse>(
    [GET_ADVANCED_ACCOUNT_SOURCE_KEY, mergeQueryParams(queryOptions), fundId],
    updateCacheDataCreate
  )
  const { setData: setDataUpdate, resetData: resetDataUpdate } = useUpdateModel<IAdvancedAccountSourceResponse>(
    [GET_ADVANCED_ACCOUNT_SOURCE_KEY, mergeQueryParams(queryOptions), fundId],
    updateCacheDataUpdate
  )
  const { resetData: resetCacheStatistic } = useUpdateModel([STATISTIC_TRACKER_TRANSACTION_KEY], () => {})

  // Memos
  const isWallet = currentTypeAccount === 'WALLET'
  const titles = ['Name', 'Type', 'Init Amount', 'Account Bank', 'Current Amount']
  const columns = useMemo(() => {
    if (tableData.length === 0) return []
    return getColumns<IAccountSourceDataFormat>({
      headers: titles,
      isSort: true
    })
  }, [tableData])

  const refetchPage = () => {
    refetchGetAdvanced()
    resetAccountSource()
    resetDataUpdate()
  }
  // Effects
  useEffect(() => {
    if (getAdvancedData) {
      setAccountSourceData(getAdvancedData.data)
      setDataTableConfig((prev) => ({
        ...prev,
        types: getTypes(getAdvancedData.data, 'type'),
        totalPage: Number(getAdvancedData.pagination?.totalPage)
      }))
    }
  }, [getAdvancedData])

  useEffect(() => {
    setTableData(filterDataAccountSource(dataTableConfig.selectedTypes || [], getAdvancedData?.data || []))
  }, [dataTableConfig.selectedTypes])

  useEffect(() => {
    initDataTable(setTableData, accountSourceData)
  }, [accountSourceData])

  useEffect(() => {
    setQueryOptions((prev) => ({ ...prev, page: dataTableConfig.currentPage, limit: dataTableConfig.limit }))
  }, [dataTableConfig])

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

  useEffect(() => {
    if (viewportHeight > 600 && viewportHeight <= 700) {
      setHeightDonut('h-[18rem]')
    } else if (viewportHeight > 700 && viewportHeight <= 800) {
      setHeightDonut('h-[20rem]')
    } else if (viewportHeight > 800 && viewportHeight <= 900) {
      setHeightDonut('h-[19rem]')
    } else {
      setHeightDonut('h-[20rem]')
    }
  }, [viewportHeight])

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
  const accountBanks = useMemo(
    () => ({
      totalBalance,
      totalAccountWallet,
      totalAccountBanking,
      totalBalanceWallet,
      totalBalanceBanking
    }),
    [totalBalance, totalAccountWallet, totalAccountBanking, totalBalanceWallet, totalBalanceBanking]
  )
  const previousBalance = useMemo(() => totalBalance * 0.95, [totalBalance])
  const isIncreased = useMemo(() => totalBalance > previousBalance, [totalBalance, previousBalance])

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
                {t('accountSource:AccountSourceCard.totalBlance.label')}
              </CardTitle>
            </CardHeader>
            <CardContent className='relative pt-1'>
              <div className='flex items-center justify-between'>
                <div className='rounded-lg bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20'>
                  <Layers2Icon className='h-7 w-7 text-white' />
                </div>
                <div className='text-right'>
                  <p className='text-2xl font-bold text-white transition-all duration-300 group-hover:scale-105'>
                    {formatCurrency(accountBanks.totalBalance, 'VND ')}
                  </p>
                  <p className='mt-1 flex items-center text-sm text-blue-100'>
                    <ArrowUpIcon className='mr-1 h-4 w-4 animate-bounce' />
                    <span>{t('accountSource:AccountSourceCard.totalBlance.gradually')}</span>
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
                {t('accountSource:AccountSourceCard.totalBanking.label')}
              </CardTitle>
            </CardHeader>
            <CardContent className='relative pt-1'>
              <div className='flex items-center justify-between'>
                <div className='rounded-lg bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20'>
                  <Layers2Icon className='h-7 w-7 text-white' />
                </div>
                <div className='text-right'>
                  <p className='text-2xl font-bold text-white transition-all duration-300 group-hover:scale-105'>
                    {formatCurrency(accountBanks.totalBalanceBanking, 'VND')}
                  </p>
                  <p className='mt-1 flex items-center text-sm text-blue-100'>
                    <ArrowUpIcon className='mr-1 h-4 w-4 animate-bounce' />
                    <span>{t('accountSource:AccountSourceCard.totalBanking.gradually')}</span>
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
                {t('accountSource:AccountSourceCard.totalWallet.label')}
              </CardTitle>
            </CardHeader>
            <CardContent className='relative pt-1'>
              <div className='flex items-center justify-between'>
                <div className='rounded-lg bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20'>
                  <Layers2Icon className='h-7 w-7 text-white' />
                </div>
                <div className='text-right'>
                  <p className='text-2xl font-bold text-white transition-all duration-300 group-hover:scale-105'>
                    {formatCurrency(accountBanks.totalBalanceWallet, 'VND')}
                  </p>
                  <p className='mt-1 flex items-center text-sm text-emerald-100'>
                    <ArrowDownIcon className='mr-1 h-4 w-4 animate-bounce' />
                    <span>{t('accountSource:AccountSourceCard.totalWallet.gradually')}</span>
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
                onRowClick={(rowData) => {
                  setDataDetail(getAdvancedData?.data.find((data) => data.id === rowData.id) || initEmptyAccountSource)
                  setIsDialogOpen((prev) => ({ ...prev, isDialogDetailOpen: true }))
                }}
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
          <Card className='flex h-full flex-col rounded-lg shadow-lg'>
            <CardHeader className='flex-none border-b px-6 py-4'>
              <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                <CardTitle>{t('accountSource:AccountSourceCardDetail.title')}</CardTitle>
                <div className='flex flex-wrap items-center gap-2'>
                  <Select
                    value={currentTypeAccount}
                    onValueChange={(value: EAccountSourceType) => setCurrentTypeAccount(value)}
                  >
                    <SelectTrigger className='h-10 w-full rounded-lg px-4 md:w-56'>
                      <SelectValue placeholder='Select type account' />
                    </SelectTrigger>
                    <SelectContent className='w-full'>
                      <SelectItem value='WALLET'>{t('accountSource:AccountSourceCardDetail.item.wallet')}</SelectItem>
                      <SelectItem value='BANKING'>{t('accountSource:AccountSourceCardDetail.item.banking')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className='px-6 py-6'>
              <div className='relative overflow-hidden'>
                <div className='mb-6 flex items-center justify-between'>
                  <Badge variant='secondary' className='rounded-full px-3 py-1 text-sm font-semibold'>
                    {isWallet ? 'WALLET' : 'BANKING'}
                  </Badge>
                  <motion.div whileHover={{ rotate: 20 }} transition={{ type: 'spring', stiffness: 300 }}>
                    {isWallet ? <Wallet size={28} /> : <BanknoteIcon size={28} />}
                  </motion.div>
                </div>

                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className='absolute bottom-2 right-2 text-sm text-gray-500 dark:text-gray-400'
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      {t('accountSource:AccountSourceCardDetail.lastUpdate')}: {new Date().toLocaleString()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <motion.div
                  className='space-y-6'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className='flex items-center justify-between'>
                    <span className='text-base font-medium text-gray-600 dark:text-gray-400'>
                      {t('accountSource:AccountSourceCardDetail.totalAccount')}
                    </span>
                    <motion.span
                      className='text-lg font-bold text-gray-800 dark:text-white'
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.3, times: [0, 0.5, 1] }}
                    >
                      {isWallet ? accountBanks.totalAccountWallet : accountBanks.totalAccountBanking}
                    </motion.span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-base font-medium text-gray-600 dark:text-gray-400'>
                      {t('accountSource:AccountSourceCardDetail.totalBlance')}
                    </span>
                    <div className='flex items-center'>
                      <motion.span
                        className={`text-lg font-bold ${
                          isIncreased ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}
                        animate={{ scale: isHovered ? 1.1 : 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        {isWallet
                          ? formatCurrency(accountBanks.totalBalanceWallet, 'VND')
                          : formatCurrency(accountBanks.totalBalanceBanking, 'VND')}
                      </motion.span>
                      <motion.div
                        className='ml-2'
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {isIncreased ? (
                          <TrendingUp className='text-green-600 dark:text-green-400' size={20} />
                        ) : (
                          <TrendingDown className='text-red-600 dark:text-red-400' size={20} />
                        )}
                      </motion.div>
                    </div>
                  </div>
                  <motion.div
                    className='text-base text-gray-500 dark:text-gray-400'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {isIncreased
                      ? t('accountSource:AccountSourceCardDetail.Increased')
                      : t('accountSource:AccountSourceCardDetail.Decreased')}{' '}
                    {t('accountSource:AccountSourceCardDetail.from')} {formatCurrency(previousBalance, 'VND')}
                  </motion.div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className='h-[55%] flex-1'>
          <CardHeader className='mb-5 py-4'>
            <CardTitle>{t('accountSource:WalletBalanceSummary')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <DonutChart data={chartData} className={`mt-[-2rem] w-full ${heightDonut}`} types='donut' />
            </div>
          </CardContent>
        </Card>
      </div>
      <AccountSourceDialog
        fundId={fundId}
        sharedDialogElements={{
          isDialogOpen,
          setIsDialogOpen,
          isCreating,
          isUpdating,
          isDeletingOne,
          isDeletingMultiple
        }}
        callBack={(payload: IAccountSourceBody) => {
          handleSubmitAccountSource({
            payload: { ...payload },
            setIsDialogOpen,
            hookCreate: createAccountSource,
            hookUpdate: updateAccountSource,
            fundId,
            isDialogOpen,
            callBackOnSuccess: callBackRefetchAccountSourcePage
          })
        }}
        detailAccountSourceDialog={{
          dataDetail
        }}
      />
      <DeleteDialog
        customDescription='Bạn chắc chắn muốn xóa tất cả dữ liệu này?'
        onDelete={() => {
          if (idDeletes.length > 0)
            handleDeleteMultipleAccountSource({
              hookDelete: deleteMultipleAccountSource,
              idDeletes,
              setIsDialogOpen,
              setIdDeletes,
              callBackOnSuccess: callBackRefetchAccountSourcePage,
              setDataTableConfig
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
