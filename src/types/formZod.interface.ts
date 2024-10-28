import { z } from 'zod'
import { IComboboxProps } from '@/components/core/Combobox'
import { DateTimePickerProps } from '@/components/core/DateTimePicker'
import { DateRangePickerProps } from '@/components/core/DateRangePicker'
import { IDynamicType } from '@/types/common.i'
import { ButtonProps } from 'react-day-picker'
import { DefaultValues } from 'react-hook-form'
import { EEmojiPickerProps } from '@/components/common/EmojiPicker'

export enum EFieldType {
  Input = 'Input',
  Select = 'Select',
  Textarea = 'Textarea',
  Combobox = 'Combobox',
  DatePicker = 'DatePicker',
  DateRangePicker = 'DateRangePicker',
  EmojiPicker = 'EmojiPicker'
}

export type IFormSchemaZod<T extends z.ZodRawShape> = z.ZodObject<T>

export interface IFormZodProps<T extends z.ZodRawShape> {
  formSchema: z.ZodObject<T>
  defaultValues?: DefaultValues<z.infer<z.ZodObject<T>>> | undefined
  onSubmit: (values: z.infer<z.ZodObject<T>>) => void
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
            : T extends EFieldType.EmojiPicker
              ? EEmojiPickerProps
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
