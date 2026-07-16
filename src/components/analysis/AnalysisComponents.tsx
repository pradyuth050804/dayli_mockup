import { BloodMarker, BloodMarkerResult, BloodPanelStatus } from '../../lib/api';

// ─── Gauge Chart ───────────────────────────────────────────────────────────────

interface GaugeChartProps {
    value: number;
    min: number;
    max: number;
    result: BloodMarkerResult;
    units: string;
}

export function GaugeChart({ value, min, max, result, units }: GaugeChartProps) {
    // Calculate position on the arc (0 = far left, 1 = far right)
    const totalRange = max - min;
    const lowBound = min - totalRange * 0.5;
    const highBound = max + totalRange * 0.5;
    const fullRange = highBound - lowBound;
    const clampedValue = Math.max(lowBound, Math.min(highBound, value));
    const position = (clampedValue - lowBound) / fullRange;

    // SVG arc parameters
    const width = 200;
    const height = 120;
    const cx = width / 2;
    const cy = height - 10;
    const radius = 80;

    // Arc from 180° to 0° (left to right semicircle)
    const startAngle = Math.PI;
    const endAngle = 0;

    // Zone boundaries on the arc
    const lowEnd = (min - lowBound) / fullRange;
    const highStart = (max - lowBound) / fullRange;

    // Needle angle
    const needleAngle = startAngle - position * Math.PI;
    const needleX = cx + radius * Math.cos(needleAngle);
    const needleY = cy - radius * Math.sin(needleAngle);

    // Arc path helper
    const arcPath = (r: number, startFrac: number, endFrac: number) => {
        const sA = startAngle - startFrac * Math.PI;
        const eA = startAngle - endFrac * Math.PI;
        const x1 = cx + r * Math.cos(sA);
        const y1 = cy - r * Math.sin(sA);
        const x2 = cx + r * Math.cos(eA);
        const y2 = cy - r * Math.sin(eA);
        const large = endFrac - startFrac > 0.5 ? 1 : 0;
        return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
    };

    const resultColor = result === 'OPTIMAL' ? '#10b981' : result === 'HIGH' ? '#ef4444' : '#f59e0b';

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[200px]">
            {/* Low zone (amber) */}
            <path d={arcPath(radius, 0, lowEnd)} fill="none" stroke="#fbbf24" strokeWidth="12" strokeLinecap="round" />
            {/* Optimal zone (green) */}
            <path d={arcPath(radius, lowEnd, highStart)} fill="none" stroke="#34d399" strokeWidth="12" strokeLinecap="round" />
            {/* High zone (red) */}
            <path d={arcPath(radius, highStart, 1)} fill="none" stroke="#f87171" strokeWidth="12" strokeLinecap="round" />

            {/* Needle */}
            <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke={resultColor} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={cx} cy={cy} r="4" fill={resultColor} />

            {/* Labels */}
            <text x={cx - radius - 2} y={cy + 14} textAnchor="middle" className="text-[9px] fill-stone-400">{min}</text>
            <text x={cx + radius + 2} y={cy + 14} textAnchor="middle" className="text-[9px] fill-stone-400">{max}</text>
            <text x={cx} y={cy - 20} textAnchor="middle" className="text-[13px] font-bold" fill={resultColor}>{value}</text>
            <text x={cx} y={cy - 6} textAnchor="middle" className="text-[8px] fill-stone-400">{units}</text>
        </svg>
    );
}

// ─── Panel Status Badge ────────────────────────────────────────────────────────

const statusConfig: Record<BloodPanelStatus, { bg: string; text: string; label: string }> = {
    GOOD: { bg: 'bg-dayli-red-light border-dayli-red-light', text: 'text-dayli-red-dark', label: 'GOOD' },
    FAIR: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', label: 'FAIR' },
    POOR: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', label: 'POOR' },
};

export function PanelStatusBadge({ status }: { status: BloodPanelStatus }) {
    const cfg = statusConfig[status] || statusConfig.GOOD;
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.text}`}>
            {cfg.label}
        </span>
    );
}

// ─── Marker Row (for deviated markers) ─────────────────────────────────────────

interface MarkerRowProps {
    marker: BloodMarker;
}

export function MarkerRow({ marker }: MarkerRowProps) {
    const value = parseFloat(marker.value);
    const min = marker.parameterInfo?.minValue ?? 0;
    const max = marker.parameterInfo?.maxValue ?? 100;
    const resultColor = marker.result === 'OPTIMAL' ? 'text-dayli-red-dark' : marker.result === 'HIGH' ? 'text-red-600' : 'text-amber-600';
    const resultBg = marker.result === 'OPTIMAL' ? 'bg-dayli-red-light' : marker.result === 'HIGH' ? 'bg-red-50' : 'bg-amber-50';

    return (
        <div className={`rounded-2xl border border-stone-100 p-6 ${resultBg}/30`}>
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: marker info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-stone-900">{marker.parameterName}</h4>
                        <span className={`text-sm font-bold ${resultColor}`}>
                            {value} {marker.units}
                        </span>
                    </div>
                    <p className="text-xs text-stone-400 mb-1">
                        Optimal Range: {min} – {max} {marker.units}
                    </p>
                    {marker.deviation > 0 && (
                        <p className={`text-xs font-semibold ${resultColor}`}>
                            Deviation: {marker.deviation}%
                        </p>
                    )}
                </div>

                {/* Center: gauge */}
                <div className="flex-shrink-0 flex items-center justify-center">
                    <GaugeChart value={value} min={min} max={max} result={marker.result} units={marker.units} />
                </div>

                {/* Right: possible reasons */}
                {marker.reason && (
                    <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-semibold text-stone-700 mb-2">Possible Reasons</h5>
                        <div className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                            {marker.reason}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Panel Card (collapsible section for each blood panel) ─────────────────────

interface PanelCardProps {
    panelName: string;
    panelStatus: BloodPanelStatus;
    healthScore: string;
    markers: BloodMarker[];
}

export function PanelCard({ panelName, panelStatus, healthScore, markers }: PanelCardProps) {
    const deviatedMarkers = markers.filter(m => m.result !== 'OPTIMAL');
    const optimalMarkers = markers.filter(m => m.result === 'OPTIMAL');

    const statusColor = panelStatus === 'GOOD' ? 'text-dayli-red-dark' : panelStatus === 'FAIR' ? 'text-amber-600' : 'text-red-600';

    return (
        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-stone-100">
                <div className="flex items-center gap-3">
                    <h3 className="text-xl font-black text-stone-900">{panelName}:</h3>
                    <span className={`text-xl font-black ${statusColor}`}>{panelStatus}</span>
                </div>
                <div className="text-right">
                    <span className="text-xs text-stone-400">Health Score: </span>
                    <span className="text-sm font-bold text-stone-700">{healthScore}</span>
                </div>
            </div>

            <div className="p-8">
                {/* Deviated markers with full detail */}
                {deviatedMarkers.length > 0 && (
                    <div className="space-y-4 mb-8">
                        {deviatedMarkers.map((marker) => (
                            <MarkerRow key={marker.parameterName} marker={marker} />
                        ))}
                    </div>
                )}

                {/* Optimal parameters table */}
                {optimalMarkers.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold text-stone-500 mb-3">Optimal Parameters</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-stone-200">
                                        <th className="text-left py-2 px-3 text-stone-500 font-medium">Parameter</th>
                                        <th className="text-left py-2 px-3 text-stone-500 font-medium">Value</th>
                                        <th className="text-left py-2 px-3 text-stone-500 font-medium">Units</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {optimalMarkers.map((m) => (
                                        <tr key={m.parameterName} className="border-b border-stone-50">
                                            <td className="py-2 px-3 text-dayli-red-dark font-medium">{m.parameterName}</td>
                                            <td className="py-2 px-3 text-stone-700">{m.value}</td>
                                            <td className="py-2 px-3 text-stone-500">{m.units}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Blood Panel Summary Donut ─────────────────────────────────────────────────

interface PanelSummaryDonutProps {
    panels: { name: string; status: BloodPanelStatus }[];
    totalParameters: number;
}

export function PanelSummaryDonut({ panels, totalParameters }: PanelSummaryDonutProps) {
    const good = panels.filter(p => p.status === 'GOOD').length;
    const fair = panels.filter(p => p.status === 'FAIR').length;
    const poor = panels.filter(p => p.status === 'POOR').length;
    const total = panels.length;

    // SVG donut
    const cx = 100, cy = 100, r = 70;
    const circumference = 2 * Math.PI * r;

    const goodFrac = good / total;
    const fairFrac = fair / total;
    const poorFrac = poor / total;

    const goodLen = goodFrac * circumference;
    const fairLen = fairFrac * circumference;
    const poorLen = poorFrac * circumference;

    const goodOffset = 0;
    const fairOffset = -(goodLen);
    const poorOffset = -(goodLen + fairLen);

    return (
        <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative">
                <svg viewBox="0 0 200 200" className="w-48 h-48">
                    {/* Background circle */}
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e7e5e4" strokeWidth="20" />
                    {/* Good segment */}
                    {good > 0 && (
                        <circle
                            cx={cx} cy={cy} r={r} fill="none" stroke="#34d399" strokeWidth="20"
                            strokeDasharray={`${goodLen} ${circumference - goodLen}`}
                            strokeDashoffset={goodOffset}
                            transform="rotate(-90 100 100)"
                        />
                    )}
                    {/* Fair segment */}
                    {fair > 0 && (
                        <circle
                            cx={cx} cy={cy} r={r} fill="none" stroke="#fbbf24" strokeWidth="20"
                            strokeDasharray={`${fairLen} ${circumference - fairLen}`}
                            strokeDashoffset={fairOffset}
                            transform="rotate(-90 100 100)"
                        />
                    )}
                    {/* Poor segment */}
                    {poor > 0 && (
                        <circle
                            cx={cx} cy={cy} r={r} fill="none" stroke="#f87171" strokeWidth="20"
                            strokeDasharray={`${poorLen} ${circumference - poorLen}`}
                            strokeDashoffset={poorOffset}
                            transform="rotate(-90 100 100)"
                        />
                    )}
                    {/* Center text */}
                    <text x={cx} y={cy - 6} textAnchor="middle" className="text-2xl font-black fill-stone-900">{totalParameters}</text>
                    <text x={cx} y={cy + 12} textAnchor="middle" className="text-[10px] fill-stone-400">parameters</text>
                </svg>
            </div>

            <div className="space-y-2">
                <h3 className="text-lg font-bold text-stone-900 mb-3">Panels</h3>
                {panels.map((panel) => (
                    <div key={panel.name} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${panel.status === 'GOOD' ? 'bg-dayli-red' :
                                panel.status === 'FAIR' ? 'bg-amber-400' : 'bg-red-400'
                            }`} />
                        <span className="text-sm text-stone-700">{panel.name}</span>
                        <PanelStatusBadge status={panel.status} />
                    </div>
                ))}

                <div className="flex gap-6 pt-3 mt-3 border-t border-stone-100 text-xs text-stone-500">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-dayli-red" /> GOOD
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" /> FAIR
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400" /> POOR
                    </div>
                </div>
            </div>
        </div>
    );
}
