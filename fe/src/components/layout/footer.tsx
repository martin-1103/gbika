"use client"

import Link from "next/link"
import { Radio, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react"

// Footer: Bottom section with contact info, links, and copyright
export function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { href: "/tentang-kami", label: "Tentang Kami" },
    { href: "/program", label: "Program & Jadwal" },
    { href: "/renungan", label: "Renungan" },
    { href: "/kesaksian", label: "Kesaksian" },
  ]

  const serviceLinks = [
    { href: "/layanan/doa", label: "Layanan Doa" },
    { href: "/layanan/request-lagu", label: "Request Lagu" },
    { href: "/partnership", label: "Partnership" },
    { href: "/pasang-iklan", label: "Pasang Iklan" },
  ]

  const socialLinks = [
    { href: "#", icon: Facebook, label: "Facebook" },
    { href: "#", icon: Instagram, label: "Instagram" },
    { href: "#", icon: Youtube, label: "YouTube" },
  ]

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Radio className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">El Shaddai FM</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Radio Kristen yang menyebarkan kasih dan berkat Tuhan melalui musik, renungan, dan pelayanan kepada masyarakat.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Menu Utama</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Layanan</h3>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Kontak Kami</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Jl. Contoh No. 123<br />
                  Jakarta, Indonesia
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  +62 21 1234 5678
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  info@elshaddaifm.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} El Shaddai FM. Semua hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  )
}