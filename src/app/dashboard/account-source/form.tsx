'use client'
import { Card, CardContent } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/DataTable'
import CardInHeader from '@/components/dashboard/CardInHeader'
import React, { useEffect, useState } from 'react'
import { IDataTableConfig } from '@/types/common.i'
import { IQueryOptions } from '@/types/query.interface'
import {
  formatAccountSourceData,
  initAccountSourceFormData,
  initDialogFlag
} from '@/app/dashboard/account-source/constants'
import { handleShowDetailAccountSource } from '@/app/dashboard/account-source/handler'
import { initTableConfig } from '@/constants/data-table'
import AccountSourceDialog from './dialog'
import { useAccountSource } from '@/core/account-source/hooks'
import { formatArrayData, getConvertedKeysToTitleCase, getTypes } from '@/libraries/utils'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import { IAccountSource, IAccountSourceBody, IAccountSourceDataFormat } from '@/core/account-source/models'

export default function AccountSourceForm() {
  // States
  const [data, setData] = useState<IAccountSourceDataFormat[]>([])
  const [columns, setColumns] = useState<any[]>([])
  const [dataTableConfig, setDataTableConfig] = useState<IDataTableConfig>(initTableConfig)
  const [idRowClicked, setIdRowClicked] = useState<string>('')
  const [queryOptions, setQueryOptions] = useState<IQueryOptions>({
    page: dataTableConfig.currentPage,
    limit: dataTableConfig.limit
  })
  const [tableData, setTableData] = useState<IAccountSourceDataFormat[]>(
    dataTableConfig?.selectedTypes?.length === 0
      ? data
      : data.filter((item: IAccountSourceDataFormat) =>
          dataTableConfig?.selectedTypes?.includes(item.checkType as string)
        )
  )
  const [formData, setFormData] = useState<IAccountSourceBody>(initAccountSourceFormData)
  const [isDialogOpen, setIsDialogOpen] = useState(initDialogFlag)

  // Hooks
  const { createAccountSource, updateAccountSource, getAdvancedAccountSource, useGetAccountSourceById } =
    useAccountSource()
  const { getAdvancedData, isGetAdvancedPending } = getAdvancedAccountSource({ query: queryOptions })
  const { getDetailAccountSource } = useGetAccountSourceById(idRowClicked)

  // Effects
  useEffect(() => {
    if (dataTableConfig?.selectedTypes?.length === 0) setTableData(data)
    else {
      setTableData(
        data.filter((item: IAccountSourceDataFormat) =>
          dataTableConfig?.selectedTypes?.includes(item.checkType as string)
        )
      )
    }
  }, [dataTableConfig.selectedTypes])

  useEffect(() => {
    if (!isGetAdvancedPending && getAdvancedData) {
      const dataFormat: IAccountSourceDataFormat[] = formatArrayData<IAccountSource, IAccountSourceDataFormat>(
        getAdvancedData.data,
        formatAccountSourceData
      )
      const titles = getConvertedKeysToTitleCase(dataFormat[0])
      const columns = getColumns(titles, true)
      setDataTableConfig((prev) => ({
        ...prev,
        types: getTypes(getAdvancedData.data),
        totalPage: Number(getAdvancedData.pagination?.totalPage)
      }))
      setData(dataFormat)
      setColumns(columns)
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
        setData={setData}
        setTableData={setTableData}
        tableData={tableData}
        data={data}
        createAccountSource={createAccountSource}
        updateAccountSource={updateAccountSource}
      />
    </div>
  )
}
