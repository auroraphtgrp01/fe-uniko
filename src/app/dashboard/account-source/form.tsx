'use client'
import { Card, CardContent } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/DataTable'
import CardInHeader from '@/components/dashboard/CardInHeader'
import React, { useEffect, useState } from 'react'
import { IAccountSourceDataFormat, IAccountSourceBody } from '@/types/account-source.i'
import { IDataTableConfig } from '@/types/common.i'
import { IQueryOptions } from '@/types/query.interface'
import { initAccountSourceFormData, initDialogFlag } from '@/app/dashboard/account-source/constants'
import { handleOnRowClickAccountSource } from '@/app/dashboard/account-source/handler'
import { initTableConfig } from '@/constants/data-table'
import AccountSourceDialog from './dialog'
import { useAccountSource } from '@/hooks/core/account-source/hooks'

export default function AccountSourceForm() {
  const [data, setData] = useState<IAccountSourceDataFormat[]>([])
  const [columns, setColumns] = useState<any[]>([])
  const [dataTableConfig, setDataTableConfig] = useState<IDataTableConfig>(initTableConfig)
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
  const { createAccountSource, updateAccountSource } = useAccountSource()

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
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res: IBaseResponseData<IAccountSource[]> = await accountSourceRoutes.getAdvanced(queryOptions)
  //       console.log('res', res)

  //       const dataFormat: IAccountSourceDataFormat[] = formatArrayData(res?.data)
  //       const titles = getConvertedKeysToTitleCase(dataFormat[0])

  //       const columns = getColumns(titles, true)
  //       setDataTableConfig((prev) => ({
  //         ...prev,
  //         types: getTypes(res),
  //         totalPage: Number(res?.pagination?.totalPage)
  //       }))
  //       setData(dataFormat)
  //       setTableData(dataFormat)
  //       setColumns(columns)
  //     } catch (error) {
  //       console.error('Failed to fetch data:', error)
  //     }
  //   }

  //   fetchData()
  // }, [queryOptions])

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
            onRowClick={handleOnRowClickAccountSource}
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
