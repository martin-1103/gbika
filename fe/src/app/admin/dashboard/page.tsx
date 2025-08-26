"use client"

import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Heart, Users, Calendar } from "lucide-react"
import { useEffect, useState } from "react"

interface DashboardStats {
  totalArticles: number
  pendingTestimonials: number
  totalUsers: number
  todaySchedules: number
}

interface Article {
  id: string
  title: string
  slug: string
  published_at: string
  status: string
}

interface Testimonial {
  id: string
  name: string
  title: string
  content: string
}

// AdminDashboard: Main dashboard page showing statistics and recent activity
export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentArticles, setRecentArticles] = useState<Article[]>([])
  const [pendingTestimonials, setPendingTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch recent articles
        const articlesResponse = await fetch('/api/articles?limit=5&sort_by=published_at&sort_order=desc')
        if (articlesResponse.ok) {
          const articlesData = await articlesResponse.json()
          setRecentArticles(articlesData.data || [])
        }

        // Mock stats for now (would need actual endpoints)
        setStats({
          totalArticles: 45,
          pendingTestimonials: 8,
          totalUsers: 12,
          todaySchedules: 6
        })

        // Mock pending testimonials (would need actual endpoint with status filter)
        setPendingTestimonials([
          {
            id: "1",
            name: "Maria Sari",
            title: "Kesembuhan yang Luar Biasa",
            content: "Saya mengalami kesembuhan yang luar biasa setelah berdoa..."
          },
          {
            id: "2",
            name: "John Doe",
            title: "Berkat dalam Keluarga",
            content: "Keluarga kami mengalami berkat yang melimpah..."
          }
        ])

      } catch (err) {
        setError('Gagal memuat data dashboard')
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Ringkasan aktivitas dan statistik website El Shaddai FM
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Artikel</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats?.totalArticles || 0}</div>
              )}
              <p className="text-xs text-muted-foreground">
                Artikel & renungan yang dipublikasikan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kesaksian Pending</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats?.pendingTestimonials || 0}</div>
              )}
              <p className="text-xs text-muted-foreground">
                Menunggu persetujuan moderator
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              )}
              <p className="text-xs text-muted-foreground">
                Admin dan editor terdaftar
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jadwal Hari Ini</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats?.todaySchedules || 0}</div>
              )}
              <p className="text-xs text-muted-foreground">
                Program siaran hari ini
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Activity Widgets */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Articles Widget */}
          <Card>
            <CardHeader>
              <CardTitle>Artikel Terbaru</CardTitle>
              <CardDescription>
                5 artikel yang baru dipublikasikan
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <p className="text-sm text-muted-foreground">{error}</p>
              ) : recentArticles.length > 0 ? (
                <div className="space-y-3">
                  {recentArticles.map((article) => (
                    <div key={article.id} className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {article.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(article.published_at)}
                        </p>
                      </div>
                      <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                        {article.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Belum ada artikel yang dipublikasikan
                </p>
              )}
            </CardContent>
          </Card>

          {/* Pending Testimonials Widget */}
          <Card>
            <CardHeader>
              <CardTitle>Kesaksian Menunggu Persetujuan</CardTitle>
              <CardDescription>
                Kesaksian yang perlu dimoderasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  ))}
                </div>
              ) : pendingTestimonials.length > 0 ? (
                <div className="space-y-3">
                  {pendingTestimonials.map((testimonial) => (
                    <div key={testimonial.id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium leading-none">
                          {testimonial.title}
                        </p>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        oleh {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {testimonial.content.substring(0, 100)}...
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Tidak ada kesaksian yang menunggu persetujuan
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}