"use client"

import { PublicLayout } from "@/components/layout"
import { TestimonialSubmitForm } from "@/components/forms"
import { Card, CardContent } from "@/components/ui/card"
import { 
  MessageSquare, 
  Heart, 
  Shield, 
  CheckCircle,
  Users,
  Star
} from "lucide-react"

// Submit Testimonial page: Form for submitting testimonials
export default function SubmitTestimonialPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <MessageSquare className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Kirim Kesaksian</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bagikan pengalaman luar biasa Anda dengan Tuhan. Kesaksian Anda dapat 
            menjadi berkat dan kekuatan bagi saudara seiman lainnya.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Menguatkan Iman</h3>
              <p className="text-sm text-muted-foreground">
                Kesaksian Anda akan menguatkan iman banyak orang
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Komunitas Berkat</h3>
              <p className="text-sm text-muted-foreground">
                Bergabung dalam komunitas yang saling berbagi berkat
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Dimoderasi</h3>
              <p className="text-sm text-muted-foreground">
                Kesaksian akan ditinjau sebelum dipublikasikan
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Star className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Memuliakan Tuhan</h3>
              <p className="text-sm text-muted-foreground">
                Setiap kesaksian adalah kemuliaan bagi nama Tuhan
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <TestimonialSubmitForm />
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-4">
              {/* Guidelines */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>Panduan Penulisan</span>
                  </h3>
                  
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="font-medium mb-2">Tips Kesaksian yang Baik:</p>
                      <ul className="space-y-1 text-muted-foreground">
                        <li className="flex items-start space-x-2">
                          <span className="text-primary">•</span>
                          <span>Ceritakan secara kronologis</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-primary">•</span>
                          <span>Fokus pada perbuatan Tuhan</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-primary">•</span>
                          <span>Gunakan bahasa yang sederhana</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-primary">•</span>
                          <span>Sertakan detail yang relevan</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-primary">•</span>
                          <span>Akhiri dengan syukur kepada Tuhan</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Examples */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <span>Contoh Tema Kesaksian</span>
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium">Kesembuhan Ilahi</p>
                      <p className="text-muted-foreground">
                        Bagaimana Tuhan menyembuhkan penyakit atau memberikan kekuatan
                      </p>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium">Penyediaan Tuhan</p>
                      <p className="text-muted-foreground">
                        Pengalaman tentang pemeliharaan dan penyediaan Tuhan
                      </p>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium">Pertobatan</p>
                      <p className="text-muted-foreground">
                        Perjalanan spiritual dan transformasi hidup
                      </p>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium">Jawaban Doa</p>
                      <p className="text-muted-foreground">
                        Bagaimana Tuhan menjawab doa dengan cara yang luar biasa
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Process Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span>Proses Moderasi</span>
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Penyerahan</p>
                        <p className="text-muted-foreground">
                          Kesaksian Anda akan diterima sistem
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Peninjauan</p>
                        <p className="text-muted-foreground">
                          Tim akan meninjau konten dan keaslian
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Publikasi</p>
                        <p className="text-muted-foreground">
                          Kesaksian akan dipublikasikan di website
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-4 p-2 bg-yellow-50 rounded">
                      ⏱️ Proses moderasi biasanya memakan waktu 1-3 hari kerja
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Notice */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Kebijakan Privasi</h3>
                  
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      Email Anda hanya akan digunakan untuk keperluan moderasi 
                      dan tidak akan dipublikasikan bersama kesaksian.
                    </p>
                    
                    <p>
                      Kami berhak untuk mengedit kesaksian untuk keperluan tata bahasa 
                      dan kesesuaian tanpa mengubah substansi cerita.
                    </p>
                    
                    <p>
                      Kesaksian yang telah dipublikasikan menjadi milik Radio Gbika 
                      dan dapat digunakan untuk berbagai media publikasi.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Bottom Inspiration */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-semibold mb-2">Kuasa Kesaksian</h3>
            <p className="text-muted-foreground mb-4">
              &quot;Dan mereka mengalahkan dia oleh darah Anak Domba dan oleh perkataan kesaksian mereka, 
              dan mereka tidak mengasihi nyawa mereka sampai ke dalam maut.&quot; - Wahyu 12:11
            </p>
            <p className="text-sm text-muted-foreground">
              Setiap kesaksian adalah senjata rohani yang dapat mengalahkan kegelapan dan 
              membawa terang bagi orang lain. Bagikan kisah Anda dan saksikan bagaimana 
              Tuhan menggunakannya untuk kemuliaan-Nya.
            </p>
          </div>
        </div>

        {/* Additional Encouragement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 mx-auto mb-3 text-red-500" />
              <h4 className="font-semibold mb-2">Menguatkan yang Lemah</h4>
              <p className="text-sm text-muted-foreground">
                Kesaksian Anda dapat memberikan harapan bagi mereka yang sedang 
                menghadapi pergumulan serupa.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 mx-auto mb-3 text-yellow-500" />
              <h4 className="font-semibold mb-2">Memuliakan Tuhan</h4>
              <p className="text-sm text-muted-foreground">
                Setiap kesaksian adalah pujian dan kemuliaan bagi Tuhan yang 
                telah berbuat baik dalam hidup kita.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  )
}