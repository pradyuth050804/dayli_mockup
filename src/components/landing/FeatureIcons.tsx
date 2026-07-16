import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, Shield, HeartPulse, Scale, TrendingUp, Sparkles } from 'lucide-react';

const features = [
  { icon: Zap, label: 'ENERGIZE', color: 'bg-dayli-yellow text-amber-800' },
  { icon: Shield, label: 'ANTI-STRESS', color: 'bg-dayli-red text-white' },
  { icon: HeartPulse, label: 'RECOVER', color: 'bg-dayli-orange text-white' },
  { icon: Scale, label: 'BALANCE', color: 'bg-dayli-blue text-white' },
  { icon: TrendingUp, label: 'PERFORM', color: 'bg-green-500 text-white' },
  { icon: Sparkles, label: 'THRIVE', color: 'bg-dayli-purple text-white' },
];

export default function FeatureIcons() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="py-12 bg-white border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="flex flex-col items-center gap-3 group cursor-default"
              >
                <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl ${feature.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} />
                </div>
                <span className="text-xs font-bold text-stone-700 tracking-wider uppercase">
                  {feature.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
