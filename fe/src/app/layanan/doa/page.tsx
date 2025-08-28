import { Metadata } from "next"
import { PublicLayout } from "@/components/layout/public-layout"
import { PrayerRequestForm } from "@/components/forms/prayer-request-form"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Clock, Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "Layanan Doa - Radio El-Shaddai FM",
  description: "Kirimkan permohonan doa Anda kepada tim doa Radio El-Shaddai FM. Kami akan mendoakan Anda dengan sepenuh hati dan dalam kerahasiaan.",
  keywords: ["layanan doa", "permohonan doa", "radio gbika", "doa kristen", "tim doa"]
}

// PrayerServicePage: Page for submitting prayer requests to the prayer team
export default function PrayerServicePage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Layanan Doa
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            &quot;Sebab itu hendaklah kamu saling mengaku dosamu dan saling mendoakan, 
            supaya kamu sembuh. Doa orang yang benar, bila dengan yakin didoakan, 
            sangat besar kuasanya.&quot; - Yakobus 5:16
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Prayer Request Form */}
          <div className="lg:col-span-2">
            <PrayerRequestForm />
          </div>

          {/* Information Sidebar */}
          <div className="space-y-6">
            {/* About Prayer Service */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Tentang Layanan Doa
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tim doa Radio El-Shaddai FM terdiri dari hamba-hamba Tuhan yang berpengalaman 
                  dan berkomitmen untuk mendoakan setiap permohonan yang masuk dengan 
                  sepenuh hati.
                </p>
                <p className="text-sm text-muted-foreground">
                  Kami percaya bahwa doa adalah kekuatan yang mengubahkan dan Tuhan 
                  selalu mendengar setiap seruan anak-anak-Nya.
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
                      Isi formulir permohonan doa dengan lengkap
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">2</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tim doa akan menerima notifikasi permohonan Anda
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">3</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Kami akan mendoakan Anda dalam sesi doa rutin
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prayer Schedule */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Jadwal Doa
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Senin - Jumat</span>
                    <span className="font-medium">06:00 & 18:00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sabtu</span>
                    <span className="font-medium">06:00 & 19:00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Minggu</span>
                    <span className="font-medium">07:00 & 19:00</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Semua waktu dalam WIB (Waktu Indonesia Barat)
                </p>
              </CardContent>
            </Card>

            {/* Privacy Notice */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Kerahasiaan
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Semua permohonan doa akan dijaga kerahasiaannya. Hanya tim doa 
                  yang akan mengetahui isi permohonan Anda.
                </p>
                <p className="text-sm text-muted-foreground">
                  Jika Anda memilih opsi &quot;anonim&quot;, identitas Anda tidak akan 
                  disebutkan dalam sesi doa.
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
                  Jika Anda memiliki pertanyaan atau membutuhkan konseling pastoral, 
                  jangan ragu untuk menghubungi kami.
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Telepon:</strong> +62 21 1234 5678
                  </p>
                  <p>
                    <strong>Email:</strong> doa@radiogbika.com
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
                &quot;Mintalah, maka akan diberikan kepadamu; carilah, maka kamu akan mendapat; 
                ketoklah, maka pintu akan dibukakan bagimu.&quot;
              </h3>
              <p className="text-primary-foreground/80 text-lg">
                Matius 7:7 - Tuhan selalu mendengar doa anak-anak-Nya
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  )
}