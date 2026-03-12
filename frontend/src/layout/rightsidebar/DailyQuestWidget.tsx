import React, { useState, useEffect } from "react";
import { Lock } from "lucide-react";

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow.getTime() - now.getTime();

      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      const pad = (n: number) => n.toString().padStart(2, "0");
      return `${pad(h)}:${pad(m)}:${pad(s)} left`;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, []);

  return <span>{timeLeft}</span>;
};

const DailyQuestWidget: React.FC = () => {
  return (
    <div className="hidden md:block w-full">
      <div className="flex justify-between items-center mb-4 px-1 text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase">
        <h3>Daily Quests</h3>
        <div className="text-blue-500 opacity-80">
          <CountdownTimer />
        </div>
      </div>

      <div className="bg-[#0B0F17]/50 border border-white/5 rounded-3xl p-5 relative group cursor-pointer hover:bg-white/[0.04] transition-colors">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:rotate-12 transition-transform">
            <Lock size={22} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <h4 className="text-white font-bold leading-tight">
              Earn 10 Interstellar Points
            </h4>
            <p className="text-[11px] text-gray-500 mt-1">
              Progress through 2 modules
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full w-[15%] bg-orange-500 rounded-full group-hover:w-[25%] transition-all duration-700 shadow-[0_0_10px_rgba(249,115,22,0.3)]"></div>
          </div>
          <p className="text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            0/10
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyQuestWidget;
