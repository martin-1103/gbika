import { Metadata } from "next"
import { PublicLayout } from "@/components/layout/public-layout"
import { AudioPlayer, LiveChat } from "@/components/live"

export const metadata: Metadata = {
  title: "Dengarkan Live - Radio El-Shaddai FM",
  description: "Dengarkan siaran radio Gbika secara langsung dan berinteraksi melalui chat live dengan penyiar dan pendengar lainnya.",
  keywords: ["radio gbika", "live streaming", "chat live", "siaran langsung", "radio kristen"]
}

// LivePage: Main page for live radio streaming and chat interaction
export default function LivePage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Dengarkan Live & Kirim Pesan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nikmati siaran radio Gbika secara langsung dan berinteraksi dengan penyiar 
            serta pendengar lainnya melalui chat live.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Audio Player */}
          <div className="lg:col-span-1">
            <AudioPlayer className="sticky top-8" />
          </div>

          {/* Live Chat */}
          <div className="lg:col-span-1">
            <LiveChat />
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-muted/50 rounded-lg p-6 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold mb-3">
              Panduan Mendengarkan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>
                <strong className="block text-foreground mb-1">🎧 Audio Berkualitas</strong>
                Streaming 128 kbps untuk kualitas suara terbaik
              </div>
              <div>
                <strong className="block text-foreground mb-1">💬 Chat Interaktif</strong>
                Kirim pesan dan berinteraksi dengan penyiar
              </div>
              <div>
                <strong className="block text-foreground mb-1">📱 Multi Platform</strong>
                Dapat diakses di desktop, tablet, dan mobile
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}