'use client'

import { useStoreLocal } from '@/hooks/useStoreLocal'
import { useEffect } from 'react'
import GoogleOneTap from '../components/core/GoogleOneTap'

export default function Template({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useStoreLocal()

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
      <GoogleOneTap></GoogleOneTap>
      {children}
    </div>
  )
}
