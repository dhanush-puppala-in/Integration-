import React, { useState } from "react";
import StickyHeader from "../components/StickyHeader";

const Starfield = () => {
  const stars = [...Array(300)].map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.7 + 0.3,
    delay: `${Math.random() * 5}s`,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full animate-pulse"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  );
};

const STAGES = [
  {
    title: "Member Integration",
    theme: {
      stroke: "#3b82f6",
      active: "#60a5fa",
      bg: "rgba(59, 130, 246, 0.2)",
    },
  },
];

const Members: React.FC = () => {
  const [activeStageIdx] = useState(0);
  const currentStage = STAGES[activeStageIdx];

  return (
    <div className="flex flex-col items-center min-h-screen text-white w-full relative bg-black">
      <Starfield />

      {/* --- STICKY HEADER --- */}
      <StickyHeader currentStage={currentStage} label="Member Hub" />

      <main className="relative z-10 p-10 flex flex-col items-center gap-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter">
          Members Page
        </h1>
        <p className="text-gray-400">View and manage chapter members.</p>
      </main>
    </div>
  );
};

export default Members;
