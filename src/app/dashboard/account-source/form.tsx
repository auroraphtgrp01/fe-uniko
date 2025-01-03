'use client'
import { Card, CardContent } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/DataTable'
import CardInHeader from '@/components/dashboard/CardInHeader'
import React, { useEffect, useMemo, useState } from 'react'
import { IDataTableConfig } from '@/types/common.i'
import { IQueryOptions } from '@/types/query.interface'
import {
  initButtonInDataTableHeader,
  initDialogFlag,
  initEmptyAccountSource
} from '@/app/dashboard/account-source/constants'
import {
  handleDeleteAnAccountSource,
  handleDeleteMultipleAccountSource,
  handleSubmitAccountSource,
  initDataTable,
  updateCacheDataCreate
} from '@/app/dashboard/account-source/handler'
import { initTableConfig } from '@/constants/data-table'
import { useAccountSource } from '@/core/account-source/hooks'
import { getConvertedKeysToTitleCase, getTypes, mergeQueryParams } from '@/libraries/utils'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import {
  IAccountSource,
  IAccountSourceBody,
  IAccountSourceDataFormat,
  IAdvancedAccountSourceResponse,
  IDialogAccountSource,
  TAccountSourceActions
} from '@/core/account-source/models'
import { initQueryOptions } from '@/constants/init-query-options'
import { useUpdateModel } from '@/hooks/useQueryModel'
import AccountSourceDialog from '@/app/dashboard/account-source/dialog'
import { useStoreLocal } from '@/hooks/useStoreLocal'
import { GET_ADVANCED_ACCOUNT_SOURCE_KEY, GET_ALL_ACCOUNT_SOURCE_KEY } from '@/core/account-source/constants'
import { useTranslation } from 'react-i18next'
import { STATISTIC_TRACKER_TRANSACTION_KEY } from '@/core/tracker-transaction/constants'
import DeleteDialog from '@/components/dashboard/DeleteDialog'

export default function AccountSourceForm() {
  const { t } = useTranslation(['common'])
  // States
  const [dataDetail, setDataDetail] = useState<IAccountSource>(initEmptyAccountSource)
  const [dataTableConfig, setDataTableConfig] = useState<IDataTableConfig>(initTableConfig)
  const [idDeletes, setIdDeletes] = useState<string[]>([])
  const [queryOptions, setQueryOptions] = useState<IQueryOptions>(initQueryOptions)
  const [tableData, setTableData] = useState<IAccountSourceDataFormat[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState<IDialogAccountSource>(initDialogFlag)

  // Hooks
  // declare hooks
  const {
    createAccountSource,
    updateAccountSource,
    getAdvancedAccountSource,
    deleteAnAccountSource,
    deleteMultipleAccountSource,
    getStatisticAccountBalance,
    getAllAccountSource
  } = useAccountSource()
  const { setAccountSourceData, accountSourceData, fundId } = useStoreLocal()

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
                  handleDeleteAnAccountSource({
                    hookDelete: deleteAnAccountSource,
                    id: idDeletes[0],
                    setIsDialogOpen,
                    setIdDeletes,
                    callBackOnSuccess: callBackRefetchAccountSourcePage,
                    setDataTableConfig
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
            }}
          />
        </CardContent>
      </Card>
      <AccountSourceDialog
        fundId={fundId}
        sharedDialogElements={{
          isDialogOpen,
          setIsDialogOpen
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
