import React from "react";
import { IoIosRocket } from "react-icons/io";

interface StickyHeaderProps {
  currentStage: {
    title: string;
    theme: {
      bg: string;
      active: string;
    };
  };
  label: string;
}

const StickyHeader: React.FC<StickyHeaderProps> = ({ currentStage, label }) => {
  return (
    <div className="sticky top-[86px] md:top-0 z-[1000] w-full flex flex-col items-center pt-2 md:pt-6 px-4 pb-4 backdrop-blur-xl transition-all duration-700 border-b border-white/5 shadow-2xl">
      <header className="flex flex-row items-center justify-between w-full lg:max-w-[1000px] p-4 px-6 md:px-10 bg-[#0c121d] border border-white/10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
        {/* Left: Branding & Rocket Switcher */}
        <div className="flex items-center gap-4 relative z-10 transition-all duration-500">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center border transition-all duration-700 shadow-lg"
            style={{
              backgroundColor: currentStage?.theme?.bg || "rgba(255, 255, 255, 0.05)",
              borderColor: currentStage?.theme?.active ? `${currentStage.theme.active}40` : "rgba(255, 255, 255, 0.1)",
              boxShadow: currentStage?.theme?.active ? `0 0 20px ${currentStage.theme.active}20` : "none",
            }}
          >
            <IoIosRocket
              className="text-2xl transition-all duration-700"
              style={{ color: currentStage?.theme?.active || "#94a3b8" }}
            />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase mb-0.5">
              {label}
            </p>
            <h1 className="text-lg font-black uppercase tracking-tighter text-white">
              {currentStage?.title || "No Active Orbit"}
            </h1>
          </div>
        </div>

        {/* Right: Avatar */}
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-10 h-10 rounded-xl border border-white/10 overflow-hidden shadow-inner">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              alt="User"
            />
          </div>
        </div>
      </header>
    </div>
  );
};

export default StickyHeader;
