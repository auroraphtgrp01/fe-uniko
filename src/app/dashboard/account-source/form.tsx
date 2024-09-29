'use client'
import { Card, CardContent } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/DataTable'
import CardInHeader from '@/components/dashboard/CardInHeader'
import React, { useEffect, useMemo, useState } from 'react'
import { IDataTableConfig } from '@/types/common.i'
import { IQueryOptions } from '@/types/query.interface'
import {
  formatAccountSourceData,
  initAccountSourceFormData,
  initDialogFlag
} from '@/app/dashboard/account-source/constants'
import {
  filterDataAccountSource,
  handleShowDetailAccountSource,
  updateCacheDataCreate,
  updateCacheDataUpdate
} from '@/app/dashboard/account-source/handler'
import { initTableConfig } from '@/constants/data-table'
import AccountSourceDialog from './dialog'
import { useAccountSource } from '@/core/account-source/hooks'
import { formatArrayData, getConvertedKeysToTitleCase, getTypes, mergeQueryParams } from '@/libraries/utils'
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
import { ACCOUNT_SOURCE_MODEL_KEY } from '@/core/account-source/constants'

export default function AccountSourceForm() {
  // States
  const [fetchedData, setFetchedData] = useState<IAccountSource[]>([])
  const [dataTableConfig, setDataTableConfig] = useState<IDataTableConfig>(initTableConfig)
  const [idRowClicked, setIdRowClicked] = useState<string>('')
  const [queryOptions, setQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const [tableData, setTableData] = useState<IAccountSourceDataFormat[]>([])
  const [formData, setFormData] = useState<IAccountSourceBody>(initAccountSourceFormData)
  const [isDialogOpen, setIsDialogOpen] = useState<IDialogAccountSource>(initDialogFlag)

  // Memo
  const query = useMemo(() => [ACCOUNT_SOURCE_MODEL_KEY, '', mergeQueryParams(queryOptions)], [queryOptions])
  const columns = useMemo(() => {
    if (tableData.length === 0) return []
    const titles = getConvertedKeysToTitleCase(tableData[0])
    return getColumns<IAccountSourceDataFormat>(titles, true)
  }, [tableData])

  // Hooks
  const { createAccountSource, updateAccountSource, getAdvancedAccountSource, useGetAccountSourceById } =
    useAccountSource()
  const { getAdvancedData, isGetAdvancedPending } = getAdvancedAccountSource({ query: queryOptions })
  const { getDetailAccountSource } = useGetAccountSourceById(idRowClicked)
  const { setData: setDataCreate } = useUpdateModel<IAdvancedAccountSourceResponse>(query, updateCacheDataCreate)
  const { setData: setDataUpdate } = useUpdateModel<IAdvancedAccountSourceResponse>(query, updateCacheDataUpdate)

  // Effects
  useEffect(() => {
    setTableData(filterDataAccountSource(fetchedData, dataTableConfig.selectedTypes as string[]))
  }, [dataTableConfig.selectedTypes])

  useEffect(() => {
    if (!isGetAdvancedPending && getAdvancedData) {
      const dataFormat: IAccountSourceDataFormat[] = formatArrayData<IAccountSource, IAccountSourceDataFormat>(
        getAdvancedData.data,
        formatAccountSourceData
      )
      setDataTableConfig((prev) => ({
        ...prev,
        types: getTypes(getAdvancedData.data),
        totalPage: Number(getAdvancedData.pagination?.totalPage)
      }))
      setFetchedData(getAdvancedData.data)
      setTableData(dataFormat)
    }
  }, [getAdvancedData])

  useEffect(() => {
    if (getDetailAccountSource !== undefined)
      handleShowDetailAccountSource(setFormData, setIsDialogOpen, getDetailAccountSource)
  }, [getDetailAccountSource])

  useEffect(() => {
    setQueryOptions((prev) => ({ ...prev, page: dataTableConfig.currentPage, limit: dataTableConfig.limit }))
  }, [dataTableConfig])

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
            onCreateButtonClick={() => setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: true }))}
            columns={columns}
            onRowClick={(row: IAccountSourceDataFormat) => setIdRowClicked(row.id)}
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
      />
    </div>
  )
}
