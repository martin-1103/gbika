import { HeroLayout } from "@/components/layout";
import { HeroSection } from "@/components/homepage/hero-section";
import { 
  TodaySchedule,
  LatestArticles,
  LatestTestimonials,
  LiveChatWidget,
  CallToAction
} from "@/components/homepage";

// Homepage: Main gateway for visitors with live status, schedule, articles, testimonials, and chat
export default function Home() {
  return (
    <HeroLayout
      heroContent={
        <HeroSection 
          title="El-Shaddai FM"
          subtitle="Kasih Karunia dalam Injil"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo."
          backgroundImage="/bg.webp"
          showPlayer={false}
        />
      }
    >

      {/* Main Content Grid */}
      <section className="py-16 px-4 relative">
        {/* Feature gradient background */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{ background: 'var(--feature-gradient)' }}
        />
        
        <div className="container mx-auto relative">
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
    </HeroLayout>
  );
}
