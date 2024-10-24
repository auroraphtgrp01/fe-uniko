import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { EmojiPicker } from '@/components/common/EmojiPicker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Check, Delete, Edit, ReceiptRussianRuble, Save, Undo2 } from 'lucide-react'

export interface IEditTrackerTypeDialogProps {
  openEditDialog: boolean
  setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>
  dataArr: { value: string; label: string }[]
}

export default function EditTrackerTypeDialog({
  openEditDialog,
  setOpenEditDialog,
  dataArr
}: IEditTrackerTypeDialogProps) {
  const [isUpdate, setIsUpdate] = React.useState(false)
  const onHandleUpdate = () => {
    if (isUpdate) {
      //update
    }
    setIsUpdate(!isUpdate)
  }
  return (
    <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
      <DialogContent className='rsm:max-w-[525px]'>
        <DialogHeader>
          <DialogTitle>Edit Tracker Transaction Type</DialogTitle>
          <DialogDescription>Make changes to your Tracker Transaction Type</DialogDescription>
          <div className='mt-4 w-full'>
            <Input className='w-full' placeholder='Search Tracker Transaction Type' />
          </div>
        </DialogHeader>

        <div>
          <ScrollArea className='h-96 overflow-y-auto rounded-md border p-4'>
            <Accordion type='single' collapsible className='w-full'>
              {dataArr.map((data) => (
                <AccordionItem key={data.value} value={data.value}>
                  <AccordionTrigger className='flex justify-between'>{data.label}</AccordionTrigger>
                  <AccordionContent>
                    <div className='flex w-full justify-between'>
                      <Button variant={'destructive'}>
                        Delete
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
                                <span>Save</span>
                              </div>
                            </div>
                          ) : (
                            <div className='flex w-full justify-between'>
                              <Edit className='h-4' />
                              <span>Edit</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className='grid gap-4 py-4'>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='name' className='text-left'>
                          Name
                        </Label>
                        <div className='col-span-3 flex gap-2'>
                          <Input
                            value={data.label}
                            disabled={!isUpdate}
                            // value={formData.name}
                            // onChange={(e) => {
                            //   setFormData((prev) => ({ ...prev, name: e.target.value }))
                            // }}
                            placeholder='Name *'
                          />
                          <EmojiPicker
                            disabled={!isUpdate}
                            onChangeValue={(value) => {
                              // setFormData((prev) => ({ ...prev, name: prev.name + value.native }))
                            }}
                          />
                        </div>
                      </div>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='type' className='text-left'>
                          Type
                        </Label>
                        <Select
                          disabled={!isUpdate}
                          //   onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                          //   value={formData.type}
                        >
                          <SelectTrigger className='col-span-3'>
                            <SelectValue placeholder='Select a type' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem key={'INCOMING'} value={'INCOMING'}>
                              Incoming
                            </SelectItem>
                            <SelectItem key={'EXPENSE'} value={'EXPENSE'}>
                              Expense
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='description' className='text-left'>
                          Description
                        </Label>
                        <Textarea
                          disabled={!isUpdate}
                          //   value={description}
                          // onChange={(e) => {
                          //   setFormData((prev) => ({ ...prev, description: e.target.value }))
                          // }}
                          className='col-span-3'
                          placeholder='Description *'
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </div>
        <Button type='submit' className='w-full'>
          Save changes
        </Button>
      </DialogContent>
    </Dialog>
  )
}
