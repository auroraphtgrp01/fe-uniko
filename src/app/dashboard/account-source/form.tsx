'use client'
import { Card, CardContent } from '@/components/ui/card'
import { DataTable } from '@/components/dashboard/DataTable'
import { getColumns } from '@/components/dashboard/ColumnsTable'
import CardInHeader from '@/components/dashboard/CardInHeader'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import CustomDialog from '@/components/dashboard/Dialog'
import React, { useEffect, useState } from 'react'
import { IAccountSourceDataFormat, IAccountSource, IAccountSourceBody } from '@/types/account-source.i'
import { apiService } from '@/libraries/api'
import { formatCurrency, getConvertedKeysToTitleCase, getTypes } from '@/libraries/utils'
import { HandCoins, Landmark, Wallet2 } from 'lucide-react'
import { IBaseResponseData, IDataTableConfig, IDialogConfig } from '@/types/common.i'
import { IQueryOptions } from '@/hooks/query-hooks/query-hook.i'
import toast from 'react-hot-toast'
import { useAccountSource, useGetAdvancedAccountSource } from '@/hooks/query-hooks/use-account-source'

const accountSourceRoutes = apiService.accountSource

export default function AccountSourceForm() {
  const [data, setData] = useState<IAccountSourceDataFormat[]>([])
  const [columns, setColumns] = useState<any[]>([])
  const [dataTableConfig, setDataTableConfig] = useState<IDataTableConfig>({
    totalPage: 0,
    currentPage: 1,
    limit: 10,
    types: [],
    selectedTypes: [],
    isPaginate: true,
    isVisibleSortType: true,
    classNameOfScroll: 'h-[calc(100vh-30rem)]'
  })
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
  const [formData, setFormData] = useState<IAccountSourceBody>({
    name: '',
    type: '',
    initAmount: 0,
    currency: '',
    id: undefined
  })
  const [isDialogOpen, setIsDialogOpen] = useState({
    isDialogCreateOpen: false,
    isDialogUpdateOpen: false,
    isCloseConfirmationDialog: false
  })
  let attemptingToClose: 'create' | 'update' | null = null
  const { createAccountSource, updateAccountSource } = useAccountSource()
  const { getAdvancedData, isGetAdvancedPending } = useGetAdvancedAccountSource({ params: queryOptions })
  const formatData = (data: IAccountSource): IAccountSourceDataFormat => {
    const { id, name, type, initAmount, currency, currentAmount, accountBank } = data
    return {
      id,
      name,
      type:
        type === 'WALLET' ? (
          <div className='Ư flex items-center'>
            <Wallet2 className='mr-2' />
            <span>Wallet</span>
          </div>
        ) : type === 'BANKING' ? (
          <div className='flex items-center'>
            <Landmark className='mr-2' /> <span>Banking</span>
          </div>
        ) : (
          <div className='flex items-center'>
            <HandCoins className='mr-2' /> <span>Transfer</span>
          </div>
        ),
      initAmount: formatCurrency(initAmount, currency),
      accountBank: accountBank?.type,
      currency,
      currentAmount: formatCurrency(currentAmount, 'VND'),
      checkType: type
    }
  }
  const formatArrayData = (data: IAccountSource[]): IAccountSourceDataFormat[] => {
    return data.map((item) => {
      return formatData(item)
    })
  }
  useEffect(() => {
    ;(async () => {
      const res: IBaseResponseData<IAccountSource[]> = await accountSourceRoutes.getAdvanced(queryOptions)
      console.log('res', res)

      const dataFormat: IAccountSourceDataFormat[] = formatArrayData(res?.data)
      const titles = getConvertedKeysToTitleCase(dataFormat[0])

      const columns = getColumns(titles, true)
      setDataTableConfig((prev) => ({
        ...prev,
        types: getTypes(res),
        totalPage: Number(res?.pagination?.totalPage)
      }))
      setData(dataFormat)
      setTableData(dataFormat)
      setColumns(columns)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryOptions])
  const contentDialogForm = (
    <div className='grid gap-4 py-4'>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='sourceName' className='text-right'>
          Source Name
        </Label>
        <Input
          value={formData.name}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }}
          className='col-span-3'
          placeholder='Source Name *'
        />
      </div>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='type' className='text-right'>
          Type
        </Label>
        <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))} value={formData.type}>
          <SelectTrigger className='col-span-3'>
            <SelectValue placeholder='Select a source type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='WALLET'>Wallet</SelectItem>
            <SelectItem value='BANKING'>Banking</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='initialAmount' className='text-right'>
          Initial Amount
        </Label>
        <Input
          type='number'
          defaultValue={formData.initAmount}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, initAmount: Number(e.target.value) }))
          }}
          className='col-span-3'
          placeholder='Init Amount *'
        />
      </div>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='currency' className='text-right'>
          Currency
        </Label>
        <Select
          onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))}
          value={formData.currency}
        >
          <SelectTrigger className='col-span-3'>
            <SelectValue placeholder='Select a currency' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='USD'>USD</SelectItem>
            <SelectItem value='EUR'>EUR</SelectItem>
            <SelectItem value='VND'>VND</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
  const createConfigDialog: IDialogConfig = {
    content: contentDialogForm,
    footer: (
      <Button type='button' onClick={async () => await handleCreateAccountSource()}>
        Save changes
      </Button>
    ),
    description: 'Please fill in the information below to create a new account source.',
    title: 'Create Account Source',
    isOpen: isDialogOpen.isDialogCreateOpen,
    onClose: () => {
      ;(attemptingToClose = 'create'), setIsDialogOpen((prev) => ({ ...prev, isCloseConfirmationDialog: true }))
    }
  }
  const updateConfigDialog: IDialogConfig = {
    content: contentDialogForm,
    footer: (
      <Button type='button' onClick={async () => await handleUpdateAccountSource()}>
        Save changes
      </Button>
    ),
    description: 'Please fill in the information below to update a account source.',
    title: 'Update Account Source',
    isOpen: isDialogOpen.isDialogUpdateOpen,
    onClose: () => {
      ;(attemptingToClose = 'update'), setIsDialogOpen((prev) => ({ ...prev, isCloseConfirmationDialog: true }))
    }
  }
  const closeConfirmationDialog: IDialogConfig = {
    title: 'Close Confirmation',
    content: 'Are you sure you want to close this dialog?',
    isOpen: isDialogOpen.isCloseConfirmationDialog,
    onClose: () => {
      setIsDialogOpen((prev) => ({ ...prev, isCloseConfirmationDialog: false })), (attemptingToClose = null)
    },
    footer: (
      <>
        <Button
          type='button'
          variant={'greenPastel1'}
          onClick={() => {
            if (attemptingToClose === 'create')
              setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: false, isCloseConfirmationDialog: false }))
            else setIsDialogOpen((prev) => ({ ...prev, isDialogUpdateOpen: false, isCloseConfirmationDialog: false }))
            setFormData((prev) => ({ ...prev, name: '', type: '', initAmount: 0, currency: '' }))
            attemptingToClose = null
          }}
        >
          Confirm
        </Button>
        <Button
          type='button'
          variant={'secondary'}
          onClick={() => {
            setIsDialogOpen((prev) => ({ ...prev, isCloseConfirmationDialog: false })), (attemptingToClose = null)
          }}
        >
          Cancel
        </Button>
      </>
    )
  }
  // FILTER DATA
  useEffect(() => {
    if (dataTableConfig?.selectedTypes?.length === 0) setTableData(data as IAccountSourceDataFormat[])
    else {
      setTableData(
        data.filter((item: IAccountSourceDataFormat) =>
          dataTableConfig?.selectedTypes?.includes(item.checkType as string)
        )
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTableConfig.selectedTypes])

  const handleCreateAccountSource = async () => {
    const payload: IAccountSourceBody = {
      name: formData.name,
      type: formData.type,
      initAmount: formData.initAmount,
      currency: formData.currency
    }
    createAccountSource(payload, {
      onSuccess: (res) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          const format = formatData(res.data)
          setIsDialogOpen((prev) => ({ ...prev, isDialogCreateOpen: false }))
          setData([format, ...data])
          setTableData([format, ...tableData])
          setFormData((prev) => ({ ...prev, name: '', type: '', initAmount: 0, currency: '' }))
          toast.success('Create account source successfully!')
        }
      }
    })
  }
  const handleUpdateAccountSource = async () => {
    const payload: IAccountSourceBody = {
      name: formData.name,
      type: formData.type,
      initAmount: formData.initAmount,
      currency: formData.currency,
      id: formData.id
    }
    updateAccountSource(payload, {
      onSuccess(res) {
        if (res.statusCode === 200 || res.statusCode === 201) {
          const format = formatData(res.data)
          setData((prevRows) => prevRows.map((row) => (row.id === format.id ? { ...row, ...format } : row)))
          setTableData((prevRows) => prevRows.map((row) => (row.id === format.id ? { ...row, ...format } : row)))
          setIsDialogOpen((prev) => ({ ...prev, isDialogUpdateOpen: false }))
          setFormData((prev) => ({ ...prev, name: '', type: '', initAmount: 0, currency: '' }))
          toast.success('Update account source successfully!')
        }
      }
    })
  }
  const handleOnRowClick = async (row: IAccountSourceDataFormat) => {
    const { data, statusCode } = await accountSourceRoutes.getOneAccountSourceById(row.id)
    if ((statusCode === 200 || statusCode === 201) && data !== null) {
      setFormData({
        id: row.id,
        name: data.name as string,
        type: data.type,
        initAmount: Number(data.initAmount),
        currency: data.currency
      })
      setIsDialogOpen((prev) => ({ ...prev, isDialogUpdateOpen: true }))
    } else {
      toast.error('Cannot get data of this account source!')
    }
  }

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
            onRowClick={handleOnRowClick}
          />
        </CardContent>
      </Card>
      <CustomDialog config={createConfigDialog} />
      <CustomDialog config={updateConfigDialog} />
      <CustomDialog config={closeConfirmationDialog} />
    </div>
  )
}
