import { authenticationRoutes } from '@/libraries/api/authentication'
import { userRoutes } from '@/libraries/api/user'
import { accountSourceRoutes } from './account-source'

export const apiService = {
  authentication: authenticationRoutes,
  user: userRoutes,
  accountSource: accountSourceRoutes
}
