import React from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import ProductsSection from '@/components/sections/ProductsSection';
import BranchesSection from '@/components/sections/BranchesSection';
import CTASection from '@/components/sections/CTASection';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <ProductsSection />
        <BranchesSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
}