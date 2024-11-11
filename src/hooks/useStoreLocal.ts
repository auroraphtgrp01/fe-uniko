import { IAccountSource } from '@/core/account-source/models'
import { IFundOfUser } from '@/core/tracker-transaction/models/tracker-transaction.interface'
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
  fundArr: IFundOfUser[]
  setFundArr: (fundArr: IFundOfUser[]) => void
}

// Add constant for localStorage key
const FUND_ID_STORAGE_KEY = 'fundId'

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
  fundId: localStorage.getItem(FUND_ID_STORAGE_KEY) || '',
  setFundId: (fundId) => {
    localStorage.setItem(FUND_ID_STORAGE_KEY, fundId)
    set({ fundId })
  },
  fundArr: [],
  setFundArr: (fundArr) => set({ fundArr })
}))
