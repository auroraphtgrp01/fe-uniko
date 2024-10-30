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

interface ICreateTrackerTypeFormProps {
  typeOfTrackerType: ETypeOfTrackerTransactionType
  formRef: React.RefObject<HTMLFormElement>
  handleCreateTrackerType: (
    data: ITrackerTransactionTypeBody,
    setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
  ) => void
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CreateTrackerTypeForm({
  typeOfTrackerType,
  formRef,
  handleCreateTrackerType,
  setIsCreating
}: ICreateTrackerTypeFormProps) {
  const createTrackerTypeSchema = z
    .object({
      name: z.string().trim().min(2).max(256),
      description: z.string().min(10).max(256).optional()
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
                <FormLabel htmlFor='name' className='text-left'>
                  Name
                </FormLabel>
                <FormControl className='col-span-3'>
                  <div className='flex gap-2'>
                    <Input className='h-10 w-full' placeholder='Name *' {...field} />
                    <EmojiPicker
                      onChangeValue={(value) => {
                        field.onChange(form.getValues('name') + value.native)
                      }}
                    />
                  </div>
                </FormControl>
              </div>
              <FormMessage className='col-span-3 col-start-2' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem className='grid grid-cols-4 items-center gap-4'>
              <FormLabel htmlFor='description'>Description</FormLabel>
              <FormControl className='col-span-3'>
                <Textarea placeholder='Description' {...field} />
              </FormControl>
              <FormMessage className='col-span-3 col-start-2' />
            </FormItem>
          )}
        />
        {/* Uncomment the following line if you want to include a submit button */}
        {/* <Button type="submit" className="ml-[25%]">Submit</Button> */}
      </form>
    </Form>
  )
}
