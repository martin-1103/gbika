"use client"

import { Play, Pause, Volume2, Radio, Users, Music } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface HeroSectionProps {
  title?: string
  subtitle?: string
  description?: string
  showPlayer?: boolean
  showThemeToggle?: boolean
  backgroundClass?: string
  backgroundImage?: string
  minHeight?: string
  children?: React.ReactNode
}

// HeroSection: Customizable hero section for all pages
export function HeroSection({
  title = "El Shaddai FM",
  subtitle = "Radio Kristiani Indonesia",
  description = "Menyebarkan kasih Kristus melalui musik, renungan, dan program rohani yang menguatkan iman",
  showPlayer = true,
  showThemeToggle = false,
  backgroundClass,
  backgroundImage,
  minHeight = "70vh",
  children
}: HeroSectionProps = {}) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div 
      className={cn(
        "relative w-full flex items-center justify-center overflow-hidden",
        backgroundClass
      )}
      style={{ minHeight }}
    >
      {/* Background Image */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        />
      )}
      
      {/* Background Gradient Overlay */}
      <div 
        className="absolute inset-0 opacity-90"
        style={{
          background: backgroundImage 
            ? 'linear-gradient(135deg, rgba(139, 69, 19, 0.8) 0%, rgba(75, 0, 130, 0.8) 50%, rgba(220, 20, 60, 0.8) 100%)'
            : backgroundClass 
            ? undefined 
            : 'var(--hero-gradient)',
        }}
      />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-40 right-16 w-24 h-24 bg-secondary/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-32 left-1/3 w-16 h-16 bg-accent/15 rounded-full blur-lg animate-pulse delay-2000" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full px-6 pt-24 md:pt-32">
        <div className="flex flex-col items-center text-center text-white space-y-8">

          
          {/* Logo/Station Name */}
          <div className="space-y-4">
           
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl md:text-2xl text-white/90 font-medium">
                {subtitle}
              </p>
            )}
            {description && (
              <p className="text-lg text-white/70 max-w-2xl">
                {description}
              </p>
            )}
          </div>
          
          {/* Live Status & Player */}
          {showPlayer && (
            <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
              <div className="p-6 space-y-4">
                {/* Live Status */}
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="font-semibold">ON AIR</span>
                  </div>
                  <div className="text-white/70">•</div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">1,234 listeners</span>
                  </div>
                </div>
                
                {/* Now Playing */}
                <div className="text-center space-y-2">
                  <p className="text-sm text-white/70">Now Playing</p>
                  <p className="font-semibold text-lg">Amazing Grace</p>
                  <p className="text-white/80">Chris Tomlin</p>
                </div>
                
                {/* Player Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                  >
                    <Volume2 className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-16 h-16 rounded-full border-2 border-white/30 text-white hover:bg-white/20 hover:scale-110"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8 ml-1" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                  >
                    <Music className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          )}
          
          
          
          {/* Custom Children */}
          {children && (
            <div className="w-full">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}