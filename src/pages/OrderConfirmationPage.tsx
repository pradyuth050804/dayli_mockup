import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Package, Repeat, ArrowRight, Sparkles } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-b from-dayli-red-light to-white pt-24 flex items-center">
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-24 h-24 rounded-full bg-dayli-red flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-dayli-red/30"
        >
          <Check size={40} className="text-white" strokeWidth={3} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-5xl font-black text-stone-900 mb-4 tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-xl text-stone-500 mb-3">
            Your precision nutrition is on its way.
          </p>
          <p className="text-sm text-stone-400 mb-12">
            Order #{id?.slice(0, 8).toUpperCase()} · Confirmation sent to your email
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {[
              { icon: Package, title: 'Preparing', desc: 'Your blend is being prepared' },
              { icon: Repeat, title: 'Auto-Renew', desc: 'Subscription activated' },
              { icon: Sparkles, title: 'Start AI Profile', desc: 'Optimize your results' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 bg-white rounded-2xl border border-stone-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-dayli-red-light flex items-center justify-center mx-auto mb-3">
                  <Icon size={20} className="text-dayli-red-dark" />
                </div>
                <div className="font-semibold text-stone-900 text-sm mb-1">{title}</div>
                <div className="text-xs text-stone-400">{desc}</div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-dayli-red-dark to-dayli-red-dark rounded-3xl p-8 text-white mb-8">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles size={20} />
            </div>
            <h3 className="text-xl font-bold mb-2">Maximize Your Results with Companion AI</h3>
            <p className="text-white/80 text-sm mb-6">
              Upload your biomarker reports and get a personalized health plan to complement your new supplements.
            </p>
            <Link
              to="/companion-ai"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-dayli-red-dark font-semibold rounded-full hover:bg-dayli-red-light transition-colors"
            >
              Start Biology Profile
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/account"
              className="px-6 py-3 bg-stone-900 text-white font-semibold rounded-full hover:bg-stone-800 transition-colors"
            >
              View My Account
            </Link>
            <Link
              to="/products"
              className="px-6 py-3 bg-stone-100 text-stone-700 font-semibold rounded-full hover:bg-stone-200 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
