import { authenticationRoutes } from '@/api/authentication'
import { userRoutes } from '@/api/user'
import { accountSourceRoutes } from './account-source'
import { transactionRoutes } from '@/api/transaction'
import { accountBanksRoutes } from './account-bank'
import { trackerTransactionTypesRoutes } from './tracker-transaction-type'
import { trackerTransactionRoutes } from './tracker-transaction'

export const apiService = {
  authentication: authenticationRoutes,
  user: userRoutes,
  accountSource: accountSourceRoutes,
  transaction: transactionRoutes,
  accountBank: accountBanksRoutes,
  trackerTransactionType: trackerTransactionTypesRoutes,
  trackerTransaction: trackerTransactionRoutes
}
