import { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { AUTH_STORAGE_KEY } from '../constants/app'
import { authService } from '../services/authService'
import { getStoredAuth, persistAuth, removeStoredAuth } from '../utils/storage'
import { AuthContext } from './AuthContextValue'

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => getStoredAuth(AUTH_STORAGE_KEY))

  const login = useCallback(async (credentials) => {
    const response = await authService.login(credentials)
    const nextAuth = {
      token: response.token,
      user: response.user,
    }

    persistAuth(AUTH_STORAGE_KEY, nextAuth)
    setAuth(nextAuth)
    toast.success('Welcome back')
    return nextAuth
  }, [])

  const register = useCallback(async (payload) => {
    const response = await authService.register(payload)
    toast.success('Account created')
    return response
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
    }),
    [auth, login, logout, register],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
