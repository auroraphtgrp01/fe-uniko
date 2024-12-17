import { Delete, Edit, Save, Undo2 } from 'lucide-react'
import FormZod from '../core/FormZod'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import {
  defineEditTrackerTypeBody,
  editTrackerTypeSchema
} from '@/core/tracker-transaction-type/constants/update-tracker-transaction-type.constant'
import {
  IEditTrackerTypeDialogData,
  ITrackerTransactionType,
  ITrackerTransactionTypeBody
} from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface IAccordionEditTrackerTypeProps {
  dataArr: IEditTrackerTypeDialogData[]
  handleUpdateTrackerType: (data: ITrackerTransactionTypeBody) => void
  handleDeleteTrackerType: (id: string) => void
  className?: string
}

export default function AccordionEditTrackerType({
  dataArr,
  handleUpdateTrackerType,
  handleDeleteTrackerType,
  className
}: IAccordionEditTrackerTypeProps) {
  const [isUpdate, setIsUpdate] = useState<boolean>(false)
  const [accordionValue, setAccordionValue] = useState<string | null>(null)

  const formRefEdit = useRef<HTMLFormElement>(null)

  const onHandleUpdate = () => {
    if (isUpdate) {
      formRefEdit.current?.requestSubmit()
    }
    setIsUpdate(!isUpdate)
  }
  const { t } = useTranslation(['common'])

  return (
    <div>
      <ScrollArea className={className || 'h-96 overflow-y-auto rounded-md border p-4'}>
        <Accordion
          onValueChange={(value) => {
            setAccordionValue(value)
          }}
          type='single'
          collapsible
          className='w-full'
        >
          {dataArr?.length > 0
            ? dataArr.map((data) => (
                <AccordionItem key={data.value} value={data.value}>
                  <AccordionTrigger className='flex justify-between'>{data.label}</AccordionTrigger>
                  <AccordionContent>
                    <div className='flex w-full justify-between'>
                      <Button variant={'destructive'} onClick={() => handleDeleteTrackerType(data.id)}>
                        {t('common:button.delete')}
                        <Delete className='h-4' />
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
                              <Undo2 className='h-4' />
                              <span>Discard</span>
                            </div>
                          </Button>
                        )}
                        <Button variant={'default'} onClick={onHandleUpdate} className='w-full'>
                          {isUpdate ? (
                            <div>
                              <div className='flex w-full justify-between'>
                                <Save className='h-4' />
                                <span>{t('common:button.save')}</span>
                              </div>
                            </div>
                          ) : (
                            <div className='flex w-full justify-between'>
                              <Edit className='h-4' />
                              <span>{t('common:button.edit')}</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className='grid gap-4 py-4'>
                      <FormZod
                        submitRef={formRefEdit}
                        defaultValues={{
                          name: data.name,
                          type: data.type as ETypeOfTrackerTransactionType,
                          description: data.description
                        }}
                        formFieldBody={defineEditTrackerTypeBody(isUpdate, data.type as ETypeOfTrackerTransactionType)}
                        formSchema={editTrackerTypeSchema}
                        onSubmit={(data) => {
                          handleUpdateTrackerType({ ...data, id: accordionValue } as ITrackerTransactionTypeBody)
                        }}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))
            : ''}
        </Accordion>
      </ScrollArea>
    </div>
  )
}
