export const authenticationRoutes = {
  signIn: 'auth/login',
  signUp: 'auth/register',
  forgotPassword: 'auth/get-forgot-password-token/:email',
  resetPassword: 'auth/reset-password/:token',
  verifyEmail: 'auth/verify-email/:token',
  loginGoogle: 'auth/login/google',
  verifyToken: 'auth/verify-token/:refreshToken',
  logOut: 'auth/logout',
  resendVerifyToken: 'auth/resend-verify-email/:email'
}
