'use client'

import { useStoreLocal } from '@/hooks/useStoreLocal'
import { useEffect } from 'react'
import GoogleOneTap from '../components/core/GoogleOneTap'
import { getAccessTokenFromLocalStorage } from '@/libraries/helpers'

export default function Template({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useStoreLocal()
  const isAuthenticated = getAccessTokenFromLocalStorage()

  useEffect(() => {
    if (user === null) {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }
  }, [user])

  return (
    <div>
      {/* {!isAuthenticated && <GoogleOneTap></GoogleOneTap>} */}
      {children}
    </div>
  )
}
