import { IAccountSource } from '@/core/account-source/models'
import { ITransaction } from '@/core/transaction/models'
import { IUser, IUserFromToken } from '@/types/user.i'
import { create } from 'zustand'

interface StoreState {
  // account source store
  accountSourceData: IAccountSource[]
  setAccountSourceData: (data: IAccountSource[]) => void
  // user store
  user: IUser | null
  setUser: (user: IUser | null) => void
  // unclassified transaction store
  unclassifiedTransactionData: ITransaction[]
  setUnclassifiedTransactionData: (data: ITransaction[]) => void
  // Fund of user store
  fundId: string
  setFundId: (fundId: string) => void
}

export const useStoreLocal = create<StoreState>((set) => ({
  // account source store
  accountSourceData: [],
  setAccountSourceData: (data) => set({ accountSourceData: data }),
  // user store
  user: null,
  setUser: (user) => set({ user }),
  // unclassified transaction store
  unclassifiedTransactionData: [],
  setUnclassifiedTransactionData: (data) => set({ unclassifiedTransactionData: data }),
  // Fund of user store
  fundId: '',
  setFundId: (fundId) => set({ fundId })
}))
