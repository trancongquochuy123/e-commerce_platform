"use client";

import HeroSection from "@/components/marketplace/hero-section";
import MarketplaceFlow from "@/components/marketplace/marketplace-flow";
import FeaturesSection from "@/components/marketplace/features-section";
import CategoriesSection from "@/components/marketplace/categories-section";
import StatsSection from "@/components/marketplace/stats-section";
import CTASection from "@/components/marketplace/cta-section";
// import Footer from '@/components/footer';

/**
 * Multi-Vendor Marketplace Landing Page
 *
 * This page showcases the platform's capabilities for both sellers and buyers.
 * Built with GSAP animations and ScrollTrigger for smooth, professional interactions.
 *
 * Sections:
 * 1. Hero - Main value proposition with animated background
 * 2. Marketplace Flow - Visual explanation of the ecosystem
 * 3. Features - Key platform capabilities with staggered reveals
 * 4. Categories - Product categories with hover animations
 * 5. Stats & Testimonials - Social proof with animated counters
 * 6. CTA - Final conversion push for sellers and buyers
 * 7. Footer - Trust signals and navigation
 */
export default function StoreSetupPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Animated entrance with floating shapes */}
      <HeroSection />

      {/* Marketplace Flow - Shows Seller → Platform → Buyer with animated lines */}
      <MarketplaceFlow />

      {/* Key Features - Cards with staggered scroll animations */}
      <FeaturesSection />

      {/* Categories - Grid with GSAP hover effects */}
      <CategoriesSection />

      {/* Stats & Social Proof - Animated counters and testimonials */}
      <StatsSection />

      {/* Call to Action - Final conversion section */}
      <CTASection />

      {/* Footer - Trust and navigation */}
      {/* <Footer /> */}
    </div>
  );
}
