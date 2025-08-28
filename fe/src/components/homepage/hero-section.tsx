"use client"

import { Play, Pause, Volume2, Radio, Music, Heart, Share2 } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface HeroSectionProps {
  title?: string
  subtitle?: string
  description?: string
  showPlayer?: boolean
  backgroundClass?: string
  backgroundImage?: string
  minHeight?: string
  children?: React.ReactNode
}

// HeroSection: Customizable hero section for all pages with enhanced interactivity
export function HeroSection({
  title = "El Shaddai FM",
  subtitle = "Radio Kristiani Indonesia",
  description = "Menyebarkan kasih Kristus melalui musik, renungan, dan program rohani yang menguatkan iman",
  showPlayer = true,
  backgroundClass,
  backgroundImage,
  minHeight = "70vh",
  children
}: HeroSectionProps = {}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(75)
  const [isLiked, setIsLiked] = useState(false)

  const [currentSong, setCurrentSong] = useState("Amazing Grace")
  const [artist, setArtist] = useState("Chris Tomlin")



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
      
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse hover:scale-110 transition-transform duration-1000" />
        <div className="absolute top-40 right-16 w-24 h-24 bg-secondary/20 rounded-full blur-xl animate-pulse delay-1000 hover:bg-secondary/30 transition-colors duration-500" />
        <div className="absolute bottom-32 left-1/3 w-16 h-16 bg-accent/15 rounded-full blur-lg animate-pulse delay-2000 hover:scale-125 transition-transform duration-700" />
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-bounce hover:animate-spin transition-all duration-1000" />
        <div className="absolute bottom-20 right-10 w-12 h-12 bg-white/10 rounded-full blur-lg animate-pulse delay-3000 hover:bg-white/20 transition-colors duration-300" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full px-6 pt-24 md:pt-32">
        <div className="flex flex-col items-center text-center text-white space-y-8">

          
          {/* Logo/Station Name */}
          <div className="space-y-4">
           
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-default group">
              <span className="group-hover:animate-pulse">{title}</span>
            </h1>
            {subtitle && (
              <p className="text-xl md:text-2xl text-white/90 font-medium hover:text-white transition-colors duration-300 cursor-default">
                {subtitle}
              </p>
            )}
            {description && (
              <p className="text-lg text-white/70 max-w-2xl hover:text-white/90 transition-colors duration-300 cursor-default">
                {description}
              </p>
            )}
          </div>
          
          {/* Enhanced Live Status & Player */}
          {showPlayer && (
            <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:shadow-2xl hover:shadow-white/10 group">
              <div className="p-6 space-y-4">
                {/* Enhanced Live Status */}
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-200">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse group-hover:animate-bounce" />
                    <span className="font-semibold group-hover:text-red-300 transition-colors duration-200">ON AIR</span>
                  </div>

                </div>
                
                {/* Enhanced Now Playing */}
                <div className="text-center space-y-2 hover:scale-105 transition-transform duration-300 cursor-pointer group/song">
                  <p className="text-sm text-white/70 group-hover/song:text-white/90 transition-colors duration-200">Now Playing</p>
                  <p className="font-semibold text-lg group-hover/song:text-yellow-300 transition-colors duration-200">{currentSong}</p>
                  <p className="text-white/80 group-hover/song:text-white transition-colors duration-200">{artist}</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "text-white/60 hover:text-red-400 hover:bg-white/10 transition-all duration-200",
                        isLiked && "text-red-400"
                      )}
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/60 hover:text-blue-400 hover:bg-white/10 transition-all duration-200"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Enhanced Player Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 hover:scale-110 transition-all duration-200 hover:text-blue-300"
                    title={`Volume: ${volume}%`}
                  >
                    <Volume2 className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-16 h-16 rounded-full border-2 border-white/30 text-white hover:bg-white/20 hover:scale-110 hover:border-white/50 transition-all duration-300 hover:shadow-lg hover:shadow-white/20 group/play"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 group-hover/play:scale-110 transition-transform duration-200" />
                    ) : (
                      <Play className="w-8 h-8 ml-1 group-hover/play:scale-110 transition-transform duration-200" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 hover:scale-110 transition-all duration-200 hover:text-purple-300"
                  >
                    <Music className="w-5 h-5" />
                  </Button>
                </div>
                
                {/* Volume Slider (appears on hover) */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-2 px-4">
                    <Volume2 className="w-4 h-4 text-white/60" />
                    <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-200"
                        style={{ width: `${volume}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/60 w-8">{volume}%</span>
                  </div>
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