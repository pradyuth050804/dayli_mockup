
import HeroSection from '../components/landing/HeroSection';
import BiologyLayers from '../components/landing/BiologyLayers';
import SciencePreview from '../components/landing/SciencePreview';
import CtaSection from '../components/landing/CtaSection';

export default function SciencePage() {
    return (
        <main className="pt-20">
            <HeroSection />
            <BiologyLayers />
            <SciencePreview />
            <CtaSection />
        </main>
    );
}
