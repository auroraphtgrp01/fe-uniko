import { EFieldType, IBodyFormField } from '@/types/formZod.interface'
import { z } from 'zod'

export const signUpSchema = z
  .object({
    fullName: z.string().trim().min(2).max(256),
    email: z.string().email(),
    password: z.string()
  })
  .strict()

export const signUpFormBody: IBodyFormField[] = [
  {
    name: 'fullName',
    type: EFieldType.Input,
    label: 'Full name',
    placeHolder: 'Enter your full name',
    props: {
      autoComplete: 'name'
    }
  },
  {
    name: 'email',
    type: EFieldType.Input,
    label: 'Email',
    placeHolder: 'Enter your email',
    props: {
      autoComplete: 'email'
    }
  },
  {
    name: 'password',
    type: EFieldType.Input,
    label: 'Password',
    placeHolder: 'Enter your password',
    props: {
      type: 'password',
      autoComplete: 'password'
    }
  }
]
