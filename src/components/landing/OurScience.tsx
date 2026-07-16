import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, FlaskConical, Microscope, Award } from 'lucide-react';

const scientists = [
    {
        name: 'DE3PBIO Research',
        role: 'Biomanufacturing Lab',
        initials: 'D3',
        position: 'top-6 left-1/2 -translate-x-1/2' as const,
    },
    {
        name: 'Precision Nutrition',
        role: 'Nutrient Engineering',
        initials: 'PN',
        position: 'bottom-16 left-4' as const,
    },
    {
        name: 'Clinical Research',
        role: 'Biomarker Science',
        initials: 'CR',
        position: 'bottom-24 right-4' as const,
    },
];

export default function OurScience() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section ref={ref} className="py-24 bg-dayli-cream overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Column: Image with floating cards */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
                            <img
                                src="/images/lego-biology.png"
                                alt="DE3PBIO Precision Nutrition Science"
                                className="w-full h-[420px] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 via-transparent to-transparent" />
                        </div>

                        {/* Floating scientist cards */}
                        {scientists.map((scientist, i) => (
                            <motion.div
                                key={scientist.name}
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.4 + i * 0.15 }}
                                className={`absolute ${scientist.position} z-10`}
                            >
                                <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-lg border border-stone-100 backdrop-blur-sm">
                                    <div className="w-10 h-10 rounded-full bg-dayli-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        {scientist.initials}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-stone-900 text-sm leading-tight">{scientist.name}</div>
                                        <div className="text-xs text-stone-400">{scientist.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Right Column: Text content */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div>
                            <span className="inline-block px-4 py-2 bg-dayli-red-light border border-red-200 text-dayli-red text-sm font-medium rounded-full mb-6">
                                Our Science
                            </span>
                            <h2 className="text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-[1.1] mb-6">
                                Science is our superpower. Now it's{' '}
                                <span className="text-dayli-red italic">yours.</span>
                            </h2>
                            <p className="text-lg text-stone-500 leading-relaxed max-w-lg">
                                Our scientists pioneer <strong className="text-stone-700">precision nutrient engineering</strong> — using AI-speed biomanufacturing to create supplements tailored to your unique biology, transforming how millions approach nutrition.
                            </p>
                        </div>

                        {/* Key stats */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { icon: FlaskConical, value: '5', label: 'Bio Layers' },
                                { icon: Microscope, value: '47+', label: 'Health Vectors' },
                                { icon: Award, value: '10+', label: 'Global Awards' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                                    className="text-center p-4 bg-white rounded-2xl border border-stone-100 shadow-sm"
                                >
                                    <stat.icon size={20} className="text-dayli-red mx-auto mb-2" />
                                    <div className="text-xl font-black text-stone-900">{stat.value}</div>
                                    <div className="text-xs text-stone-400 mt-0.5">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>

                        <Link
                            to="/science"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-stone-50 text-stone-800 font-semibold rounded-full border border-stone-200 transition-all hover:scale-105 active:scale-95 shadow-sm group"
                        >
                            Explore our science
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
