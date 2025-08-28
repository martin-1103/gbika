"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { cn } from "@/lib/utils"

// Article data interface based on API structure
interface Article {
  id: string
  title: string
  slug: string
  content: string
  status: 'draft' | 'published'
  published_at: string | null
  createdAt: string
  excerpt?: string
  category?: string
  tags?: string[]
  author?: string
  image?: string
}

interface ArticleCardProps {
  article: Article
  className?: string
  showExcerpt?: boolean
  showImage?: boolean
  variant?: 'default' | 'compact' | 'featured'
}

// Extract excerpt from content if not provided
function extractExcerpt(content: string, maxLength: number = 150): string {
  // Remove HTML tags and get plain text
  const plainText = content.replace(/<[^>]*>/g, '').trim()
  if (plainText.length <= maxLength) return plainText
  return plainText.substring(0, maxLength).trim() + '...'
}

// Format relative time in Indonesian
function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return 'Belum dipublikasi'
  try {
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true, 
      locale: id 
    })
  } catch {
    return 'Tanggal tidak valid'
  }
}

// ArticleCard: Reusable card component for displaying article summaries
export function ArticleCard({ 
  article, 
  className,
  showExcerpt = true,
  showImage = true,
  variant = 'default'
}: ArticleCardProps) {
  const excerpt = article.excerpt || extractExcerpt(article.content)
  const publishedDate = formatRelativeTime(article.published_at)
  
  const cardVariants = {
    default: "group hover:shadow-lg transition-shadow",
    compact: "group hover:shadow-md transition-shadow",
    featured: "group hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
  }
  
  return (
    <Card className={cn(cardVariants[variant], className)}>
      {/* Article Image */}
      {showImage && article.image && (
        <div className="aspect-video overflow-hidden rounded-t-lg relative">
          <Image 
            src={article.image} 
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <CardHeader className={cn(
        "space-y-2",
        variant === 'compact' && "pb-2"
      )}>
        {/* Category Badge */}
        {article.category && (
          <Badge variant="secondary" className="w-fit text-xs">
            {article.category}
          </Badge>
        )}
        
        {/* Article Title */}
        <CardTitle className={cn(
          "leading-tight group-hover:text-primary transition-colors",
          variant === 'compact' ? "text-base" : "text-lg",
          variant === 'featured' && "text-xl"
        )}>
          <Link href={`/renungan/${article.slug}`} className="block">
            {article.title}
          </Link>
        </CardTitle>
        
        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{publishedDate}</span>
          </div>
          
          {article.author && (
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{article.author}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{Math.ceil(article.content.length / 1000)} min</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={cn(
        variant === 'compact' && "pt-0"
      )}>
        {/* Article Excerpt */}
        {showExcerpt && (
          <p className={cn(
            "text-muted-foreground mb-4 line-clamp-3",
            variant === 'compact' && "text-sm line-clamp-2"
          )}>
            {excerpt}
          </p>
        )}
        
        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.slice(0, variant === 'compact' ? 2 : 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {article.tags.length > (variant === 'compact' ? 2 : 3) && (
              <Badge variant="outline" className="text-xs">
                +{article.tags.length - (variant === 'compact' ? 2 : 3)}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Export types for use in other components
export type { Article, ArticleCardProps }