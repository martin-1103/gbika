"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Handshake, MessageSquare, ArrowRight, Star, Phone } from "lucide-react"
import Link from "next/link"

interface CallToActionProps {
  className?: string
}

// CallToAction: Encourage user engagement through partnership and testimonials
export function CallToAction({ className }: CallToActionProps) {


  return (
    <section className={`py-16 px-4 ${className}`}>
      <div className="container mx-auto">
        {/* Modern Header with Stats */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="secondary" className="px-3 py-1">
              <Star className="w-3 h-3 mr-1" />
              Bergabung Bersama Kami
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Menjadi Bagian Pelayanan
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Bersama-sama kita dapat menyebarkan kasih Kristus lebih luas melalui berbagai cara
          </p>
          

        </div>
        
        {/* Modern Action Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Partnership CTA */}
          <Card className="group bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-8 text-center relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Handshake className="w-8 h-8 text-white" />
              </div>
              
              <Badge variant="secondary" className="mb-3 bg-blue-50 text-blue-700 border-blue-200">
                Partnership
              </Badge>
              <h3 className="text-xl font-bold mb-4 text-foreground">Menjadi Partner</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Dukung pelayanan Radio El-Shaddai FM melalui partnership dan bantuan doa. 
                Bersama kita dapat menjangkau lebih banyak jiwa.
              </p>
              
              <Button asChild className="group/btn w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 shadow-md">
                <Link href="/partnership">
                  Bergabung Sekarang
                  <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* Testimonial CTA */}
          <Card className="group bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-8 text-center relative">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              
              <Badge variant="secondary" className="mb-3 bg-green-50 text-green-700 border-green-200">
                Kesaksian
              </Badge>
              <h3 className="text-xl font-bold mb-4 text-foreground">Bagikan Kesaksian</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Ceritakan bagaimana Tuhan bekerja dalam hidup Anda. 
                Kesaksian Anda dapat menguatkan iman orang lain.
              </p>
              
              <Button asChild variant="outline" className="group/btn w-full border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300">
                <Link href="/kesaksian">
                  Kirim Kesaksian
                  <Heart className="ml-2 w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* Contact CTA */}
          <Card className="group bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-sm overflow-hidden md:col-span-2 lg:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-8 text-center relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Phone className="w-8 h-8 text-white" />
              </div>
              
              <Badge variant="secondary" className="mb-3 bg-purple-50 text-purple-700 border-purple-200">
                Kontak
              </Badge>
              <h3 className="text-xl font-bold mb-4 text-foreground">Hubungi Kami</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Butuh doa khusus atau ingin berbagi pergumulan? 
                Tim pastoral kami siap melayani Anda.
              </p>
              
              <Button asChild variant="outline" className="group/btn w-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300">
                <Link href="/kontak">
                  Kontak Sekarang
                  <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Modern Bottom CTA */}
        <div className="mt-16">
          <Card className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground border-0 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
            
            <CardContent className="p-12 text-center relative">
              <div className="max-w-4xl mx-auto">
                <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  <Star className="w-3 h-3 mr-1" />
                  Amanat Agung
                </Badge>
                
                <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                  &quot;Karena itu pergilah, jadikanlah semua bangsa murid-Ku...&quot;
                </h3>
                <p className="text-primary-foreground/90 mb-8 text-xl leading-relaxed">
                  Matius 28:19 - Mari bersama-sama menjadi bagian dari Amanat Agung
                </p>
                

                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    className="group bg-white text-primary hover:bg-white/90 shadow-lg font-semibold px-8"
                    asChild
                  >
                    <Link href="/tentang-kami">
                      Pelajari Lebih Lanjut
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="group bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm font-semibold px-8"
                    asChild
                  >
                    <Link href="/dengarkan-live">
                      Dengarkan Sekarang
                      <Heart className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}