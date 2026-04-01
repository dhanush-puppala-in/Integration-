import { useEffect, useState } from "react";
import StarfieldScene2D from "../../components/animation/StarfieldScene2D";
import {
    fetchCertificateAwardsTodayPerHour,
    fetchCertificateAwardsTodayTotal,
    fetchCertificateAwardsLastWeek,
    fetchCertificateAwardsLastMonth,
    fetchCertificateAwardsAllTime,
    fetchMemoriesCreatedPerHour,
    fetchMemoriesLastWeek,
    fetchMemoriesLastMonth,
    fetchMemoriesAllTime,
    fetchAverageMemoriesPerUser,
    fetchNewUsersWhoCreatedMemories,
    fetchTotalMemoriesCount,
    fetchTopAndWorstClubs,
    fetchTopAndWorstCommunities
} from "../../../../api/crucialMeta";

import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from "chart.js";
import { motion, AnimatePresence } from "framer-motion";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

/* -------------------------------------------------------------------------- */
/*                                HELPER TYPES                                */
/* -------------------------------------------------------------------------- */

interface SummaryState {
    certs: {
        today: number;
        week: number;
        month: number;
        allTime: number;
    };
    memories: {
        today: number;
        week: number;
        month: number;
        allTime: number;
    };
}

interface RankingItem {
    rank: number;
    name?: string;
    title?: string;
    totalScore: number;
}

/* -------------------------------------------------------------------------- */
/*                             SUB-COMPONENTS                                 */
/* -------------------------------------------------------------------------- */

function Spinner() {
    return (
        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
    );
}

const StatCard = ({ title, value, icon, loading }: any) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden group"
    >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-4xl">
            {icon}
        </div>
        <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{title}</span>
        <span className="text-3xl font-black text-white">
            {loading ? <Spinner /> : value ?? 0}
        </span>
    </motion.div>
);

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

const CrucialMeta: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<SummaryState | null>(null);
    const [certHourly, setCertHourly] = useState<any[]>([]);
    const [kpis, setKpis] = useState<any>({});

    // Rankings State
    const [rankingType, setRankingType] = useState<"clubs" | "communities">("clubs");
    const [rankingLimit, setRankingLimit] = useState(5);
    const [rankings, setRankings] = useState<any>(null);
    const [rankingsLoading, setRankingsLoading] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [
                    certHour, certToday, certWeek, certMonth, certAll,
                    memHour, memWeek, memMonth, memAll,
                    avgMem, newMemUsers, totalMemCount
                ]: any[] = await Promise.all([
                    fetchCertificateAwardsTodayPerHour(),
                    fetchCertificateAwardsTodayTotal(),
                    fetchCertificateAwardsLastWeek(),
                    fetchCertificateAwardsLastMonth(),
                    fetchCertificateAwardsAllTime(),
                    fetchMemoriesCreatedPerHour(),
                    fetchMemoriesLastWeek(),
                    fetchMemoriesLastMonth(),
                    fetchMemoriesAllTime(),
                    fetchAverageMemoriesPerUser(),
                    fetchNewUsersWhoCreatedMemories(),
                    fetchTotalMemoriesCount()
                ]);

                setCertHourly(certHour.todayPerHour || []);

                setSummary({
                    certs: {
                        today: certToday.todayTotal || 0,
                        week: certWeek.lastWeek || 0,
                        month: certMonth.lastMonth || 0,
                        allTime: certAll.allTime || 0
                    },
                    memories: {
                        today: (memHour.todayPerHour || []).reduce((a: number, b: any) => a + b.count, 0),
                        week: memWeek.lastWeek || 0,
                        month: memMonth.lastMonth || 0,
                        allTime: memAll.allTime || 0
                    }
                });

                setKpis({
                    avgMemories: avgMem.averageMemoriesPerUser,
                    newCreators: newMemUsers.today,
                    totalMemories: totalMemCount.total
                });

                // Initial Rankings
                const initialRankings: any = await fetchTopAndWorstClubs(5);
                setRankings(initialRankings);

                setLoading(false);
            } catch (err) {
                console.error("CrucialMeta load error:", err);
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const handleRefetchRankings = async () => {
        setRankingsLoading(true);
        try {
            const res: any = rankingType === "clubs"
                ? await fetchTopAndWorstClubs(rankingLimit)
                : await fetchTopAndWorstCommunities(rankingLimit);
            setRankings(res);
        } catch (err) {
            console.error("Failed to fetch rankings:", err);
        } finally {
            setRankingsLoading(false);
        }
    };

    /* -------------------------------------------------------------------------- */
    /*                               CHART CONFIG                                 */
    /* -------------------------------------------------------------------------- */

    const certChartData = {
        labels: certHourly.map(h => `${h.hour}:00`),
        datasets: [{
            label: "Certificates Issued",
            data: certHourly.map(h => h.count),
            borderColor: "#8B5CF6",
            backgroundColor: "rgba(139, 92, 246, 0.1)",
            borderWidth: 3,
            pointBackgroundColor: "#8B5CF6",
            tension: 0.4,
            fill: true
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: "rgba(255,255,255,0.05)" },
                ticks: { color: "rgba(255,255,255,0.4)" }
            },
            x: {
                grid: { display: false },
                ticks: { color: "rgba(255,255,255,0.4)" }
            }
        }
    };

    return (
        <div className="relative min-h-screen bg-[#0A0F1F] text-white">
            <StarfieldScene2D />

            <div className="relative z-10 p-8 pt-12 max-w-7xl mx-auto space-y-12 pb-24">

                {/* 🌌 HEADER SECTION */}
                <div className="text-center space-y-2">
                    <h1 className="text-5xl font-black tracking-tight text-white/90">Crucial Metadata</h1>
                    <p className="text-violet-400 font-bold uppercase tracking-[0.2em] text-xs">Platform Vitality & MemoryLane</p>
                </div>

                {/* 📊 KPI GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Avg Memories / User" value={kpis.avgMemories} icon="🧠" loading={loading} />
                    <StatCard title="New Memory Creators (Today)" value={kpis.newCreators} icon="✨" loading={loading} />
                    <StatCard title="Total Memories Platform-wide" value={kpis.totalMemories} icon="📦" loading={loading} />
                </div>

                {/* 📈 MAIN CHART */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
                                Certificate Issuance Velocity
                            </h2>
                            <p className="text-sm text-white/40">Hourly distribution of awarded certificates today</p>
                        </div>
                    </div>
                    <div className="h-80">
                        {loading ? <Spinner /> : <Line data={certChartData} options={chartOptions} />}
                    </div>
                </motion.div>

                {/* 📊 METRICS COMPARISON TABLE */}
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden"
                    >
                        <table className="w-full text-left">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="p-4 text-white/50 uppercase text-xs font-bold tracking-widest">Metadata Vector</th>
                                    <th className="p-4 text-center text-white/50 uppercase text-xs font-bold tracking-widest">Today</th>
                                    <th className="p-4 text-center text-white/50 uppercase text-xs font-bold tracking-widest">Last Week</th>
                                    <th className="p-4 text-center text-white/50 uppercase text-xs font-bold tracking-widest">Last Month</th>
                                    <th className="p-4 text-center text-white/50 uppercase text-xs font-bold tracking-widest">All Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-white/80 font-medium">Certificates Issued</td>
                                    <td className="p-4 text-center font-bold text-violet-400">{loading ? <Spinner /> : summary?.certs.today}</td>
                                    <td className="p-4 text-center">{loading ? <Spinner /> : summary?.certs.week}</td>
                                    <td className="p-4 text-center">{loading ? <Spinner /> : summary?.certs.month}</td>
                                    <td className="p-4 text-center opacity-60 italic">{loading ? <Spinner /> : summary?.certs.allTime}</td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-white/80 font-medium">Memories Logged</td>
                                    <td className="p-4 text-center font-bold text-emerald-400">{loading ? <Spinner /> : summary?.memories.today}</td>
                                    <td className="p-4 text-center">{loading ? <Spinner /> : summary?.memories.week}</td>
                                    <td className="p-4 text-center">{loading ? <Spinner /> : summary?.memories.month}</td>
                                    <td className="p-4 text-center opacity-60 italic">{loading ? <Spinner /> : summary?.memories.allTime}</td>
                                </tr>
                            </tbody>
                        </table>
                    </motion.div>
                </div>

                {/* 🏆 RANKINGS SECTION */}
                <div className="space-y-6 pt-12 border-t border-white/5">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="space-y-1 text-center md:text-left">
                            <h2 className="text-2xl font-black tracking-tight">Performance Rankings</h2>
                            <p className="text-white/40 text-sm italic">Categorical leaders and laggards by Total Score</p>
                        </div>

                        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-xl">
                            <select
                                value={rankingType}
                                onChange={(e: any) => setRankingType(e.target.value)}
                                className="bg-transparent border-none focus:ring-0 text-sm font-bold text-white/80 uppercase cursor-pointer px-4 outline-none"
                            >
                                <option value="clubs" className="bg-[#0b0f17]">Clubs</option>
                                <option value="communities" className="bg-[#0b0f17]">Communities</option>
                            </select>

                            <input
                                type="number"
                                value={rankingLimit}
                                onChange={(e: any) => setRankingLimit(Number(e.target.value))}
                                className="w-16 bg-white/10 border-none rounded-xl text-center text-sm font-bold py-1.5 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
                            />

                            <button
                                onClick={handleRefetchRankings}
                                disabled={rankingsLoading}
                                className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-6 py-1.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-violet-600/20"
                            >
                                {rankingsLoading ? "..." : "REFETCH"}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`top-${rankingType}-${rankingsLoading}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-emerald-500/5 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-8 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 text-emerald-500/10 pointer-events-none">
                                    <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                </div>
                                <h3 className="text-lg font-bold text-emerald-400 mb-6 flex items-center gap-2">
                                    Top Performers
                                </h3>
                                <div className="space-y-4">
                                    {(rankings?.[rankingType === "clubs" ? "topClubs" : "topCommunities"] || []).map((item: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <span className="w-6 h-6 flex items-center justify-center bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-black">{item.rank}</span>
                                                <span className="font-bold text-white/90 group-hover:text-white transition-colors">{item.name || item.title}</span>
                                            </div>
                                            <span className="text-emerald-400 font-mono text-sm font-bold">{item.totalScore}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div
                                key={`worst-${rankingType}-${rankingsLoading}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-rose-500/5 backdrop-blur-xl border border-rose-500/20 rounded-3xl p-8 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 text-rose-500/10 pointer-events-none">
                                    <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" opacity="0.3" /><path d="M12 17c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
                                </div>
                                <h3 className="text-lg font-bold text-rose-400 mb-6 flex items-center gap-2">
                                    Underperformers
                                </h3>
                                <div className="space-y-4">
                                    {(rankings?.[rankingType === "clubs" ? "worstClubs" : "worstCommunities"] || []).map((item: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <span className="w-6 h-6 flex items-center justify-center bg-rose-500/20 text-rose-400 rounded-lg text-[10px] font-black">{item.rank}</span>
                                                <span className="font-bold text-white/90 group-hover:text-white transition-colors">{item.name || item.title}</span>
                                            </div>
                                            <span className="text-rose-400 font-mono text-sm font-bold">{item.totalScore}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CrucialMeta;
