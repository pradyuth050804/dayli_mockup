import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Brain, Upload, BarChart3, Sparkles, ArrowRight, Sun } from 'lucide-react';

export default function CompanionAIPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const navigate = useNavigate();

  return (
    <section ref={ref} className="py-24 bg-dayli-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left Column: Explanation */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-dayli-red-light border border-red-200 rounded-full text-dayli-red text-sm font-medium mb-6">
                <Sparkles size={16} className="text-dayli-red" />
                Precision Nutrition Intelligence
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-stone-900 leading-[1.1] mb-6 tracking-tight">
                Decode your biomarkers for<br />
                <span className="text-dayli-red">
                  ultimate optimization.
                </span>
              </h1>
              <p className="text-lg text-stone-500 leading-relaxed max-w-xl">
                Your body's data holds the key to optimal health. By understanding your unique biomarkers, we can build a hyper-personalized health plan that actually works.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-dayli-red-light border border-red-200 flex items-center justify-center flex-shrink-0">
                  <Upload size={24} className="text-dayli-red" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">Upload Your Blood Work</h3>
                  <p className="text-stone-500 leading-relaxed max-w-md text-sm">
                    Securely upload your recent lab results, hormone panels, or metabolic reports. Our AI extracts and structures your data instantly.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-dayli-red-light border border-red-200 flex items-center justify-center flex-shrink-0">
                  <Brain size={24} className="text-dayli-red" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">Advanced AI Analysis</h3>
                  <p className="text-stone-500 leading-relaxed max-w-md text-sm">
                    The AI Companion processes 47+ health vectors, crossing your biomarkers against a massive database of clinical nutrition research.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-dayli-red-light border border-red-200 flex items-center justify-center flex-shrink-0">
                  <BarChart3 size={24} className="text-dayli-red" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">Identify Nutrient Gaps</h3>
                  <p className="text-stone-500 leading-relaxed max-w-md text-sm">
                    We identify exactly where your body needs support — from micro-deficiencies to systemic inflammation — and prescribe targeted blends.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md mx-auto lg:ml-auto"
          >
            <div className="bg-white rounded-[2.5rem] p-10 sm:p-12 text-center border border-stone-200 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-dayli-red flex items-center justify-center mx-auto mb-8 shadow-lg shadow-red-500/20">
                <Sun size={32} strokeWidth={2.5} className="text-white" />
              </div>

              <h2 className="text-[2rem] leading-tight font-black text-stone-900 mb-5 tracking-tight">
                Your AI<br />
                <span className="text-dayli-red">
                  Companion
                </span>
              </h2>

              <p className="text-stone-500 mb-10 leading-relaxed text-[15px]">
                Get a precision health plan built on your actual biology. Upload your biomarkers, complete a quick survey, and receive science-backed supplement recommendations.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/auth"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-dayli-red hover:bg-dayli-red-dark text-white font-semibold rounded-full text-sm transition-all shadow-md"
                >
                  Create Free Account <ArrowRight size={18} />
                </Link>
                <button
                  onClick={() => navigate('/companion-ai', { state: { step: 1 } })}
                  className="flex-1 px-6 py-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-full text-sm border border-stone-200 transition-all"
                >
                  Continue as Guest
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
