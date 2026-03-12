import React from "react";

const StatisticWidget: React.FC = () => {
  return (
    <div className="bg-[#0f172a]/80 border border-white/10 rounded-3xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.3)] backdrop-blur-md">
      <h3 className="text-[10px] font-black text-blue-400 tracking-[0.3em] uppercase mb-6 flex items-center gap-2">
        <span className="w-1 h-3 bg-blue-500 rounded-full animate-pulse" />
        Cosmic Statistics
      </h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center group cursor-default">
          <p className="text-2xl font-black text-white leading-none transition-all duration-300 group-hover:scale-110 group-hover:text-blue-400">
            24
          </p>
          <p className="text-[9px] text-gray-500 font-black uppercase mt-2 tracking-widest">
            Clubs
          </p>
        </div>
        <div className="text-center group cursor-default">
          <p className="text-2xl font-black text-white leading-none transition-all duration-300 group-hover:scale-110 group-hover:text-purple-400">
            12
          </p>
          <p className="text-[9px] text-gray-500 font-black uppercase mt-2 tracking-widest">
            Galaxies
          </p>
        </div>
        <div className="text-center group cursor-default">
          <p className="text-2xl font-black text-white leading-none transition-all duration-300 group-hover:scale-110 group-hover:text-green-400">
            1.2K
          </p>
          <p className="text-[9px] text-gray-500 font-black uppercase mt-2 tracking-widest">
            Members
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatisticWidget;
