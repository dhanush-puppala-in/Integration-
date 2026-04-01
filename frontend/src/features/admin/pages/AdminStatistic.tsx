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
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

/* -------------------------------------------------------------------------- */
/*                              KPI CARD                                      */
/* -------------------------------------------------------------------------- */

interface KpiConfig {
  icon: IconType;
  label: string;
  value: number;
  sub?: string;
  iconBg: string;
  badge?: string;
  badgeColor?: string;
}

const KpiCard: React.FC<KpiConfig> = ({
  icon: Icon,
  label,
  value,
  sub,
  iconBg,
  badge,
  badgeColor,
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

  return (
    <div
      className="
        flex flex-col justify-between h-full
        bg-white/10 backdrop-blur-xl
        border border-white/20 rounded-2xl
        px-4 py-3 shadow-lg
        hover:-translate-y-0.5 hover:shadow-xl hover:border-white/30
        transition-all duration-300
      "
    >
      <div className="flex items-center gap-2 mb-1">
        <div className={`p-2 rounded-lg shrink-0 shadow-md ${iconBg}`}>
          <Icon size={14} className="text-white" />
        </div>
        <p className="text-white/60 text-xs font-medium truncate">{label}</p>
      </div>

      <p className="text-white font-bold text-2xl leading-none">
        {animated.toLocaleString()}
      </p>

      <div className="flex items-center justify-between mt-1">
        {sub && <p className="text-white/40 text-xs">{sub}</p>}
        {badge && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${badgeColor}`}>
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
    { icon: FaUserPlus, label: "Total Signups", value: totalUsers, sub: "All time", iconBg: "bg-blue-600", badge: `+${todayUsers} today`, badgeColor: "bg-green-500/20 text-green-400" },
    { icon: FaChartLine, label: "Today Sessions", value: todaySessions, iconBg: "bg-violet-600" },
    { icon: FaClock, label: "Avg Session", value: avgSessionTime, sub: "minutes", iconBg: "bg-cyan-600" },
    { icon: FaBolt, label: "Active Events", value: liveEvents, iconBg: "bg-amber-500" },
    { icon: FaBell, label: "Notifications", value: 32, sub: "5 avg clicks", iconBg: "bg-pink-600" },
    { icon: FaEnvelope, label: "Auto Emails", value: 500, sub: "55 manual", iconBg: "bg-indigo-600" },
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
        {/* ROW 1 — Icon slug  +  KPI Cards strip                            */}
        {/* ================================================================ */}
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="
            bg-white/10 backdrop-blur-2xl border border-white/20
            rounded-3xl shadow-2xl px-6 py-5
            flex items-stretch gap-4
          "
        >
          {/* Page identity slug */}
          {/* KPI cards — equal-height grid filling remaining space */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {kpiCards.map((card, i) => (
              <motion.div key={i} variants={fadeUp} className="h-full">
                <KpiCard {...card} />
              </motion.div>
            ))}
          </div>
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
        {/* ROW 3 — Traffic Line Chart  (full width)                         */}
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

          {/* Rotating Carousel */}
          <motion.div
            variants={fadeUp}
            className="
              bg-white/10 backdrop-blur-xl border border-white/20
              rounded-2xl shadow-lg overflow-hidden
              flex flex-col
            "
          >
            <div className="px-5 pt-4 shrink-0">
              <h2 className="text-lg font-semibold text-white leading-tight">
                Platform Sections
              </h2>
              <p className="text-white/40 text-xs mt-0.5">
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
