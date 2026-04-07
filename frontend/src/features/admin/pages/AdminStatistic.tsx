import React, { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  FaUserPlus,
  FaChartLine,
  FaClock,
  FaBolt,
  FaBell,
  FaEnvelope,
  FaChartPie,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import type { IconType } from "react-icons";

import DoughnutCard from "../components/Charts/DoughnutCard";
import LineChartCard from "../components/Charts/LineChartCard";
import StatsCarousel from "../Carousel/DashboardCarousel";
import StarfieldScene2D from "../components/animation/StarfieldScene2D";

import {
  fetchTotalUsers,
  fetchTodayUsers,
  fetchTodaySessions,
  fetchAverageSessionTime,
  fetchLiveEvents,
} from "../components/Sidebar/sidebar_api";

/* -------------------------------------------------------------------------- */
/*                              ANIMATION VARIANTS                            */
/* -------------------------------------------------------------------------- */

const pageMotion: Variants = {
  initial: { opacity: 0, y: 20, filter: "blur(12px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const fadeUp: Variants = {
  initial: { opacity: 0, y: 24, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
};

const stagger: Variants = {
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

/* -------------------------------------------------------------------------- */
/*                        LIVE CLOCK HOOK                                     */
/* -------------------------------------------------------------------------- */

function useLiveClock() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* -------------------------------------------------------------------------- */
/*                              KPI CARD                                      */
/* -------------------------------------------------------------------------- */

interface KpiConfig {
  icon: IconType;
  label: string;
  value: number;
  sub?: string;
  accentColor: string;       // CSS colour string for top-rule + icon bg tint
  iconBg: string;            // Tailwind bg class for icon pill
  badge?: string;
  badgeTrend?: "up" | "down" | "neutral";
  isLive?: boolean;          // show animated pulse dot
}

const KpiCard: React.FC<KpiConfig> = ({
  icon: Icon,
  label,
  value,
  sub,
  accentColor,
  iconBg,
  badge,
  badgeTrend,
  isLive,
}) => {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    let start = 0;
    const steps = 120;
    const inc = value / steps;
    const timer = setInterval(() => {
      start += inc;
      if (start >= value) { start = value; clearInterval(timer); }
      setAnimated(Math.floor(start));
    }, 10);
    return () => clearInterval(timer);
  }, [value]);

  const trendIcon =
    badgeTrend === "up" ? <FaArrowUp size={9} /> :
      badgeTrend === "down" ? <FaArrowDown size={9} /> : null;

  const trendColor =
    badgeTrend === "up" ? "bg-emerald-500/15 text-emerald-400" :
      badgeTrend === "down" ? "bg-red-500/15 text-red-400" :
        "bg-white/10 text-white/50";

  return (
    <div
      className="
        flex flex-col justify-between h-full
        bg-[#0D0D1A] border border-white/8 rounded-xl
        px-4 py-3 shadow-lg
        hover:-translate-y-0.5 hover:shadow-xl hover:border-white/15
        transition-all duration-300
      "
      style={{ borderTop: `2px solid ${accentColor}` }}
    >
      {/* Header row: icon + label + optional live dot */}
      <div className="flex items-center gap-2 mb-1">
        <div className={`p-2 rounded-lg shrink-0 ${iconBg}`}>
          <Icon size={13} className="text-white" />
        </div>
        <p className="text-white/55 text-xs font-medium truncate flex-1">{label}</p>
        {isLive && (
          <span className="relative flex h-2 w-2 shrink-0">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: accentColor }}
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ backgroundColor: accentColor }}
            />
          </span>
        )}
      </div>

      {/* Value */}
      <p className="text-white font-bold text-2xl leading-none">
        {animated.toLocaleString()}
      </p>

      {/* Footer: sub text + trend badge */}
      <div className="flex items-center justify-between mt-1">
        {sub && <p className="text-white/35 text-xs">{sub}</p>}
        {badge && (
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-lg ${trendColor}`}>
            {trendIcon}
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                               ADMIN STATISTICS                             */
/* -------------------------------------------------------------------------- */

const AdminStatistic: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [todayUsers, setTodayUsers] = useState(0);
  const [todaySessions, setTodaySessions] = useState(0);
  const [avgSessionTime, setAvgSessionTime] = useState(0);
  const [liveEvents, setLiveEvents] = useState(0);

  const now = useLiveClock();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [t, td, s, avg, ev] = await Promise.allSettled([
        fetchTotalUsers(), fetchTodayUsers(), fetchTodaySessions(),
        fetchAverageSessionTime(), fetchLiveEvents(),
      ]);
      if (!mounted) return;
      if (t.status === "fulfilled") setTotalUsers(t.value?.users ?? 0);
      if (td.status === "fulfilled") setTodayUsers(td.value?.users ?? 0);
      if (s.status === "fulfilled") setTodaySessions(s.value?.count ?? 0);
      if (avg.status === "fulfilled") setAvgSessionTime(Number(avg.value?.avgSessionTimeMinutes ?? 0));
      if (ev.status === "fulfilled") setLiveEvents(ev.value?.count ?? 0);
    })();
    return () => { mounted = false; };
  }, []);

  const kpiCards: KpiConfig[] = [
    {
      icon: FaUserPlus,
      label: "Total Signups",
      value: totalUsers,
      sub: "All time",
      accentColor: "#3B82F6",
      iconBg: "bg-blue-600/70",
      badge: `+${todayUsers} today`,
      badgeTrend: "up",
    },
    {
      icon: FaChartLine,
      label: "Today Sessions",
      value: todaySessions,
      accentColor: "#8B5CF6",
      iconBg: "bg-violet-600/70",
    },
    {
      icon: FaClock,
      label: "Avg Session",
      value: avgSessionTime,
      sub: "minutes",
      accentColor: "#06B6D4",
      iconBg: "bg-cyan-600/70",
    },
    {
      icon: FaBolt,
      label: "Active Events",
      value: liveEvents,
      accentColor: "#F59E0B",
      iconBg: "bg-amber-500/70",
      isLive: true,
    },
    {
      icon: FaBell,
      label: "Notifications",
      value: 32,
      sub: "5 avg clicks",
      accentColor: "#EC4899",
      iconBg: "bg-pink-600/70",
      badge: "+4",
      badgeTrend: "up",
    },
    {
      icon: FaEnvelope,
      label: "Auto Emails",
      value: 500,
      sub: "55 manual",
      accentColor: "#6366F1",
      iconBg: "bg-indigo-600/70",
    },
  ];

  return (
    <motion.div
      variants={pageMotion}
      initial="initial"
      animate="animate"
      transition={{ duration: 1.1, ease: "easeOut" }}
      className="relative w-full min-h-screen text-white bg-black overflow-x-hidden"
    >
      <StarfieldScene2D />

      {/* ================================================================== */}
      {/* MAIN WRAPPER                                                         */}
      {/* ================================================================== */}
      <div className="relative z-10 p-6 max-w-[1700px] mx-auto flex flex-col gap-6">

        {/* ================================================================ */}
        {/* PAGE HEADER                                                        */}
        {/* ================================================================ */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center justify-between"
        >
          {/* Left — Title + breadcrumb */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-600/20 border border-violet-500/30">
              <FaChartPie size={18} className="text-violet-400" />
            </div>
            <div>
              <p className="text-white/35 text-xs font-medium tracking-widest uppercase">
                Admin / Analytics
              </p>
              <h1 className="text-white text-xl font-bold leading-tight">
                Statistics Dashboard
              </h1>
            </div>
          </div>

          {/* Right — Live clock */}
          <div className="text-right hidden sm:block">
            <p className="text-white font-mono text-lg font-semibold leading-tight">
              {timeStr}
            </p>
            <p className="text-white/40 text-xs">{dateStr}</p>
          </div>
        </motion.div>

        {/* ================================================================ */}
        {/* ROW 1 — KPI Cards strip (no outer glass wrapper)                  */}
        {/* ================================================================ */}
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
        >
          {kpiCards.map((card, i) => (
            <motion.div key={i} variants={fadeUp} className="h-full">
              <KpiCard {...card} />
            </motion.div>
          ))}
        </motion.div>

        {/* ================================================================ */}
        {/* ROW 2 — Two equal Doughnut cards                                 */}
        {/* ================================================================ */}
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.div variants={fadeUp}>
            <DoughnutCard type="SESSION_DURATION" title="Total Sessions" />
          </motion.div>
          <motion.div variants={fadeUp}>
            <DoughnutCard type="TIME_OF_DAY" title="Sessions by Time of Day" />
          </motion.div>
        </motion.div>

        {/* ================================================================ */}
        {/* ROW 3 — Traffic Line Chart (full width)                           */}
        {/* ================================================================ */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
        >
          <LineChartCard title="Traffic" />
        </motion.div>

        {/* ================================================================ */}
        {/* ROW 4 — Signups chart (50%)  |  Carousel (50%)                   */}
        {/* ================================================================ */}
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Signups line chart */}
          <motion.div variants={fadeUp}>
            <LineChartCard title="Signups" />
          </motion.div>

          {/* Rotating Carousel — solid dark card */}
          <motion.div
            variants={fadeUp}
            className="
              bg-[#0D0D1A] border border-white/8 rounded-2xl
              shadow-lg overflow-hidden flex flex-col
              hover:-translate-y-0.5 hover:border-white/15
              transition-all duration-300
            "
            style={{ borderTop: "2px solid #8B5CF6" }}
          >
            <div className="px-5 pt-4 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-0.5 h-5 rounded-full bg-violet-500" />
                <h2 className="text-base font-semibold text-white leading-tight">
                  Platform Sections
                </h2>
              </div>
              <p className="text-white/35 text-xs mt-0.5 pl-3">
                Click a card to explore analytics
              </p>
            </div>
            <div className="flex-1 min-h-0">
              <StatsCarousel />
            </div>
          </motion.div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default AdminStatistic;
