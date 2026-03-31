// src/pages/metadata/ClubsMeta.tsx
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import StarfieldScene2D from "../../components/animation/StarfieldScene2D";
/*
import {
    getTotalClubVisitsToday,
    getTotalClubVisitsLastWeek,
    getTotalClubVisitsLastMonth,
    getTotalClubVisitsAllTime,

    getAvgClubTimeToday,
    getAvgClubTimeLastWeek,
    getAvgClubTimeLastMonth,
    getAvgClubTimeAllTime,

    getBounceRateClubToday,
    getBounceRateClubLastWeek,
    getBounceRateClubLastMonth,
    getBounceRateClubAllTime,

    getSingleHitClubSessionsToday,
    getSingleHitClubSessionsLastWeek,
    getSingleHitClubSessionsLastMonth,
    getSingleHitClubSessionsAllTime,

    getAvgRequestsPerClubVisitToday,
    getAvgRequestsPerClubVisitLastWeek,
    getAvgRequestsPerClubVisitLastMonth,
    getAvgRequestsPerClubVisitAllTime,

    getClubVisitTimeClusters,
    getPeakClubUsageHourly,
    getTopNavigationFromClub,

    getClubEngagementRate,
    getClubStickinessRate,
    getClubDeepNavigationRate,
    getClubDiscoveryFromEventsRate,
    getReturningClubUsers,
    getMedianClubTime,
    getTotalClubTimeAllTime
} from "../../api/clubMetadata_api";
*/

import { Line, Doughnut } from "react-chartjs-2";
import {
    Chart,
    LineElement,
    PointElement,
    ArcElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    type ChartData,
    type ChartOptions
} from "chart.js";

Chart.register(
    LineElement,
    PointElement,
    ArcElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
);

interface SummaryPeriod {
    totalVisits: number;
    avgTimeMinutes: number;
    bounceRate: number;
    singleHitRate: number;
    avgRequestsPerVisit: number;
}

interface SummaryData {
    today: SummaryPeriod;
    lastWeek: SummaryPeriod;
    lastMonth: SummaryPeriod;
    allTime: SummaryPeriod;
}

export default function ClubMeta(): React.JSX.Element {
    const [loading, setLoading] = useState(true);

    const [summary, setSummary] = useState<SummaryData | null>(null);
    const [clusters, setClusters] = useState<Record<string, number> | null>(null);
    const [hourly, setHourly] = useState<Record<string, number> | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [topNav, setTopNav] = useState<any[]>([]);
    const [insights, setInsights] = useState<{ label: string; value: string | number }[]>([]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [engagementRateData, setEngagementRateData] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [stickinessRateData, setStickinessRateData] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [deepNavigationRateData, setDeepNavigationRateData] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [discoveryRateData, setDiscoveryRateData] = useState<any>(null);

    useEffect(() => {
        async function loadClubMetadata() {
            try {
                const [
                    visitsToday, visitsWeek, visitsMonth, visitsAll,
                    avgToday, avgWeek, avgMonth, avgAll,
                    bounceToday, bounceWeek, bounceMonth, bounceAll,
                    singleToday, singleWeek, singleMonth, singleAll,
                    avgReqToday, avgReqWeek, avgReqMonth, avgReqAll,
                    clustersRes, hourlyRes, topNavRes,
                    engagementRes, stickinessRes, deepRes, discoveryRes,
                    returningRes, medianRes, totalTimeRes
                ]: any[] = await Promise.all([
                    // getTotalClubVisitsToday(),
                    // getTotalClubVisitsLastWeek(),
                    // getTotalClubVisitsLastMonth(),
                    // getTotalClubVisitsAllTime(),

                    // getAvgClubTimeToday(),
                    // getAvgClubTimeLastWeek(),
                    // getAvgClubTimeLastMonth(),
                    // getAvgClubTimeAllTime(),

                    // getBounceRateClubToday(),
                    // getBounceRateClubLastWeek(),
                    // getBounceRateClubLastMonth(),
                    // getBounceRateClubAllTime(),

                    // getSingleHitClubSessionsToday(),
                    // getSingleHitClubSessionsLastWeek(),
                    // getSingleHitClubSessionsLastMonth(),
                    // getSingleHitClubSessionsAllTime(),

                    // getAvgRequestsPerClubVisitToday(),
                    // getAvgRequestsPerClubVisitLastWeek(),
                    // getAvgRequestsPerClubVisitLastMonth(),
                    // getAvgRequestsPerClubVisitAllTime(),

                    // getClubVisitTimeClusters(),
                    // getPeakClubUsageHourly(),
                    // getTopNavigationFromClub(),

                    // getClubEngagementRate(),
                    // getClubStickinessRate(),
                    // getClubDeepNavigationRate(),
                    // getClubDiscoveryFromEventsRate(),

                    // getReturningClubUsers(),
                    // getMedianClubTime(),
                    // getTotalClubTimeAllTime()
                ]);

                setSummary({
                    today: {
                        totalVisits: visitsToday.data.totalVisits,
                        avgTimeMinutes: avgToday.data.avgTimeMinutes,
                        bounceRate: bounceToday.data.bounceRate,
                        singleHitRate: singleToday.data.singleHitSessions,
                        avgRequestsPerVisit: avgReqToday.data.avgRequestsPerVisit
                    },
                    lastWeek: {
                        totalVisits: visitsWeek.data.totalVisits,
                        avgTimeMinutes: avgWeek.data.avgTimeMinutes,
                        bounceRate: bounceWeek.data.bounceRate,
                        singleHitRate: singleWeek.data.singleHitSessions,
                        avgRequestsPerVisit: avgReqWeek.data.avgRequestsPerVisit
                    },
                    lastMonth: {
                        totalVisits: visitsMonth.data.totalVisits,
                        avgTimeMinutes: avgMonth.data.avgTimeMinutes,
                        bounceRate: bounceMonth.data.bounceRate,
                        singleHitRate: singleMonth.data.singleHitSessions,
                        avgRequestsPerVisit: avgReqMonth.data.avgRequestsPerVisit
                    },
                    allTime: {
                        totalVisits: visitsAll.data.totalVisits,
                        avgTimeMinutes: avgAll.data.avgTimeMinutes,
                        bounceRate: bounceAll.data.bounceRate,
                        singleHitRate: singleAll.data.singleHitSessions,
                        avgRequestsPerVisit: avgReqAll.data.avgRequestsPerVisit
                    }
                });

                setClusters(clustersRes.data.clusters);

                const hourlyMap: Record<string, number> = {};
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                hourlyRes.data.hourlyUsage.forEach((h: any) => {
                    hourlyMap[h.hour] = h.count;
                });
                setHourly(hourlyMap);

                setTopNav(topNavRes.data.topNavigations);

                setInsights([
                    { label: "Club Engagement Rate", value: `${engagementRes.data.engagementRate}%` },
                    { label: "Club Stickiness Rate", value: `${stickinessRes.data.stickinessRate}%` },
                    { label: "Deep Navigation Rate", value: `${deepRes.data.deepNavigationRate}%` },
                    { label: "Club Discovery from Events", value: `${discoveryRes.data.discoveryRate}%` },
                    { label: "Returning Club Users", value: returningRes.data.returningUsers },
                    { label: "Median Club Time (mins)", value: medianRes.data.medianTimeMinutes },
                    { label: "Total Club Time (mins)", value: totalTimeRes.data.totalTimeMinutes }
                ]);

                setEngagementRateData(engagementRes.data);
                setStickinessRateData(stickinessRes.data);
                setDeepNavigationRateData(deepRes.data);
                setDiscoveryRateData(discoveryRes.data);

                setLoading(false);
            } catch (err) {
                console.error("ClubMeta load error:", err);
            }
        }

        loadClubMetadata();
    }, []);

    const donutData: ChartData<"doughnut"> | undefined = clusters ? {
        labels: Object.keys(clusters),
        datasets: [{
            data: Object.values(clusters),
            backgroundColor: ["#60A5FA", "#34D399", "#F87171"],
            borderWidth: 0
        }]
    } : undefined;

    const lineData: ChartData<"line"> | undefined = hourly ? {
        labels: Object.keys(hourly).map(h => `${h}:00`),
        datasets: [{
            label: "Club Traffic",
            data: Object.values(hourly),
            borderColor: "#F472B6",
            backgroundColor: "rgba(244,114,182,0.25)",
            pointRadius: 3,
            tension: 0.4
        }]
    } : undefined;

    const lineOptions: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { grid: { color: "rgba(255,255,255,0.12)" }, ticks: { color: "rgba(255,255,255,0.7)" } },
            y: { grid: { color: "rgba(255,255,255,0.12)" }, ticks: { color: "rgba(255,255,255,0.7)" } }
        }
    };

    return (
        <div className="relative min-h-screen w-screen bg-black text-white overflow-x-hidden">
            <StarfieldScene2D />
            <div className="relative z-10">
                <Sidebar />

                <div className="max-w-7xl mx-auto px-10 py-8">
                    <h1 className="text-4xl font-bold text-center">Club Metadata</h1>

                    {/* METRICS TABLE */}
                    <div className="mt-12 overflow-x-auto">
                        <table className="w-full border border-white/30 text-sm">
                            <thead className="bg-black/60">
                                <tr>
                                    <th className="p-4 text-left">Metric</th>
                                    <th className="p-4">Today</th>
                                    <th className="p-4">Last Week</th>
                                    <th className="p-4">Last Month</th>
                                    <th className="p-4">All Time</th>
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

                    {/* CHARTS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-14">
                        <ChartCard title="Club Visit Time Distribution">
                            {loading || !donutData ? <Spinner /> : (
                                <div className="w-full h-full max-w-[420px] max-h-[420px]">
                                    <Doughnut data={donutData} options={{ maintainAspectRatio: false }} />
                                </div>
                            )}
                        </ChartCard>

                        <ChartCard title="Peak Club Usage (Hourly)">
                            {loading || !lineData ? <Spinner /> : <Line data={lineData} options={lineOptions} />}
                        </ChartCard>
                    </div>

                    {/* TOP NAV */}
                    <Section title="Top Navigation From Club">
                        <ul className="space-y-2 text-sm">
                            {topNav.map(item => (
                                <li key={item.page} className="flex justify-between">
                                    <span>{item.page}</span>
                                    <span className="text-white/70">{item.count}</span>
                                </li>
                            ))}
                        </ul>
                    </Section>

                    {/* INSIGHTS */}
                    <Section title="Club Engagement Insights">
                        <ul className="space-y-2 text-sm">
                            {insights.map(item => (
                                <li key={item.label} className="flex justify-between">
                                    <span>{item.label}</span>
                                    <span className="text-white/70">{item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </Section>

                    {/* FULL CONTROLLER OUTPUTS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                        <RateList title="Club Engagement Rate – Full Output" data={engagementRateData} />
                        <RateList title="Club Stickiness Rate – Full Output" data={stickinessRateData} />
                        <RateList title="Club Deep Navigation Rate – Full Output" data={deepNavigationRateData} />
                        <RateList title="Club Discovery From Events Rate – Full Output" data={discoveryRateData} />
                    </div>
                </div>
            </div>

            {/* INLINE SPINNER CSS */}
            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 22px;
          height: 22px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
      `}</style>
        </div>
    );
}

/* ---------------- HELPERS ---------------- */

interface MetricRowProps {
    label: string;
    field: keyof SummaryPeriod;
    data: SummaryData | null;
    loading: boolean;
}

function MetricRow({ label, field, data, loading }: MetricRowProps): React.JSX.Element {
    return (
        <tr className="border-t border-white/10">
            <td className="p-4 text-white/80">{label}</td>
            {(["today", "lastWeek", "lastMonth", "allTime"] as const).map(key => (
                <td key={key} className="p-4 text-center">
                    {loading ? <Spinner /> : data?.[key]?.[field] ?? 0}
                </td>
            ))}
        </tr>
    );
}

interface SectionProps {
    title: string;
    children: React.ReactNode;
}

function Section({ title, children }: SectionProps): React.JSX.Element {
    return (
        <div className="bg-black/35 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mt-12">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            {children}
        </div>
    );
}

function ChartCard({ title, children }: SectionProps): React.JSX.Element {
    return (
        <div className="bg-black/40 border border-white/20 rounded-2xl p-6 h-[520px] md:h-[600px] flex flex-col">
            <h3 className="text-sm font-semibold text-white/80 mb-4">{title}</h3>
            <div className="flex-1 flex items-center justify-center">{children}</div>
        </div>
    );
}

interface RateListProps {
    title: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any> | null;
}

function RateList({ title, data }: RateListProps): React.JSX.Element | null {
    if (!data) return null;
    return (
        <Section title={title}>
            <ul className="space-y-2 text-sm">
                {Object.entries(data).map(([k, v]) => (
                    <li key={k} className="flex justify-between">
                        <span>{k}</span>
                        <span className="text-white/70">{String(v)}</span>
                    </li>
                ))}
            </ul>
        </Section>
    );
}

function Spinner(): React.JSX.Element {
    return <div className="spinner" />;
}
