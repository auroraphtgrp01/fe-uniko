import { EFieldType, IBodyFormField } from '@/types/formZod.interface'
import { z } from 'zod'

export const forgotPasswordFormSchema = z
  .object({
    email: z.string().email()
  })
  .strict()

export const forgotPasswordFormBody: IBodyFormField[] = [
  {
    name: 'email',
    type: EFieldType.Input,
    label: 'Email',
    placeHolder: 'Enter your email',
    props: {
      autoComplete: 'email'
    }
  }
]
