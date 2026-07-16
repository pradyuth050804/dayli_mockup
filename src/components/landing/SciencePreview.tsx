import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Globe, Rocket, Target } from 'lucide-react';

const cards = [
    {
        icon: Globe,
        title: 'Global Recognition',
        description: 'UN, WEF, EAT EU, Unreasonable Food US, CleanTech Group US, BMW Foundation Germany, Falling Walls Germany, Corfo Chile, & Puerto Rico Science & Tech Trust',
    },
    {
        icon: Rocket,
        title: 'AI-speed Biomanufacturing',
        description: 'From lab to production in record time',
    },
    {
        icon: Target,
        title: 'Precision Engineering',
        description: 'Better bioavailability',
    },
];

export default function SciencePreview() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section ref={ref} className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-5 relative"
                    >
                        <div className="absolute inset-0 bg-dayli-red/10 blur-[100px] rounded-full" />
                        <img
                            src="/images/lego-biology.png"
                            alt="DE3PBIO Precision Engineering"
                            className="w-full max-w-sm mx-auto lg:max-w-none rounded-[2rem] shadow-2xl relative z-10 border border-stone-200"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:col-span-7"
                    >
                        <h2 className="text-4xl lg:text-5xl font-black text-stone-900 tracking-tight mb-8">
                            Powered by <span className="text-[#E63329]">DE3PBIO</span>
                        </h2>
                        <p className="text-lg text-stone-500 leading-relaxed mb-8 max-w-2xl">
                            DE3PBIO is an AI-speed biomanufacturing company pioneering
                            programmable nutrient engineering. Their breakthrough technology
                            enables the creation of precision-engineered ingredients that can be
                            tailored to individual biological needs, like playing with Lego - the
                            foundation that makes DAYLI possible.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {cards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={card.title}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                                className="flex flex-col p-8 bg-white border border-stone-200/60 rounded-xl hover:border-dayli-red-light hover:shadow-lg transition-all group shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]"
                            >
                                <div className="w-14 h-14 bg-dayli-red-light rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Icon size={24} className="text-dayli-red" />
                                </div>
                                <h3 className="text-stone-900 font-bold mb-3">{card.title}</h3>
                                <p className="text-sm text-stone-500 leading-relaxed pr-2 group-hover:text-stone-600 transition-colors">
                                    {card.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
