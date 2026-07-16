import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Layers, Zap, Dna, Activity, Sparkles } from 'lucide-react';

const layers = [
  {
    id: 'L1',
    name: 'Macros',
    icon: Layers,
    description: 'Precision-calibrated proteins, fats, and carbohydrates matched to your metabolic phenotype and activity demands.',
    molecules: ['Whey Isolate', 'MCT Oil', 'Complex Carbs', 'Fiber Matrix'],
  },
  {
    id: 'L2',
    name: 'Micros',
    icon: Zap,
    description: 'Bioavailable vitamins and minerals dosed at functional levels — not the bare minimums of mass-market supplements.',
    molecules: ['Vitamin D3/K2', 'Magnesium Glycinate', 'Zinc Bisglycinate', 'B-Complex'],
  },
  {
    id: 'L3',
    name: 'Amino Acids & Peptides',
    icon: Dna,
    description: 'Essential and conditionally essential amino acids plus bioactive peptides for cellular repair and growth signaling.',
    molecules: ['EAA Profile', 'Collagen Peptides', 'Glutamine', 'Creatine'],
  },
  {
    id: 'L4',
    name: 'Biotics & Metabolites',
    icon: Activity,
    description: 'Targeted probiotic strains, prebiotics, and metabolites for gut-brain axis optimization and metabolic health.',
    molecules: ['Multi-strain Probiotics', 'Inulin & FOS', 'Butyrate', 'Postbiotics'],
  },
  {
    id: 'L5',
    name: 'Growth Factors',
    icon: Sparkles,
    description: 'Cutting-edge bioactives that modulate cellular growth pathways, longevity signals, and regenerative capacity.',
    molecules: ['NAD+ Precursors', 'CoQ10', 'Adaptogens', 'Polyphenols'],
  },
];

export default function BiologyLayers() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [activeLayer, setActiveLayer] = useState(0);

  const active = layers[activeLayer];

  return (
    <section ref={ref} className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-[#FEE2E2] text-[#E63329] text-xs font-bold rounded-full mb-6 tracking-wide uppercase">
            The Biology Interface
          </span>
          <h2 className="text-4xl lg:text-[3.5rem] leading-[1.1] font-black text-stone-900 tracking-tight mb-4">
            Five Mandatory<br />
            <span className="text-[#E63329]">
              Biological Layers
            </span>
          </h2>
          <p className="text-lg text-stone-500 max-w-2xl mx-auto leading-relaxed">
            While conventional supplements operate at a single layer, DAYLI optimizes<br />across all five for exponentially better outcomes.
          </p>
        </motion.div>

        {/* Desktop: Tab interface */}
        <div className="hidden lg:block">
          <div className="flex gap-3 mb-6 relative z-10 w-full justify-between">
            {layers.map((layer, index) => {
              const Icon = layer.icon;
              const isActive = activeLayer === index;
              return (
                <motion.button
                  key={layer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  onClick={() => setActiveLayer(index)}
                  className={`relative flex flex-col items-center justify-center gap-2 flex-1 min-w-[140px] py-6 rounded-2xl border transition-all duration-300 text-center group ${isActive
                    ? `bg-[#E63329] border-[#E63329] shadow-xl text-white`
                    : 'bg-white border-stone-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:border-dayli-red-light hover:shadow-md'
                    }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all opacity-80 ${isActive ? 'bg-white/20' : 'bg-[#f8faf9] group-hover:bg-[#FEE2E2]'
                    }`}>
                    <Icon size={20} className={isActive ? 'text-white' : 'text-stone-400 group-hover:text-dayli-red'} />
                  </div>
                  <div>
                    <div className={`text-xs font-bold mb-0.5 ${isActive ? 'text-white/80' : 'text-stone-400'}`}>{layer.id}</div>
                    <div className={`text-sm font-bold leading-tight ${isActive ? 'text-white' : 'text-stone-700'}`}>{layer.name}</div>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicatorBody"
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rotate-45 bg-[#E63329] rounded-sm -z-10"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          <motion.div
            key={activeLayer}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-[2rem] border border-stone-100/50 shadow-xl overflow-hidden mt-6 bg-white"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[45%_55%]">
              <div className="bg-[#E63329] p-10 lg:p-14 flex flex-col justify-between min-h-72">
                <div>
                  <div className="flex items-start flex-col gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-2 inline-flex">
                      <Layers size={32} className="text-white opacity-90" />
                    </div>
                    <div>
                      <span className="text-white/80 text-sm font-bold">{active.id}</span>
                      <h3 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">{active.name}</h3>
                    </div>
                  </div>
                  <p className="text-white/90 text-[17px] leading-relaxed pr-8">{active.description}</p>
                </div>
              </div>

              <div className="bg-[#FEE2E2] p-10 lg:p-14 flex flex-col justify-start">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#E63329] mb-6">
                    Key Ingredients
                  </h4>
                  <div className="space-y-3">
                    {active.molecules.map((mol, i) => (
                      <motion.div
                        key={mol}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="flex items-center gap-3 px-5 py-4 bg-white rounded-xl shadow-sm font-bold text-stone-800"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E63329] flex-shrink-0" />
                        {mol}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile: Stacked cards */}
        <div className="lg:hidden space-y-4">
          {layers.map((layer, index) => {
            const Icon = layer.icon;
            return (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="rounded-2xl border border-stone-100 shadow-md overflow-hidden"
              >
                <div className="bg-[#E63329] p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <Icon size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="text-white/70 text-xs font-bold">{layer.id}</div>
                      <h3 className="text-xl font-bold text-white">{layer.name}</h3>
                    </div>
                  </div>
                  <p className="text-white/85 text-sm leading-relaxed">{layer.description}</p>
                </div>
                <div className="bg-[#FEE2E2] p-5">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#E63329] mb-3">Key Ingredients</h4>
                  <div className="flex flex-wrap gap-2">
                    {layer.molecules.map(mol => (
                      <span key={mol} className="px-3 py-1.5 bg-white rounded-full text-xs font-semibold text-stone-700 shadow-sm">
                        {mol}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { value: '5', label: 'Biological Layers', sub: 'vs. 1 in most brands' },
            { value: '47+', label: 'Active Compounds', sub: 'per precision blend' },
            { value: '3x', label: 'Better Bioavailability', sub: 'clinically measured' },
            { value: '100%', label: 'Science-Backed', sub: 'peer-reviewed formulas' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
              className="p-6 bg-white border border-stone-200 rounded-2xl text-center shadow-sm"
            >
              <div className="text-3xl font-black text-stone-900 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-stone-700">{stat.label}</div>
              <div className="text-xs text-stone-400 mt-1">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
