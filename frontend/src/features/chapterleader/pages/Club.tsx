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

const STAGES: Stage[] = [
  {
    title: "Foundation Orbit",
    objective: "Establishing the first nodes of gravity on campus.",
    theme: {
      stroke: "#22c55e",
      active: "#4ade80",
      bg: "rgba(34, 197, 94, 0.2)",
    },
    quests: [
      {
        id: "c1q1",
        name: "Spark Ignition",
        task: "Get 1 club to 50 members.",
        reward: "+200 IP",
        progress: 50,
        total: 50,
        icon: <IoMdFlame />,
        lottieData: rotatingPlanetLottie,
      },
      {
        id: "c1q2",
        name: "Century Club",
        task: "Get 1 club to 100 members.",
        reward: "+400 IP",
        progress: 82,
        total: 100,
        icon: <FaMedal />,
        lottieData: earthLottie,
      },
      {
        id: "c1q3",
        name: "First Active Club",
        task: "1 club meets ACTIVE criteria (50+ members, 3 posts/week, 10 interactions/week).",
        reward: "+500 IP",
        progress: 0,
        total: 1,
        icon: <FaChartLine />,
        lottieData: planetOrbitLottie,
      },
      {
        id: "c1q4",
        name: "Triple Foundation",
        task: "3 clubs reach 50 members each.",
        reward: "+600 IP",
        progress: 1,
        total: 3,
        icon: <FaUsers />,
        lottieData: planetStarsLottie,
      },
    ],
  },
  {
    title: "Growth Orbit",
    objective: "Expanding the campus footprint and local density.",
    theme: {
      stroke: "#3b82f6",
      active: "#60a5fa",
      bg: "rgba(59, 130, 246, 0.2)",
    },
    quests: [
      {
        id: "c2q1",
        name: "Power 5",
        task: "5 clubs reach 100 members each.",
        reward: "+1000 IP",
        progress: 1,
        total: 5,
        icon: <FaUsers />,
        lottieData: planetLoaderLottie,
      },
      {
        id: "c2q2",
        name: "Strong Network",
        task: "10 clubs with 50+ members each.",
        reward: "+1500 IP",
        progress: 3,
        total: 10,
        icon: <FaProjectDiagram />,
        lottieData: redPlanetLottie,
      },
      {
        id: "c2q3",
        name: "Elite 10",
        task: "10 clubs reach 100+ members each.",
        reward: "+3000 IP",
        progress: 0,
        total: 10,
        icon: <FaCrown />,
        lottieData: rotatingPlanetLottie,
      },
      {
        id: "c2q4",
        name: "Member Milestone",
        task: "Reach 1,000 total club members across the university.",
        reward: "+2000 IP",
        progress: 420,
        total: 1000,
        icon: <GiGalaxy />,
      },
      {
        id: "c2q5",
        name: "Massive Expansion",
        task: "20 active clubs onboarded and verified.",
        reward: "+4000 IP",
        progress: 8,
        total: 20,
        icon: <FaGlobeAmericas />,
      },
    ],
  },
  {
    title: "Engagement Orbit",
    objective:
      "Generating the 'Atmosphere' through active, consistent discussion.",
    theme: {
      stroke: "#a855f7",
      active: "#c084fc",
      bg: "rgba(168, 85, 247, 0.2)",
    },
    quests: [
      {
        id: "c3q1",
        name: "Engagement Starter",
        task: "At least 50 total weekly posts across all clubs.",
        reward: "+800 IP",
        progress: 12,
        total: 50,
        icon: <FaComments />,
      },
      {
        id: "c3q2",
        name: "Interaction Boost",
        task: "200 weekly interactions (likes/comments) across all clubs.",
        reward: "+1200 IP",
        progress: 45,
        total: 200,
        icon: <FaChartLine />,
      },
      {
        id: "c3q3",
        name: "Retention Master",
        task: "Maintain 70% of members active weekly.",
        reward: "+2000 IP",
        progress: 55,
        total: 70,
        icon: <FaUsers />,
      },
      {
        id: "c3q4",
        name: "Weekly Momentum",
        task: "Meet engagement targets for 3 consecutive weeks.",
        reward: "+1500 IP",
        progress: 0,
        total: 3,
        icon: <FaChartLine />,
      },
    ],
  },
  {
    title: "The Multiverse Orbit",
    objective:
      "Dissolve local boundaries by importing global intelligence and exporting campus influence.",
    theme: {
      stroke: "#f97316",
      active: "#fb923c",
      bg: "rgba(249, 115, 22, 0.2)",
    },
    quests: [
      {
        id: "c4q1",
        name: "The Rift Opening",
        task: "Host 1 joint project with a club from a different University Galaxy.",
        reward: "+1,500 IP",
        badge: "Dimensional Traveler",
        progress: 0,
        total: 1,
        icon: <FaProjectDiagram />,
      },
      {
        id: "c4q2",
        name: "Multiverse Mesh",
        task: "Establish active partnerships with 3 different universities.",
        reward: "+3,000 IP",
        badge: "Multiverse Architect",
        progress: 0,
        total: 3,
        icon: <FaGlobeAmericas />,
      },
      {
        id: "c4q3",
        name: "Alien Arrival",
        task: "Onboard 1 Foreign University Student/Faculty as a Club Mentor.",
        reward: "+3,500 IP",
        badge: "Interstellar Host",
        progress: 0,
        total: 1,
        icon: <FaUserTie />,
      },
      {
        id: "c4q4",
        name: "Multiverse Citizen",
        task: "Ensure 10% of total club members are 'Migrants' from external/international unis.",
        reward: "+4,500 IP",
        badge: "Galaxy Citizen",
        progress: 2,
        total: 10,
        icon: <FaPassport />,
      },
    ],
  },
  {
    title: "The Event Stack",
    objective:
      "Transforming campus activity into a professional-grade revenue engine.",
    theme: {
      stroke: "#ec4899",
      active: "#f472b6",
      bg: "rgba(236, 72, 153, 0.2)",
    },
    quests: [
      {
        id: "c5q1",
        name: "The Foundation Stack",
        task: "Organize one event powered by 3 Collaborative Nodes.",
        reward: "+2,500 IP",
        progress: 0,
        total: 1,
        icon: <FaProjectDiagram />,
      },
      {
        id: "c5q2",
        name: "Revenue Catalyst",
        task: "Generate ₹10,000 in gross revenue from a single Event Stack.",
        reward: "+3,000 IP",
        progress: 2450,
        total: 10000,
        icon: <FaMoneyBillWave />,
      },
      {
        id: "c5q3",
        name: "Ticket Surge",
        task: "Successfully check in 500 unique ticket-holders at an event.",
        reward: "+2,500 IP",
        progress: 120,
        total: 500,
        icon: <FaTicketAlt />,
      },
      {
        id: "c5q4",
        name: "Brand Bridge",
        task: "Secure a Brand Partner who pays for a slot, stall, or sponsorship.",
        reward: "+4,000 IP",
        progress: 0,
        total: 1,
        icon: <FaHandshake />,
      },
    ],
  },
  {
    title: "Domination Orbit",
    objective:
      "Total university stabilization and the ultimate 'Titan' rewards.",
    theme: {
      stroke: "#eab308",
      active: "#facc15",
      bg: "rgba(234, 179, 8, 0.2)",
    },
    quests: [
      {
        id: "c6q1",
        name: "Ecosystem Builder",
        task: "10 active clubs + 1,000 members + 1 collaboration.",
        reward: "+5000 IP",
        progress: 0,
        total: 1,
        icon: <FaProjectDiagram />,
      },
      {
        id: "c6q2",
        name: "Regional Leader",
        task: "Rank in the Top 5 universities in your region's IP leaderboard.",
        reward: "+7000 IP",
        progress: 12,
        total: 5,
        icon: <FaMedal />,
      },
      {
        id: "c6q3",
        name: "National Architect",
        task: "20 clubs (100+ members) + 3 collaborations + 2 sponsored events.",
        reward: "+10,000 IP",
        progress: 0,
        total: 1,
        icon: <FaCrown />,
      },
      {
        id: "c6q4",
        name: "Interstellar Chapter",
        task: "25 clubs + 2,000 members + 5 collaborations + Revenue milestone hit.",
        reward: "Revenue Share Unlock",
        badge: "Ambassador Status",
        progress: 0,
        total: 1,
        icon: <GiGalaxy />,
      },
    ],
  },
];

const Club: React.FC = () => {
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [hoveredQuestId, setHoveredQuestId] = useState<string | null>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

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
  }, []);

  const currentStage = STAGES[activeStageIdx] || STAGES[0];

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
        {STAGES.map((stage, sIdx) => (
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
                const isCompleted = quest.progress >= quest.total;
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
                          <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                            <div className="flex flex-col text-left">
                              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                                Reward
                              </span>
                              <span className="text-yellow-400 font-black text-sm">
                                {quest.reward}
                              </span>
                            </div>
                            <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black uppercase rounded-xl transition-all shadow-lg active:scale-95">
                              Start
                            </button>
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
