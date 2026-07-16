
import HeroSection from '../components/landing/HeroSection';
import FeatureIcons from '../components/landing/FeatureIcons';
import ProductsPreview from '../components/landing/ProductsPreview';
import WhatIsDayli from '../components/landing/WhatIsDayli';
import CompanionAIPreview from '../components/landing/CompanionAIPreview';
import OurScience from '../components/landing/OurScience';
import ComparisonTable from '../components/landing/ComparisonTable';
import SocialProof from '../components/landing/SocialProof';
import CtaSection from '../components/landing/CtaSection';

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <FeatureIcons />
      <ProductsPreview />
      <WhatIsDayli />
      <CompanionAIPreview />
      <OurScience />
      <ComparisonTable />
      <SocialProof />
      <CtaSection />
    </main>
  );
}
