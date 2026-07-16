import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Sun, Leaf, Atom } from 'lucide-react';

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative overflow-hidden bg-dayli-cream pt-24 lg:pt-28 pb-12 lg:pb-16">
      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left: Text Content */}
          <div className="order-2 lg:order-1">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05] text-stone-900 mb-8"
            >
              <span className="block">Precision</span>
              <span className="block">Nutrition<span className="text-dayli-red">™</span></span>
              <span className="block relative">
                Superblends
                <motion.span 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute -top-2 -right-2 lg:-right-4"
                >
                  <Sun size={20} className="text-dayli-yellow" />
                </motion.span>
              </span>
              <span className="block">Built For</span>
              <span className="block">Your Biology</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap items-center gap-4 mb-8"
            >
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <Leaf size={16} className="text-green-500" />
                <span className="font-medium">Vegan. Vegetarian.</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <Atom size={16} className="text-dayli-red" />
                <span className="font-medium">Powered by DE3PBIO (USA)</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Link
                to="/products"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-dayli-red hover:bg-dayli-red-dark text-white font-bold rounded-full text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-red-500/25 uppercase tracking-wide"
              >
                Start My DAYLI
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Right: Family Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-stone-200 min-h-[300px] lg:min-h-[480px]">
              <img
                src="/images/carousel/slide5_all.jpg"
                alt="DAYLI — Precision Nutrition for the whole family"
                className="w-full h-full object-cover"
              />
              {/* Decorative floating elements */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute top-4 right-4"
              >
                <span className="text-2xl">⭐</span>
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                className="absolute top-8 left-8"
              >
                <span className="text-xl">✨</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
