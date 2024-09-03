import { authenticationRoutes } from '@/libraries/api/authentication'
import { userRoutes } from '@/libraries/api/user'

export const apiService = {
  authentication: authenticationRoutes,
  user: userRoutes
}
