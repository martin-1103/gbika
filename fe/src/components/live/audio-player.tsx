"use client"

// AudioPlayer: Enhanced radio streaming player with fallback URLs and improved error handling
// Updated: Added multiple streaming URLs, automatic fallback on error, better debugging
// Changes: Fixed streaming URL to https://c1.siar.us:9130/live with fallbacks
// Latest: Added autoplay functionality with preload="auto" for automatic streaming
// Recent: Fixed autoplay permission handling to use proper browser autoplay policies
// Current: Hidden audio preload element from UI while maintaining functionality
// Latest: Removed URL display and changed branding to elshaddaifm

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, Radio, Loader2, RefreshCw } from "lucide-react"

interface AudioPlayerProps {
  streamUrl?: string
  className?: string
}

// Fallback streaming URLs
const STREAM_URLS = [
  "https://c1.siar.us:9130/live",
  "https://c1.siar.us/public/el_shaddai_fm",
  "http://c1.siar.us:9130/live"
]

interface PlayerState {
  isPlaying: boolean
  isLoading: boolean
  isLive: boolean
  volume: number
  isMuted: boolean
  currentProgram: string
  error: string | null
  autoplayBlocked: boolean
}

// AudioPlayer: Main radio streaming player with controls and status
export function AudioPlayer({ 
  streamUrl = "https://c1.siar.us:9130/live", 
  className 
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    isLoading: false,
    isLive: true,
    volume: 70,
    isMuted: false,
    currentProgram: "Renungan Pagi - Bersama Pdt. Sarah",
    error: null,
    autoplayBlocked: false
  })
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0)
  const [actualStreamUrl, setActualStreamUrl] = useState(streamUrl || STREAM_URLS[0])

  // Initialize audio element
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Set audio attributes for better streaming support
    console.log('Setting audio source to:', actualStreamUrl)
    audio.src = actualStreamUrl
    audio.volume = playerState.volume / 100
    audio.crossOrigin = "anonymous"
    audio.preload = "auto"
    
    // Add additional attributes for live streaming with autoplay
    audio.setAttribute('autoplay', 'true')
    audio.setAttribute('controls', 'false')

    const handleLoadStart = () => {
      setPlayerState(prev => ({ ...prev, isLoading: true, error: null }))
    }

    const handleCanPlay = () => {
      setPlayerState(prev => ({ ...prev, isLoading: false }))
    }

    const handleError = (e: Event) => {
      console.error('Audio error:', e, 'Current URL:', actualStreamUrl)
      const target = e.target as HTMLAudioElement
      
      // Try next URL if available
      if (currentUrlIndex < STREAM_URLS.length - 1) {
        const nextIndex = currentUrlIndex + 1
        const nextUrl = STREAM_URLS[nextIndex]
        console.log('Trying fallback URL:', nextUrl)
        setCurrentUrlIndex(nextIndex)
        setActualStreamUrl(nextUrl)
        return
      }
      
      let errorMessage = "Gagal memuat stream audio. Silakan coba lagi."
      
      if (target?.error) {
        switch (target.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = "Pemutaran audio dibatalkan."
            break
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = "Kesalahan jaringan. Periksa koneksi internet Anda."
            break
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = "Kesalahan decoding audio."
            break
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = "Format audio tidak didukung atau URL tidak valid."
            break
          default:
            errorMessage = "Terjadi kesalahan tidak dikenal."
        }
      }
      
      setPlayerState(prev => ({ 
        ...prev, 
        isLoading: false, 
        isPlaying: false,
        error: errorMessage
      }))
    }

    const handlePlay = () => {
      console.log('Audio started playing')
      setPlayerState(prev => ({ ...prev, isPlaying: true, isLoading: false }))
    }

    const handlePause = () => {
      console.log('Audio paused')
      setPlayerState(prev => ({ ...prev, isPlaying: false }))
    }
    
    const handleWaiting = () => {
      console.log('Audio waiting for data')
      setPlayerState(prev => ({ ...prev, isLoading: true }))
    }
    
    const handlePlaying = () => {
      console.log('Audio playing (data available)')
      setPlayerState(prev => ({ ...prev, isLoading: false }))
    }

    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('error', handleError)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('waiting', handleWaiting)
    audio.addEventListener('playing', handlePlaying)

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('waiting', handleWaiting)
      audio.removeEventListener('playing', handlePlaying)
    }
  }, [actualStreamUrl, playerState.volume])

  // Handle autoplay attempt when component mounts
  useEffect(() => {
    const attemptAutoplay = async () => {
      const audio = audioRef.current
      if (!audio) return

      try {
        // Wait a bit for audio to initialize
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Try to start playing automatically
        const playPromise = audio.play()
        if (playPromise !== undefined) {
          await playPromise
          console.log('Autoplay started successfully')
          setPlayerState(prev => ({ ...prev, autoplayBlocked: false }))
        }
      } catch (error: any) {
        console.log('Autoplay blocked by browser:', error.name)
        
        let errorMessage = "Klik tombol play untuk memulai streaming radio."
        
        if (error.name === 'NotAllowedError') {
          errorMessage = "Browser memblokir autoplay. Klik tombol play untuk memulai streaming."
          setPlayerState(prev => ({ ...prev, autoplayBlocked: true }))
        } else if (error.name === 'NotSupportedError') {
          errorMessage = "Browser tidak mendukung format audio ini. Coba gunakan browser lain."
        }
        
        // Autoplay was blocked, user will need to click play button
        setPlayerState(prev => ({ 
          ...prev, 
          error: errorMessage
        }))
      }
    }

    attemptAutoplay()
  }, []) // Only run once when component mounts

  // Toggle play/pause
  const togglePlayback = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (playerState.isPlaying) {
        audio.pause()
      } else {
        setPlayerState(prev => ({ ...prev, isLoading: true, error: null }))
        
        // Reload the audio source to ensure fresh connection
        audio.load()
        
        // Wait a bit for the audio to load
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const playPromise = audio.play()
        
        if (playPromise !== undefined) {
          await playPromise
        }
      }
    } catch (error: any) {
      console.error('Playback error:', error)
      let errorMessage = "Gagal memutar audio. Periksa koneksi internet Anda."
      
      if (error.name === 'NotAllowedError') {
        errorMessage = "Browser memblokir autoplay. Silakan klik tombol play untuk memulai."
      } else if (error.name === 'NotSupportedError') {
        errorMessage = "Format audio tidak didukung oleh browser Anda."
      } else if (error.name === 'AbortError') {
        errorMessage = "Pemutaran dibatalkan. Silakan coba lagi."
      }
      
      setPlayerState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: errorMessage
      }))
    }
  }

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setPlayerState(prev => ({ ...prev, volume: newVolume, isMuted: newVolume === 0 }))
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }

  // Toggle mute
  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (playerState.isMuted) {
      audio.volume = playerState.volume / 100
      setPlayerState(prev => ({ ...prev, isMuted: false }))
    } else {
      audio.volume = 0
      setPlayerState(prev => ({ ...prev, isMuted: true }))
    }
  }

  // Enable autoplay after user interaction
  const enableAutoplay = async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      setPlayerState(prev => ({ ...prev, error: null, autoplayBlocked: false }))
      await togglePlayback()
    } catch (error) {
      console.error('Failed to enable autoplay:', error)
    }
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-8">
        <audio 
          ref={audioRef} 
          preload="auto" 
          crossOrigin="anonymous"
          controls={false}
          autoPlay={true}
          hidden
        />
        
        {/* Status Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Radio className="w-8 h-8 text-primary" />
              {playerState.isLive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">Radio El-Shaddai FM</h2>
              <Badge variant={playerState.isLive ? "default" : "secondary"} className="text-xs">
                {playerState.isLive ? "🔴 LIVE" : "📻 OFFLINE"}
              </Badge>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Sedang Tayang</p>
            <p className="font-medium">{playerState.currentProgram}</p>
          </div>
        </div>



        {/* Error Message */}
        {playerState.error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{playerState.error}</p>
          </div>
        )}

        {/* Main Controls */}
        <div className="flex items-center justify-center mb-8">
          <Button
            size="lg"
            onClick={togglePlayback}
            disabled={playerState.isLoading}
            className="w-20 h-20 rounded-full text-lg"
          >
            {playerState.isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : playerState.isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </Button>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="flex-shrink-0"
          >
            {playerState.isMuted || playerState.volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </Button>
          
          <div className="flex-1">
            <Slider
              value={[playerState.isMuted ? 0 : playerState.volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
          
          <span className="text-sm text-muted-foreground w-12 text-right">
            {playerState.isMuted ? 0 : playerState.volume}%
          </span>
        </div>

        {/* Stream Info */}
        <div className="mt-6 pt-6 border-t text-center">
          <p className="text-sm text-muted-foreground">
            Streaming berkualitas tinggi • 128 kbps
          </p>
          <p className="text-xs text-muted-foreground">
            Powered By El-Shaddai FM
          </p>
        </div>
      </CardContent>
    </Card>
  )
}