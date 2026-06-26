export interface ResetPasswordRequest {
  usernameOrEmail: string, 
  code: string, 
  newPassword: string,
}