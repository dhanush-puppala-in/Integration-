import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { IoIosCheckmarkCircle } from "react-icons/io";

import CircularProgress from "../components/CircularProgress";
import image from "../../../assets/image.png";
import StickyHeader from "../components/StickyHeader";

// Lottie Animations

export const formatTimeAgo = (dateString?: string | null): string => {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} secs ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hrs ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} d ago`;
};

export const formatTimeUntil = (dateString?: string | null): string => {
  if (!dateString) return "Soon";
  const lastUpdate = new Date(dateString);
  const nextUpdate = new Date(lastUpdate.getTime() + 3 * 60 * 60 * 1000); // 3 hours later
  const now = new Date();
  const diffInSeconds = Math.floor((nextUpdate.getTime() - now.getTime()) / 1000);
  
  if (diffInSeconds <= 0) return "Any moment now";
  
  if (diffInSeconds < 60) return `${diffInSeconds} secs`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} mins`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  const remainingMins = diffInMinutes % 60;
  return remainingMins > 0 ? `${diffInHours} hrs ${remainingMins} mins` : `${diffInHours} hrs`;
};

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
  overallProgress?: number;
  isCompleted?: boolean;
  isRewardClaimed?: boolean;
  icon: React.ReactNode;
  lottieData?: any;
  type?: string;
  lastUpdatedAt?: string;
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
import GlobalLoader from "../../../components/GlobalLoader";
import { FaMedal, FaUsers } from "react-icons/fa";

const Community: React.FC = () => {
  const { user, fetchChapterLeaderDetails } = useAuth();
  const { addToast } = useToast();
  const { details } = useSelector((state: RootState) => state.chapterLeader);
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [hoveredQuestId, setHoveredQuestId] = useState<string | null>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const [stages, setStages] = useState<Stage[]>([]); // Start with empty array for dynamic rendering
  const [dbLoading, setDbLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const handleClaimReward = async (questId: string) => {
    try {
      setClaimingId(questId);
      const res = await chapterLeaderApi.claimQuestReward(questId, (details?._id || user?.id || (user as any)?._id) as string);
      if (res.data?.success || res.status === 200 || res.status === 201) {
        setStages(prevStages => prevStages.map(stage => ({
          ...stage,
          quests: stage.quests.map(quest => 
            quest.id === questId ? { ...quest, isRewardClaimed: true, isCompleted: true } : quest
          )
        })));
        addToast("Reward claimed successfully!", "success");
        await fetchChapterLeaderDetails();
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
        const res = await chapterLeaderApi.getQuestsProgress('community');
        console.log(res)
        if (res.data?.success && res.data.data?.orbits) {
          const mappedStages = res.data.data.orbits.map((o: any, index: number) => {
             const theme = ORBIT_THEMES[index % ORBIT_THEMES.length] || DEFAULT_THEME;
             return {
               title: o.orbit?.title || `Orbit ${o.orbit?.id || index + 1}`,
               objective: o.orbit?.description || o.orbit?.subTitle || "",
               theme: theme,
               quests: o.quests.map((q: any, qIdx: number) => {
                  const type = q.type || "continuous";
                  let currentVal = 0;
                  let targetVal = 1;

                  if (type === "continuous") {
                    currentVal = q.overallProgress || 0;
                    targetVal = 100;
                  } else {
                    currentVal = q.value || 0;
                    targetVal = q.entityLimit || 1;
                  }

                  return {
                    id: q.questId || String(qIdx),
                    name: q.title || `Quest ${qIdx + 1}`,
                    task: q.description || "",
                    reward: q.ip ? `+${q.ip} IP` : "+100 IP",
                    progress: currentVal,
                    total: targetVal,
                    overallProgress: q.overallProgress || 0,
                    isCompleted: q.isCompleted || false,
                    isRewardClaimed: q.isRewardClaimed || false,
                    type: q.type || 'continuous',
                    lastUpdatedAt: q.lastUpdatedAt || null,
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
      { threshold: 0, rootMargin: "-15% 0px -80% 0px" },
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [stages]);

  const currentStage = stages[activeStageIdx] || stages[0];

  if (dbLoading) {
    return <GlobalLoader text="Initializing Orbit..." fullScreen={false} />;
  }

  if (stages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white w-full relative">
        <Starfield />
        <StickyHeader currentStage={undefined as any} label="Community Guild" />
        <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 text-center">
          <div className="w-24 h-24 mb-8 bg-white/5 rounded-full flex items-center justify-center border border-white/10 animate-pulse">
            <FaUsers className="text-5xl text-gray-500" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500">
            Sector Uncharted
          </h2>
          <p className="max-w-md text-gray-400 text-lg font-medium italic">
            "No community orbits have been mapped in this region. We're currently scanning for potential alliances and social hubs."
          </p>
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <span className="text-[10px] font-black tracking-[0.4em] text-gray-600 uppercase">
              Scanning for life forms
            </span>
          </div>
        </div>
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
      <StickyHeader currentStage={currentStage} label="Community Guild" />
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
                const isFullProgress = quest.progress >= quest.total && (quest.overallProgress || 0) >= 100;
                const isCompleted = quest.isCompleted || isFullProgress;
                const isEven = qIdx % 2 === 0;

                return (
                  <div
                    key={quest.id}
                    className={`relative mb-52 flex items-center justify-center w-full group ${hoveredQuestId === quest.id ? "z-[999]" : "z-10"}`}
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
                      className={`relative flex items-center justify-center ${hoveredQuestId === quest.id ? "z-[99]" : "z-30"}`}
                      onMouseEnter={() => setHoveredQuestId(quest.id)}
                      onMouseLeave={() => setHoveredQuestId(null)}
                    >
                      {/* INVISIBLE HOVER BRIDGE TO PREVENT MOUSELEAVE DROPOUT */}
                      {hoveredQuestId === quest.id && <div className="absolute w-[500px] h-[200px] z-0" />}
                      
                      {/* Circle Node (Moves on Hover - Desktop Only) */}
                      <div
                        className={`relative z-20 flex-shrink-0 transition-all duration-700 ease-out cursor-help
                          ${
                            hoveredQuestId === quest.id
                              ? isEven
                                ? "md:-translate-x-[120px]"
                                : "md:translate-x-[120px]"
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

                      <div
                        className={`
                          absolute z-[100] w-[380px] 
                          ${hoveredQuestId === quest.id ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
                          transition-all duration-700 ease-out
                          left-1/2 -translate-x-1/2 
                          ${
                            hoveredQuestId === quest.id
                              ? isEven
                                ? "md:translate-x-[calc(-50%+180px)]"
                                : "md:translate-x-[calc(-50%-180px)]"
                              : "md:translate-x-[-50%]"
                          }
                          top-1/2 -translate-y-1/2
                        `}
                      >
                        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-visible">
                          <div className="flex gap-4 items-start w-full relative z-10">
                            {/* Left Column: Info & Progress Bar */}
                            <div className="flex-1 flex flex-col gap-2 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-white font-bold text-sm uppercase tracking-tight truncate">
                                  {quest.name}
                                </span>
                                {isCompleted && (
                                  <IoIosCheckmarkCircle className="text-green-500 text-sm shrink-0" />
                                )}
                              </div>
                              <p className="text-gray-400 text-[11px] leading-snug line-clamp-2">
                                {quest.task}
                              </p>
                              
                              <div className="mt-1 w-full flex flex-col gap-1.5">
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                  <div
                                    className="h-full transition-all duration-1000"
                                    style={{
                                      width: `${Math.min((quest.progress / quest.total) * 100, 100)}%`,
                                      backgroundColor: isCompleted ? stage.theme.stroke : stage.theme.active,
                                      boxShadow: `0 0 10px ${isCompleted ? stage.theme.stroke : stage.theme.active}`,
                                    }}
                                  />
                                </div>
                                <div className="flex justify-between items-center text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                                  {quest.type === "continuous" ? (
                                    <span>{Math.floor(quest.overallProgress || 0)}%</span>
                                  ) : (
                                    <>
                                      <span>
                                        Progress: {Math.floor(quest.progress)}/{Math.floor(quest.total)}
                                      </span>
                                      <span>{Math.floor(quest.overallProgress || 0)}%</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Right Column: Reward & Action */}
                            <div className="w-[100px] shrink-0 flex flex-col items-center justify-between gap-3 pt-1 border-l border-white/5 pl-4">
                              <div className="flex flex-col items-center text-center">
                                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">
                                  Reward
                                </span>
                                <span className="text-yellow-400 font-black text-sm">
                                  {quest.reward}
                                </span>
                              </div>
                              
                              <div className="w-full">
                                {isCompleted ? (
                                  quest.isRewardClaimed ? (
                                    <div className="py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 text-[8px] font-black uppercase rounded-lg text-center">
                                      Claimed
                                    </div>
                                  ) : (
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); handleClaimReward(quest.id); }}
                                      disabled={claimingId === quest.id}
                                      className="w-full py-1.5 bg-yellow-500 text-black text-[8px] font-black uppercase rounded-lg hover:bg-yellow-400 transition-all active:scale-95"
                                    >
                                      {claimingId === quest.id ? "..." : "Claim"}
                                    </button>
                                  )
                                ) : (
                                  <div className="py-1.5 bg-white/5 text-gray-500 border border-white/5 text-[8px] font-black uppercase rounded-lg text-center">
                                    In Progress
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Timestamps Row - Full Width */}
                          <div className="flex justify-between items-center text-[8px] font-bold  mt-4 pt-3 border-t border-white/5 w-full">
                            <span className="text-blue-400/80">Last Updated: {formatTimeAgo(quest.lastUpdatedAt)}</span>
                            <span className="text-purple-400/80">Next Update: {formatTimeUntil(quest.lastUpdatedAt)}</span>
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

export default Community;
