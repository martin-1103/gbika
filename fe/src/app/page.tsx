import { HeroLayout } from "@/components/layout";
import { HeroSection } from "@/components/homepage/hero-section";
import { 
  TodaySchedule,
  LatestArticles,
  LatestTestimonials,
  LiveChatWidget,
  CallToAction
} from "@/components/homepage";

// Homepage: Modern clean dashboard-style layout with card-based components
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

       {/* Full Width - Testimonials */}
        <LatestTestimonials />


      {/* Modern Dashboard Layout */}
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        
        {/* Main Dashboard Grid */}
        <section className="py-12 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            
           

            {/* Primary Grid - Dashboard Style */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              
              {/* Left Column - Schedule & Stats */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Today's Schedule - Main Widget */}
                <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-300">
                  <TodaySchedule />
                </div>
                
              </div>

              {/* Right Sidebar - Live Chat */}
              <div className="lg:col-span-4">
                <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-300 sticky top-6">
                  <LiveChatWidget />
                </div>
              </div>
            </div>

          </div>
        </section>
        
       
        
        {/* Full Width - Latest Articles */}
        <LatestArticles />

        {/* Call to Action */}
        <CallToAction />
      </div>
    </HeroLayout>
  );
}
