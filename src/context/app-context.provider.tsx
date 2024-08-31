'use client'
import { IUserFromToken } from '@/types/user.i' // Ensure this path is correct
import { createContext, useState, useEffect, useContext, ReactNode } from 'react'

interface AppContextType {
  user: IUserFromToken | null
  setUser: React.Dispatch<React.SetStateAction<IUserFromToken | null>>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUserFromToken | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser) as IUserFromToken)
    }
  }, [])

  const value = { user, setUser }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
