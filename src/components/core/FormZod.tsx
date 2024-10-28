import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form'
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
import { DateRange } from 'react-day-picker'

export default function FormZod<T extends z.ZodRawShape>({
  formSchema,
  defaultValues,
  onSubmit,
  formFieldBody,
  buttonConfig,
  classNameForm
}: IFormZodProps<T>) {
  const form = useForm<z.infer<z.ZodObject<T>>>({
    resolver: zodResolver(formSchema),
    defaultValues
  })

  function handleSubmit(value: z.infer<z.ZodObject<T>>) {
    onSubmit(value)
  }

  useEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues, form])

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className={cn(classNameForm, 'space-y-3')}>
          {formFieldBody.map((fieldItem, index) => (
            <FormField
              control={form.control}
              name={fieldItem.name as any}
              key={index}
              render={({ field }) => {
                return (
                  <FormItem className={(fieldItem.props as any).className}>
                    {fieldItem?.label && <FormLabel className='text-muted-foreground'>{fieldItem.label}</FormLabel>}
                    <FormControl>
                      <>
                        {fieldItem.type === EFieldType.Input && (
                          <Input
                            placeholder={fieldItem.placeHolder}
                            {...(fieldItem.props as InputProps)}
                            {...field}
                            onChange={(value) => {
                              field.onChange(value)
                            }}
                          />
                        )}
                        {fieldItem.type === EFieldType.Select && (
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                            }}
                            {...(fieldItem.props as any)}
                            {...field}
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
                            onChange={(value) => {
                              field.onChange(value)
                            }}
                          />
                        )}

                        {fieldItem.type === EFieldType.Combobox && (
                          <Combobox
                            {...field}
                            {...(fieldItem.props as IComboboxProps)}
                            onValueSelect={(value) => {
                              field.onChange(value)
                            }}
                          />
                        )}
                        {fieldItem.type === EFieldType.DatePicker && (
                          <DateTimePicker
                            {...field}
                            {...(fieldItem.props as DateTimePickerProps)}
                            onChange={(value) => {
                              field.onChange(value)
                            }}
                          />
                        )}
                        {fieldItem.type === EFieldType.DateRangePicker && (
                          <DateRangePicker
                            {...field}
                            {...(fieldItem.props as DateRangePickerProps)}
                            value={field.value as DateRange | undefined}
                            onChange={(value) => {
                              field.onChange(value)
                            }}
                          />
                        )}
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          ))}
          <Button {...buttonConfig} type='submit'>
            {buttonConfig?.label ?? 'Submit'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
