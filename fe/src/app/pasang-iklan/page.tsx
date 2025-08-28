"use client"

import { HeroLayout } from "@/components/layout"
import { HeroSection } from "@/components/homepage/hero-section"
import { AdvertisingForm } from "@/components/forms"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Megaphone, 
  Users, 
  Clock,
  Radio,
  Target,
  TrendingUp,
  Star,
  CheckCircle,
  BarChart3,
  Headphones,
  Calendar,
  DollarSign
} from "lucide-react"

// Advertising page: Information about advertising packages and placement form
export default function PasangIklanPage() {
  const packages = [
    {
      name: "Spot Radio Basic",
      price: "Rp 500K",
      duration: "30 detik",
      frequency: "5x sehari",
      period: "1 minggu",
      features: [
        "Spot audio 30 detik",
        "5x penayangan per hari", 
        "Prime time slots",
        "Script consultation"
      ],
      popular: false
    },
    {
      name: "Sponsorship Premium",
      price: "Rp 2.5M",
      duration: "60 detik",
      frequency: "Program sponsor",
      period: "1 bulan",
      features: [
        "Sponsor program populer",
        "Mention setiap program",
        "Social media promotion",
        "Website banner placement"
      ],
      popular: true
    },
    {
      name: "Live Mention",
      price: "Rp 200K",
      duration: "Live mention",
      frequency: "1x per program",
      period: "Per mention",
      features: [
        "Live mention by presenter",
        "Interactive promotion",
        "Flexible timing",
        "Social engagement"
      ],
      popular: false
    }
  ]

  const stats = [
    { label: "Pendengar Harian", value: "100K+", icon: Headphones },
    { label: "Jangkauan Kota", value: "15+", icon: Target },
    { label: "Program Aktif", value: "50+", icon: Radio },
    { label: "Tingkat Engagement", value: "85%", icon: TrendingUp }
  ]

  const benefits = [
    {
      icon: Users,
      title: "Audiens Targeted",
      description: "Jangkau audiens yang tepat sesuai dengan program dan waktu siaran yang Anda pilih."
    },
    {
      icon: Clock,
      title: "Fleksibel",
      description: "Pilihan paket yang fleksibel sesuai budget dan kebutuhan promosi bisnis Anda."
    },
    {
      icon: Star,
      title: "Kualitas Tinggi",
      description: "Produksi iklan berkualitas tinggi dengan tim kreatif berpengalaman."
    },
    {
      icon: BarChart3,
      title: "Laporan Performance",
      description: "Dapatkan laporan performa iklan dan insight mendalam tentang reach audience."
    }
  ]

  return (
    <HeroLayout
      heroContent={
        <HeroSection 
          title="Jangkau Ribuan Pendengar Setia"
          subtitle="Pasang Iklan"
          description="Promosikan bisnis Anda melalui Radio Gbika dan capai audiens yang tepat dengan program-program berkualitas dan nilai-nilai Kristiani."
          showPlayer={false}
          showThemeToggle={false}
          backgroundImage="/advertising-bg.webp"
        />
      }
    >
      <div className="container mx-auto px-4 py-8 space-y-12">

        {/* Stats Section */}
        <div className="bg-primary/5 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Mengapa Radio Gbika?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-center">Keunggulan Beriklan di Radio Gbika</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <benefit.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Packages Section */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Paket Iklan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Pilih paket iklan yang sesuai dengan kebutuhan dan budget bisnis Anda. 
              Semua paket dapat dikustomisasi sesuai permintaan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <Card key={index} className={`relative ${pkg.popular ? 'border-primary shadow-lg' : ''}`}>
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary">Paling Populer</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-primary">{pkg.price}</div>
                    <div className="text-sm text-muted-foreground">per {pkg.period}</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Clock className="h-4 w-4 inline mr-1 text-primary" />
                      {pkg.duration}
                    </div>
                    <div>
                      <Radio className="h-4 w-4 inline mr-1 text-primary" />
                      {pkg.frequency}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant={pkg.popular ? "default" : "outline"}
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    Pilih Paket
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Butuh paket custom atau konsultasi lebih lanjut?
            </p>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Konsultasi Gratis
            </Button>
          </div>
        </div>

        {/* Process Section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-center">Proses Mudah & Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Ajukan Permintaan</h3>
              <p className="text-sm text-muted-foreground">
                Isi formulir permintaan iklan dengan detail kebutuhan Anda
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Konsultasi</h3>
              <p className="text-sm text-muted-foreground">
                Tim kami akan menghubungi untuk konsultasi paket dan strategi
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Produksi</h3>
              <p className="text-sm text-muted-foreground">
                Produksi materi iklan berkualitas tinggi sesuai brand Anda
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold">4</span>
              </div>
              <h3 className="font-semibold mb-2">Tayang</h3>
              <p className="text-sm text-muted-foreground">
                Iklan mulai tayang dan mendapat laporan performa rutin
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="bg-muted/50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Testimoni Klien</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">PT. Maju Bersama</h3>
                    <p className="text-sm text-muted-foreground">Retail & Fashion</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  &quot;Iklan di Radio Gbika sangat efektif untuk menjangkau target market kami. 
                  Tim professional dan hasil yang memuaskan!&quot;
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Rumah Makan Berkah</h3>
                    <p className="text-sm text-muted-foreground">Food & Beverage</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  &quot;Setelah iklan di Radio Gbika, penjualan meningkat 40%. Audiensnya 
                  sangat tepat dengan target pasar kami.&quot;
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Ajukan Permintaan Iklan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Isi formulir di bawah ini dengan lengkap. Tim marketing kami akan menghubungi 
              Anda dalam 1-2 hari kerja untuk konsultasi lebih lanjut.
            </p>
          </div>
          
          <AdvertisingForm />
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Pertanyaan Umum</CardTitle>
            <CardDescription>
              Jawaban untuk pertanyaan yang sering diajukan tentang iklan di Radio Gbika
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Apakah ada minimum kontrak?</h3>
                <p className="text-sm text-muted-foreground">
                  Tidak ada minimum kontrak. Anda bisa mulai dengan paket mingguan 
                  dan upgrade sesuai kebutuhan.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Bisakah iklan dikustomisasi?</h3>
                <p className="text-sm text-muted-foreground">
                  Ya, semua paket iklan dapat dikustomisasi sesuai kebutuhan dan 
                  budget Anda. Konsultasikan dengan tim kami.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Bagaimana cara pembayaran?</h3>
                <p className="text-sm text-muted-foreground">
                  Pembayaran dapat dilakukan via transfer bank, e-wallet, atau 
                  secara kredit dengan syarat dan ketentuan berlaku.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Apakah ada laporan performa?</h3>
                <p className="text-sm text-muted-foreground">
                  Ya, kami menyediakan laporan performa iklan termasuk reach, 
                  frequency, dan engagement metrics.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center bg-primary/5 rounded-2xl p-8 space-y-4">
          <h2 className="text-2xl font-bold">Siap Memulai Kampanye Iklan?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tim marketing profesional kami siap membantu Anda merancang kampanye iklan 
            yang efektif dan sesuai target. Konsultasi gratis!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              <Megaphone className="mr-2 h-4 w-4" />
              Mulai Sekarang
            </Button>
            <Button variant="outline" size="lg">
              <Calendar className="mr-2 h-4 w-4" />
              Jadwalkan Konsultasi
            </Button>
          </div>
        </div>
      </div>
    </HeroLayout>
  )
}