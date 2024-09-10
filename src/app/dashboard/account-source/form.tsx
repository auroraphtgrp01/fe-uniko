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
import React, { use, useEffect, useState } from 'react'
import { IAccountSourceDataFormat, IAccountSourceBody, IAccountSource } from '@/types/account-source.i'
import { apiService } from '@/libraries/api'
import { formatCurrency, getConvertedKeysToTitleCase, getTypes } from '@/libraries/utils'
import { HandCoins, Landmark, Wallet2 } from 'lucide-react'
import { IBaseResponseData, ISelectFields } from '@/types/common.i'
import toast from 'react-hot-toast'
import { useAccountSource } from '@/hooks/query-hooks/use-account-source'

const accountSourceRoutes = apiService.accountSource

export default function AccountSourceForm() {
  const [isDialogCreateOpen, setIsDialogCreateOpen] = useState(false)
  const [isDialogUpdateOpen, setIsDialogUpdateOpen] = useState(false)
  const [data, setData] = useState<IAccountSourceDataFormat[]>([])
  const [columns, setColumns] = useState<any[]>([])
  const [totalPage, setTotalPage] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [condition, setCondition] = useState<string>()
  const [isExactly, setIsExactly] = useState<boolean>()
  const [sort, setSort] = useState<string>()
  const [includePopulate, setIncludePopulate] = useState<boolean>(true)
  const [selectFields, setSelectFields] = useState<ISelectFields[]>([])
  const [id, setId] = useState<string>('')
  const [nameInput, setNameInput] = useState<string>('')
  const [typeInput, setTypeInput] = useState<string>('')
  const [initAmountInput, setInitAmountInput] = useState<number>()
  const [currencyInput, setCurrencyInput] = useState<string>('')
  const [types, setTypes] = useState<string[]>()
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [filteredData, setFilteredData] = useState<IAccountSourceDataFormat[]>([])

  const { createAccountSource, updateAccountSource } = useAccountSource()
  // GET DATA
  useEffect(() => {
    ;(async () => {
      const payload = await accountSourceRoutes.getAccountSource({
        page: currentPage,
        limit,
        condition,
        isExactly,
        sort,
        includePopulate,
        select: selectFields
      })
      const dataFormat: IAccountSourceDataFormat[] = formatArrayData(payload?.data)
      const titles = getConvertedKeysToTitleCase(dataFormat[0])

      const columns = getColumns(titles, true)
      setData(dataFormat)
      setFilteredData(dataFormat)
      setColumns(columns)
      setTypes(getTypes(payload?.data))
      setTotalPage(Number(payload?.pagination?.totalPage))
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, condition, isExactly, sort, includePopulate, selectFields])

  // FILTER DATA
  useEffect(() => {
    if (selectedTypes.length === 0) setFilteredData(data as IAccountSourceDataFormat[])
    else
      setFilteredData(data.filter((item: IAccountSourceDataFormat) => selectedTypes.includes(item.checkType as string)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTypes])
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
  const contentDialogForm = (
    <div className='grid gap-4 py-4'>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='sourceName' className='text-right'>
          Source Name
        </Label>
        <Input
          value={nameInput}
          onChange={(e) => {
            setNameInput(e.target.value)
          }}
          className='col-span-3'
          placeholder='Source Name *'
        />
      </div>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='type' className='text-right'>
          Type
        </Label>
        <Select onValueChange={(value) => setTypeInput(value)} value={typeInput}>
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
          defaultValue={initAmountInput}
          onChange={(e) => {
            setInitAmountInput(Number(e.target.value))
          }}
          className='col-span-3'
          placeholder='Init Amount *'
        />
      </div>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='currency' className='text-right'>
          Currency
        </Label>
        <Select onValueChange={(value) => setCurrencyInput(value)} value={currencyInput}>
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
  const titleDialogCreate = 'Create Account Source'
  const descriptionDialogCreate = 'Please fill in the information below to create a new account source.'
  const footerDialogCreate = (
    <Button type='button' onClick={async () => await handleCreateAccountSource()}>
      Save changes
    </Button>
  )

  const titleDialogUpdate = 'Update Account Source'
  const descriptionDialogUpdate = 'Please fill in the information below to update a new account source.'
  const footerDialogUpdate = (
    <Button type='button' onClick={async () => await handleUpdateAccountSource()}>
      Save changes
    </Button>
  )

  const handleCreateAccountSource = async () => {
    const payload: IAccountSourceBody = {
      name: nameInput,
      type: typeInput,
      initAmount: initAmountInput,
      currency: currencyInput
    }
    createAccountSource(payload, {
      onSuccess: (res) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          const format = formatData(res.data)
          setIsDialogCreateOpen(false)
          setData([format, ...data])
          toast.success('Create account source successfully!')
        }
      }
    })
  }
  const handleUpdateAccountSource = async () => {
    const payload: IAccountSourceBody & { id: string } = {
      name: nameInput,
      type: typeInput,
      initAmount: initAmountInput,
      currency: currencyInput,
      id
    }
    updateAccountSource(payload, {
      onSuccess(res) {
        if (res.statusCode === 200 || res.statusCode === 201) {
          const format = formatData(res.data)
          setData((prevRows) => prevRows.map((row) => (row.id === format.id ? { ...row, ...format } : row)))
          setIsDialogUpdateOpen(false)
          toast.success('Update account source successfully!')
        }
      }
    })
  }

  const handleOnRowClick = async (row: IAccountSourceDataFormat) => {
    const { data, statusCode } = await accountSourceRoutes.getOneAccountSourceById(row.id)
    if ((statusCode === 200 || statusCode === 201) && data !== null) {
      console.log(data.type)

      setId(row.id)
      setIsDialogUpdateOpen(true)
      setNameInput(data.name as string)
      setTypeInput(data.type)
      setInitAmountInput(Number(data.initAmount))
      setCurrencyInput(data.currency)
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
            isVisibleSortType={true}
            types={types}
            createFunction={() => setIsDialogCreateOpen(true)}
            columns={columns}
            data={filteredData}
            isPaginate={true}
            classNameOfScroll='h-[calc(100vh-30rem)]'
            onRowClick={handleOnRowClick}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            limit={limit}
            setLimit={setLimit}
            totalPage={totalPage}
            setTotalPage={setTotalPage}
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
          />
        </CardContent>
      </Card>
      <CustomDialog
        isOpen={isDialogCreateOpen}
        onClose={() => setIsDialogCreateOpen(false)}
        content={contentDialogForm}
        footer={footerDialogCreate}
        title={titleDialogCreate}
        description={descriptionDialogCreate}
      />
      <CustomDialog
        isOpen={isDialogUpdateOpen}
        onClose={() => setIsDialogUpdateOpen(false)}
        content={contentDialogForm}
        footer={footerDialogUpdate}
        title={titleDialogUpdate}
        description={descriptionDialogUpdate}
      />
    </div>
  )
}
