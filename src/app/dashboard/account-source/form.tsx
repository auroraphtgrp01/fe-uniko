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
import { getConvertedKeysToTitleCase } from '@/libraries/utils'
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
import { GET_ADVANCED_ACCOUNT_SOURCE_KEY } from '@/core/account-source/constants'

export default function AccountSourceForm() {
  // States
  const [fetchedData, setFetchedData] = useState<IAccountSource[]>([])
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
  const { createAccountSource, updateAccountSource, getAdvancedAccountSource } = useAccountSource()
  const { getAdvancedData, isGetAdvancedPending } = getAdvancedAccountSource({ query: queryOptions })
  const { setData: setDataCreate } = useUpdateModel<IAdvancedAccountSourceResponse>(
    [GET_ADVANCED_ACCOUNT_SOURCE_KEY],
    updateCacheDataCreate
  )
  const { setData: setDataUpdate } = useUpdateModel<IAdvancedAccountSourceResponse>(
    [GET_ADVANCED_ACCOUNT_SOURCE_KEY],
    updateCacheDataUpdate
  )
  const { setAccountSourceData } = useStoreLocal()
  // Effects
  useEffect(() => {
    initDataTable(isGetAdvancedPending, getAdvancedData, setDataTableConfig, setFetchedData, setTableData)
  }, [getAdvancedData])

  useEffect(() => {
    setAccountSourceData(fetchedData)
  }, [fetchedData])

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
        setIsDialogOpen={setIsDialogOpen}
        isDialogOpen={isDialogOpen}
        setFormData={setFormData}
        formData={formData}
        setFetchedData={setFetchedData}
        setTableData={setTableData}
        tableData={tableData}
        fetchedData={fetchedData}
        createAccountSource={createAccountSource}
        updateAccountSource={updateAccountSource}
        setDataCreate={setDataCreate}
        setDataUpdate={setDataUpdate}
        setIdRowClicked={setIdRowClicked}
      />
    </div>
  )
}
