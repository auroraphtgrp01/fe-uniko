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
  initDialogFlag,
  initEmptyAccountSource
} from '@/app/dashboard/account-source/constants'
import {
  handleCreateAccountSource,
  handleShowDetailAccountSource,
  handleSubmitAccountSource,
  initDataTable,
  onRowClick,
  updateCacheDataCreate,
  updateCacheDataForDeleteFeat,
  updateCacheDataUpdate
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
import toast from 'react-hot-toast'
import DeleteDialog from '@/components/dashboard/DeleteDialog'
import { useTrackerTransaction } from '@/core/tracker-transaction/hooks'

export default function AccountSourceForm() {
  const { t } = useTranslation(['common'])
  // States
  const [dataDetail, setDataDetail] = useState<IAccountSource>(initEmptyAccountSource)
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
  // declare hooks
  const {
    createAccountSource,
    updateAccountSource,
    getAdvancedAccountSource,
    deleteAnAccountSource,
    deleteMultipleAccountSource,
    getStatisticAccountBalance
  } = useAccountSource()
  const { getStatisticData } = useTrackerTransaction()
  const { setAccountSourceData, accountSourceData, fundId } = useStoreLocal()

  const { refetchGetStatisticAccountBalanceData } = getStatisticAccountBalance(fundId)
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

  const actionMap: Record<TAccountSourceActions, () => void> = {
    getAllAccountSource: refetchGetAdvanced,
    getStatisticAccountBalance: refetchGetStatisticAccountBalanceData
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
      <AccountSourceDialog
        fundId={fundId}
        sharedDialogElements={{
          isDialogOpen,
          setIsDialogOpen
        }}
        callBack={(payload: IAccountSourceBody) => {
          handleSubmitAccountSource({
            payload,
            setIsDialogOpen,
            hookCreate: createAccountSource,
            hookUpdate: updateAccountSource,
            fundId,
            isDialogOpen,
            setIdRowClicked,
            callBackOnSuccess: callBackRefetchAccountSourcePage
          })
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
