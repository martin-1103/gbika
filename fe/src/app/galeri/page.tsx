"use client"

import { useState } from "react"
import { PublicLayout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Camera, 
  Search, 
  Calendar,
  MapPin,
  Play,
  Image as ImageIcon,
  Video,
  Users,
  Clock
} from "lucide-react"
import Image from "next/image"

// Sample gallery data
const galleryItems = [
  {
    id: "1",
    type: "image",
    title: "Ibadah Minggu Pagi",
    description: "Suasana khidmat ibadah minggu pagi di studio Radio Gbika",
    imageUrl: "/images/gallery/worship-1.jpg",
    category: "ibadah",
    date: "2024-12-15",
    location: "Studio Utama",
    photographer: "Tim Media"
  },
  {
    id: "2",
    type: "image", 
    title: "Tim Penyiar Bersama",
    description: "Foto bersama tim penyiar Radio Gbika dalam acara gathering tahunan",
    imageUrl: "/images/gallery/team-1.jpg",
    category: "tim",
    date: "2024-12-10",
    location: "Ruang Konferensi",
    photographer: "John Doe"
  },
  {
    id: "3",
    type: "video",
    title: "Behind The Scene",
    description: "Video behind the scene proses produksi program radio harian",
    imageUrl: "/images/gallery/bts-1.jpg",
    videoUrl: "/videos/bts-radio.mp4",
    category: "produksi",
    date: "2024-12-08",
    location: "Studio Produksi",
    duration: "5:30"
  },
  {
    id: "4",
    type: "image",
    title: "Acara Charity",
    description: "Kegiatan bakti sosial Radio Gbika untuk masyarakat sekitar",
    imageUrl: "/images/gallery/charity-1.jpg", 
    category: "acara",
    date: "2024-12-05",
    location: "Panti Asuhan Kasih",
    photographer: "Grace L."
  },
  {
    id: "5",
    type: "image",
    title: "Workshop Musik",
    description: "Workshop musik rohani untuk para pemuda gereja",
    imageUrl: "/images/gallery/workshop-1.jpg",
    category: "workshop",
    date: "2024-11-28",
    location: "Aula Gbika",
    photographer: "Michael C."
  },
  {
    id: "6",
    type: "video",
    title: "Live Concert",
    description: "Rekaman live concert musik rohani spesial Natal",
    imageUrl: "/images/gallery/concert-1.jpg",
    videoUrl: "/videos/concert-natal.mp4",
    category: "acara",
    date: "2024-11-25",
    location: "Studio Live",
    duration: "45:20"
  },
  {
    id: "7",
    type: "image",
    title: "Renovasi Studio",
    description: "Proses renovasi dan upgrade peralatan studio radio",
    imageUrl: "/images/gallery/studio-1.jpg",
    category: "fasilitas",
    date: "2024-11-20",
    location: "Studio Utama",
    photographer: "David S."
  },
  {
    id: "8",
    type: "image",
    title: "Pelatihan Penyiar",
    description: "Sesi pelatihan untuk calon penyiar radio baru",
    imageUrl: "/images/gallery/training-1.jpg",
    category: "pelatihan",
    date: "2024-11-15",
    location: "Ruang Training",
    photographer: "Ruth S."
  }
]

const categories = [
  { value: "all", label: "Semua", count: galleryItems.length },
  { value: "ibadah", label: "Ibadah", count: galleryItems.filter(i => i.category === "ibadah").length },
  { value: "tim", label: "Tim", count: galleryItems.filter(i => i.category === "tim").length },
  { value: "produksi", label: "Produksi", count: galleryItems.filter(i => i.category === "produksi").length },
  { value: "acara", label: "Acara", count: galleryItems.filter(i => i.category === "acara").length },
  { value: "workshop", label: "Workshop", count: galleryItems.filter(i => i.category === "workshop").length },
  { value: "fasilitas", label: "Fasilitas", count: galleryItems.filter(i => i.category === "fasilitas").length },
  { value: "pelatihan", label: "Pelatihan", count: galleryItems.filter(i => i.category === "pelatihan").length }
]

// Gallery page: Photos and videos from Radio Gbika activities
export default function GaleriPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedItem, setSelectedItem] = useState<typeof galleryItems[0] | null>(null)

  // Filter gallery items
  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    })
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <Badge variant="outline" className="text-primary">
            <Camera className="w-4 h-4 mr-2" />
            Galeri
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold">
            Momen-Momen
            <span className="block text-primary">Berharga</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Dokumentasi kegiatan, program, dan momen istimewa dalam perjalanan pelayanan Radio Gbika.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <ImageIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{galleryItems.filter(i => i.type === 'image').length}</div>
            <div className="text-sm text-muted-foreground">Foto</div>
          </div>
          
          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <Video className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{galleryItems.filter(i => i.type === 'video').length}</div>
            <div className="text-sm text-muted-foreground">Video</div>
          </div>
          
          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">50+</div>
            <div className="text-sm text-muted-foreground">Acara</div>
          </div>
          
          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">2024</div>
            <div className="text-sm text-muted-foreground">Tahun Aktif</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari foto atau video..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className="flex items-center gap-1"
              >
                {category.label}
                {category.count > 0 && (
                  <span className="text-xs opacity-75">({category.count})</span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div>
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300"
                  onClick={() => setSelectedItem(item)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden rounded-t-lg">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        {item.type === 'video' ? (
                          <Play className="h-12 w-12 text-white" />
                        ) : (
                          <ImageIcon className="h-12 w-12 text-white" />
                        )}
                      </div>
                      
                      {/* Type Badge */}
                      <div className="absolute top-2 right-2">
                        <Badge variant={item.type === 'video' ? 'destructive' : 'secondary'}>
                          {item.type === 'video' ? (
                            <>
                              <Video className="h-3 w-3 mr-1" />
                              Video
                            </>
                          ) : (
                            <>
                              <ImageIcon className="h-3 w-3 mr-1" />
                              Foto
                            </>
                          )}
                        </Badge>
                      </div>

                      {/* Duration for videos */}
                      {item.type === 'video' && item.duration && (
                        <div className="absolute bottom-2 right-2">
                          <Badge variant="outline" className="bg-black/70 text-white border-white/20">
                            <Clock className="h-3 w-3 mr-1" />
                            {item.duration}
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold line-clamp-1 mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(item.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Tidak Ada Hasil</h3>
              <p className="text-muted-foreground mb-4">
                Tidak ada foto atau video yang cocok dengan pencarian &quot;{searchQuery}&quot;
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}
              >
                Reset Filter
              </Button>
            </div>
          )}
        </div>

        {/* Modal/Lightbox for selected item */}
        {selectedItem && (
          <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <div 
              className="bg-background rounded-lg max-w-4xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {selectedItem.type === 'video' ? (
                  <video
                    controls
                    className="w-full max-h-96 object-contain"
                    poster={selectedItem.imageUrl}
                  >
                    <source src={selectedItem.videoUrl} type="video/mp4" />
                    Browser Anda tidak mendukung video player.
                  </video>
                ) : (
                  <div className="relative w-full max-h-96">
                    <Image
                      src={selectedItem.imageUrl}
                      alt={selectedItem.title}
                      width={800}
                      height={600}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-4 right-4"
                  onClick={() => setSelectedItem(null)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{selectedItem.title}</h2>
                <p className="text-muted-foreground mb-4">{selectedItem.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Tanggal:</strong> {formatDate(selectedItem.date)}
                  </div>
                  <div>
                    <strong>Lokasi:</strong> {selectedItem.location}
                  </div>
                  {selectedItem.photographer && (
                    <div>
                      <strong>Fotografer:</strong> {selectedItem.photographer}
                    </div>
                  )}
                  {selectedItem.duration && (
                    <div>
                      <strong>Durasi:</strong> {selectedItem.duration}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload CTA */}
        <div className="text-center bg-primary/5 rounded-2xl p-8 space-y-4">
          <h2 className="text-2xl font-bold">Punya Foto atau Video?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Jika Anda memiliki dokumentasi kegiatan Radio Gbika yang ingin dibagikan, 
            silakan hubungi tim media kami.
          </p>
          <Button size="lg">
            <Camera className="mr-2 h-4 w-4" />
            Kirim Media
          </Button>
        </div>
      </div>
    </PublicLayout>
  )
}