import { EFieldType, IBodyFormField } from '@/types/formZod.interface'
import { z } from 'zod'

export const signInSchema = z
  .object({
    email: z.string().email(),
    password: z.string()
  })
  .strict()

export const signInFormBody: IBodyFormField[] = [
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
