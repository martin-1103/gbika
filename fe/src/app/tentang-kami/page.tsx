"use client"

import { PublicLayout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Radio, 
  Heart, 
  Users, 
  Mic, 
  MapPin,
  Phone,
  Mail,
  Play,
  Award
} from "lucide-react"
import Link from "next/link"

// About Us page: Radio Gbika company information and history
export default function TentangKamiPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <Badge variant="outline" className="text-primary">
            <Radio className="w-4 h-4 mr-2" />
            Tentang Radio Gbika
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold">
            Menyebarkan Kasih Kristus
            <span className="block text-primary">Melalui Gelombang Radio</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Radio Gbika telah melayani masyarakat selama puluhan tahun dengan program-program 
            yang menghibur, menginspirasi, dan menguatkan iman.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Visi Kami
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
                Menjadi radio Kristiani terdepan yang memberkati, menginspirasi, dan 
                mempersatukan umat dalam kasih Kristus melalui program-program berkualitas.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Misi Kami
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>• Menyebarkan nilai-nilai Kristiani melalui media radio</li>
                <li>• Memberikan hiburan yang sehat dan mendidik</li>
                <li>• Membangun komunitas yang saling mendukung</li>
                <li>• Melayani kebutuhan rohani masyarakat</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* History Timeline */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Perjalanan Kami</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-20 text-right">
                <Badge variant="outline">1990</Badge>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Berdiri Pertama Kali</h3>
                <p className="text-muted-foreground">
                  Radio Gbika didirikan dengan visi menyebarkan kasih Kristus melalui gelombang radio.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-20 text-right">
                <Badge variant="outline">2000</Badge>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Ekspansi Digital</h3>
                <p className="text-muted-foreground">
                  Memulai siaran online dan mengembangkan program-program interaktif.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-20 text-right">
                <Badge variant="outline">2010</Badge>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Era Multimedia</h3>
                <p className="text-muted-foreground">
                  Integrasi dengan media sosial dan platform streaming modern.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-20 text-right">
                <Badge variant="outline">2025</Badge>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Digital Transformation</h3>
                <p className="text-muted-foreground">
                  Peluncuran website baru dengan fitur live chat dan streaming berkualitas tinggi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-primary/5 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Radio Gbika Dalam Angka</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">35+</div>
              <div className="text-muted-foreground">Tahun Mengudara</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50+</div>
              <div className="text-muted-foreground">Program Mingguan</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">100K+</div>
              <div className="text-muted-foreground">Pendengar Aktif</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-muted-foreground">Siaran Non-Stop</div>
            </div>
          </div>
        </div>

        {/* Team Leadership */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-center">Tim Kepemimpinan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Mic className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-semibold">Pdt. John Doe</h3>
                <p className="text-sm text-muted-foreground mb-2">Direktur Utama</p>
                <p className="text-xs">Memimpin visi dan strategi Radio Gbika</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-semibold">Jane Smith</h3>
                <p className="text-sm text-muted-foreground mb-2">Program Director</p>
                <p className="text-xs">Mengkoordinasi seluruh program siaran</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-semibold">Michael Johnson</h3>
                <p className="text-sm text-muted-foreground mb-2">Head of Technology</p>
                <p className="text-xs">Mengembangkan platform digital</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Hubungi Kami</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <MapPin className="h-6 w-6 mx-auto text-primary" />
                <h3 className="font-semibold">Alamat</h3>
                <p className="text-sm text-muted-foreground">
                  Jl. Radio Gbika No. 123<br />
                  Jakarta Selatan, 12345
                </p>
              </div>
              
              <div className="space-y-2">
                <Phone className="h-6 w-6 mx-auto text-primary" />
                <h3 className="font-semibold">Telepon</h3>
                <p className="text-sm text-muted-foreground">
                  +62 21 1234 5678<br />
                  +62 21 8765 4321
                </p>
              </div>
              
              <div className="space-y-2">
                <Mail className="h-6 w-6 mx-auto text-primary" />
                <h3 className="font-semibold">Email</h3>
                <p className="text-sm text-muted-foreground">
                  info@radiogbika.com<br />
                  program@radiogbika.com
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center space-y-6 bg-primary/5 rounded-2xl p-8">
          <h2 className="text-3xl font-bold">Bergabung Dengan Kami</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mari bersama-sama menyebarkan kasih Kristus dan membangun komunitas yang kuat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/live">
                <Play className="mr-2 h-4 w-4" />
                Dengarkan Live
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/kontak">
                <Mail className="mr-2 h-4 w-4" />
                Kontak Kami
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}