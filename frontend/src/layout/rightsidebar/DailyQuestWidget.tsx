import React, { useState, useEffect } from "react";
import { Lock, Zap, Target, ChevronRight } from "lucide-react";

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

const themeMap: Record<string, { bg: string; text: string; bar: string; shadow: string }> = {
  orange: { bg: "bg-orange-500/10", text: "text-orange-500", bar: "bg-orange-500", shadow: "0 0 10px rgba(249,115,22,0.4)" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-500", bar: "bg-blue-500", shadow: "0 0 10px rgba(59,130,246,0.4)" },
  green: { bg: "bg-green-500/10", text: "text-green-500", bar: "bg-green-500", shadow: "0 0 10px rgba(34,197,94,0.4)" }
};

const DailyQuestWidget: React.FC = () => {
  const quests = [
    {
      id: 1,
      title: "Active Leader",
      desc: "Post 3 updates",
      progress: 1,
      total: 3,
      icon: <Zap size={14} strokeWidth={2.5} />,
      colorType: "orange"
    },
    {
      id: 2,
      title: "Community Growth",
      desc: "Invite 5 members",
      progress: 2,
      total: 5,
      icon: <Target size={14} strokeWidth={2.5} />,
      colorType: "blue"
    },
    {
      id: 3,
      title: "Event Host",
      desc: "Create 1 event",
      progress: 0,
      total: 1,
      icon: <Lock size={14} strokeWidth={2.5} />,
      colorType: "green"
    }
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4 px-1 text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase">
        <h3>Daily Quests</h3>
        <div className="text-blue-500 opacity-80">
          <CountdownTimer />
        </div>
      </div>

      <div className="bg-[#0f172a]/80 border border-white/10 rounded-3xl p-5 relative flex flex-col gap-6 shadow-[0_0_40px_rgba(0,0,0,0.3)] backdrop-blur-md">
        {quests.map((q) => {
          const percentage = Math.round((q.progress / q.total) * 100);
          const c = themeMap[q.colorType];

          return (
            <div key={q.id} className="group cursor-pointer hover:bg-white/[0.04] transition-colors rounded-xl p-1 -mx-1">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-xl ${c.bg} flex items-center justify-center ${c.text} group-hover:rotate-12 transition-transform shrink-0`}>
                  {q.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-bold text-[11px] leading-tight truncate">
                    {q.title}
                  </h4>
                  <p className="text-[9px] text-gray-500 mt-0.5 truncate uppercase font-bold tracking-wider">
                    {q.desc}
                  </p>
                </div>
                <p className={`text-[10px] font-black ${c.text} whitespace-nowrap pt-1 bg-white/5 px-2 py-0.5 rounded-md border border-white/5`}>
                  {q.progress}/{q.total}
                </p>
              </div>

              <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${c.bar} rounded-full transition-all duration-700`}
                  style={{ width: `${percentage}%`, boxShadow: c.shadow }}
                />
              </div>
            </div>
          );
        })}

        {/* View More Embedded */}
        <div className="border-t border-white/5">
          <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition">

            <span className="text-gray-400 text-sm font-medium">
              View More
            </span>

            <ChevronRight size={16} />

          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyQuestWidget;
