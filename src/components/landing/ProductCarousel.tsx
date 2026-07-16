import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const SLIDES = [
    { id: 'champs', src: '/images/carousel/slide1_champs.jpg', alt: 'DAYLI Kids' },
    { id: 'teen', src: '/images/carousel/slide2_teen.png', alt: 'DAYLI Girls' },
    { id: 'mom', src: '/images/carousel/slide3_mom.png', alt: 'DAYLI Women' },
    { id: 'glp', src: '/images/carousel/slide4_glp.png', alt: 'DAYLI Gym Freaks' },
    { id: 'all', src: '/images/carousel/slide5_all.jpg', alt: 'All DAYLI Products' },
];

export default function ProductCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
        }, 4000); // 4 seconds per slide
        return () => clearInterval(timer);
    }, []);

    const scrollToProducts = () => {
        const productsSection = document.getElementById('products-preview');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative w-full h-[80vh] min-h-[600px] max-h-[900px] overflow-hidden bg-stone-900 mt-20">
            <AnimatePresence mode="popLayout">
                <motion.img
                    key={SLIDES[currentIndex].id}
                    src={SLIDES[currentIndex].src}
                    alt={SLIDES[currentIndex].alt}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute inset-0 w-full h-full object-contain"
                />
            </AnimatePresence>

            {/* Top gradient for navbar readability */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-stone-900/50 to-transparent pointer-events-none z-[1]" />
            {/* Bottom gradient for arrow visibility */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-stone-900/60 to-transparent pointer-events-none" />

            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                {SLIDES.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`transition-all duration-300 rounded-full ${idx === currentIndex ? 'w-8 h-2 bg-dayli-red' : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>

            {/* Down Arrow Overlay */}
            <div className="absolute inset-x-0 bottom-16 flex flex-col items-center z-10 pointer-events-none">
                <button
                    onClick={scrollToProducts}
                    className="flex flex-col items-center gap-2 pointer-events-auto text-white hover:text-dayli-red transition-colors group"
                >
                    <span className="text-sm font-semibold tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                        Explore Products
                    </span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-12 h-12 rounded-full border border-white/30 bg-black/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-black/40 group-hover:border-dayli-red group-hover:scale-110 transition-all"
                    >
                        <ChevronDown size={24} />
                    </motion.div>
                </button>
            </div>
        </section>
    );
}
