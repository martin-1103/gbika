"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Quote, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { cn } from "@/lib/utils"

// Testimonial data interface
export interface TestimonialData {
  id: string
  title: string
  name: string
  city?: string
  content: string
  createdAt?: string | Date
  category?: string
}

// TestimonialCard component props
export interface TestimonialCardProps {
  testimonial: TestimonialData
  className?: string
  showCategory?: boolean
  showDate?: boolean
  variant?: "default" | "compact"
}

// Format relative time helper
const formatRelativeTime = (date: string | Date) => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: id })
  } catch {
    return ''
  }
}

// Reusable TestimonialCard component
export function TestimonialCard({ 
  testimonial, 
  className, 
  showCategory = false, 
  showDate = true,
  variant = "default"
}: TestimonialCardProps) {
  const isCompact = variant === "compact"
  
  return (
    <Card className={cn(
      "group hover:shadow-lg transition-shadow relative",
      isCompact && "h-full",
      className
    )}>
      <CardHeader className={cn(isCompact && "pb-3")}>
        <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
        <CardTitle className={cn(
          "leading-tight pr-10",
          isCompact ? "text-base" : "text-lg"
        )}>
          {testimonial.title}
        </CardTitle>
        
        {showCategory && testimonial.category && (
          <Badge variant="secondary" className="w-fit text-xs">
            {testimonial.category}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className={cn(isCompact && "pt-0")}>
        <blockquote className={cn(
          "text-muted-foreground mb-4 italic",
          isCompact ? "line-clamp-3 text-sm" : "line-clamp-4"
        )}>
          "{testimonial.content}"
        </blockquote>
        
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{testimonial.name}</span>
          {testimonial.city && (
            <>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{testimonial.city}</span>
            </>
          )}
        </div>
        
        {showDate && testimonial.createdAt && (
          <div className="mt-2 text-xs text-muted-foreground">
            {formatRelativeTime(testimonial.createdAt)}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Export default
export default TestimonialCard