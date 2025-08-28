"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"
import { apiClient } from "@/lib/api/client"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRoles?: string[]
  redirectTo?: string
}

// AuthGuard: Protect routes with authentication and role-based access
export function AuthGuard({ 
  children, 
  requiredRoles = [], 
  redirectTo = "/admin/login" 
}: AuthGuardProps) {
  const router = useRouter()
  const { user, token, isAuthenticated, login, logout } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // If no token, redirect to login
        if (!token) {
          router.push(redirectTo)
          return
        }

        // Verify token with backend
        const response = await apiClient.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        const userData = response.data
        
        // Update user data in store only if it's different
        if (!user || user.id !== userData.id || user.email !== userData.email || user.name !== userData.name) {
          login(userData, token)
        }

        // Check role authorization if required
        if (requiredRoles.length > 0) {
          if (!userData.role || !requiredRoles.includes(userData.role)) {
            // User doesn't have required role
            router.push('/unauthorized')
            return
          }
        }

        setIsAuthorized(true)
      } catch (error) {
        console.error('Auth verification failed:', error)
        // Clear invalid token and redirect to login
        logout()
        router.push(redirectTo)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [token, redirectTo, requiredRoles])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Memverifikasi autentikasi...</p>
        </div>
      </div>
    )
  }

  // Only render children if authorized
  if (isAuthorized) {
    return <>{children}</>
  }

  // Return null while redirecting
  return null
}