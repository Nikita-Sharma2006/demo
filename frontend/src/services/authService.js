import api from './api'

export const authService = {
  register: (payload) => api.post('/auth/register', payload),
  verifyRegisterOtp: (payload) => api.post('/auth/verify-register-otp', payload),
  login: (credentials) => api.post('/auth/login', credentials),
  verifyLoginOtp: (payload) => api.post('/auth/verify-login-otp', payload),
  profile: () => api.get('/auth/profile'),
}
