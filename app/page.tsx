"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { FreeServiceSection } from "@/components/home/free-service-section"
import { ServicesOverview } from "@/components/home/services-overview"
import TestimonialsSection from "@/components/home/testimonials-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FreeServiceSection />
        <ServicesOverview />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  )
}
