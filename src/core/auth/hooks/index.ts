'use client'

import { useState } from 'react'
import { useSignIn } from '@/core/auth/hooks/useSignIn'
import { useSignUp } from '@/core/auth/hooks/useSignUp'
import { IUseQueryHookOptions } from '@/types/query.interface'
import { useForgotPassword } from '@/core/auth/hooks/useForgotPassword'
import { useResetPassword } from '@/core/auth/hooks/useResetPassword'

export const useAuth = (opts?: IUseQueryHookOptions) => {
  const [isRememberMe, setIsRememberMe] = useState(true)

  const { mutate: signIn, isPending: isSigningIn } = useSignIn(isRememberMe, opts)
  const { mutate: signUp, isPending: isSigningUp } = useSignUp(opts)
  const { mutate: resetPassword, isPending: isResetPassword } = useResetPassword()
  return {
    signIn,
    isSigningIn,
    isRememberMe,
    setIsRememberMe,
    signUp,
    isSigningUp,
    forgotPassword: useForgotPassword,
    resetPassword,
    isResetPassword
  }
}
