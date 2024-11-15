'use client'

import { modifiedTrackerTypeForComboBox } from '@/app/dashboard/tracker-transaction/handlers'
import FormZod from '@/components/core/FormZod'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ICategoryTabsContentProps, IExpenditureFund } from '@/core/expenditure-fund/models/expenditure-fund.interface'
import {
  defineEditTrackerTypeBody,
  editTrackerTypeSchema
} from '@/core/tracker-transaction-type/constants/update-tracker-transaction-type.constant'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import {
  IEditTrackerTypeDialogData,
  ITrackerTransactionTypeBody
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { DeleteIcon, EditIcon, PlusIcon, SaveIcon, Undo2Icon } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'

export default function CategoryTabsContent({
  detailData,
  type,
  setType,
  categoryTabProps,
  setIsCreating
}: ICategoryTabsContentProps) {
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

  const formRefEdit = useRef<HTMLFormElement>(null)

  const onHandleUpdate = () => {
    if (isUpdate) {
      formRefEdit.current?.requestSubmit()
    }
    setIsUpdate(!isUpdate)
  }

  return (
    <div className='w-full space-y-3'>
      <Input
        value={valueSearch}
        onChange={(e) => setValueSearch(e.target.value)}
        className='w-full'
        placeholder='Search Tracker Transaction Type'
      />
      <div className='flex space-x-2'>
        <Select onValueChange={(value) => setType(value as ETypeOfTrackerTransactionType)} value={type}>
          <SelectTrigger>
            <SelectValue placeholder='Select type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='INCOMING'>Incoming</SelectItem>
            <SelectItem value='EXPENSE'>Expense</SelectItem>
          </SelectContent>
        </Select>
        <Button className='w-full whitespace-nowrap sm:w-auto' variant='secondary' onClick={() => setIsCreating(true)}>
          Create <PlusIcon className='ml-1 h-4 w-4' />
        </Button>
      </div>
      <ScrollArea className='h-52 overflow-y-auto rounded-md border p-4'>
        <Accordion
          onValueChange={(value) => {
            setAccordionValue(value)
          }}
          type='single'
          collapsible
          className='w-full'
        >
          {filteredDataArr.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className='text-white hover:text-gray-300'>
                <span>{item.label}</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className='flex w-full justify-between'>
                  <Button onClick={() => {}} variant={'destructive'}>
                    Delete
                    <DeleteIcon className='h-4' />
                  </Button>
                  <div className='flex gap-2'>
                    {isUpdate && (
                      <Button
                        onClick={() => {
                          setIsUpdate(false)
                        }}
                        className='w-full'
                        variant={'blueVin'}
                      >
                        <div className='flex w-full justify-between'>
                          <Undo2Icon className='h-4' />
                          <span>Discard</span>
                        </div>
                      </Button>
                    )}
                    <Button variant={'default'} onClick={onHandleUpdate} className='w-full'>
                      {isUpdate ? (
                        <div>
                          <div className='flex w-full justify-between'>
                            <SaveIcon className='h-4' />
                            <span>Save</span>
                          </div>
                        </div>
                      ) : (
                        <div className='flex w-full justify-between'>
                          <EditIcon className='h-4' />
                          <span>Edit</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
                <div className='grid gap-4 py-4'>
                  <FormZod
                    submitRef={formRefEdit}
                    defaultValues={{
                      name: item.name,
                      type: item.type as ETypeOfTrackerTransactionType,
                      description: item.description
                    }}
                    formFieldBody={defineEditTrackerTypeBody(isUpdate, item.type as ETypeOfTrackerTransactionType)}
                    formSchema={editTrackerTypeSchema}
                    onSubmit={(data) => {
                      categoryTabProps.handleUpdate({
                        ...data,
                        id: accordionValue
                      } as ITrackerTransactionTypeBody)
                    }}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  )
}
