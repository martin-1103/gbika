"use client"

import { useState, useEffect } from "react"
import { Header } from "./header"
import { Footer } from "./footer"
import { cn } from "@/lib/utils"

interface HeroLayoutProps {
  children: React.ReactNode
  heroContent?: React.ReactNode
  heroClassName?: string
  minHeight?: string
}

// HeroLayout: Layout with hero section and overlay/sticky navigation
export function HeroLayout({ 
  children, 
  heroContent, 
  heroClassName = "",
  minHeight = "70vh" 
}: HeroLayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  // Detect scroll to toggle header mode
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Overlay Header */}
      <Header isOverlay={!isScrolled} isSticky={isScrolled} />
      
      {/* Hero Section */}
      {heroContent && (
        <section 
          className={cn(
            "relative flex items-center justify-center overflow-hidden",
            heroClassName
          )}
          style={{ minHeight }}
        >
          {heroContent}
        </section>
      )}
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  )
}