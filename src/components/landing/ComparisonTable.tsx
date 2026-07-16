import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, X, AlertTriangle } from 'lucide-react';

type CellStatus = 'yes' | 'no' | 'partial' | 'text';

interface ComparisonRow {
    feature: string;
    dayli: { status: CellStatus; text: string };
    ag1: { status: CellStatus; text: string };
    im8: { status: CellStatus; text: string };
    huel: { status: CellStatus; text: string };
}

const comparisonData: ComparisonRow[] = [
    {
        feature: 'Demographic Specific',
        dayli: { status: 'yes', text: 'Yes (Kids, Girls, Women, Men, Gym Freaks, Seniors)' },
        ag1: { status: 'no', text: 'No (One blend for all)' },
        im8: { status: 'no', text: 'No' },
        huel: { status: 'no', text: 'No' },
    },
    {
        feature: 'Nano Tech',
        dayli: { status: 'yes', text: 'Yes (Nano Iron, Zinc, Vitamins)' },
        ag1: { status: 'no', text: 'No' },
        im8: { status: 'no', text: 'No' },
        huel: { status: 'no', text: 'No' },
    },
    {
        feature: 'Precursors (not finished compounds)',
        dayli: { status: 'yes', text: 'Yes (Collagen building blocks, amino structuring)' },
        ag1: { status: 'no', text: 'No' },
        im8: { status: 'no', text: 'No' },
        huel: { status: 'no', text: 'No' },
    },
    {
        feature: 'Bioavailability Engineered',
        dayli: { status: 'yes', text: 'Yes (Nano delivery + gut co-factors)' },
        ag1: { status: 'partial', text: 'General forms' },
        im8: { status: 'partial', text: 'General forms' },
        huel: { status: 'partial', text: 'Standard fortification' },
    },
    {
        feature: 'Postbiotics / Metabolite Strategy',
        dayli: { status: 'yes', text: 'Yes (Gut-first architecture)' },
        ag1: { status: 'no', text: 'Probiotics only' },
        im8: { status: 'no', text: 'Probiotics only' },
        huel: { status: 'no', text: 'No meaningful gut stack' },
    },
    {
        feature: 'Building Blocks / Precision Nutrition',
        dayli: { status: 'yes', text: 'Yes (Layered stack architecture)' },
        ag1: { status: 'no', text: 'Broad 75-ingredient mix' },
        im8: { status: 'no', text: 'Broad blend' },
        huel: { status: 'no', text: 'Meal replacement' },
    },
    {
        feature: 'Scientific Studies',
        dayli: { status: 'yes', text: 'Structured validation protocols' },
        ag1: { status: 'partial', text: 'Ingredient-backed' },
        im8: { status: 'partial', text: 'Ingredient-backed' },
        huel: { status: 'no', text: 'No structured validation' },
    },
    {
        feature: 'In Vitro / Consumer Studies',
        dayli: { status: 'yes', text: 'Yes (Internal pilot + field validation)' },
        ag1: { status: 'no', text: 'Not disclosed' },
        im8: { status: 'no', text: 'Not disclosed' },
        huel: { status: 'no', text: 'No' },
    },
    {
        feature: 'Subscription Price (US)',
        dayli: { status: 'text', text: '$49' },
        ag1: { status: 'text', text: '~$79' },
        im8: { status: 'text', text: '~$79' },
        huel: { status: 'text', text: '~$65' },
    },
    {
        feature: 'Own Nutrients / IP Control',
        dayli: { status: 'yes', text: 'Yes (Formulation control + manufacturing strategy)' },
        ag1: { status: 'no', text: 'Blends sourced ingredients' },
        im8: { status: 'no', text: 'Blends sourced ingredients' },
        huel: { status: 'no', text: 'Commodity sourcing' },
    },
];

function StatusIcon({ status }: { status: CellStatus }) {
    if (status === 'yes')
        return (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 mr-1.5 flex-shrink-0">
                <Check size={12} className="text-dayli-red" />
            </span>
        );
    if (status === 'no')
        return (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-stone-100 mr-1.5 flex-shrink-0">
                <X size={12} className="text-stone-400" />
            </span>
        );
    if (status === 'partial')
        return (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 mr-1.5 flex-shrink-0">
                <AlertTriangle size={12} className="text-amber-500" />
            </span>
        );
    return null;
}

export default function ComparisonTable() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section ref={ref} className="py-24 bg-stone-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-2 bg-dayli-red-light border border-red-200 text-dayli-red text-sm font-medium rounded-full mb-6">
                        Side-by-Side
                    </span>
                    <h2 className="text-4xl lg:text-6xl font-black text-stone-900 tracking-tight mb-4">
                        DAYLI vs AG1 vs IM8 vs Huel
                    </h2>
                    <p className="text-lg text-stone-500 max-w-2xl mx-auto">
                        All-Purpose Mix — see how our precision-layered architecture compares to broad-spectrum blends.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-lg shadow-stone-200/50"
                >
                    <table className="w-full min-w-[800px] text-left">
                        <thead>
                            <tr className="border-b border-stone-200">
                                <th className="p-5 text-sm font-semibold text-stone-500 uppercase tracking-wider w-[22%]">
                                    Feature
                                </th>
                                <th className="p-5 text-sm font-bold text-dayli-red uppercase tracking-wider w-[22%]">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-dayli-red animate-pulse" />
                                        DAYLI
                                    </span>
                                </th>
                                <th className="p-5 text-sm font-semibold text-stone-500 uppercase tracking-wider w-[18%]">
                                    AG1
                                </th>
                                <th className="p-5 text-sm font-semibold text-stone-500 uppercase tracking-wider w-[18%]">
                                    IM8
                                </th>
                                <th className="p-5 text-sm font-semibold text-stone-500 uppercase tracking-wider w-[20%]">
                                    Huel Daily
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonData.map((row, i) => (
                                <tr
                                    key={row.feature}
                                    className={`border-b border-stone-100 transition-colors hover:bg-stone-50 ${i % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'
                                        }`}
                                >
                                    <td className="p-5 text-sm font-semibold text-stone-800">
                                        {row.feature}
                                    </td>
                                    {/* DAYLI column — highlighted */}
                                    <td className="p-5 text-sm text-dayli-red bg-red-50/50 border-l border-r border-red-100">
                                        <div className="flex items-start">
                                            <StatusIcon status={row.dayli.status} />
                                            <span>{row.dayli.text}</span>
                                        </div>
                                    </td>
                                    <td className="p-5 text-sm text-stone-600">
                                        <div className="flex items-start">
                                            <StatusIcon status={row.ag1.status} />
                                            <span>{row.ag1.text}</span>
                                        </div>
                                    </td>
                                    <td className="p-5 text-sm text-stone-600">
                                        <div className="flex items-start">
                                            <StatusIcon status={row.im8.status} />
                                            <span>{row.im8.text}</span>
                                        </div>
                                    </td>
                                    <td className="p-5 text-sm text-stone-600">
                                        <div className="flex items-start">
                                            <StatusIcon status={row.huel.status} />
                                            <span>{row.huel.text}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>

                {/* Bottom summary callout */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-10 text-center"
                >
                    <p className="text-stone-500 text-sm">
                        Data compiled from publicly available sources as of 2025. Pricing and formulations may vary by region.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
