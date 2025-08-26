"use client"

import { Header } from "./header"
import { Footer } from "./footer"

interface PublicLayoutProps {
  children: React.ReactNode
}

// PublicLayout: Main layout wrapper for all public pages with header and footer
export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}