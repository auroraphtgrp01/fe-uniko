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
  handleShowDetailAccountSource,
  initDataTable,
  updateCacheDataCreate,
  updateCacheDataForDeleteFeat,
  updateCacheDataUpdate
} from '@/app/dashboard/account-source/handler'
import { initTableConfig } from '@/constants/data-table'
import { useAccountSource } from '@/core/account-source/hooks'
import { getConvertedKeysToTitleCase, getTypes, mergeQueryParams } from '@/libraries/utils'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import {
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

export default function AccountSourceForm() {
  const { t } = useTranslation(['common'])
  // States
  const [dataTableConfig, setDataTableConfig] = useState<IDataTableConfig>(initTableConfig)
  const [idDeletes, setIdDeletes] = useState<string[]>([])
  const [idRowClicked, setIdRowClicked] = useState<string>('')
  const [queryOptions, setQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const [tableData, setTableData] = useState<IAccountSourceDataFormat[]>([])
  const [formData, setFormData] = useState<IAccountSourceBody>(initAccountSourceFormData)
  const [isDialogOpen, setIsDialogOpen] = useState<IDialogAccountSource>(initDialogFlag)

  // Hooks
  const {
    createAccountSource,
    updateAccountSource,
    getAdvancedAccountSource,
    deleteAnAccountSource,
    deleteMultipleAccountSource
  } = useAccountSource()
  const { setAccountSourceData, accountSourceData, fundId } = useStoreLocal()
  const { getAdvancedData } = getAdvancedAccountSource({ query: queryOptions, fundId })
  const { setData: setDataCreate, resetData: resetAccountSource } = useUpdateModel<IAdvancedAccountSourceResponse>(
    [GET_ADVANCED_ACCOUNT_SOURCE_KEY, mergeQueryParams(queryOptions)],
    updateCacheDataCreate
  )
  const { setData: setDataUpdate } = useUpdateModel<IAdvancedAccountSourceResponse>(
    [GET_ADVANCED_ACCOUNT_SOURCE_KEY, mergeQueryParams(queryOptions)],
    updateCacheDataUpdate
  )
  const { setData: setDataForDeleteFeat } = useUpdateModel<IAdvancedAccountSourceResponse>(
    [GET_ADVANCED_ACCOUNT_SOURCE_KEY, mergeQueryParams(queryOptions)],
    updateCacheDataForDeleteFeat
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
                          setDataForDeleteFeat(res.data)
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
