import { EFieldType, IBodyFormField } from '@/types/formZod.interface'
import { z } from 'zod'

export const updateUserSchema = z
  .object({
    fullName: z.string().min(5),
    dateOfBirth: z.date(),
    gender: z.string().min(3),
    workplace: z.string().min(3),
    phone_number: z.string().min(3),
    address: z.string().min(3)
  })
  .strict()

export const updateUserFormBody: IBodyFormField[] = [
  {
    name: 'fullName',
    type: EFieldType.Input,
    label: 'profile:form.common.fullName.label',
    placeHolder: 'profile:form.common.fullName.placeholder',
    props: {
      autoComplete: 'name',
      className: 'col-span-4'
    }
  },
  {
    name: 'dateOfBirth',
    type: EFieldType.DatePicker,
    label: 'form.common.dateOfBirth.label',
    placeHolder: 'form.common.dateOfBirth.placeholder',
    props: {
      className: 'col-span-2 row-start-2'
    }
  },
  {
    name: 'gender',
    type: EFieldType.Select,
    label: 'form.common.gender.label',
    placeHolder: 'form.common.gender.placeholder',
    dataSelector: [
      {
        value: 'Male',
        label: 'Male'
      },
      {
        value: 'Female',
        label: 'Female'
      }
    ],
    props: {
      className: 'col-span-2 col-start-3 row-start-2'
    }
  },
  {
    name: 'workplace',
    type: EFieldType.Input,
    label: 'form.common.workplace.label',
    placeHolder: 'form.common.workplace.placeholder',
    props: {
      autoComplete: 'workplace',
      className: 'col-span-2 row-start-3'
    }
  },
  {
    name: 'phone_number',
    type: EFieldType.Input,
    label: 'form.common.phone_number.label',
    placeHolder: 'form.common.phone_number.placeholder',
    props: {
      autoComplete: 'phoneNumber',
      className: 'col-span-2 col-start-3 row-start-3'
    }
  },
  {
    name: 'address',
    type: EFieldType.Input,
    label: 'form.common.address.label',
    placeHolder: 'form.common.address.placeholder',
    props: {
      autoComplete: 'address',
      className: 'col-span-4 row-start-4'
    }
  }
]
