import { authenticationRoutes } from '@/api/authentication'
import { userRoutes } from '@/api/user'
import { accountSourceRoutes } from './account-source'
import { transactionRoutes } from '@/api/transaction'
import { accountBanksRoutes } from './account-bank'

export const apiService = {
  authentication: authenticationRoutes,
  user: userRoutes,
  accountSource: accountSourceRoutes,
  transaction: transactionRoutes,
  accountBank: accountBanksRoutes
}
