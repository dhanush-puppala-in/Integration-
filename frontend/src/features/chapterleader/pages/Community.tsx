import React, { useState, useEffect, useRef } from "react";
import { IoMdFlame, IoIosCheckmarkCircle } from "react-icons/io";
import { FaGraduationCap, FaGlobeAmericas, FaUsers } from "react-icons/fa";
import { FaTicketAlt } from "react-icons/fa";
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
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Milky Way Subtle Gradient Band */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-transparent rotate-[15deg] scale-150 blur-[120px]" />

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
    title: "Galaxy Colonization",
    objective:
      "Rapidly expand the number of active interest groups and users in the multiverse.",
    theme: {
      stroke: "#22c55e",
      active: "#4ade80",
      bg: "rgba(34, 197, 94, 0.2)",
    },
    quests: [
      {
        id: "s1q1",
        name: "The Big Bang",
        task: "Be among the first 50 members of a newly created Interest Galaxy.",
        reward: "+300 IP",
        badge: "Galaxy Founder",
        progress: 12,
        total: 10,
        icon: <IoMdFlame />,
        lottieData: rotatingPlanetLottie,
      },
      {
        id: "q2",
        name: "Eco Warrior",
        task: "Attend 3 environment-related events.",
        reward: "+400 IP",
        progress: 1,
        total: 3,
        icon: <FaGlobeAmericas />,
        lottieData: earthLottie,
      },
      {
        id: "q3",
        name: "Skill Up",
        task: "Attend 5 technical workshops.",
        reward: "+500 IP",
        progress: 2,
        total: 5,
        icon: <FaGraduationCap />,
        lottieData: planetStarsLottie,
      },
    ],
  },
  {
    title: "Stage 2: Team Player",
    objective: "Contribute to the success of your community.",
    theme: {
      stroke: "#ef4444",
      active: "#f87171",
      bg: "rgba(239, 68, 68, 0.15)",
    },
    quests: [
      {
        id: "q4",
        name: "Event Lead",
        task: "Lead 1 community event with 20+ attendees.",
        reward: "+1000 IP",
        progress: 0,
        total: 1,
        icon: <FaUsers />,
        lottieData: redPlanetLottie,
      },
      {
        id: "q5",
        name: "Network Hub",
        task: "Invite 10 friends to join the community.",
        reward: "+800 IP",
        progress: 4,
        total: 10,
        icon: <FaTicketAlt />,
        lottieData: planetLoaderLottie,
      },
      {
        id: "s2q3",
        name: "Cross-Border Growth",
        task: "Invite 1 member from a Foreign University to a Community.",
        reward: "+2,500 IP",
        badge: "Global Ambassador",
        progress: 0,
        total: 1,
        icon: <FaGlobeAmericas />,
        lottieData: planetOrbitLottie,
      },
    ],
  },
  {
    title: "Interaction Engine",
    objective:
      "Convert 'Members' into 'Engaged Users' for high platform activity.",
    theme: {
      stroke: "#a855f7",
      active: "#c084fc",
      bg: "rgba(168, 85, 247, 0.2)",
    },
    quests: [
      {
        id: "s3q1",
        name: "The Global Commenter",
        task: "Leave 50 'High-Value' comments (min. 15 words) across 10 communities.",
        reward: "+1,200 IP",
        badge: "Multiverse Voice",
        progress: 14,
        total: 50,
        icon: <FaTicketAlt />,
        lottieData: earthLottie,
      },
      {
        id: "s3q2",
        name: "Thread Starter",
        task: "Start 5 discussion threads that each receive 20 unique replies.",
        reward: "+1,800 IP",
        badge: "Conversationalist Aura",
        progress: 1,
        total: 5,
        icon: <FaUsers />,
        lottieData: redPlanetLottie,
      },
      {
        id: "s3q3",
        name: "The Knowledge Bridge",
        task: "Answer 10 'Help Needed' questions in a non-founder community.",
        reward: "+2,500 IP",
        badge: "Community Helper",
        progress: 4,
        total: 10,
        icon: <FaGlobeAmericas />,
        lottieData: rotatingPlanetLottie,
      },
    ],
  },
  {
    title: "Influence Surge",
    objective:
      "Establish users as Nodes of Authority for global brand expert status.",
    theme: {
      stroke: "#f97316",
      active: "#fb923c",
      bg: "rgba(249, 115, 22, 0.2)",
    },
    quests: [
      {
        id: "s4q1",
        name: "The Curator",
        task: "Post 5 high-quality resources that get 100+ total Saves.",
        reward: "+3,500 IP",
        badge: "Resource King",
        progress: 1,
        total: 5,
        icon: <FaGlobeAmericas />,
        lottieData: rotatingPlanetLottie,
      },
      {
        id: "s4q2",
        name: "The Global Stitcher",
        task: "Facilitate a follow-exchange between 20 people from 10 universities.",
        reward: "+4,000 IP",
        badge: "Global Networker Skin",
        progress: 3,
        total: 20,
        icon: <FaUsers />,
      },
      {
        id: "s4q3",
        name: "Community Event Host",
        task: "Organize and host 1 Virtual 'AMA' with at least 30 live attendees.",
        reward: "+5,500 IP",
        badge: "Rising Influencer",
        progress: 0,
        total: 1,
        icon: <FaTicketAlt />,
      },
    ],
  },
];

const CommunityPage: React.FC = () => {
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
      { threshold: 0.3, rootMargin: "-100px 0px -40% 0px" },
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
      <StickyHeader currentStage={currentStage} label="Guild Portal" />

      {/* --- MISSION MAP --- */}
      <div className="w-full flex flex-col items-center pb-64 pt-12 relative flex-1">
        {STAGES.map((stage, sIdx) => (
          <div
            key={stage.title}
            ref={(el) => {
              if (el) sectionRefs.current[sIdx] = el;
            }}
            data-stage-idx={sIdx}
            className="w-full flex flex-col items-center mb-32"
          >
            <div className="mb-16 flex flex-col items-center text-center px-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-0.5 w-12 bg-white/5" />
                <span className="text-[11px] font-black text-white px-3 py-1 bg-white/5 rounded-full tracking-[0.3em] uppercase">
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
                      <div className="absolute top-[67.5px] left-1/2 -translate-x-1/2 w-64 h-[400px] pointer-events-none opacity-30 z-0">
                        <svg
                          className="w-full h-full overflow-visible"
                          viewBox="0 0 100 100"
                        >
                          <path
                            d={
                              isEven
                                ? "M 50 -5 Q 0 50 50 115"
                                : "M 50 -5 Q 100 50 50 115"
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
                          absolute z-[100] w-[min(350px,94vw)] opacity-0 pointer-events-none 
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

                          {/* Reward Section */}
                          <div className="mt-auto pt-6 border-t border-white/5 flex items-end justify-between gap-6">
                            <div className="flex flex-col text-left min-w-0 pb-1">
                              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1.5 whitespace-nowrap opacity-80">
                                Reward
                              </span>
                              <span className="text-yellow-400 font-black text-sm leading-none">
                                {quest.reward}
                              </span>
                            </div>
                            {quest.badge && (
                              <div className="flex-shrink-0 px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-xl">
                                <span className="text-green-500 font-black text-[10px] uppercase block">
                                  {quest.badge}
                                </span>
                              </div>
                            )}
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
    </div>
  );
};

export default CommunityPage;
