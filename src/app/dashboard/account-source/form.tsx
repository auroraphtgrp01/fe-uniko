'use client'
import { Card, CardContent } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/DataTable'
import CardInHeader from '@/components/dashboard/CardInHeader'
import React, { useEffect, useMemo, useState } from 'react'
import { IDataTableConfig } from '@/types/common.i'
import { IQueryOptions } from '@/types/query.interface'
import {
  initAccountSourceFormData,
  initButtonInDataTableHeader,
  initDialogFlag
} from '@/app/dashboard/account-source/constants'
import {
  filterDataAccountSource,
  handleShowDetailAccountSource,
  initDataTable,
  updateCacheDataCreate,
  updateCacheDataUpdate,
  updateCacheDetailData
} from '@/app/dashboard/account-source/handler'
import { initTableConfig } from '@/constants/data-table'
import { useAccountSource } from '@/core/account-source/hooks'
import { getConvertedKeysToTitleCase, getTypes, mergeQueryParams } from '@/libraries/utils'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import {
  IAccountSource,
  IAccountSourceBody,
  IAccountSourceDataFormat,
  IAccountSourceResponse,
  IAdvancedAccountSourceResponse,
  IDialogAccountSource
} from '@/core/account-source/models'
import { initQueryOptions } from '@/constants/init-query-options'
import { useUpdateModel } from '@/hooks/useQueryModel'
import AccountSourceDialog from '@/app/dashboard/account-source/dialog'
import { useStoreLocal } from '@/hooks/useStoreLocal'
import { GET_ADVANCED_ACCOUNT_SOURCE_KEY, GET_ALL_ACCOUNT_SOURCE_KEY } from '@/core/account-source/constants'
import { useAuth } from '@/core/auth/hooks'
import { arraysEqual, getRefreshTokenFromLocalStorage } from '@/libraries/helpers'
import { useTranslation } from 'react-i18next'
import { STATISTIC_TRACKER_TRANSACTION_KEY } from '@/core/tracker-transaction/constants'

export default function AccountSourceForm() {
  const { t } = useTranslation(['common'])
  // States
  const [dataTableConfig, setDataTableConfig] = useState<IDataTableConfig>(initTableConfig)
  const [idRowClicked, setIdRowClicked] = useState<string>('')
  const [queryOptions, setQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const [tableData, setTableData] = useState<IAccountSourceDataFormat[]>([])
  const [formData, setFormData] = useState<IAccountSourceBody>(initAccountSourceFormData)
  const [isDialogOpen, setIsDialogOpen] = useState<IDialogAccountSource>(initDialogFlag)
  // Memos
  const titles = useMemo(() => getConvertedKeysToTitleCase(tableData[0]), [tableData])
  const columns = useMemo(() => {
    if (tableData.length === 0) return []
    return getColumns<IAccountSourceDataFormat>(titles, true)
  }, [tableData])

  // Hooks
  const { verifyToken } = useAuth()
  const { isVerifyingToken } = verifyToken({ refreshToken: getRefreshTokenFromLocalStorage() })
  const { createAccountSource, updateAccountSource, getAdvancedAccountSource } = useAccountSource()
  const { getAdvancedData, isGetAdvancedPending } = getAdvancedAccountSource({ query: queryOptions })
  const { setData: setDataCreate } = useUpdateModel<IAdvancedAccountSourceResponse>(
    [GET_ADVANCED_ACCOUNT_SOURCE_KEY, mergeQueryParams(queryOptions)],
    updateCacheDataCreate
  )
  const { setData: setDataUpdate } = useUpdateModel<IAdvancedAccountSourceResponse>(
    [GET_ADVANCED_ACCOUNT_SOURCE_KEY, mergeQueryParams(queryOptions)],
    updateCacheDataUpdate
  )
  const { resetData: resetCacheStatistic } = useUpdateModel([STATISTIC_TRACKER_TRANSACTION_KEY], () => {})
  const { resetData: resetCacheGetAllAccount } = useUpdateModel([GET_ALL_ACCOUNT_SOURCE_KEY], () => {})
  const { setAccountSourceData, accountSourceData } = useStoreLocal()
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

  return (
    <div className='w-full'>
      <div className='flex w-full flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0'>
        <CardInHeader className='flex-grow sm:w-1/2 lg:w-1/2' />
        <CardInHeader className='flex-grow sm:w-1/2 lg:w-1/2' />
      </div>
      <Card className='mt-5'>
        <CardContent>
          <DataTable
            data={tableData}
            config={dataTableConfig}
            setConfig={setDataTableConfig}
            columns={columns}
            onRowClick={(data: IAccountSourceDataFormat) => setIdRowClicked(data.id)}
            buttons={dataTableButtons}
          />
        </CardContent>
      </Card>
      <AccountSourceDialog
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
          setIdRowClicked
        }}
      />
    </div>
  )
}
