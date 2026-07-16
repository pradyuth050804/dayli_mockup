import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Atom, Beaker, FlaskConical, CheckCircle2, Eye, Heart, TrendingUp } from 'lucide-react';

export default function WhatIsDayli() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-20 bg-white border-t border-stone-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          
          {/* What is DAYLI? */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Atom size={20} className="text-dayli-red" />
              <h3 className="text-xl font-black text-stone-900">What is DAYLI?</h3>
            </div>
            <div className="space-y-4 text-sm text-stone-600 leading-relaxed">
              <p>
                DAYLI produces its own nutrients via proprietary AI-Biomanufacturing Tech.
              </p>
              <p>
                These are <strong className="text-stone-800">Precision Nutrients™</strong> — modular building blocks of nutrition (think, Lego) engineered for maximum customization, superior biology, cost-effectiveness and sustainability.
              </p>
              <div className="pt-2">
                <p className="font-bold text-stone-900 text-base">Same Habits.</p>
                <p className="font-bold text-stone-900 text-base">Same Price.</p>
                <p className="font-bold text-dayli-red text-base">Superior Biology.</p>
              </div>
            </div>
          </motion.div>

          {/* How to Use */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Beaker size={20} className="text-dayli-red" />
              <h3 className="text-xl font-black text-stone-900">How To Use</h3>
            </div>
            <div className="space-y-5">
              {[
                { step: '1', icon: FlaskConical, text: 'Mix 1 scoop with 300ml cold water (or any beverage of your choice).' },
                { step: '2', icon: FlaskConical, text: 'Shake.' },
                { step: '3', icon: FlaskConical, text: 'Drink daily.' },
              ].map(({ step, text }) => (
                <div key={step} className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-stone-700">{step}</span>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed">{text}</p>
                </div>
              ))}
              <div className="mt-4 p-4 bg-dayli-red-light rounded-2xl flex items-start gap-3">
                <CheckCircle2 size={18} className="text-dayli-red flex-shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-dayli-red">
                  Consistent Habits = Extraordinary Results.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Why DAYLI? */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <CheckCircle2 size={20} className="text-dayli-red" />
              <h3 className="text-xl font-black text-stone-900">Why DAYLI?</h3>
            </div>
            <div className="space-y-3">
              {[
                'Nutrition is broken.',
                'Most food is ultra-processed.',
                'Our soil, water & air are depleted.',
                'Supplements are generic and overpriced.',
                'DAYLI changes that.',
              ].map((reason, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className={`flex-shrink-0 mt-0.5 ${i === 4 ? 'text-dayli-red' : 'text-dayli-red/60'}`} />
                  <span className={`text-sm ${i === 4 ? 'font-bold text-dayli-red' : 'text-stone-600'}`}>
                    {reason}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 pt-8 border-t border-stone-100"
        >
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
            {[
              { icon: Eye, label: 'Look better.' },
              { icon: Heart, label: 'Feel better.' },
              { icon: TrendingUp, label: 'Perform better.' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-stone-500">
                <Icon size={18} className="text-stone-400" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-stone-400 mt-4">
            ** Not a cure or medicine. Preventive Care.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
