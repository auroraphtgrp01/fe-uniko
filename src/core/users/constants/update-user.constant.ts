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
    label: 'Full Name',
    placeHolder: 'Enter your full name',
    props: {
      autoComplete: 'name',
      className: 'col-span-4'
    }
  },
  {
    name: 'dateOfBirth',
    type: EFieldType.DatePicker,
    label: 'Date Of Birth',
    placeHolder: 'Enter your date of birth',
    props: {
      className: 'col-span-2 row-start-2'
    }
  },
  {
    name: 'gender',
    type: EFieldType.Select,
    label: 'Gender',
    placeHolder: 'Enter your gender',
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
    label: 'Workplace',
    placeHolder: 'Enter your workplace',
    props: {
      autoComplete: 'workplace',
      className: 'col-span-2 row-start-3'
    }
  },
  {
    name: 'phone_number',
    type: EFieldType.Input,
    label: 'Phone Number',
    placeHolder: 'Enter your phone number',
    props: {
      autoComplete: 'phoneNumber',
      className: 'col-span-2 col-start-3 row-start-3'
    }
  },
  {
    name: 'address',
    type: EFieldType.Input,
    label: 'Address',
    placeHolder: 'Enter your address',
    props: {
      autoComplete: 'address',
      className: 'col-span-4 row-start-4'
    }
  }
]
