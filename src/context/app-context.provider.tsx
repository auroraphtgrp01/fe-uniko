'use client'
import { IUserFromToken } from '@/types/user.i'
import { createContext, useState, useEffect, useContext, ReactNode, Dispatch, SetStateAction, FC } from 'react'

interface AppContextType {
  user: IUserFromToken | null
  setUser: Dispatch<SetStateAction<IUserFromToken | null>>
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUserFromToken | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser) as IUserFromToken)
    }
  }, [])

  const value = { user, setUser, loading, setLoading }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
