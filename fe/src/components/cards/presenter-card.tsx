"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Mic, 
  Clock, 
  Instagram, 
  Facebook, 
  Twitter,
  ExternalLink 
} from "lucide-react"
import { cn } from "@/lib/utils"

// Presenter data interface
export interface PresenterData {
  id: string
  name: string
  role: string
  bio: string
  avatar?: string
  schedule?: {
    days: string[]
    time: string
  }
  programs?: string[]
  social?: {
    instagram?: string
    facebook?: string
    twitter?: string
  }
  isOnAir?: boolean
}

// PresenterCard component props
export interface PresenterCardProps {
  presenter: PresenterData
  className?: string
  showSchedule?: boolean
  showSocial?: boolean
  variant?: "default" | "compact"
  onViewProfile?: () => void
}

// Get presenter initials for avatar fallback
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Format schedule display
const formatSchedule = (schedule: PresenterData['schedule']) => {
  if (!schedule) return null
  return `${schedule.days.join(', ')} • ${schedule.time}`
}

// Reusable PresenterCard component
export function PresenterCard({ 
  presenter, 
  className, 
  showSchedule = true,
  showSocial = true,
  variant = "default",
  onViewProfile
}: PresenterCardProps) {
  const isCompact = variant === "compact"
  const socialLinks = presenter.social || {}
  const hasSocial = Object.values(socialLinks).some(Boolean)
  
  return (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-300",
      "hover:scale-[1.02] border-border/50",
      isCompact && "h-full",
      className
    )}>
      <CardHeader className={cn(
        "text-center relative",
        isCompact ? "pb-3" : "pb-4"
      )}>
        {/* On-Air Indicator */}
        {presenter.isOnAir && (
          <Badge 
            variant="destructive" 
            className="absolute top-2 right-2 text-xs animate-pulse"
          >
            LIVE
          </Badge>
        )}

        {/* Avatar */}
        <Avatar className={cn(
          "mx-auto ring-2 ring-border group-hover:ring-primary/20 transition-colors",
          isCompact ? "w-16 h-16" : "w-20 h-20"
        )}>
          <AvatarImage 
            src={presenter.avatar} 
            alt={`${presenter.name} profile`}
            loading="lazy"
          />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {getInitials(presenter.name)}
          </AvatarFallback>
        </Avatar>

        {/* Name & Role */}
        <div className="mt-3">
          <CardTitle className={cn(
            "leading-tight",
            isCompact ? "text-base" : "text-lg"
          )}>
            {presenter.name}
          </CardTitle>
          <p className="text-muted-foreground text-sm mt-1 flex items-center justify-center gap-1">
            <Mic className="w-3 h-3" />
            {presenter.role}
          </p>
        </div>
      </CardHeader>
      
      <CardContent className={cn("space-y-4", isCompact && "pt-0")}>
        {/* Bio */}
        <p className={cn(
          "text-muted-foreground text-center",
          isCompact ? "line-clamp-2 text-sm" : "line-clamp-3"
        )}>
          {presenter.bio}
        </p>

        {/* Programs */}
        {presenter.programs && presenter.programs.length > 0 && (
          <div className="text-center">
            <div className="flex flex-wrap gap-1 justify-center">
              {presenter.programs.slice(0, isCompact ? 2 : 3).map((program, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {program}
                </Badge>
              ))}
              {presenter.programs.length > (isCompact ? 2 : 3) && (
                <Badge variant="outline" className="text-xs">
                  +{presenter.programs.length - (isCompact ? 2 : 3)}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Schedule */}
        {showSchedule && presenter.schedule && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{formatSchedule(presenter.schedule)}</span>
          </div>
        )}

        {/* Social Links */}
        {showSocial && hasSocial && !isCompact && (
          <div className="flex justify-center gap-2">
            {socialLinks.instagram && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                asChild
              >
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow ${presenter.name} on Instagram`}
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
            )}
            {socialLinks.facebook && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                asChild
              >
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow ${presenter.name} on Facebook`}
                >
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
            )}
            {socialLinks.twitter && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                asChild
              >
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow ${presenter.name} on Twitter`}
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        )}

        {/* View Profile Button */}
        {onViewProfile && !isCompact && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full group/btn"
            onClick={onViewProfile}
          >
            <span>Lihat Profil</span>
            <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Export default
export default PresenterCard