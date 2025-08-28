import { Metadata } from "next"
import { PublicLayout } from "@/components/layout/public-layout"
import { SongRequestForm } from "@/components/forms/song-request-form"
import { Card, CardContent } from "@/components/ui/card"
import { Music, Users, Clock, Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "Request Lagu - Radio Gbika",
  description: "Kirimkan permintaan lagu favorit Anda untuk diputar di Radio Gbika. Bagikan pesan dan dedikasi bersama lagu pilihan Anda.",
  keywords: ["request lagu", "permintaan lagu", "radio gbika", "musik kristen", "dedikasi lagu"]
}

// SongRequestPage: Page for submitting song requests with dedications
export default function SongRequestPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Request Lagu
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            &quot;Bernyanyilah bagi TUHAN nyanyian baru, bernyanyilah bagi TUHAN, hai segenap bumi!&quot; - Mazmur 96:1
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Song Request Form */}
          <div className="lg:col-span-2">
            <SongRequestForm />
          </div>

          {/* Information Sidebar */}
          <div className="space-y-6">
            {/* About Song Request */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Music className="h-5 w-5 text-primary" />
                  Tentang Request Lagu
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Kirimkan permintaan lagu favorit Anda untuk diputar di Radio Gbika. 
                  Bagikan pesan dan dedikasi khusus bersama lagu pilihan Anda.
                </p>
                <p className="text-sm text-muted-foreground">
                  Setiap lagu yang diputar akan disertai dengan pesan dedikasi Anda 
                  untuk menyebarkan kasih dan berkat kepada pendengar lainnya.
                </p>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Cara Kerja
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">1</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Isi formulir request dengan judul lagu dan pesan dedikasi
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">2</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Penyiar akan menerima permintaan Anda secara real-time
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">3</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Lagu akan diputar dengan dedikasi Anda di siaran
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Request Guidelines */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Panduan Request
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Waktu Proses</span>
                    <span className="font-medium">5-15 menit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jam Operasional</span>
                    <span className="font-medium">06:00 - 24:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jenis Musik</span>
                    <span className="font-medium">Rohani Kristen</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Request akan diputar sesuai dengan program siaran yang sedang berlangsung
                </p>
              </CardContent>
            </Card>

            {/* Privacy Notice */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Kebijakan Konten
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Semua request lagu akan dimoderasi untuk memastikan kesesuaian 
                  dengan nilai-nilai Kristiani dan standar siaran kami.
                </p>
                <p className="text-sm text-muted-foreground">
                  Pesan dedikasi yang tidak pantas atau mengandung unsur SARA 
                  tidak akan disiarkan.
                </p>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Butuh Bantuan?
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Jika Anda memiliki pertanyaan tentang request lagu atau 
                  mengalami kendala teknis, hubungi kami.
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Telepon:</strong> +62 21 1234 5678
                  </p>
                  <p>
                    <strong>Email:</strong> request@radiogbika.com
                  </p>
                  <p>
                    <strong>WhatsApp:</strong> +62 812 3456 7890
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 text-center">
          <Card className="bg-primary text-primary-foreground max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                &quot;Nyanyikanlah syukur kepada TUHAN dengan kecapi, bermazmurlah bagi-Nya dengan gambus sepuluh tali!&quot;
              </h3>
              <p className="text-primary-foreground/80 text-lg">
                Mazmur 33:2 - Mari bersama memuji Tuhan melalui musik
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  )
}