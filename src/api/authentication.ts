export const authenticationRoutes = {
  signIn: 'auth/login',
  signUp: 'auth/register',
  forgotPassword: 'users/get-forgot-password-token/:email',
  verifyEmail: 'auth/verify-email/:id',
  resetPassword: 'users/reset-password/:token'
}
