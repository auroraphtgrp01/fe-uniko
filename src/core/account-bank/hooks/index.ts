import { useQueryAccountBank } from './useQueryAccountBank'

export const useAccountBank = () => {
  return {
    getAccountBank: useQueryAccountBank
  }
}
