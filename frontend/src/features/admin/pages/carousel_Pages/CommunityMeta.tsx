import { useEffect, useState } from "react";
import StarfieldScene2D from "../../components/animation/StarfieldScene2D";
import {
    getTotalCommunityVisitsToday,
    getTotalCommunityVisitsLastWeek,
    getTotalCommunityVisitsLastMonth,
    getTotalCommunityVisitsAllTime,

    getAvgCommunityTimeToday,
    getAvgCommunityTimeLastWeek,
    getAvgCommunityTimeLastMonth,
    getAvgCommunityTimeAllTime,

    getBounceRateCommunityToday,
    getBounceRateCommunityLastWeek,
    getBounceRateCommunityLastMonth,
    getBounceRateCommunityAllTime,

    getSingleHitCommunitySessionsToday,
    getSingleHitCommunitySessionsLastWeek,
    getSingleHitCommunitySessionsLastMonth,
    getSingleHitCommunitySessionsAllTime,

    getAvgRequestsPerCommunityVisitToday,
    getAvgRequestsPerCommunityVisitLastWeek,
    getAvgRequestsPerCommunityVisitLastMonth,
    getAvgRequestsPerCommunityVisitAllTime,

    getCommunityVisitTimeClusters,
    getPeakCommunityUsageHourly,
    getTopNavigationFromCommunity,

    getCommunityToEventConversionRate,
    getReturningCommunityUsers,
    getMedianCommunityTime,
    getTotalCommunityTimeAllTime
} from "../../../../api/communityMeta";

import { Line, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

/* -------------------------------------------------------------------------- */
/*                                HELPER TYPES                                */
/* -------------------------------------------------------------------------- */

interface MetricData {
    totalVisits: number;
    avgTimeMinutes: number;
    bounceRate: number;
    singleHitRate: number;
    avgRequestsPerVisit: number;
}

interface SummaryState {
    today: MetricData | null;
    lastWeek: MetricData | null;
    lastMonth: MetricData | null;
    allTime: MetricData | null;
}

interface Insight {
    label: string;
    value: string | number;
}

/* -------------------------------------------------------------------------- */
/*                             SUB-COMPONENTS                                 */
/* -------------------------------------------------------------------------- */

function Spinner() {
    return (
        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
    );
}

interface MetricRowProps {
    label: string;
    field: keyof MetricData;
    data: SummaryState;
    loading: boolean;
}

function MetricRow({ label, field, data, loading }: MetricRowProps): React.JSX.Element {
    return (
        <tr className="border-t border-white/10 hover:bg-white/5 transition-colors duration-200">
            <td className="p-4 text-white/80 font-medium">{label}</td>
            {(["today", "lastWeek", "lastMonth", "allTime"] as const).map(key => (
                <td key={key} className="p-4 text-center">
                    {loading ? <Spinner /> : (data[key]?.[field] ?? 0)}
                </td>
            ))}
        </tr>
    );
}

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

const CommunityMeta: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<SummaryState>({
        today: null,
        lastWeek: null,
        lastMonth: null,
        allTime: null
    });

    const [clusters, setClusters] = useState<any>(null);
    const [hourly, setHourly] = useState<Record<string, number>>({});
    const [topNav, setTopNav] = useState<any[]>([]);
    const [insights, setInsights] = useState<Insight[]>([]);

    useEffect(() => {
        const loadCommunityMetadata = async () => {
            try {
                const [
                    visitsToday, visitsWeek, visitsMonth, visitsAll,
                    avgToday, avgWeek, avgMonth, avgAll,
                    bounceToday, bounceWeek, bounceMonth, bounceAll,
                    singleToday, singleWeek, singleMonth, singleAll,
                    avgReqToday, avgReqWeek, avgReqMonth, avgReqAll,
                    clustersRes, hourlyRes, topNavRes,
                    conversionRes, returningRes, medianRes, totalTimeRes
                ]: any[] = await Promise.all([
                    getTotalCommunityVisitsToday(),
                    getTotalCommunityVisitsLastWeek(),
                    getTotalCommunityVisitsLastMonth(),
                    getTotalCommunityVisitsAllTime(),

                    getAvgCommunityTimeToday(),
                    getAvgCommunityTimeLastWeek(),
                    getAvgCommunityTimeLastMonth(),
                    getAvgCommunityTimeAllTime(),

                    getBounceRateCommunityToday(),
                    getBounceRateCommunityLastWeek(),
                    getBounceRateCommunityLastMonth(),
                    getBounceRateCommunityAllTime(),

                    getSingleHitCommunitySessionsToday(),
                    getSingleHitCommunitySessionsLastWeek(),
                    getSingleHitCommunitySessionsLastMonth(),
                    getSingleHitCommunitySessionsAllTime(),

                    getAvgRequestsPerCommunityVisitToday(),
                    getAvgRequestsPerCommunityVisitLastWeek(),
                    getAvgRequestsPerCommunityVisitLastMonth(),
                    getAvgRequestsPerCommunityVisitAllTime(),

                    getCommunityVisitTimeClusters(),
                    getPeakCommunityUsageHourly(),
                    getTopNavigationFromCommunity(),

                    getCommunityToEventConversionRate(),
                    getReturningCommunityUsers(),
                    getMedianCommunityTime(),
                    getTotalCommunityTimeAllTime()
                ]);

                setSummary({
                    today: {
                        totalVisits: visitsToday.totalVisits,
                        avgTimeMinutes: avgToday.avgTimeMinutes,
                        bounceRate: bounceToday.bounceRate,
                        singleHitRate: singleToday.singleHitSessions,
                        avgRequestsPerVisit: avgReqToday.avgRequestsPerVisit
                    },
                    lastWeek: {
                        totalVisits: visitsWeek.totalVisits,
                        avgTimeMinutes: avgWeek.avgTimeMinutes,
                        bounceRate: bounceWeek.bounceRate,
                        singleHitRate: singleWeek.singleHitSessions,
                        avgRequestsPerVisit: avgReqWeek.avgRequestsPerVisit
                    },
                    lastMonth: {
                        totalVisits: visitsMonth.totalVisits,
                        avgTimeMinutes: avgMonth.avgTimeMinutes,
                        bounceRate: bounceMonth.bounceRate,
                        singleHitRate: singleMonth.singleHitSessions,
                        avgRequestsPerVisit: avgReqMonth.avgRequestsPerVisit
                    },
                    allTime: {
                        totalVisits: visitsAll.totalVisits,
                        avgTimeMinutes: avgAll.avgTimeMinutes,
                        bounceRate: bounceAll.bounceRate,
                        singleHitRate: singleAll.singleHitSessions,
                        avgRequestsPerVisit: avgReqAll.avgRequestsPerVisit
                    }
                });

                setClusters(clustersRes.clusters);

                const hourlyMap: Record<string, number> = {};
                hourlyRes.hourlyUsage.forEach((h: any) => {
                    hourlyMap[h.hour] = h.count;
                });
                setHourly(hourlyMap);

                setTopNav(topNavRes.topNavigations);

                setInsights([
                    { label: "Community → Event Conversion", value: `${conversionRes.conversionRate}%` },
                    { label: "Returning Community Users", value: returningRes.returningUsers },
                    { label: "Median Community Time (mins)", value: medianRes.medianTimeMinutes },
                    { label: "Total Community Time (mins)", value: totalTimeRes.totalTimeMinutes }
                ]);

                setLoading(false);
            } catch (err) {
                console.error("CommunityMeta failed to load:", err);
                setLoading(false);
            }
        };

        loadCommunityMetadata();
    }, []);

    /* -------------------------------------------------------------------------- */
    /*                               CHART CONFIGS                                */
    /* -------------------------------------------------------------------------- */

    const doughnutData = {
        labels: clusters ? Object.keys(clusters) : [],
        datasets: [{
            data: clusters ? Object.values(clusters) : [],
            backgroundColor: ["#60A5FA", "#34D399", "#F87171"],
            borderColor: "transparent",
            hoverOffset: 4
        }]
    };

    const lineData = {
        labels: Object.keys(hourly).map(h => `${h}:00`),
        datasets: [{
            label: "Community Traffic",
            data: Object.values(hourly),
            borderColor: "#A78BFA",
            backgroundColor: "rgba(167, 139, 250, 0.2)",
            tension: 0.4,
            fill: true
        }]
    };

    return (
        <div className="relative min-h-screen bg-[#0A0F1F] text-white">
            <StarfieldScene2D />

            <div className="relative z-10 p-8 pt-12 max-w-7xl mx-auto space-y-12 pb-24">

                {/* 🌌 HEADER SECTION */}
                <div className="text-center space-y-2">
                    <h1 className="text-5xl font-black tracking-tight text-white/90">Community Metadata</h1>
                    <p className="text-purple-400 font-bold uppercase tracking-[0.2em] text-xs">Aetherion Institutional Intelligence</p>
                </div>

                {/* 📊 SUMMARY TABLE */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="p-4 text-white/50 uppercase text-xs font-bold tracking-widest">Metric</th>
                                    <th className="p-4 text-center text-white/50 uppercase text-xs font-bold tracking-widest">Today</th>
                                    <th className="p-4 text-center text-white/50 uppercase text-xs font-bold tracking-widest">Last Week</th>
                                    <th className="p-4 text-center text-white/50 uppercase text-xs font-bold tracking-widest">Last Month</th>
                                    <th className="p-4 text-center text-white/50 uppercase text-xs font-bold tracking-widest">All Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                <MetricRow label="Total Visits" field="totalVisits" data={summary} loading={loading} />
                                <MetricRow label="Avg Session Time (mins)" field="avgTimeMinutes" data={summary} loading={loading} />
                                <MetricRow label="Bounce Rate (%)" field="bounceRate" data={summary} loading={loading} />
                                <MetricRow label="Single-Hit Sessions" field="singleHitRate" data={summary} loading={loading} />
                                <MetricRow label="Avg Requests / Visit" field="avgRequestsPerVisit" data={summary} loading={loading} />
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* 📈 CHARTS GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
                    >
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-400 rounded-full" />
                            Community Visit Time Distribution
                        </h2>
                        <div className="h-64 flex items-center justify-center">
                            {loading ? <Spinner /> : <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
                    >
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-400 rounded-full" />
                            Peak Community Usage (Hourly)
                        </h2>
                        <div className="h-64 flex items-center justify-center">
                            {loading ? <Spinner /> : <Line data={lineData} options={{ maintainAspectRatio: false }} />}
                        </div>
                    </motion.div>
                </div>

                {/* 🧠 INSIGHTS & TOP NAVIGATION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Insights List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 grid grid-cols-2 gap-4"
                    >
                        {insights.map((insight, idx) => (
                            <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col gap-1">
                                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{insight.label}</span>
                                <span className="text-2xl font-black text-white">{insight.value}</span>
                            </div>
                        ))}
                    </motion.div>

                    {/* Top Navigation Side Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-purple-600/10 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8"
                    >
                        <h2 className="text-xl font-bold mb-6">Top Navigations (from Comm)</h2>
                        <div className="space-y-4">
                            {loading ? <Spinner /> : topNav.length > 0 ? topNav.map((nav, i) => (
                                <div key={i} className="flex justify-between items-center group">
                                    <span className="text-white/80 group-hover:text-white transition-colors">{nav.page}</span>
                                    <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-bold">{nav.count} Hits</span>
                                </div>
                            )) : <p className="text-gray-500">No data available</p>}
                        </div>
                    </motion.div>

                </div>

            </div>
        </div>
    );
};

export default CommunityMeta;