import React, { useState, useEffect, useRef } from "react";
import { IoIosCheckmarkCircle, IoMdFlame } from "react-icons/io";
import {
  FaGlobeAmericas,
  FaComments,
  FaUsers,
  FaChartLine,
  FaProjectDiagram,
  FaUserTie,
  FaPassport,
  FaMoneyBillWave,
  FaTicketAlt,
  FaHandshake,
  FaMedal,
  FaCrown,
} from "react-icons/fa";
import { GiGalaxy } from "react-icons/gi";
import CircularProgress from "../components/CircularProgress";
import image from "../../../assets/image.png";
import StickyHeader from "../components/StickyHeader";

// Lottie Animations
import earthLottie from "../../../assets/Earth globe rotating with Seamless loop animation.json";
import planetOrbitLottie from "../../../assets/Planet Orbit.json";
import planetStarsLottie from "../../../assets/Planet and stars.json";
import planetLoaderLottie from "../../../assets/Planet laoder.json";
import redPlanetLottie from "../../../assets/Red Planet.json";
import rotatingPlanetLottie from "../../../assets/Rotating Planet Loader.json";

const Starfield = () => {
  const stars = [...Array(450)].map((_, i) => {
    // Logic to create a "Milky Way" diagonal density
    const isInBand = Math.random() > 0.6;

    return {
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * (isInBand ? 1.8 : 1.2) + 0.3,
      opacity: Math.random() * (isInBand ? 0.9 : 0.5) + 0.1,
      delay: `${Math.random() * 8}s`,
      duration: `${Math.random() * 5 + 3}s`,
      color: ["#ffffff", "#e0f2fe", "#fef3c7", "#fae8ff"][
        Math.floor(Math.random() * 4)
      ],
      glow: isInBand && Math.random() > 0.8,
    };
  });

  const nebulas = [...Array(8)].map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 600 + 300,
    color: [
      "rgba(59, 130, 246, 0.08)",
      "rgba(147, 51, 234, 0.08)",
      "rgba(34, 197, 94, 0.04)",
      "rgba(249, 115, 22, 0.04)",
    ][Math.floor(Math.random() * 4)],
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none ">
      {/* Milky Way Subtle Gradient Band */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-transparent rotate-12 scale-150 blur-[100px]" />

      {/* Nebula Glows */}
      {nebulas.map((neb) => (
        <div
          key={`neb-${neb.id}`}
          className="absolute rounded-full blur-[150px]"
          style={{
            top: neb.top,
            left: neb.left,
            width: neb.size,
            height: neb.size,
            backgroundColor: neb.color,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full animate-pulse"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            backgroundColor: star.color,
            animationDelay: star.delay,
            animationDuration: star.duration,
            boxShadow: star.glow ? `0 0 10px ${star.color}` : "none",
          }}
        />
      ))}
    </div>
  );
};

// --- Types ---
interface Quest {
  id: string;
  name: string;
  task: string;
  reward: string;
  badge?: string;
  progress: number;
  total: number;
  isCompleted?: boolean;
  isRewardClaimed?: boolean;
  icon: React.ReactNode;
  lottieData?: any;
}

interface Stage {
  title: string;
  objective: string;
  quests: Quest[];
  theme: {
    stroke: string;
    active: string;
    bg: string;
  };
}

const ORBIT_THEMES = [
  { stroke: "#22c55e", active: "#4ade80", bg: "rgba(34, 197, 94, 0.2)" }, // Foundation Orbit
  { stroke: "#3b82f6", active: "#60a5fa", bg: "rgba(59, 130, 246, 0.2)" }, // Growth Orbit
  { stroke: "#a855f7", active: "#c084fc", bg: "rgba(168, 85, 247, 0.2)" }, // Engagement Orbit
  { stroke: "#f97316", active: "#fb923c", bg: "rgba(249, 115, 22, 0.2)" }, // The Multiverse Orbit
  { stroke: "#ec4899", active: "#f472b6", bg: "rgba(236, 72, 153, 0.2)" }, // The Event Stack
  { stroke: "#eab308", active: "#facc15", bg: "rgba(234, 179, 8, 0.2)" }, // Domination Orbit
];

const DEFAULT_THEME = { stroke: "#22c55e", active: "#4ade80", bg: "rgba(34, 197, 94, 0.2)" };

import { chapterLeaderApi } from "../../../api/chapterLeader";

const Club: React.FC = () => {
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [hoveredQuestId, setHoveredQuestId] = useState<string | null>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const [stages, setStages] = useState<Stage[]>([]); // Start with empty array for dynamic rendering
  const [dbLoading, setDbLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const handleClaimReward = async (questId: string) => {
    try {
      setClaimingId(questId);
      const res = await chapterLeaderApi.claimQuestReward(questId);
      if (res.data?.success || res.status === 200 || res.status === 201) {
        setStages(prevStages => prevStages.map(stage => ({
          ...stage,
          quests: stage.quests.map(quest => 
            quest.id === questId ? { ...quest, isRewardClaimed: true, isCompleted: true } : quest
          )
        })));
      }
    } catch (error) {
      console.error("Failed to claim reward:", error);
    } finally {
      setClaimingId(null);
    }
  };

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await chapterLeaderApi.getQuestsProgress('club');
        console.log(res)
        if (res.data?.success && res.data.data?.orbits) {
          const mappedStages = res.data.data.orbits.map((o: any, index: number) => {
             const theme = ORBIT_THEMES[index % ORBIT_THEMES.length] || DEFAULT_THEME;
             return {
               title: o.orbit?.title || `Orbit ${o.orbit?.id || index + 1}`,
               objective: o.orbit?.description || o.orbit?.subTitle || "",
               theme: theme,
               quests: o.quests.map((q: any, qIdx: number) => {

                  const currentVal = Array.isArray(q.current) && q.current.length > 0 
                    ? q.current[0]?.value || 0 
                    : (typeof q.current === 'number' ? q.current : 0);
                    
                  const targetVal = Array.isArray(q.target) && q.target.length > 0 
                    ? q.target[0] 
                    : (typeof q.target === 'number' ? q.target : q.numOfEntities || 1);

                  return {
                    id: q.questId || String(qIdx),
                    name: q.title || `Quest ${qIdx + 1}`,
                    task: q.description || "",
                    reward: q.ip ? `+${q.ip} IP` : "+100 IP",
                    progress: currentVal,
                    total: targetVal,
                    isCompleted: q.isCompleted || false,
                    isRewardClaimed: q.isRewardClaimed || false,
                    icon: <FaMedal />,
                    lottieData: null
                  };
               })
             };
          });
          if (mappedStages.length > 0) {
             setStages(mappedStages);
          }
        }
      } catch (err) {
        console.error("Failed to fetch quests progress", err);
      } finally {
        setDbLoading(false);
      }
    };
    fetchProgress();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(
              entry.target.getAttribute("data-stage-idx") || "0",
            );
            setActiveStageIdx(idx);
          }
        });
      },
      { threshold: 0.2, rootMargin: "-100px 0px -40% 0px" },
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [stages]);

  const currentStage = stages[activeStageIdx] || stages[0];

  if (dbLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-[#0c121d] tracking-widest text-sm uppercase">
        Initializing Orbit...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen text-white w-full relative">
      {/* Mobile-only Status Bar AT THE TOP - NOW STICKY */}

      <div className="fixed inset-0 z-0 pointer-events-none" />
      <div className="fixed inset-0 z-0 pointer-events-none" />
      <Starfield />

      {/* --- STICKY HEADER --- */}
      <StickyHeader currentStage={currentStage} label="Club Guild" />
      {/* --- MISSION MAP --- */}
      <div className="w-full flex flex-col items-center pb-64 pt-12 relative flex-1">
        {stages.map((stage, sIdx) => (
          <div
            key={stage.title}
            ref={(el) => {
              if (el) sectionRefs.current[sIdx] = el;
            }}
            data-stage-idx={sIdx}
            className="w-full flex flex-col items-center mb-16"
          >
            {/* Stage Title Section */}
            <div className="mb-16 flex flex-col items-center text-center px-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-0.5 w-12 bg-white/5" />
                <span className="text-[11px] font-black tracking-[0.5em] text-gray-500 uppercase">
                  Stage {sIdx + 1}
                </span>
                <div className="h-0.5 w-12 bg-white/5" />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-3 underline decoration-white/5 underline-offset-8 decoration-4">
                {stage.title}
              </h2>
              <p className="max-w-md text-gray-500 text-sm italic font-medium">
                "{stage.objective}"
              </p>
            </div>

            {/* Quests Path */}
            <div className="w-full max-w-4xl flex flex-col items-center gap-24 relative">
              {stage.quests.map((quest, qIdx) => {
                const isCompleted = quest.isCompleted || quest.progress >= quest.total;
                const isEven = qIdx % 2 === 0;

                return (
                  <div
                    key={quest.id}
                    className="relative mb-52 flex items-center justify-center w-full group"
                  >
                    {/* Curved Dotted Connecting Line (Gapless) */}
                    {qIdx < stage.quests.length - 1 && (
                      <div className="absolute top-[67.5px] left-1/2 -translate-x-1/2 w-64 h-[450px] pointer-events-none opacity-30 z-0">
                        <svg
                          className="w-full h-full overflow-visible"
                          viewBox="0 0 100 100"
                        >
                          <path
                            d={
                              isEven
                                ? "M 50 -10 Q 0 50 50 105"
                                : "M 50 -10 Q 100 50 50 105"
                            }
                            fill="transparent"
                            stroke="white"
                            strokeWidth="1"
                            strokeDasharray="2 2"
                          />
                        </svg>
                      </div>
                    )}

                    {/* Quest Node Interaction Area (Stationary Parent) */}
                    <div
                      className="relative z-30 flex items-center justify-center"
                      onMouseEnter={() => setHoveredQuestId(quest.id)}
                      onMouseLeave={() => setHoveredQuestId(null)}
                    >
                      {/* Circle Node (Moves on Hover - Desktop Only) */}
                      <div
                        className={`relative z-20 flex-shrink-0 transition-all duration-700 ease-out cursor-help
                          ${
                            hoveredQuestId === quest.id
                              ? isEven
                                ? "md:-translate-x-[160px]"
                                : "md:translate-x-[160px]"
                              : ""
                          }
                        `}
                      >
                        <div
                          className={`relative transition-all duration-500 ${isCompleted ? "scale-100" : "scale-110 active:scale-95"}`}
                        >
                          <CircularProgress
                            value={quest.progress}
                            total={quest.total}
                            size={135}
                            strokeWidth={8}
                            imageSrc={image}
                            lottieData={quest.lottieData}
                            isCompleted={isCompleted}
                          />

                          {/* Pin Point Indicator */}
                          <div
                            className={`absolute -bottom-1 -right-1 w-10 h-10 bg-[#0c121d] border border-white/20 rounded-xl flex items-center justify-center text-white text-3xl shadow-2xl transition-all duration-500 z-[60] 
                              ${
                                hoveredQuestId === quest.id
                                  ? "scale-125 border-white/50 bg-white/10 opacity-100"
                                  : "scale-100 opacity-60"
                              }
                            `}
                            style={{ color: stage.theme.stroke }}
                          >
                            {quest.icon}
                          </div>
                        </div>
                      </div>

                      {/* Quest Detail Card (Sliding Reveal) */}
                      <div
                        className={`
                          absolute z-[100] w-[min(350px,90vw)] opacity-0 pointer-events-none 
                          ${hoveredQuestId === quest.id ? "opacity-100 pointer-events-auto" : ""}
                          transition-all duration-700 ease-out
                          ${isEven ? "md:left-1/2 md:ml-[-40px]" : "md:right-1/2 md:mr-[-40px]"}
                          left-1/2 -translate-x-1/2 md:translate-x-0
                          top-1/2 -translate-y-1/2
                        `}
                      >
                        <div className="bg-[#0c121d] border-2 border-white/10 rounded-[2rem] p-5 sm:p-6 shadow-[0_40px_80px_rgba(0,0,0,0.8)] relative">
                          {/* Triangle Pointer - Hidden on Mobile */}
                          <div
                            className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#0c121d] border-l-2 border-b-2 border-white/10 rotate-45
                            ${isEven ? "-left-[7px]" : "left-auto -right-[7px] rotate-[225deg]"}
                          `}
                          />

                          <div className="flex items-center gap-4 mb-2 text-left">
                            <span className="text-white font-black text-base uppercase tracking-tight">
                              {quest.name}
                            </span>
                            {isCompleted && (
                              <IoIosCheckmarkCircle className="text-green-500 text-lg" />
                            )}
                          </div>
                          <p className="text-gray-400 text-[13px] leading-relaxed mb-4 text-left">
                            {quest.task}
                          </p>

                          {/* Progress Stats */}
                          <div className="flex flex-col gap-2 items-start">
                            <div className="flex items-center justify-between w-full">
                              <span className="text-gray-500 font-bold text-[10px] uppercase tracking-wider">
                                Progress
                              </span>
                              <span className="text-white font-black text-xs">
                                {quest.progress} / {quest.total}
                              </span>
                            </div>
                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mt-1">
                              <div
                                className="h-full transition-all duration-1000"
                                style={{
                                  width: `${Math.min((quest.progress / quest.total) * 100, 100)}%`,
                                  backgroundColor: isCompleted
                                    ? stage.theme.stroke
                                    : stage.theme.active,
                                }}
                              />
                            </div>
                          </div>

                          {/* Reward Badge */}
                          <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex flex-col text-left">
                              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                                Reward
                              </span>
                              <span className="text-yellow-400 font-black text-sm">
                                {quest.reward}
                              </span>
                            </div>
                            
                            <div className="shrink-0 flex items-center justify-center pointer-events-auto z-10">
                              {isCompleted ? (
                                quest.isRewardClaimed ? (
                                  <div className="px-5 py-2.5 bg-green-500/20 text-green-400 border border-green-500/30 text-[11px] font-black uppercase rounded-xl shadow-lg flex items-center justify-center gap-1.5 min-w-[100px]">
                                    <IoIosCheckmarkCircle className="text-sm" /> Claimed
                                  </div>
                                ) : (
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); handleClaimReward(quest.id); }}
                                    disabled={claimingId === quest.id}
                                    className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black text-[11px] font-black uppercase rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 min-w-[100px]"
                                  >
                                    {claimingId === quest.id ? "..." : "Claim IP"}
                                  </button>
                                )
                              ) : (
                                <div className="px-5 py-2.5 bg-white/5 text-gray-400 border border-white/10 text-[11px] font-black uppercase rounded-xl shadow-none min-w-[100px] text-center">
                                  In Progress
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Decorative background stardust */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 right-1/2 w-[500px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full" />
      </div>
    </div>
  );
};

export default Club;
