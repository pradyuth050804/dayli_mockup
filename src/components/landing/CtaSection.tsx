import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function CtaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Mock waitlist signup
    setTimeout(() => setSubmitted(true), 500);
  };

  return (
    <section ref={ref} className="py-32 bg-dayli-cream">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 bg-dayli-red-light border border-red-200 text-dayli-red text-sm font-semibold rounded-full mb-8 tracking-wide uppercase">
            Begin Today
          </span>
          <h2 className="text-5xl lg:text-7xl font-black text-stone-900 tracking-tight mb-6">
            Good Days<br />
            <span className="text-dayli-red">
              Start With DAYLI
            </span>
          </h2>
          <p className="text-xl text-stone-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands who have upgraded from generic supplements to science-driven precision nutrition. Start your DAYLI journey today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/products"
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-dayli-red hover:bg-dayli-red-dark text-white font-bold rounded-full text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-red-500/20 uppercase tracking-wide"
            >
              Start My DAYLI
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/science"
              className="flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-semibold rounded-full text-lg transition-all shadow-sm"
            >
              Explore The Science
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-stone-500 mb-16">
            {['No commitment required', 'Cancel anytime', 'Free shipping over $75', '30-day satisfaction guarantee'].map(item => (
              <div key={item} className="flex items-center gap-2">
                <Check size={14} className="text-dayli-red" />
                {item}
              </div>
            ))}
          </div>

          {!submitted ? (
            <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
              <p className="font-semibold text-stone-800 mb-4">Get precision nutrition insights in your inbox</p>
              <form onSubmit={handleWaitlist} className="flex gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-5 py-3 bg-stone-50 border border-stone-200 rounded-full text-stone-800 focus:outline-none focus:border-dayli-red transition-colors placeholder:text-stone-400"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-dayli-red hover:bg-dayli-red-dark text-white font-semibold rounded-full transition-colors"
                >
                  Join
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-dayli-red-light border border-red-200 rounded-3xl p-8 flex items-center justify-center gap-3 text-dayli-red">
              <Check size={20} className="text-dayli-red" />
              <span className="font-semibold">You're on the list. Welcome to DAYLI — I Own My Bio!</span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
