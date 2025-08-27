"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Save, User, Loader2, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react"

interface UserFormData {
  name: string
  email: string
  password?: string
  role: "admin" | "editor" | "broadcaster"
  isActive: boolean
  permissions?: {
    articles: boolean
    testimonials: boolean
    schedules: boolean
    users: boolean
    livechat: boolean
  }
}

interface UserFormProps {
  userId?: string
  initialData?: Partial<UserFormData>
  mode?: "create" | "edit"
  onSuccess?: () => void
  onCancel?: () => void
}

// UserForm: Create/edit user form for admin
export function UserForm({ 
  userId,
  initialData,
  mode = "create",
  onSuccess,
  onCancel
}: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    password: "",
    role: initialData?.role || "editor",
    isActive: initialData?.isActive ?? true,
    permissions: {
      articles: initialData?.permissions?.articles ?? true,
      testimonials: initialData?.permissions?.testimonials ?? false,
      schedules: initialData?.permissions?.schedules ?? false,
      users: initialData?.permissions?.users ?? false,
      livechat: initialData?.permissions?.livechat ?? false,
      ...initialData?.permissions
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(!!userId && mode === "edit")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Role options with descriptions
  const roles = [
    { 
      value: "admin", 
      label: "Administrator", 
      description: "Akses penuh ke semua fitur sistem"
    },
    { 
      value: "editor", 
      label: "Editor", 
      description: "Kelola konten artikel dan kesaksian"
    },
    { 
      value: "broadcaster", 
      label: "Penyiar", 
      description: "Akses dashboard penyiar dan live chat"
    }
  ]

  // Permission labels
  const permissionLabels = {
    articles: "Kelola Artikel",
    testimonials: "Kelola Kesaksian",
    schedules: "Kelola Jadwal",
    users: "Kelola User",
    livechat: "Moderasi Live Chat"
  }

  // Load user data if in edit mode
  useEffect(() => {
    if (userId && mode === "edit" && !initialData) {
      loadUser()
    }
  }, [userId, mode])

  // Auto-set permissions based on role
  useEffect(() => {
    const rolePermissions = {
      admin: {
        articles: true,
        testimonials: true,
        schedules: true,
        users: true,
        livechat: true
      },
      editor: {
        articles: true,
        testimonials: true,
        schedules: false,
        users: false,
        livechat: false
      },
      broadcaster: {
        articles: false,
        testimonials: false,
        schedules: false,
        users: false,
        livechat: true
      }
    }

    setFormData(prev => ({
      ...prev,
      permissions: rolePermissions[formData.role]
    }))
  }, [formData.role])

  const loadUser = async () => {
    try {
      setIsLoadingData(true)
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Gagal memuat data user')
      }

      const data = await response.json()
      setFormData({
        name: data.name || "",
        email: data.email || "",
        password: "", // Never pre-fill password
        role: data.role || "editor",
        isActive: data.isActive ?? true,
        permissions: data.permissions || {
          articles: false,
          testimonials: false,
          schedules: false,
          users: false,
          livechat: false
        }
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan')
    } finally {
      setIsLoadingData(false)
    }
  }

  // Handle form input changes
  const handleInputChange = (field: keyof UserFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  // Handle permission changes
  const handlePermissionChange = (permission: keyof UserFormData['permissions'], checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: checked
      }
    }))
  }

  // Validate email format
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!isValidEmail(formData.email)) {
      setError("Format email tidak valid")
      return
    }
    
    if (mode === 'create' && !formData.password) {
      setError("Password wajib diisi untuk user baru")
      return
    }
    
    if (formData.password && formData.password.length < 6) {
      setError("Password minimal 6 karakter")
      return
    }
    
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const token = localStorage.getItem('auth_token')
      const endpoint = mode === 'create' 
        ? '/api/users' 
        : `/api/users/${userId}`
      
      const method = mode === 'create' ? 'POST' : 'PUT'
      
      // Prepare payload (exclude empty password for edit mode)
      const payload = { ...formData }
      if (mode === 'edit' && !payload.password) {
        delete payload.password
      }
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Gagal ${mode === 'create' ? 'membuat' : 'memperbarui'} user`)
      }

      setSuccess(true)
      
      if (onSuccess) {
        onSuccess()
      } else if (mode === 'create') {
        // Reset form if creating new
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "editor",
          isActive: true,
          permissions: {
            articles: true,
            testimonials: false,
            schedules: false,
            users: false,
            livechat: false
          }
        })
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  // Get role info
  const getRoleInfo = (roleValue: string) => {
    return roles.find(r => r.value === roleValue)
  }

  if (isLoadingData) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat data user...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {mode === 'create' ? 'Tambah User Baru' : 'Edit User'}
        </CardTitle>
        <CardDescription>
          {mode === 'create' 
            ? 'Buat akun user baru dengan role dan permission yang sesuai'
            : 'Ubah informasi user dan atur role serta permission'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Success Message */}
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              User berhasil {mode === 'create' ? 'dibuat' : 'diperbarui'}!
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status Section */}
          <div className="flex items-center gap-4">
            <Label>Status Akun:</Label>
            <div className="flex items-center gap-3">
              <Badge variant={formData.isActive ? "default" : "secondary"}>
                {formData.isActive ? "Aktif" : "Nonaktif"}
              </Badge>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleInputChange('isActive', !formData.isActive)}
                disabled={isLoading}
              >
                {formData.isActive ? 'Nonaktifkan' : 'Aktifkan'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Masukkan nama lengkap"
                disabled={isLoading}
                maxLength={100}
                required
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@contoh.com"
                disabled={isLoading}
                maxLength={200}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Password {mode === 'create' ? '*' : '(Kosongkan jika tidak ingin mengubah)'}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder={mode === 'create' ? "Minimal 6 karakter" : "Kosongkan jika tidak ingin mengubah"}
                disabled={isLoading}
                minLength={mode === 'create' ? 6 : undefined}
                required={mode === 'create'}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Role Field */}
          <div className="space-y-2">
            <Label>Role User *</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleInputChange('role', value)}
              disabled={isLoading}
              required
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <div>
                      <div className="font-medium">{role.label}</div>
                      <div className="text-sm text-muted-foreground">{role.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getRoleInfo(formData.role) && (
              <p className="text-sm text-muted-foreground">
                {getRoleInfo(formData.role)?.description}
              </p>
            )}
          </div>

          {/* Permissions Section */}
          <div className="space-y-4">
            <Label>Permission Akses</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(permissionLabels).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={formData.permissions?.[key as keyof typeof formData.permissions] || false}
                    onCheckedChange={(checked) => 
                      handlePermissionChange(key as keyof typeof formData.permissions, checked as boolean)
                    }
                    disabled={isLoading}
                  />
                  <Label htmlFor={key} className="text-sm font-normal">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Permission akan otomatis disesuaikan berdasarkan role yang dipilih.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'create' ? 'Membuat...' : 'Menyimpan...'}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {mode === 'create' ? 'Buat User' : 'Simpan Perubahan'}
                </>
              )}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Batal
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}