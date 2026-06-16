import { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { AUTH_STORAGE_KEY } from '../constants/app'
import { authService } from '../services/authService'
import { getStoredAuth, persistAuth, removeStoredAuth } from '../utils/tokenStorage'
import { AuthContext } from './AuthContextValue'

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => getStoredAuth(AUTH_STORAGE_KEY))

  const login = useCallback(async (credentials) => {
    const response = await authService.login(credentials)
    return response
  }, [])

  const register = useCallback(async (payload) => {
    const response = await authService.register(payload)
    return response
  }, [])

  const verifyRegisterOtp = useCallback(async (payload) => {
    const response = await authService.verifyRegisterOtp(payload)
    const nextAuth = {
      token: response.token,
      user: response.user,
    }

    persistAuth(AUTH_STORAGE_KEY, nextAuth)
    setAuth(nextAuth)
    toast.success('Email confirmed')
    return nextAuth
  }, [])

  const verifyLoginOtp = useCallback(async (payload) => {
    const response = await authService.verifyLoginOtp(payload)
    const nextAuth = {
      token: response.token,
      user: response.user,
    }

    persistAuth(AUTH_STORAGE_KEY, nextAuth)
    setAuth(nextAuth)
    toast.success('Welcome back')
    return nextAuth
  }, [])

  const logout = useCallback(() => {
    removeStoredAuth(AUTH_STORAGE_KEY)
    setAuth(null)
    toast.success('Signed out')
  }, [])

  const value = useMemo(
    () => ({
      user: auth?.user || null,
      token: auth?.token || null,
      isAuthenticated: Boolean(auth?.token),
      isInitializing: false,
      login,
      logout,
      register,
      verifyRegisterOtp,
      verifyLoginOtp,
    }),
    [auth, login, logout, register, verifyRegisterOtp, verifyLoginOtp],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
