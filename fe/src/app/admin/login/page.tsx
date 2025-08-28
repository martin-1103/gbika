import { Metadata } from "next"
import { LoginForm } from "@/components/forms/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Radio } from "lucide-react"

export const metadata: Metadata = {
  title: "Admin Login - Radio El-Shaddai FM",
  description: "Login untuk mengakses panel admin Radio El-Shaddai FM",
  robots: "noindex, nofollow"
}

// AdminLoginPage: Secure login page for admin/staff authentication
export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <Radio className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Radio El-Shaddai FM</h1>
          <p className="text-muted-foreground mt-2">Panel Administrasi</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Masuk ke Admin</CardTitle>
            <CardDescription className="text-center">
              Masukkan kredensial Anda untuk mengakses panel admin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>© 2024 Radio El-Shaddai FM. Semua hak dilindungi.</p>
        </div>
      </div>
    </div>
  )
}