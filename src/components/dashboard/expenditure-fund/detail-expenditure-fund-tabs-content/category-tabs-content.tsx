'use client'

import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ICategoryTabsContentProps } from '@/core/expenditure-fund/models/expenditure-fund.interface'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { IEditTrackerTypeDialogData } from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { IDialogConfig } from '@/types/common.i'
import { PlusIcon } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import CreateTrackerTypeForm from '../../CreateTrackerTypeForm'
import CustomDialog from '../../Dialog'
import AccordionEditTrackerType from '../../AccordionEditTrackerType'
import { useTranslation } from 'react-i18next'

export default function CategoryTabsContent({
  detailData,
  type,
  setType,
  categoryTabProps,
  setIsCreating,
  isCreating
}: ICategoryTabsContentProps) {
  const formRefCreate = useRef<HTMLFormElement>(null)
  const formRefSave = useRef<HTMLFormElement>(null)

  const [valueSearch, setValueSearch] = useState<string>('')
  const [accordionValue, setAccordionValue] = useState<string>('')
  const [isUpdate, setIsUpdate] = useState(false)
  const editCategories: IEditTrackerTypeDialogData[] = useMemo(
    () => modifiedTrackerTypeForComboBox(detailData.categories.filter((category) => category.type === type)),
    [detailData.categories, type]
  )

  const filteredDataArr = editCategories?.filter((data: IEditTrackerTypeDialogData) =>
    data.label.toLowerCase().includes(valueSearch.trim().toLowerCase())
  )
  const { t } = useTranslation(['expenditureFundDetails', 'common'])

  const createTrackerTypeDialog: IDialogConfig = {
    content: (
      <CreateTrackerTypeForm
        typeOfTrackerType={type}
        formRef={formRefCreate}
        handleCreateTrackerType={categoryTabProps.handleCreate}
        setIsCreating={setIsCreating}
        selectType={true}
        expenditureFund={categoryTabProps.expenditureFund}
        defaultFundId={detailData.id}
      />
    ),
    isOpen: isCreating,
    onClose: () => setIsCreating(false),
    title: t('createTrackerTypeDialog.title'),
    description: t('createTrackerTypeDialog.description'),
    footer: (
      <Button onClick={() => formRefCreate.current?.requestSubmit()} type='button'>
        {t('common:button.save')}
      </Button>
    )
  }

  return (
    <div className='w-full space-y-3'>
      <Input
        value={valueSearch}
        onChange={(e) => setValueSearch(e.target.value)}
        className='w-full'
        placeholder={t('categoryTabsContent.input')}
      />
      <div className='flex space-x-2'>
        <Select onValueChange={(value) => setType(value as ETypeOfTrackerTransactionType)} value={type}>
          <SelectTrigger style={{ userSelect: 'none' }}>
            <SelectValue placeholder='Select type' />
          </SelectTrigger>
          <SelectContent style={{ userSelect: 'none' }}>
            <SelectItem value='INCOMING'>Incoming</SelectItem>
            <SelectItem value='EXPENSE'>Expense</SelectItem>
          </SelectContent>
        </Select>
        <Button
          className='w-full whitespace-nowrap py-1 sm:w-auto'
          variant='secondary'
          onClick={() => setIsCreating(true)}
        >
          {t('common:button.create')} <PlusIcon className='ml-1 h-4 w-4' />
        </Button>
      </div>
      <AccordionEditTrackerType
        dataArr={filteredDataArr || []}
        handleDeleteTrackerType={(id: string) => {}}
        handleUpdateTrackerType={categoryTabProps.handleUpdate}
        className='h-52 overflow-y-auto rounded-md border p-4'
      />
      <CustomDialog config={createTrackerTypeDialog} />
    </div>
  )
}
