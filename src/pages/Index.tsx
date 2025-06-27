
import Navigation from "@/components/landing/Navigation";
import HeroSection from "@/components/landing/HeroSection";
import GoogleCalendarSection from "@/components/landing/GoogleCalendarSection";
import PaymentFeaturesSection from "@/components/landing/PaymentFeaturesSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CompleteSoftwareSection from "@/components/landing/CompleteSoftwareSection";
import PricingSection from "@/components/landing/PricingSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      <Navigation />
      <HeroSection />
      <GoogleCalendarSection />
      <PaymentFeaturesSection />
      <FeaturesSection />
      <CompleteSoftwareSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
