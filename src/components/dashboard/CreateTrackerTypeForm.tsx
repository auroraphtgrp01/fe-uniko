import { ITrackerTransactionTypeBody } from '@/core/tracker-transaction-type/models/tracker-transaction-type.interface'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import React from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { EmojiPicker } from '../common/EmojiPicker'
import { ETypeOfTrackerTransactionType } from '@/core/tracker-transaction-type/models/tracker-transaction-type.enum'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ICreateTrackerTypeFormProps {
  typeOfTrackerType: ETypeOfTrackerTransactionType
  formRef: React.RefObject<HTMLFormElement>
  handleCreateTrackerType: (
    data: ITrackerTransactionTypeBody,
    setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
  ) => void
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
  selectType?: boolean
}

export default function CreateTrackerTypeForm({
  typeOfTrackerType,
  formRef,
  handleCreateTrackerType,
  setIsCreating,
  selectType
}: ICreateTrackerTypeFormProps) {
  const createTrackerTypeSchema = z
    .object({
      name: z.string().trim().min(2).max(256),
      description: z.any(),
      type: z.nativeEnum(ETypeOfTrackerTransactionType).optional()
    })
    .strict()

  const form = useForm<z.infer<typeof createTrackerTypeSchema>>({
    resolver: zodResolver(createTrackerTypeSchema)
  })

  const onSubmit = (data: z.infer<typeof createTrackerTypeSchema>) => {
    const payload: ITrackerTransactionTypeBody = { ...data, type: typeOfTrackerType }
    handleCreateTrackerType(payload, setIsCreating)
  }
  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className='space-y-1'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='grid gap-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <FormLabel className='text-white-700'>Name</FormLabel>
                <FormControl className='col-span-3'>
                  <div className='flex flex-col gap-1'>
                    <FormMessage />
                    <div className='flex gap-2'>
                      <Input className='h-10 w-full' placeholder='Name *' {...field} />
                      <EmojiPicker
                        onChangeValue={(value) => {
                          field.onChange(form.getValues('name') + value.native)
                        }}
                      />
                    </div>
                  </div>
                </FormControl>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem className='grid grid-cols-4 items-center gap-4'>
              <FormLabel className='text-white-700'>Description</FormLabel>
              <FormControl className='col-span-3'>
                <div className='flex flex-col gap-1'>
                  {/* Error message for description if needed */}
                  <FormMessage />
                  <Textarea placeholder='Description' {...field} />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        {selectType && (
          <FormField
            control={form.control}
            name='type'
            render={({ field }) => (
              <FormItem className='grid grid-cols-4 items-center gap-4'>
                <FormLabel className='text-white-700'>Type</FormLabel>
                <FormControl className='col-span-3'>
                  <div className='flex flex-col gap-1'>
                    <FormMessage />
                    <Select defaultValue={typeOfTrackerType} onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select type' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='INCOMING'>INCOMING</SelectItem>
                        <SelectItem value='EXPENSE'>EXPENSE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        )}
      </form>
    </Form>
  )
}
