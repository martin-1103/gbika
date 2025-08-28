"use client"

import { useState } from "react"
import { PublicLayout } from "@/components/layout"
import { PresenterCard } from "@/components/cards"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Mic, 
  Search, 
  Clock,
  Users,
  Radio,
  Star
} from "lucide-react"

// Sample presenter data
const presenters = [
  {
    id: "1",
    name: "Pdt. Sarah Johnson",
    role: "Senior Presenter",
    bio: "Pengalaman 15 tahun dalam pelayanan radio, memandu program renungan pagi dan konseling rohani.",
    avatar: "/images/presenters/sarah.jpg",
    schedule: {
      days: ["Senin", "Rabu", "Jumat"],
      time: "06:00 - 08:00"
    },
    programs: ["Renungan Fajar", "Konseling Rohani"],
    social: {
      instagram: "https://instagram.com/sarah_gbika",
      facebook: "https://facebook.com/sarah.johnson.gbika"
    },
    isOnAir: false
  },
  {
    id: "2", 
    name: "Michael Chen",
    role: "Music Director",
    bio: "Ahli musik rohani dengan passion untuk menghadirkan worship yang bermakna melalui gelombang radio.",
    avatar: "/images/presenters/michael.jpg",
    schedule: {
      days: ["Selasa", "Kamis", "Sabtu"],
      time: "19:00 - 21:00"
    },
    programs: ["Worship Night", "Lagu Rohani Favorit"],
    social: {
      instagram: "https://instagram.com/michael_worship",
      twitter: "https://twitter.com/michaelchen_gbika"
    },
    isOnAir: true
  },
  {
    id: "3",
    name: "Grace Lumbantobing", 
    role: "Youth Program Host",
    bio: "Energik dan kreatif dalam memandu program-program anak muda dengan pendekatan yang fresh dan relevan.",
    avatar: "/images/presenters/grace.jpg",
    schedule: {
      days: ["Minggu"],
      time: "16:00 - 18:00"
    },
    programs: ["Youth Connection", "Teens Talk"],
    social: {
      instagram: "https://instagram.com/grace_youth",
      facebook: "https://facebook.com/grace.lumbantobing"
    },
    isOnAir: false
  },
  {
    id: "4",
    name: "David Santoso",
    role: "Talk Show Host", 
    bio: "Host berpengalaman untuk program talk show dan wawancara dengan tokoh-tokoh inspiratif.",
    avatar: "/images/presenters/david.jpg",
    schedule: {
      days: ["Senin", "Kamis"],
      time: "20:00 - 22:00"
    },
    programs: ["Inspirasi Malam", "Dialog Kehidupan"],
    social: {
      instagram: "https://instagram.com/david_talks",
      facebook: "https://facebook.com/david.santoso.gbika"
    },
    isOnAir: false
  },
  {
    id: "5",
    name: "Ruth Situmorang",
    role: "Family Program Host",
    bio: "Spesialis program keluarga dengan heart untuk membangun rumah tangga yang kuat dalam iman.",
    avatar: "/images/presenters/ruth.jpg", 
    schedule: {
      days: ["Rabu", "Sabtu"],
      time: "10:00 - 12:00"
    },
    programs: ["Family Time", "Parenting Corner"],
    social: {
      instagram: "https://instagram.com/ruth_family",
      facebook: "https://facebook.com/ruth.situmorang.gbika"
    },
    isOnAir: false
  },
  {
    id: "6",
    name: "Joshua Tampubolon",
    role: "Morning Show Host",
    bio: "Presenter pagi yang penuh semangat, siap menyapa hari dengan sukacita dan berkat Tuhan.",
    avatar: "/images/presenters/joshua.jpg",
    schedule: {
      days: ["Selasa", "Jumat"],
      time: "08:00 - 10:00" 
    },
    programs: ["Good Morning Blessing", "Pagi Ceria"],
    social: {
      instagram: "https://instagram.com/joshua_morning",
      twitter: "https://twitter.com/joshua_gbika"
    },
    isOnAir: false
  }
]

// Presenters page: Showcase radio presenters and their programs  
export default function PenyiarPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")

  // Filter presenters based on search and role
  const filteredPresenters = presenters.filter(presenter => {
    const matchesSearch = presenter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         presenter.programs.some(program => program.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesRole = selectedRole === "all" || presenter.role.toLowerCase().includes(selectedRole.toLowerCase())
    
    return matchesSearch && matchesRole
  })

  // Get unique roles for filter
  const roles = [...new Set(presenters.map(p => p.role))]
  const onAirPresenters = presenters.filter(p => p.isOnAir)

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <Badge variant="outline" className="text-primary">
            <Mic className="w-4 h-4 mr-2" />
            Tim Penyiar
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold">
            Suara-Suara
            <span className="block text-primary">Yang Memberkati</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Berkenalan dengan tim penyiar Radio Gbika yang berdedikasi menyebarkan kasih Kristus 
            melalui program-program yang inspiratif dan menghibur.
          </p>
        </div>

        {/* On Air Now */}
        {onAirPresenters.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Radio className="h-5 w-5 text-red-600 animate-pulse" />
              <h2 className="text-lg font-semibold text-red-800">Sedang Mengudara</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {onAirPresenters.map((presenter) => (
                <PresenterCard
                  key={presenter.id}
                  presenter={presenter}
                  variant="compact"
                  showSocial={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari penyiar atau program..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedRole === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRole("all")}
            >
              Semua
            </Button>
            {roles.map((role) => (
              <Button
                key={role}
                variant={selectedRole === role.toLowerCase() ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRole(role.toLowerCase())}
              >
                {role}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{presenters.length}</div>
            <div className="text-sm text-muted-foreground">Total Penyiar</div>
          </div>
          
          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <Radio className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{onAirPresenters.length}</div>
            <div className="text-sm text-muted-foreground">Sedang Live</div>
          </div>
          
          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">24</div>
            <div className="text-sm text-muted-foreground">Jam Siaran</div>
          </div>
          
          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">50+</div>
            <div className="text-sm text-muted-foreground">Program Unik</div>
          </div>
        </div>

        {/* Presenters Grid */}
        <div>
          {filteredPresenters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPresenters.map((presenter) => (
                <PresenterCard
                  key={presenter.id}
                  presenter={presenter}
                  onViewProfile={() => {
                    // Future: Navigate to individual presenter profile
                    console.log(`View profile for ${presenter.name}`)
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Penyiar Tidak Ditemukan</h3>
              <p className="text-muted-foreground mb-4">
                Tidak ada penyiar yang cocok dengan pencarian &quot;{searchQuery}&quot;
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedRole("all")
                }}
              >
                Reset Filter
              </Button>
            </div>
          )}
        </div>

        {/* Join Team CTA */}
        <div className="text-center bg-primary/5 rounded-2xl p-8 space-y-4">
          <h2 className="text-2xl font-bold">Tertarik Bergabung?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Jika Anda memiliki passion untuk pelayanan melalui media radio dan ingin menjadi 
            bagian dari tim Radio Gbika, kami sangat terbuka untuk kandidat yang tepat.
          </p>
          <Button size="lg">
            <Mic className="mr-2 h-4 w-4" />
            Hubungi Kami
          </Button>
        </div>
      </div>
    </PublicLayout>
  )
}