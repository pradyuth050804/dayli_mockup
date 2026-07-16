import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Dr. Priya Sharma',
    role: 'Functional Medicine Physician',
    quote: 'Finally a supplement brand that actually understands biological optimization. The precision-layered framework mirrors how we think about nutrition in functional medicine.',
    rating: 5,
    avatar: 'PS',
  },
  {
    name: 'Rahul Mehta',
    role: 'Founder, 42 years old',
    quote: 'After uploading my annual blood panel, the AI identified three deficiencies I had no idea about. My energy levels are dramatically better 8 weeks in.',
    rating: 5,
    avatar: 'RM',
  },
  {
    name: 'Ananya Krishnan',
    role: 'Performance Coach',
    quote: 'I recommend DAYLI to all my clients. The Gym Freaks blend is especially remarkable — my clients report significantly better recovery and performance.',
    rating: 5,
    avatar: 'AK',
  },
  {
    name: 'Sneha Patel',
    role: 'Working Mom, 32 years old',
    quote: 'DAYLI Women gave me peace of mind. The formulation is thorough and I love that it covers all 5 layers — something most supplements don\'t even attempt.',
    rating: 5,
    avatar: 'SP',
  },
];

const metrics = [
  { value: '94%', label: 'Report improved energy in 30 days' },
  { value: '89%', label: 'Notice better sleep quality' },
  { value: '10,000+', label: 'Active subscribers' },
  { value: '4.9★', label: 'Average product rating' },
];

export default function SocialProof() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-dayli-red-light border border-red-200 text-dayli-red text-sm font-medium rounded-full mb-6">
            Results
          </span>
          <h2 className="text-4xl lg:text-6xl font-black text-stone-900 tracking-tight mb-6">
            Real Biology.<br />
            <span className="text-dayli-red">
              Real Results.
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-8 bg-dayli-cream rounded-3xl"
            >
              <div className="text-4xl font-black text-dayli-red mb-2">{metric.value}</div>
              <div className="text-sm text-stone-500">{metric.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="p-8 bg-dayli-cream rounded-3xl hover:bg-red-50 transition-colors group"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <Quote size={24} className="text-red-200 mb-4" />
              <p className="text-stone-700 leading-relaxed mb-6 italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-dayli-gradient flex items-center justify-center text-white text-sm font-bold">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-stone-900 text-sm">{t.name}</div>
                  <div className="text-xs text-stone-400">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
