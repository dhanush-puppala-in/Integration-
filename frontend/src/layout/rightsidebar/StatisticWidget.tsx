import React from "react";

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
};

const StatisticWidget: React.FC = () => {
  const stats = [
    { label: "Clubs", value: 30, color: "text-blue-400" },
    { label: "Communities", value: 20, color: "text-purple-400" },
    { label: "Events", value: 100, color: "text-orange-400" },
    { label: "Users", value: 100000, color: "text-green-400" },
  ];

  return (
    <div className="bg-[#0f172a]/80 border border-white/10 rounded-3xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.3)] backdrop-blur-md">
      <h3 className="text-[10px] font-black text-blue-400 tracking-[0.3em] uppercase mb-4 flex items-center gap-2 pb-4 border-b border-white/5">
        <span className="w-1 h-3 bg-blue-500 rounded-full animate-pulse" />
        Cosmic Statistics
      </h3>
      
      <div className="flex flex-col gap-4 mt-2">
        {stats.map((stat, i) => (
          <div key={i} className="flex justify-between items-center group cursor-default">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              {stat.label}
            </p>
            <p className={`text-base font-black leading-none transition-all duration-300 group-hover:scale-110 ${stat.color}`}>
              {formatNumber(stat.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticWidget;
