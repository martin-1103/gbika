import axios, { AxiosInstance, AxiosRequestConfig, isAxiosError } from 'axios'
import { useAuthStore } from '@/stores/auth-store'

// API Error Response Types
export interface ApiErrorResponse {
  message: string
  errors?: Array<{
    path: string
    msg: string
  }>
  status?: number
}

// Helper function to extract error message from API response
export const getErrorMessage = (error: unknown, fallback = 'Terjadi kesalahan'): string => {
  if (isAxiosError(error)) {
    const errorData = error.response?.data as ApiErrorResponse | undefined
    return errorData?.message || error.message || fallback
  }
  return error instanceof Error ? error.message : fallback
}

// Create axios instance with base configuration
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor to add auth token
  client.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Auto logout on 401 unauthorized
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )

  return client
}

// ApiClient: Configured axios instance for API requests
export const apiClient = createApiClient()

// Generic API request function
export const apiRequest = async <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.request<T>(config)
  return response.data
}

// Export isAxiosError for error handling
export { isAxiosError }