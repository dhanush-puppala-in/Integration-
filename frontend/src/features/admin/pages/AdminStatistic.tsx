import React from "react";
import { motion, type Variants } from "framer-motion";

import DoughnutCard from "../components/Charts/DoughnutCard";
import LineChartCard from "../components/Charts/LineChartCard";
import StatsCarousel from "../Carousel/DashboardCarousel";

import StarfieldScene2D from "../components/animation/StarfieldScene2D";
import Sidebar from "../components/Sidebar/Sidebar";
/* -------------------------------------------------------------------------- */
/*                              ANIMATION VARIANTS                            */
/* -------------------------------------------------------------------------- */

const pageMotion: Variants = {
  initial: { opacity: 0, y: 20, filter: "blur(12px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const mainCardMotion: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 30 },
  animate: { opacity: 1, scale: 1, y: 0 },
};

const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.55,
    },
  },
};

const chartCard: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
};

const carouselMotion: Variants = {
  initial: { opacity: 0, y: 25, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const sidebarMotion: Variants = {
  initial: { opacity: 0, x: -30, filter: "blur(10px)" },
  animate: { opacity: 1, x: 0, filter: "blur(0px)" },
};

/* -------------------------------------------------------------------------- */
/*                               ADMIN STATISTICS                             */
/* -------------------------------------------------------------------------- */

const AdminStatistic: React.FC = () => {
  return (
    <motion.div
      variants={pageMotion}
      initial="initial"
      animate="animate"
      transition={{ duration: 1.1, ease: "easeOut", delay: 0.05 }}
      className="relative w-full min-h-screen text-white bg-black overflow-x-hidden"
    >
      {/* 🌌 STARFIELD BACKGROUND */}
      <StarfieldScene2D />

      <div className="relative z-10 p-6 flex flex-col lg:flex-row gap-8 max-w-[1700px] mx-auto">
        {/* SIDEBAR */}
        <motion.div
          variants={sidebarMotion}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.35 }}
          className="w-full lg:w-80 shrink-0"
        >
          <Sidebar />
        </motion.div>

        {/* MAIN CONTENT */}
        <motion.div
          variants={mainCardMotion}
          initial="initial"
          animate="animate"
          transition={{
            duration: 1,
            ease: [0.34, 1.4, 0.64, 1],
            delay: 0.45,
          }}
          className="flex-1 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-8 flex flex-col gap-10 min-w-0"
        >
          {/* PAGE TITLE */}
          <h1 className="text-4xl font-bold mb-2">Admin Statistics Overview</h1>
          {/* DONUT CHARTS */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <motion.div variants={chartCard}>
              <DoughnutCard type="SESSION_DURATION" title="Total Sessions" />
            </motion.div>

            <motion.div variants={chartCard}>
              <DoughnutCard
                type="TIME_OF_DAY"
                title="Sessions by Time of Day"
              />
            </motion.div>
          </motion.div>

          {/* LINE CHARTS */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <motion.div variants={chartCard}>
              <LineChartCard title="Traffic" />
            </motion.div>

            <motion.div variants={chartCard}>
              <LineChartCard title="Signups" />
            </motion.div>
          </motion.div>

          {/* CAROUSEL */}
          <motion.div
            variants={carouselMotion}
            initial="initial"
            animate="animate"
            transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
            className="mt-2"
          >
            <StatsCarousel />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminStatistic;
