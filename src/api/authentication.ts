export const authenticationRoutes = {
  signIn: 'auth/login',
  signUp: 'auth/register',
  forgotPassword: 'users/get-forgot-password-token/:email',
  resetPassword: 'users/reset-password/:token',
  verifyEmail: 'auth/verify-email/:token'
}
