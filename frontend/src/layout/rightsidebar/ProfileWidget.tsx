import React from "react";
import { Sparkles, Trophy } from "lucide-react";

interface ProfileWidgetProps {
  className?: string;
}

export const ProfileWidget: React.FC<ProfileWidgetProps> = ({ className }) => {
  return (
    <div
      className={`flex items-center justify-between bg-[#0f172a]/80 backdrop-blur-md border border-white/10 rounded-2xl md:rounded-3xl p-3 md:p-4 px-4 md:px-6 relative z-[3000] shadow-xl ${className}`}
    >
      {/* College Image Section */}
      <div className="flex items-center gap-3 group cursor-pointer">
        <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden border-2 border-white/10 shadow-lg group-hover:scale-110 transition-all duration-300">
          <img
            src="https://api.dicebear.com/7.x/initials/svg?seed=CU&backgroundColor=3b82f6"
            alt="College"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Ranking Section */}
      <div className="flex items-center gap-2 group cursor-pointer px-2">
        <div className="group-hover:scale-110 transition-transform flex items-center justify-center">
          <Trophy
            size={20}
            strokeWidth={2.5}
            className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
          />
        </div>
        <span className="text-white font-black text-sm md:text-lg tracking-tighter">
          #12
        </span>
      </div>

      {/* Interstellar Points Section */}
      <div className="flex items-center gap-2 group cursor-pointer">
        <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(147,51,234,0.4)] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse"></div>
          <Sparkles className="text-white text-sm md:text-lg relative z-10" />
        </div>
        <span className="text-purple-400 font-black text-sm md:text-lg tracking-tighter">
          1287
        </span>
      </div>
    </div>
  );
};

export default ProfileWidget;
