"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HeaderProps {
  isOverlay?: boolean
  isSticky?: boolean
}

// Header: Top navigation with logo, menu, and live streaming button
export function Header({ isOverlay = false, isSticky = true }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Toggle mobile menu visibility
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const navigationItems = [
    { href: "/tentang-kami", label: "Tentang Kami" },
    { href: "/program", label: "Program" },
    { href: "/renungan", label: "Renungan" },
    { href: "/kesaksian", label: "Kesaksian" },
    { href: "/layanan/doa", label: "Layanan" },
    { href: "/galeri", label: "Galeri" },
    { href: "/kontak", label: "Kontak" },
  ]

  return (
    <header className={cn(
      "z-50 w-full transition-all duration-300",
      isOverlay ? (
        "absolute top-0 left-0 right-0 bg-transparent border-transparent"
      ) : (
        "sticky top-0 border-b border-border/20 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40"
      ),
      isSticky && !isOverlay && "sticky top-0"
    )}>
      <div className="container mx-auto px-4">
        <div className="py-4">
          {/* Top Row: Logo centered with action buttons on right */}
          <div className="flex h-12 items-center justify-between">
            {/* Empty space for balance */}
            <div className="flex-1"></div>
            
            {/* Logo - Centered */}
            <Link href="/" className="flex items-center space-x-2">
              <Radio className={cn(
                "h-8 w-8",
                isOverlay ? "text-white" : "text-primary"
              )} />
              <span className={cn(
                "text-xl font-bold",
                isOverlay ? "text-white" : ""
              )}>El Shaddai FM</span>
            </Link>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 flex-1 justify-end">
              <Button 
                asChild 
                className={cn(
                  "hidden sm:inline-flex",
                  isOverlay ? "bg-white/20 text-white hover:bg-white/30 border border-white/30" : ""
                )}
              >
                <Link href="/live">
                  <Radio className="mr-2 h-4 w-4" />
                  Dengarkan Live
                </Link>
              </Button>

              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "md:hidden",
                  isOverlay ? "text-white hover:bg-white/10" : ""
                )}
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Bottom Row: Navigation Menu - Centered */}
          <nav className="hidden md:flex items-center justify-center space-x-6 mt-3 pt-3 border-t border-border/20">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isOverlay ? "text-white hover:text-white/80 border-white/20" : ""
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={cn(
            "md:hidden border-t py-4",
            isOverlay ? "border-white/20 bg-black/80 backdrop-blur-xl" : ""
          )}>
            <nav className="flex flex-col space-y-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary px-2 py-1",
                    isOverlay ? "text-white hover:text-white/80" : ""
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className={cn(
                "pt-2 border-t",
                isOverlay ? "border-white/20" : ""
              )}>
                <Button 
                  asChild 
                  className={cn(
                    "w-full",
                    isOverlay ? "bg-white/20 text-white hover:bg-white/30 border border-white/30" : ""
                  )}
                >
                  <Link href="/live" onClick={() => setIsMenuOpen(false)}>
                    <Radio className="mr-2 h-4 w-4" />
                    Dengarkan Live
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}