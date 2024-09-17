import { authenticationRoutes } from '@/libraries/api/authentication'
import { userRoutes } from '@/libraries/api/user'
import { accountSourceRoutes } from './account-source'
import { transactionRoutes } from '@/libraries/api/transaction'

export const apiService = {
  authentication: authenticationRoutes,
  user: userRoutes,
  accountSource: accountSourceRoutes,
  transaction: transactionRoutes
}
