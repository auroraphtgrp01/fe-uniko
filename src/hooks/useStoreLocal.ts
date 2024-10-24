import { IAccountSource } from '@/core/account-source/models'
import { IUserFromToken } from '@/types/user.i'
import { create } from 'zustand'

interface StoreState {
  // account source store
  accountSourceData: IAccountSource[]
  setAccountSourceData: (data: IAccountSource[]) => void
  // user store
  user: IUserFromToken | null
  setUser: (user: IUserFromToken | null) => void
}

export const useStoreLocal = create<StoreState>((set) => ({
  // account source store
  accountSourceData: [],
  setAccountSourceData: (data) => set({ accountSourceData: data }),
  // user store
  user: null,
  setUser: (user) => set({ user })
}))
