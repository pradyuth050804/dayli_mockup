import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, FileText, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getReport, Report, BloodMarker, BloodPanelStatus } from '../lib/api';
import { PanelCard, PanelSummaryDonut } from '../components/analysis/AnalysisComponents';

export default function AnalysisPage() {
    const { reportId } = useParams<{ reportId: string }>();
    const { session } = useAuth();
    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!reportId) return;

        // Check if report was passed via navigation state
        const storedReport = sessionStorage.getItem(`report_${reportId}`);
        if (storedReport) {
            try {
                setReport(JSON.parse(storedReport));
                setLoading(false);
                return;
            } catch {
                // Fall through to API fetch
            }
        }

        // Fetch from API
        if (session?.access_token) {
            getReport(session.access_token, reportId)
                .then((res) => {
                    if (res.data) {
                        setReport(res.data);
                    } else {
                        setError(res.message || 'Failed to load report');
                    }
                })
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false));
        } else {
            setError('Please sign in to view analysis results');
            setLoading(false);
        }
    }, [reportId, session]);

    if (loading) {
        return (
            <div className="min-h-screen bg-stone-50 pt-24 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 rounded-full border-4 border-dayli-red-light border-t-dayli-red animate-spin" />
                    </div>
                    <p className="text-stone-500">Loading analysis...</p>
                </div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="min-h-screen bg-stone-50 pt-24 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <p className="text-red-600 font-semibold mb-4">{error || 'Report not found'}</p>
                    <Link to="/companion-ai" className="text-dayli-red-dark hover:text-dayli-red-dark font-medium">
                        ← Back to Companion AI
                    </Link>
                </div>
            </div>
        );
    }

    // Parse blood panel data
    const panelEntries = Object.entries(report.bloodPanelListMap || {});
    const panels: { name: string; status: BloodPanelStatus; healthScore: string; markers: BloodMarker[] }[] = [];

    for (const [panelKey, markers] of panelEntries) {
        // panelKey is a JSON string like {"name":"Heart Health","healthScore":"3/5","status":"POOR"}
        try {
            const panelInfo = typeof panelKey === 'string' ? JSON.parse(panelKey) : panelKey;
            panels.push({
                name: panelInfo.name || 'Unknown Panel',
                status: (panelInfo.status as BloodPanelStatus) || 'GOOD',
                healthScore: panelInfo.healthScore || 'N/A',
                markers: markers as BloodMarker[],
            });
        } catch {
            panels.push({
                name: panelKey,
                status: 'GOOD',
                healthScore: 'N/A',
                markers: markers as BloodMarker[],
            });
        }
    }

    const totalParameters = panels.reduce((sum, p) => sum + p.markers.length, 0);

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('en-IN', {
                year: 'numeric', month: 'long', day: 'numeric',
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-16">
            <div className="max-w-5xl mx-auto px-6">
                {/* Back nav */}
                <Link to="/companion-ai" className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-600 mb-6 text-sm">
                    <ArrowLeft size={16} /> Back to Companion AI
                </Link>

                {/* Title */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-3 mb-2">
                        <FileText size={24} className="text-dayli-red-dark" />
                        <h1 className="text-3xl font-black text-stone-900">Root Cause Analysis</h1>
                    </div>
                </motion.div>

                {/* Client Info Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 mt-6"
                >
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
                        {report.client?.name && (
                            <div>
                                <span className="text-stone-400 block">Client Name</span>
                                <span className="font-semibold text-stone-900">{report.client.name}</span>
                            </div>
                        )}
                        <div>
                            <span className="text-stone-400 block">Report Date</span>
                            <span className="font-semibold text-stone-900">{formatDate(report.reportDate)}</span>
                        </div>
                        {report.gender && (
                            <div>
                                <span className="text-stone-400 block">Gender</span>
                                <span className="font-semibold text-stone-900">{report.gender}</span>
                            </div>
                        )}
                        {report.ageOnReportDate && (
                            <div>
                                <span className="text-stone-400 block">Age</span>
                                <span className="font-semibold text-stone-900">{report.ageOnReportDate}</span>
                            </div>
                        )}
                        {report.height && (
                            <div>
                                <span className="text-stone-400 block">Height</span>
                                <span className="font-semibold text-stone-900">{report.height} cm</span>
                            </div>
                        )}
                        {report.weight && (
                            <div>
                                <span className="text-stone-400 block">Weight</span>
                                <span className="font-semibold text-stone-900">{report.weight} kg</span>
                            </div>
                        )}
                        {report.bmi && (
                            <div>
                                <span className="text-stone-400 block">BMI</span>
                                <span className="font-semibold text-stone-900">{report.bmi.toFixed(1)}</span>
                            </div>
                        )}
                        {report.diet && (
                            <div>
                                <span className="text-stone-400 block">Diet</span>
                                <span className="font-semibold text-stone-900">{report.diet}</span>
                            </div>
                        )}
                    </div>
                    {report.lifestyleHabits && report.lifestyleHabits.length > 0 && (
                        <div className="mt-4 text-sm">
                            <span className="text-stone-400">Lifestyle: </span>
                            <span className="text-stone-700">{report.lifestyleHabits.join(', ')}</span>
                        </div>
                    )}
                </motion.div>

                {/* Blood Panel Summary */}
                {panels.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 mt-6"
                    >
                        <h2 className="text-xl font-black text-stone-900 mb-6">Blood Panel Summary</h2>
                        <PanelSummaryDonut
                            panels={panels.map(p => ({ name: p.name, status: p.status }))}
                            totalParameters={totalParameters}
                        />
                    </motion.div>
                )}

                {/* Individual Panel Sections */}
                <div className="space-y-6 mt-6">
                    {panels.map((panel, idx) => (
                        <motion.div
                            key={panel.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + idx * 0.05 }}
                        >
                            <PanelCard
                                panelName={panel.name}
                                panelStatus={panel.status}
                                healthScore={panel.healthScore}
                                markers={panel.markers}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Clinical Notes */}
                {report.notes && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 mt-6"
                    >
                        <h2 className="text-xl font-black text-stone-900 mb-4">Additional Notes</h2>
                        <div className="prose prose-stone prose-sm max-w-none text-stone-600 leading-relaxed whitespace-pre-line">
                            {report.notes}
                        </div>
                    </motion.div>
                )}

                {/* Product Recommendations CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-r from-dayli-red-dark to-dayli-red-dark rounded-3xl p-8 text-white mt-6"
                >
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles size={20} />
                                <h3 className="text-lg font-bold">Personalized Supplement Recommendations</h3>
                            </div>
                            <p className="text-white/80 text-sm">
                                Based on your blood panel analysis, we can recommend precision-formulated supplements to address your specific nutrient gaps.
                            </p>
                        </div>
                        <Link
                            to="/products"
                            className="flex items-center gap-2 px-6 py-3 bg-white text-dayli-red-dark font-semibold rounded-full hover:bg-dayli-red-light transition-colors text-sm whitespace-nowrap"
                        >
                            <ShoppingBag size={18} /> Shop Products
                        </Link>
                    </div>
                </motion.div>

                {/* Disclaimer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-stone-400 max-w-2xl mx-auto">
                        This analysis is for informational purposes only and does not constitute medical advice.
                        Always consult with a qualified healthcare provider before making changes to your diet or supplement regimen.
                    </p>
                </div>
            </div>
        </div>
    );
}
