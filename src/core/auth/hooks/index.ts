'use client'

import { useState } from 'react'
import { useSignIn } from '@/core/auth/hooks/useSignIn'
import { useSignUp } from '@/core/auth/hooks/useSignUp'
import { IUseQueryHookOptions } from '@/types/query.interface'

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
