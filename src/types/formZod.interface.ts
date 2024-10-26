import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { IComboboxProps } from '@/components/core/Combobox'
import { DateTimePickerProps } from '@/components/core/DateTimePicker'
import { DateRangePickerProps } from '@/components/core/DateRangePicker'
import { IDynamicType } from '@/types/common.i'
import { ButtonProps } from 'react-day-picker'

export enum EFieldType {
  Input = 'Input',
  Select = 'Select',
  Textarea = 'Textarea',
  Combobox = 'Combobox',
  DatePicker = 'DatePicker',
  DateRangePicker = 'DateRangePicker'
}

export type IFormSchemaZod<T extends z.ZodRawShape> = z.ZodObject<T>

export interface IFormZodProps<T extends z.ZodRawShape> {
  formSchema: IFormSchemaZod<T>
  defaultValues?:
    | Promise<{
        [K in keyof T]: T[K] extends z.ZodTypeAny ? z.infer<T[K]> : any
      }>
    | {
        [K in keyof T]: T[K] extends z.ZodTypeAny ? z.infer<T[K]> : any
      }
    | undefined
  onSubmit: (values: z.infer<IFormSchemaZod<T>>) => void
  formFieldBody: IBodyFormField[]
  buttonConfig?: ButtonProps & { label?: string }
  classNameForm?: string
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string | number }[]
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

type FieldProps<T extends EFieldType> = T extends EFieldType.Input
  ? InputProps
  : T extends EFieldType.Select
    ? SelectProps
    : T extends EFieldType.Textarea
      ? TextareaProps
      : T extends EFieldType.Combobox
        ? IComboboxProps
        : T extends EFieldType.DatePicker
          ? DateTimePickerProps
          : T extends EFieldType.DateRangePicker
            ? DateRangePickerProps
            : never

export interface IBodyFormField<T extends EFieldType = EFieldType> {
  name: string
  type: T
  label?: string
  placeHolder: string
  props?: FieldProps<T>
  dataSelector?: IDynamicType[] | undefined
  classNameTrigger?: string
}

export const formBody: IBodyFormField[] = [
  {
    name: 'username',
    type: EFieldType.Input,
    label: 'Username',
    placeHolder: 'Enter your username',
    props: {
      onChange: (e: any) => console.log(e.target.value)
    }
  },
  {
    name: 'email',
    type: EFieldType.Input,
    label: 'Email',
    placeHolder: 'Enter your email',
    props: {
      onChange: (e: any) => console.log(e.target.value)
    }
  },
  {
    name: 'date',
    type: EFieldType.DatePicker,
    label: 'Date',
    placeHolder: 'Enter your date'
  },
  {
    name: 'dateRange',
    type: EFieldType.DateRangePicker,
    label: 'Date Range',
    placeHolder: 'Enter your date range'
  },
  {
    name: 'options',
    type: EFieldType.Combobox,
    label: 'options',
    placeHolder: 'Select your combobox',
    props: {
      dataArr: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' }
      ]
    }
  }
]

export const registerSchema = z
  .object({
    username: z.string().trim().min(2).max(256),
    email: z.string().email(),
    date: z.date(),
    dateRange: z.any(),
    options: z.any()
  })
  .strict()

export type RegisterBodyType = z.TypeOf<typeof registerSchema>
