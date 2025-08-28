"use client"

import { HeroLayout } from "@/components/layout"
import { HeroSection } from "@/components/homepage/hero-section"
import { PartnershipForm } from "@/components/forms"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Handshake, 
  Heart, 
  Users, 
  Globe,
  Star,
  Shield,
  CheckCircle,
  Target
} from "lucide-react"

// Partnership page: Information and form for partnership opportunities
export default function PartnershipPage() {
  return (
    <HeroLayout
      heroContent={
        <HeroSection 
          title="Partnership"
          subtitle="Bersama Menyebarkan Injil"
          description="Bergabunglah dengan Radio Gbika dalam misi menyebarkan Injil melalui media radio. Bersama-sama kita dapat menjangkau lebih banyak jiwa untuk kerajaan Tuhan."
          showPlayer={false}
          showThemeToggle={false}
          backgroundImage="/partnership-bg.webp"
        />
      }
    >
      <div className="container mx-auto px-4 py-8 space-y-8">

        {/* Partnership Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <Globe className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Jangkauan Luas</h3>
              <p className="text-sm text-muted-foreground">
                Menjangkau ribuan pendengar di seluruh Indonesia
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Misi Mulia</h3>
              <p className="text-sm text-muted-foreground">
                Turut serta dalam menyebarkan kasih dan berkat Tuhan
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Komunitas Solid</h3>
              <p className="text-sm text-muted-foreground">
                Bergabung dengan komunitas yang memiliki visi sama
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Star className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Dampak Positif</h3>
              <p className="text-sm text-muted-foreground">
                Menciptakan dampak positif bagi kehidupan banyak orang
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <PartnershipForm />
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-4">
              {/* Partnership Types */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center space-x-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span>Jenis Partnership</span>
                  </h3>
                  
                  <div className="space-y-4 text-sm">
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium mb-1">Sponsor Program</p>
                      <p className="text-muted-foreground">
                        Mendukung program siaran khusus dengan nama perusahaan/organisasi
                      </p>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium mb-1">Media Partner</p>
                      <p className="text-muted-foreground">
                        Kerjasama publikasi dan promosi acara atau kegiatan gereja
                      </p>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium mb-1">Community Partner</p>
                      <p className="text-muted-foreground">
                        Kolaborasi dalam kegiatan sosial dan pelayanan masyarakat
                      </p>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium mb-1">Ministry Partner</p>
                      <p className="text-muted-foreground">
                        Kemitraan dalam program pelayanan dan penginjilan
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Partnership Process */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>Proses Partnership</span>
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Pengajuan Proposal</p>
                        <p className="text-muted-foreground">
                          Kirim proposal melalui form atau email
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Evaluasi Tim</p>
                        <p className="text-muted-foreground">
                          Tim akan mengevaluasi proposal dan kecocokan visi
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Diskusi Detail</p>
                        <p className="text-muted-foreground">
                          Meeting untuk membahas detail kerjasama
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
                        4
                      </div>
                      <div>
                        <p className="font-medium">Penandatanganan</p>
                        <p className="text-muted-foreground">
                          MoU dan pelaksanaan program partnership
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Partners */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>Partner Terkini</span>
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-3 p-2 bg-muted/50 rounded">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <Heart className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Gereja Bethel Indonesia</p>
                        <p className="text-muted-foreground text-xs">Ministry Partner</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-2 bg-muted/50 rounded">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <Globe className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Yayasan Kasih Agape</p>
                        <p className="text-muted-foreground text-xs">Community Partner</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-2 bg-muted/50 rounded">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <Star className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">CV Berkat Sejahtera</p>
                        <p className="text-muted-foreground text-xs">Sponsor Partner</p>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground text-center mt-4 pt-3 border-t">
                      Dan 15+ partner lainnya yang mendukung misi kami
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span>Persyaratan</span>
                  </h3>
                  
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Visi dan misi yang sejalan dengan nilai-nilai Kristiani</span>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Komitmen jangka panjang dalam kerjasama</span>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Transparansi dalam tujuan dan ekspektasi</span>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Kesediaan untuk saling mendukung dan berkomunikasi</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Info Kontak</h3>
                  
                  <div className="space-y-3 text-sm">
                    <p className="text-muted-foreground">
                      Untuk informasi lebih lanjut tentang partnership:
                    </p>
                    
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Partnership Manager:</span>
                        <br />
                        <span className="text-muted-foreground">Bpk. Daniel Wijaya</span>
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>
                        <br />
                        <span className="text-muted-foreground">partnership@radiogbika.com</span>
                      </p>
                      <p>
                        <span className="font-medium">WhatsApp:</span>
                        <br />
                        <span className="text-muted-foreground">+62 812 3456 7890</span>
                      </p>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-4 p-2 bg-blue-50 rounded">
                      📅 Respon partnership proposal: 3-7 hari kerja
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Bottom Vision Statement */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <Handshake className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-semibold mb-2">Bersama Membangun Kerajaan</h3>
            <p className="text-muted-foreground mb-4">
              &quot;Karena sama seperti tubuh itu satu dan anggotanya banyak, dan segala anggota itu, 
              sekalipun banyak, merupakan satu tubuh, demikian pula Kristus.&quot; - 1 Korintus 12:12
            </p>
            <p className="text-sm text-muted-foreground">
              Melalui partnership yang solid, kita dapat mencapai lebih banyak jiwa dan 
              membuat dampak yang lebih besar bagi kerajaan Tuhan. Mari bergandengan tangan 
              dalam misi yang mulia ini.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary mb-1">20+</p>
            <p className="text-sm text-muted-foreground">Active Partners</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary mb-1">50K+</p>
            <p className="text-sm text-muted-foreground">Lives Reached</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary mb-1">15</p>
            <p className="text-sm text-muted-foreground">Joint Programs</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary mb-1">5+</p>
            <p className="text-sm text-muted-foreground">Years Experience</p>
          </div>
        </div>
      </div>
    </HeroLayout>
  )
}