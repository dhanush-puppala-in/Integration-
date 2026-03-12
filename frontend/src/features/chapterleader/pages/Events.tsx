import React, { useState, useEffect, useRef } from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import {
  FaTicketAlt,
  FaStar,
  FaShareAlt,
  FaUserFriends,
  FaQrcode,
  FaProjectDiagram,
  FaUsers,
  FaGlobeAmericas,
  FaMoneyBillWave,
  FaHandshake,
  FaCrown,
} from "react-icons/fa";
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
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/5 to-transparent rotate-12 scale-150 blur-[100px]" />
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
    title: "Participant Orbit",
    objective: "Mastering the platform’s event-tech (Ticketing & Scans).",
    theme: {
      stroke: "#22c55e",
      active: "#4ade80",
      bg: "rgba(34, 197, 94, 0.2)",
    },
    quests: [
      {
        id: "e1q1",
        name: "The Ticket Pioneer",
        task: "Purchase and check into 3 events using QR Scan.",
        reward: "+200 IP",
        badge: "Active Attendee",
        progress: 1,
        total: 3,
        icon: <FaTicketAlt />,
        lottieData: earthLottie,
      },
      {
        id: "s1q2",
        name: "The Digital Critic",
        task: "Leave 5 'Verified Reviews' (with photos) for events you attended.",
        reward: "+400 IP",
        progress: 2,
        total: 5,
        icon: <FaStar />,
        lottieData: planetOrbitLottie,
      },
      {
        id: "s1q3",
        name: "The Event Scout",
        task: "Share 5 upcoming events to your personal 'Stitch Feed'.",
        reward: "+500 IP",
        progress: 0,
        total: 5,
        icon: <FaShareAlt />,
        lottieData: planetStarsLottie,
      },
    ],
  },
  {
    title: "THE NETWORK PULSE (Growth)",
    objective: "Expanding your influence and building communities.",
    theme: {
      stroke: "#f59e0b",
      active: "#fbbf24",
      bg: "rgba(245, 158, 11, 0.2)",
    },
    quests: [
      {
        id: "s2q1",
        name: "The Viral Engine",
        task: "Refer 10 friends who purchase their first ticket through your link.",
        reward: "+1000 IP",
        progress: 4,
        total: 10,
        icon: <FaUserFriends />,
        lottieData: planetLoaderLottie,
      },
      {
        id: "s2q2",
        name: "The Access Master",
        task: "Use 'Priority Booking' to secure tickets for 2 high-demand events.",
        reward: "+800 IP",
        progress: 1,
        total: 2,
        icon: <FaCrown />,
        lottieData: redPlanetLottie,
      },
      {
        id: "s2q3",
        name: "The QR Ranger",
        task: "Complete 10 event check-ins to unlock the 'Event Veteran' badge.",
        reward: "+1200 IP",
        progress: 7,
        total: 10,
        icon: <FaQrcode />,
        lottieData: rotatingPlanetLottie,
      },
    ],
  },
  {
    title: "THE ARCHITECT ORBIT (Elite)",
    objective: "Mastering the event stack and driving massive results.",
    theme: {
      stroke: "#ef4444",
      active: "#f87171",
      bg: "rgba(239, 68, 68, 0.2)",
    },
    quests: [
      {
        id: "s3q1",
        name: "The Event Architect",
        task: "Coordinate with 3 different event organizers as an 'Assistant Promoter'.",
        reward: "+2500 IP",
        progress: 1,
        total: 3,
        icon: <FaProjectDiagram />,
        lottieData: earthLottie,
      },
      {
        id: "s3q2",
        name: "The Community Pillar",
        task: "Host a 'Stitch Meetup' within an event that attracts 20+ attendees.",
        reward: "+3000 IP",
        progress: 0,
        total: 1,
        icon: <FaUsers />,
        lottieData: planetOrbitLottie,
      },
      {
        id: "s3q3",
        name: "The Global Ambassador",
        task: "Drive ticket sales from 5 different cities using the global stitching network.",
        reward: "+5000 IP",
        progress: 1,
        total: 5,
        icon: <FaGlobeAmericas />,
        lottieData: planetStarsLottie,
      },
    ],
  },
  {
    title: "THE LEGENDARY VOID (Master)",
    objective: "The ultimate tier of event mastery.",
    theme: {
      stroke: "#a855f7",
      active: "#c084fc",
      bg: "rgba(168, 85, 247, 0.2)",
    },
    quests: [
      {
        id: "s4q1",
        name: "The Revenue Titan",
        task: "Generate $5000+ in total ticket revenue through your promoter link.",
        reward: "+10,000 IP",
        progress: 1250,
        total: 5000,
        icon: <FaMoneyBillWave />,
        lottieData: planetLoaderLottie,
      },
      {
        id: "s4q2",
        name: "The Sponsor's Ally",
        task: "Facilitate a successful brand deal for a major event.",
        reward: "+15,000 IP",
        progress: 0,
        total: 1,
        icon: <FaHandshake />,
        lottieData: redPlanetLottie,
      },
      {
        id: "e4q3",
        name: "Interstellar Festival",
        task: "1,000+ Attendees + 5 Clubs + ₹50,000 Revenue.",
        reward: "+30,000 IP",
        badge: "Event Overlord",
        progress: 0,
        total: 1,
        icon: <FaCrown />,
      },
    ],
  },
];

const Events: React.FC = () => {
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
    <div className="flex flex-col items-center min-h-screen text-white w-full relative overflow-x-hidden">
      <Starfield />

      {/* --- STICKY HEADER --- */}
      <StickyHeader currentStage={currentStage} label="Event Multiverse" />

      {/* --- MISSION MAP --- */}
      <div className="w-full flex flex-col items-center pb-64 pt-12 relative flex-1 max-w-2xl mx-auto">
        {STAGES.map((stage, sIdx) => (
          <div
            key={stage.title}
            ref={(el) => {
              if (el) sectionRefs.current[sIdx] = el;
            }}
            data-stage-idx={sIdx}
            className="w-full flex flex-col items-center mb-16"
          >
            <div className="mb-16 flex flex-col items-center text-center px-6">
              <h2 className="text-2xl font-black uppercase tracking-widest mb-1 text-gray-400">
                STAGE {sIdx + 1}
              </h2>
              <h3 className="text-4xl font-black uppercase tracking-tighter mb-3">
                {stage.title}
              </h3>
              <p className="max-w-md text-gray-500 text-sm font-medium italic">
                "{stage.objective}"
              </p>
            </div>

            <div className="w-full flex flex-col items-center relative py-10">
              {stage.quests.map((quest, qIdx) => {
                const isCompleted = quest.progress >= quest.total;
                const isEven = qIdx % 2 === 0;

                return (
                  <div
                    key={quest.id}
                    className="relative mb-52 flex items-center justify-center w-full group"
                  >
                    {/* Curved Dotted Connecting Line (Larger Gap) */}
                    {qIdx < stage.quests.length - 1 && (
                      <div className="absolute top-[120px] left-1/2 -translate-x-1/2 w-64 h-52 pointer-events-none opacity-20 z-0">
                        <svg
                          className="w-full h-full overflow-visible"
                          viewBox="0 0 100 100"
                        >
                          <path
                            d={
                              isEven
                                ? "M 50 0 Q 0 50 50 100"
                                : "M 50 0 Q 100 50 50 100"
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

                          <div className="flex flex-col gap-2 items-start">
                            <div className="flex justify-between items-center w-full">
                              <span className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">
                                Progress
                              </span>
                              <span className="text-white font-black text-xs">
                                {quest.progress} / {quest.total}
                              </span>
                            </div>
                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
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
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1.5 whitespace-nowrap opacity-80">
                                Reward
                              </span>
                              <span className="text-yellow-400 font-black text-sm leading-none mt-0.5">
                                {quest.reward}
                              </span>
                            </div>
                            <button className="flex-shrink-0 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_8px_16px_-4px_rgba(37,99,235,0.4)] active:scale-95">
                              Master
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

        {/* --- STACK MULTIPLIER LEGEND --- */}
        <div className="mt-20 w-full max-w-lg p-8 bg-black/40 border border-white/10 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full" />
          <h2 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
            <FaProjectDiagram className="text-purple-500" /> Stack Multipliers
          </h2>
          <div className="space-y-4">
            {[
              {
                level: "Solo Event",
                desc: "1 Club Only",
                mult: "1x",
                color: "text-gray-400",
              },
              {
                level: "Cluster Event",
                desc: "3+ Clubs",
                mult: "1.5x",
                color: "text-blue-400",
              },
              {
                level: "Multiverse Event",
                desc: "2+ Universities",
                mult: "3x",
                color: "text-purple-400",
              },
              {
                level: "Sponsored Event",
                desc: "Club + Brand",
                mult: "5x",
                color: "text-orange-400",
              },
            ].map((m) => (
              <div
                key={m.level}
                className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5"
              >
                <div>
                  <span
                    className={`block text-xs font-black uppercase tracking-tight ${m.color}`}
                  >
                    {m.level}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">
                    {m.desc}
                  </span>
                </div>
                <span className="text-xl font-black text-white">{m.mult}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
