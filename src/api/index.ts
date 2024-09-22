import { authenticationRoutes } from '@/api/authentication'
import { userRoutes } from '@/api/user'
import { accountSourceRoutes } from './account-source'
import { transactionRoutes } from '@/api/transaction'

export const apiService = {
  authentication: authenticationRoutes,
  user: userRoutes,
  accountSource: accountSourceRoutes,
  transaction: transactionRoutes
}
