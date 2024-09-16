'use client'

import { useState } from 'react'
import { IUseQueryHookOptions } from '@/hooks/query-hooks/query-hook.i'
import { useSignIn, useSignUp } from '@/services/authServices'

export const useAuth = (opts?: IUseQueryHookOptions) => {
  const [isRememberMe, setIsRememberMe] = useState(true)

  const { mutate: signIn, isPending: isSigningIn } = useSignIn(isRememberMe, opts)
  const { mutate: signUp, isPending: isSigningUp } = useSignUp(opts)

  return {
    signIn,
    isSigningIn,
    isRememberMe,
    setIsRememberMe,
    signUp,
    isSigningUp
  }
}
