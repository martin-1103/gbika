"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Calendar, User } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"

interface Article {
  id: string
  title: string
  content: string
  excerpt: string
  published_at: string
  author_id: string
  category_id: string
  tags: string[]
  featured_image?: string
  slug: string
  status: string
}

interface LatestArticlesProps {
  className?: string
}

// LatestArticles: Display recent devotionals and articles
export function LatestArticles({ className }: LatestArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch latest articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Mock data - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 800)) // Simulate loading
        
        const mockArticles: Article[] = [
          {
            id: "1",
            title: "Kasih yang Tidak Pernah Berubah",
            content: "Kasih Allah adalah fondasi dari segala sesuatu...",
            excerpt: "Merenungkan kasih Allah yang kekal dan tidak berubah dalam hidup kita sehari-hari.",
            published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            author_id: "pastor-john",
            category_id: "renungan",
            tags: ["kasih", "iman", "kehidupan"],
            featured_image: "/images/articles/kasih-allah.jpg",
            slug: "kasih-yang-tidak-pernah-berubah",
            status: "published"
          },
          {
            id: "2",
            title: "Berdoa dengan Hati yang Tulus",
            content: "Doa bukan hanya ritual, tetapi komunikasi dengan Bapa...",
            excerpt: "Bagaimana membangun hubungan yang lebih dalam dengan Tuhan melalui doa yang tulus.",
            published_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            author_id: "pastor-mary",
            category_id: "renungan",
            tags: ["doa", "spiritualitas", "hubungan"],
            featured_image: "/images/articles/doa-tulus.jpg",
            slug: "berdoa-dengan-hati-yang-tulus",
            status: "published"
          },
          {
            id: "3",
            title: "Mengampuni dalam Kasih Kristus",
            content: "Pengampunan adalah jantung dari Injil...",
            excerpt: "Belajar mengampuni seperti Kristus telah mengampuni kita, sebuah perjalanan transformasi hati.",
            published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            author_id: "pastor-david",
            category_id: "renungan",
            tags: ["pengampunan", "kasih", "transformasi"],
            featured_image: "/images/articles/pengampunan.jpg",
            slug: "mengampuni-dalam-kasih-kristus",
            status: "published"
          }
        ]
        
        setArticles(mockArticles)
      } catch (err) {
        setError("Gagal memuat artikel terbaru")
        console.error("Error fetching articles:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: id 
      })
    } catch {
      return "Baru saja"
    }
  }

  if (loading) {
    return (
      <div className={className}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Renungan Terbaru
          </h2>
          <p className="text-muted-foreground">
            Firman Tuhan untuk menguatkan iman Anda
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={className}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Renungan Terbaru
          </h2>
        </div>
        <Card>
          <CardContent className="py-8">
            <p className="text-muted-foreground text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className={className}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Renungan Terbaru
          </h2>
        </div>
        <Card>
          <CardContent className="py-8">
            <p className="text-muted-foreground text-center">
              Belum ada artikel tersedia
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Renungan Terbaru
        </h2>
        <p className="text-muted-foreground">
          Firman Tuhan untuk menguatkan iman Anda
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card key={article.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                  <Link href={`/renungan/${article.slug}`}>
                    {article.title}
                  </Link>
                </CardTitle>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{formatRelativeTime(article.published_at)}</span>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {article.excerpt}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {article.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {article.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{article.tags.length - 2}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <Link 
          href="/renungan" 
          className="text-primary hover:underline font-medium"
        >
          Lihat Semua Renungan →
        </Link>
      </div>
    </div>
  )
}