import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { EFieldType, IFormZodProps, InputProps, TextareaProps } from '@/types/formZod.interface'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { IDynamicType } from '@/types/common.i'
import { cn } from '@/libraries/utils'
import { Textarea } from '@/components/ui/textarea'
import { Combobox, IComboboxProps } from '@/components/core/Combobox'
import { DateTimePicker, DateTimePickerProps } from '@/components/core/DateTimePicker'
import { DateRangePicker, DateRangePickerProps } from '@/components/core/DateRangePicker'

export default function FormZod({
  formSchema,
  defaultValues,
  onSubmit,
  formFieldBody,
  buttonConfig,
  classNameForm
}: IFormZodProps<z.ZodRawShape>) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  })

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log('Form submitted with data:', data)
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Error in form submission:', error)
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className={cn(classNameForm, 'space-y-3')}>
          {formFieldBody.map((fieldItem, index) => (
            <FormField
              control={form.control}
              name={fieldItem.name}
              key={index}
              render={({ field }) => (
                <FormItem>
                  {fieldItem?.label && <FormLabel>{fieldItem.label}</FormLabel>}
                  <FormControl>
                    <>
                      {fieldItem.type === EFieldType.Input && (
                        <Input
                          placeholder={fieldItem.placeHolder}
                          {...(fieldItem.props as InputProps)}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            console.log(`${fieldItem.name} changed:`, e.target.value)
                          }}
                        />
                      )}
                      {fieldItem.type === EFieldType.Select && (
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            console.log(`${fieldItem.name} selected:`, value)
                          }}
                        >
                          <SelectTrigger className={cn('w-full', fieldItem?.classNameTrigger)}>
                            <SelectValue placeholder={fieldItem.placeHolder} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Select {fieldItem.label}</SelectLabel>
                              {fieldItem?.dataSelector?.map((item: IDynamicType) => (
                                <SelectItem key={item.value} value={item.value}>
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                      {fieldItem.type === EFieldType.Textarea && (
                        <Textarea
                          {...field}
                          placeholder={fieldItem.placeHolder}
                          {...(fieldItem.props as TextareaProps)}
                          onChange={(e) => {
                            field.onChange(e)
                            console.log(`${fieldItem.name} changed:`, e.target.value)
                          }}
                        />
                      )}
                      {fieldItem.type === EFieldType.Combobox && (
                        <Combobox
                          {...(fieldItem.props as IComboboxProps)}
                          onValueSelect={(value) => {
                            field.onChange(value)
                            console.log(`${fieldItem.name} selected:`, value)
                          }}
                        />
                      )}
                      {fieldItem.type === EFieldType.DatePicker && (
                        <DateTimePicker
                          {...field}
                          {...(fieldItem.props as DateTimePickerProps)}
                          onChange={(value) => {
                            field.onChange(value)
                            console.log(`${fieldItem.name} changed:`, value)
                          }}
                        />
                      )}
                      {fieldItem.type === EFieldType.DateRangePicker && (
                        <DateRangePicker
                          {...field}
                          {...(fieldItem.props as DateRangePickerProps)}
                          onChange={(value) => {
                            field.onChange(value)
                            console.log(`${fieldItem.name} changed:`, value)
                          }}
                        />
                      )}
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button {...buttonConfig} type='submit' onClick={() => console.log('Submit button clicked')}>
            {buttonConfig?.label ?? 'Submit'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
