import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosRequestConfig } from 'axios'
import { apiRequest } from '@/lib/api/client'

interface UseApiQueryOptions<T> {
  queryKey: string[]
  config: AxiosRequestConfig
  enabled?: boolean
  staleTime?: number
  refetchOnWindowFocus?: boolean
}

interface UseApiMutationOptions<T, V> {
  mutationKey?: string[]
  config: (variables: V) => AxiosRequestConfig
  onSuccess?: (data: T, variables: V) => void
  onError?: (error: Error, variables: V) => void
  invalidateQueries?: string[][]
}

// Custom hook for API queries using React Query
export const useApiQuery = <T>(
  options: UseApiQueryOptions<T>
) => {
  return useQuery({
    queryKey: options.queryKey,
    queryFn: () => apiRequest<T>(options.config),
    enabled: options.enabled,
    staleTime: options.staleTime,
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
  })
}

// Custom hook for API mutations using React Query
export const useApiMutation = <T, V = void>(
  options: UseApiMutationOptions<T, V>
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: options.mutationKey,
    mutationFn: (variables: V) => apiRequest<T>(options.config(variables)),
    onSuccess: (data, variables) => {
      options.onSuccess?.(data, variables)
      
      // Invalidate specified queries
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey })
        })
      }
    },
    onError: options.onError,
  })
}

// Hook for fetching user data
export const useUser = (userId?: string) => {
  return useApiQuery<any>({
    queryKey: ['user', userId || ''],
    config: {
      method: 'GET',
      url: `/users/${userId}`,
    },
    enabled: !!userId,
  })
}

// Hook for fetching current user profile
export const useProfile = () => {
  return useApiQuery<any>({
    queryKey: ['profile'],
    config: {
      method: 'GET',
      url: '/auth/profile',
    },
  })
}