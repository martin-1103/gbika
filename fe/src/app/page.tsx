import { PublicLayout } from "@/components/layout";
import { 
  LiveStatusBar,
  TodaySchedule,
  LatestArticles,
  LatestTestimonials,
  LiveChatWidget,
  CallToAction
} from "@/components/homepage";

// Homepage: Main gateway for visitors with live status, schedule, articles, testimonials, and chat
export default function Home() {
  return (
    <PublicLayout>
      {/* Hero Section with Live Status */}
      <section className="relative py-8 px-4">
        <div className="container mx-auto">
          <LiveStatusBar />
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Schedule & Articles */}
            <div className="lg:col-span-2 space-y-8">
              <TodaySchedule />
              <LatestArticles />
            </div>
            
            {/* Right Column - Testimonials & Chat */}
            <div className="space-y-8">
              <LatestTestimonials />
              <LiveChatWidget />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <CallToAction />
    </PublicLayout>
  );
}
