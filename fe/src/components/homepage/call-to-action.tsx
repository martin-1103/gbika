"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Handshake, MessageSquare, ArrowRight } from "lucide-react"
import Link from "next/link"

interface CallToActionProps {
  className?: string
}

// CallToAction: Encourage user engagement through partnership and testimonials
export function CallToAction({ className }: CallToActionProps) {
  return (
    <section className={`py-16 px-4 bg-gradient-to-br from-primary/5 via-background to-primary/10 ${className}`}>
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bergabunglah dalam Pelayanan
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Bersama-sama kita dapat menyebarkan kasih Kristus lebih luas melalui berbagai cara
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Partnership CTA */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Handshake className="w-8 h-8 text-primary" />
              </div>
              
              <h3 className="text-xl font-bold mb-4">Menjadi Partner</h3>
              <p className="text-muted-foreground mb-6">
                Dukung pelayanan Radio Gbika melalui partnership dan bantuan doa. 
                Bersama kita dapat menjangkau lebih banyak jiwa.
              </p>
              
              <Button asChild className="group/btn">
                <Link href="/partnership">
                  Bergabung Sekarang
                  <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* Testimonial CTA */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              
              <h3 className="text-xl font-bold mb-4">Bagikan Kesaksian</h3>
              <p className="text-muted-foreground mb-6">
                Ceritakan bagaimana Tuhan bekerja dalam hidup Anda. 
                Kesaksian Anda dapat menguatkan iman orang lain.
              </p>
              
              <Button asChild variant="outline" className="group/btn">
                <Link href="/kesaksian">
                  Kirim Kesaksian
                  <MessageSquare className="ml-2 w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* Contact CTA */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 md:col-span-2 lg:col-span-1">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              
              <h3 className="text-xl font-bold mb-4">Hubungi Kami</h3>
              <p className="text-muted-foreground mb-6">
                Butuh doa khusus atau ingin berbagi pergumulan? 
                Tim pastoral kami siap melayani Anda.
              </p>
              
              <Button asChild variant="outline" className="group/btn">
                <Link href="/kontak">
                  Kontak Sekarang
                  <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                "Karena itu pergilah, jadikanlah semua bangsa murid-Ku..."
              </h3>
              <p className="text-primary-foreground/80 mb-6 text-lg">
                Matius 28:19 - Mari bersama-sama menjadi bagian dari Amanat Agung
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="group"
                  asChild
                >
                  <Link href="/tentang-kami">
                    Pelajari Lebih Lanjut
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary group"
                  asChild
                >
                  <Link href="/dengarkan-live">
                    Dengarkan Sekarang
                    <Heart className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}