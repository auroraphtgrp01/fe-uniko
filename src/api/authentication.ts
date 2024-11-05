export const authenticationRoutes = {
  signIn: 'auth/login',
  signUp: 'auth/register',
  forgotPassword: 'users/get-forgot-password-token/:email',
  resetPassword: 'users/reset-password/:token',
  verifyEmail: 'auth/verify-email/:token',
  loginGoogle: 'auth/login/google',
  verifyToken: 'auth/verify-token/:refreshToken',
  logOut: 'auth/logout'
}
