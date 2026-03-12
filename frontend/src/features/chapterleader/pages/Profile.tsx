import React from "react";
import { IoMdSettings, IoMdTrendingUp, IoMdRocket } from "react-icons/io";
import {
  FaGraduationCap,
  FaGlobeAmericas,
  FaUsers,
  FaMedal,
  FaBell,
  FaCheckCircle,
} from "react-icons/fa";
import { GiCrystalCluster } from "react-icons/gi";

import ProfileWidget from "../../../layout/rightsidebar/ProfileWidget";
import StatisticWidget from "../../../layout/rightsidebar/StatisticWidget";
import DailyQuestWidget from "../../../layout/rightsidebar/DailyQuestWidget";

const Profile: React.FC = () => {
  return (
    <div className="flex flex-col items-center min-h-screen text-white w-full relative bg-[#070b14] p-6 md:p-14 ">
      {/* Professional Top Gradient */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />

      {/* --- PROFESSIONAL PROFILE HEADER --- */}
      <div className="w-full flex flex-col items-center pt-6 md:pt-10 pb-16 px-6 relative z-10 border-b border-white/5">
        <div className="w-full lg:max-w-[1700px] flex flex-col md:flex-row items-stretch gap-12 xl:gap-20">
          {/* Section 1: Avatar & Quick Actions */}
          <div className="flex-1 flex flex-col items-center gap-8 shrink-0">
            <div className="relative group">
              <div className="w-44 h-44 md:w-56 md:h-56 rounded-3xl overflow-hidden border-2 border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] bg-[#0c121d] p-1 transition-all duration-500 group-hover:border-blue-500/30 group-hover:shadow-[0_40px_80px_-16px_rgba(37,99,235,0.2)]">
                <div className="w-full h-full rounded-[20px] overflow-hidden bg-slate-900/50 flex items-center justify-center relative">
                  <FaUsers className="text-6xl text-blue-500/20" />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent" />
                </div>
              </div>
              {/* Professional Tier Badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#0c121d] px-5 py-2.5 rounded-xl border border-blue-500/20 shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] whitespace-nowrap">
                    Elite Node
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col gap-3 w-full max-w-[240px]">
              <button className="flex items-center justify-center gap-3 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_12px_24px_-6px_rgba(37,99,235,0.4)] active:scale-95 w-full font-black">
                Edit Profile
              </button>
              <button className="flex items-center justify-center gap-3 px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all w-full font-black">
                <IoMdSettings className="text-sm" />
                Settings
              </button>
            </div>
          </div>

          {/* Section 2: Bio, Professional DNA & Core Metrics */}
          <div className="flex-1 flex flex-col justify-between pt-2">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] font-black text-blue-500 tracking-[0.3em] uppercase">
                  Executive Profile
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              </div>

              <h1 className="text-4xl xl:text-5xl font-black tracking-tight mb-5 text-white">
                Felix Multiverse
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                  <FaGraduationCap className="text-slate-400 text-sm" />
                  <span className="text-[11px] font-bold text-slate-300">
                    Stanford Graduate
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                  <FaGlobeAmericas className="text-slate-400 text-sm" />
                  <span className="text-[11px] font-bold text-slate-300">
                    Global Node
                  </span>
                </div>
              </div>
            </div>

            {/* Core Metrics Grid - Unified in Section 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-white/5 w-full mt-auto">
              <div className="flex flex-col items-center md:items-start group cursor-default">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3 group-hover:text-blue-500 transition-colors">
                  Portfolio
                </span>
                <div className="flex items-center gap-2 text-blue-400">
                  <GiCrystalCluster className="text-xl shrink-0" />
                  <span className="text-xl xl:text-2xl font-black text-white whitespace-nowrap leading-none">
                    12,850
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center md:items-start group cursor-default">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3 group-hover:text-slate-300 transition-colors">
                  Affiliations
                </span>
                <div className="flex items-center gap-2 text-slate-400">
                  <FaUsers className="text-xl shrink-0" />
                  <span className="text-xl xl:text-2xl font-black text-white whitespace-nowrap leading-none">
                    24
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center md:items-start group cursor-default">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3 group-hover:text-emerald-500 transition-colors">
                  Growth
                </span>
                <div className="flex items-center gap-2 text-emerald-500">
                  <IoMdTrendingUp className="text-xl shrink-0" />
                  <span className="text-xl xl:text-2xl font-black text-white whitespace-nowrap leading-none">
                    92%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Analytical Intelligence (Integrated Widgets) */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="w-full">
              <ProfileWidget />
            </div>
            <div className="w-full">
              <StatisticWidget />
            </div>
            <div className="w-full">
              <DailyQuestWidget />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:max-w-[1700px] grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 pb-32 relative z-10 mt-16">
        {/* Main Content Area */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          {/* Verified Credentials Section */}
          <div className="bg-[#0c121d] border border-white/5 rounded-2xl p-8 overflow-hidden relative">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
                  <FaMedal className="text-blue-500" />
                </div>
                <h2 className="text-lg font-black uppercase tracking-tight">
                  Verified Credentials
                </h2>
              </div>
              <button className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                Audit History
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  name: "Founding Member",
                  level: "Elite",
                  icon: <IoMdRocket />,
                },
                {
                  name: "Data Architect",
                  level: "Senior",
                  icon: <GiCrystalCluster />,
                },
                {
                  name: "Global Scout",
                  level: "Advanced",
                  icon: <FaGlobeAmericas />,
                },
                {
                  name: "Top Contributor",
                  level: "Expert",
                  icon: <FaUsers />,
                },
              ].map((badge) => (
                <div
                  key={badge.name}
                  className="flex flex-col items-center p-6 bg-black/40 border border-white/5 rounded-2xl hover:border-blue-500/30 transition-all group"
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4 bg-white/5 text-slate-400 group-hover:bg-blue-600/10 group-hover:text-blue-400 transition-all duration-300">
                    {badge.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white mb-1">
                    {badge.name}
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">
                    {badge.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Analytical Performance Graph placeholder */}
          <div className="bg-[#0c121d] border border-white/5 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-lg font-black uppercase tracking-tight">
                Impact Analysis
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />{" "}
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    Active
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />{" "}
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    Baseline
                  </span>
                </div>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-6 px-2">
              {[35, 62, 48, 85, 55, 78, 92, 65, 70, 88].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-4"
                >
                  <div
                    className="w-full bg-slate-800/40 rounded-t-sm relative group cursor-pointer"
                    style={{ height: `${h}%` }}
                  >
                    <div
                      className="absolute bottom-0 left-0 w-full bg-blue-600 transition-all duration-700 rounded-t-sm"
                      style={{ height: `${h * 0.9}%` }}
                    />
                    {/* Hover Tooltip Overlay */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-600 text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-xl">
                      {h}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full flex justify-between mt-6 px-1">
              {[
                "JAN",
                "FEB",
                "MAR",
                "APR",
                "MAY",
                "JUN",
                "JUL",
                "AUG",
                "SEP",
                "OCT",
              ].map((m) => (
                <span
                  key={m}
                  className="text-[8px] font-bold text-slate-600 tracking-widest uppercase"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="xl:col-span-4 flex flex-col gap-8">
          {/* Status Card */}
          <div className="bg-[#0c121d] border border-white/5 rounded-2xl p-8 relative overflow-hidden group">
            {/* Subtle Blue Glow Overlay */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl pointer-events-none" />

            <h2 className="text-base font-black uppercase tracking-widest text-white mb-8 flex items-center justify-between">
              <span className="flex items-center gap-3">
                <FaCheckCircle className="text-blue-500" /> Operational Status
              </span>
              <span className="text-[9px] text-blue-500 font-bold bg-blue-500/10 px-2 py-0.5 rounded">
                ONLINE
              </span>
            </h2>

            <div className="flex flex-col gap-7">
              {[
                {
                  node: "Galaxy Colonization",
                  status: "In Progress",
                  prog: 84,
                  active: true,
                },
                {
                  node: "Protocol Sync",
                  status: "Queued",
                  prog: 32,
                  active: false,
                },
                {
                  node: "Network Expansion",
                  status: "Verified",
                  prog: 100,
                  active: false,
                },
              ].map((s) => (
                <div key={s.node} className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-slate-300">
                    <span className={s.active ? "text-white" : ""}>
                      {s.node}
                    </span>
                    <span className="text-slate-500 font-black">{s.prog}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${s.prog === 100 ? "bg-emerald-500" : "bg-blue-600"}`}
                      style={{ width: `${s.prog}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-10 py-4 bg-blue-600 hover:bg-blue-500 transition-all border border-blue-400/20 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-[0_12px_24px_-8px_rgba(37,99,235,0.3)] active:scale-95">
              Request Node Upgrade
            </button>
          </div>

          {/* Profile Quote / Narrative */}
          <div className="bg-[#0c121d] border border-white/5 rounded-2xl p-8">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">
              Official Narrative
            </h2>
            <p className="text-slate-300 text-xs leading-relaxed font-medium">
              "Developing high-reliability AI infrastructures to optimize
              cross-functional communication within global interest sectors."
            </p>
            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xl font-black text-white">1,240</span>
                <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                  Global Node Follows
                </span>
              </div>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border border-[#070b14] overflow-hidden bg-slate-800"
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 25}`}
                      alt="follower"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0c121d] to-black border border-white/5 rounded-2xl p-5 flex items-center justify-between group cursor-pointer hover:border-blue-600/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-500">
                <FaBell />
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-white">
                  Notifications
                </span>
                <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                  3 New Signals
                </span>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
