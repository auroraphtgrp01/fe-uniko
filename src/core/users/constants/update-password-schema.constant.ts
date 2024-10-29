import { EFieldType, IBodyFormField } from '@/types/formZod.interface'
import { z } from 'zod'

export const updatePassWordSchema = z
  .object({
    currentPassword: z.string().min(3, { message: 'Current password must be at least 3 characters long.' }),
    newPassword: z.string().min(3, { message: 'New password must be at least 3 characters long.' })
    //   .regex(/[a-zA-Z]/, { message: 'Password must include letters.' })
    //   .regex(/[0-9]/, { message: 'Password must include at least one number.' })
    //   .regex(/[^a-zA-Z0-9]/, { message: 'Password must include at least one special character.' })
  })
  .strict()
export const updatePasswordFormBody: IBodyFormField[] = [
  {
    name: 'currentPassword',
    type: EFieldType.Input,
    label: 'Current Password',
    placeHolder: 'Enter your current password',
    props: {
      type: 'password',
      autoComplete: 'password'
    }
  },
  {
    name: 'newPassword',
    type: EFieldType.Input,
    label: 'New Password',
    placeHolder: 'Enter your new password',
    props: {
      type: 'password',
      autoComplete: 'password'
    }
  }
]
