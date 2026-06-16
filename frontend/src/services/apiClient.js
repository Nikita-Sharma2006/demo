import axios from 'axios'
import { API_TIMEOUT, AUTH_STORAGE_KEY } from '../constants/app'
import { getStoredAuth } from '../utils/tokenStorage'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const storedAuth = getStoredAuth(AUTH_STORAGE_KEY)

  if (storedAuth?.token) {
    config.headers.Authorization = `Bearer ${storedAuth.token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong'

    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data,
    })
  },
)

export default apiClient
