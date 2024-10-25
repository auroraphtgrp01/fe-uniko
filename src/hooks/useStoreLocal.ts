import { IAccountSource } from '@/core/account-source/models'
import { ITransaction } from '@/core/transaction/models'
import { IUserFromToken } from '@/types/user.i'
import { create } from 'zustand'

interface StoreState {
  // account source store
  accountSourceData: IAccountSource[]
  setAccountSourceData: (data: IAccountSource[]) => void
  // user store
  user: IUserFromToken | null
  setUser: (user: IUserFromToken | null) => void
  transactionData: ITransaction[]
  setTransactionData: (data: ITransaction[]) => void
}

export const useStoreLocal = create<StoreState>((set) => ({
  // account source store
  accountSourceData: [],
  setAccountSourceData: (data) => set({ accountSourceData: data }),
  // user store
  user: null,
  setUser: (user) => set({ user }),
  transactionData: [],
  setTransactionData: (data) => set({ transactionData: data })
}))
