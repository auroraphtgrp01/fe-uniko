import { z } from 'zod'
import { EFieldType, IBodyFormField } from '@/types/formZod.interface'

export const updatePassWordSchemaWithCurrentPassword = z
  .object({
    currentPassword: z.string().min(3, { message: 'Current password must be at least 3 characters long.' }),
    newPassword: z.string().min(3, { message: 'New password must be at least 3 characters long.' })
  })
  .strict()

export const updatePassWordSchemaWithoutCurrentPassword = z
  .object({
    newPassword: z.string().min(3, { message: 'New password must be at least 3 characters long.' })
  })
  .strict()

export const updatePasswordFormBodyWithCurrentPassword: IBodyFormField[] = [
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

export const updatePasswordFormBodyWithoutCurrentPassword: IBodyFormField[] = [
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
