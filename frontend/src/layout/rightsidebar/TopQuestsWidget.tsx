import React, { useState, useEffect } from "react";
import { Flame, Trophy, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { chapterLeaderApi } from "../../api/chapterLeader";

interface TopQuest {
  id: string;
  title: string;
  progress: number; // 0-100
  category: string; // Club, Community, Event, Member
  isCompleted: boolean;
  reward: string;
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; bar: string; dot: string }> = {
  Club:      { bg: "bg-purple-500/10", text: "text-purple-400", bar: "bg-purple-500", dot: "bg-purple-500" },
  Community: { bg: "bg-blue-500/10",   text: "text-blue-400",   bar: "bg-blue-500",   dot: "bg-blue-500" },
  Event:     { bg: "bg-orange-500/10", text: "text-orange-400", bar: "bg-orange-500", dot: "bg-orange-500" },
  Member:    { bg: "bg-green-500/10",  text: "text-green-400",  bar: "bg-green-500",  dot: "bg-green-500" },
};

const CATEGORY_ROUTES: Record<string, string> = {
  Club: "/chapterleader/club",
  Community: "/chapterleader/community",
  Event: "/chapterleader/event",
  Member: "/chapterleader/members",
};

const TopQuestsWidget: React.FC = () => {
  const navigate = useNavigate();
  const [quests, setQuests] = useState<TopQuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const categories = ["Club", "community", "Event", "Member"];
        const results = await Promise.allSettled(
          categories.map((cat) => chapterLeaderApi.getQuestsProgress(cat))
        );

        const allQuests: TopQuest[] = [];

        results.forEach((result, i) => {
          if (result.status !== "fulfilled") return;
          const res = result.value;
          const categoryLabel = ["Club", "Community", "Event", "Member"][i];
          const orbits = res.data?.data?.orbits;
          if (!orbits) return;

          orbits.forEach((orbit: any) => {
            orbit.quests?.forEach((q: any, qIdx: number) => {
              const progress = q.overallProgress ?? 0;
              allQuests.push({
                id: q.questId || `${categoryLabel}-${qIdx}`,
                title: q.title || `Quest ${qIdx + 1}`,
                progress: Math.min(Math.round(progress), 100),
                category: categoryLabel,
                isCompleted: q.isCompleted || false,
                reward: q.ip ? `+${q.ip} IP` : "+100 IP",
              });
            });
          });
        });

        // Filter: not completed, sort by progress descending (closest to finish), take top 5
        const top5 = allQuests
          .filter((q) => !q.isCompleted && q.progress > 0)
          .sort((a, b) => b.progress - a.progress)
          .slice(0, 5);

        setQuests(top5);
      } catch (err) {
        console.error("TopQuestsWidget fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleQuestClick = (quest: TopQuest) => {
    const route = CATEGORY_ROUTES[quest.category];
    if (route) {
      navigate(`${route}?questId=${quest.id}`);
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="bg-[#0f172a]/80 border border-white/10 rounded-3xl p-5 backdrop-blur-md">
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-2">
                <div className="h-3 bg-white/5 rounded-lg w-3/4" />
                <div className="h-1.5 bg-white/5 rounded-full w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (quests.length === 0) return null;

  const visibleQuests = expanded ? quests : quests.slice(0, 3);
  const hasMore = quests.length > 3;

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Flame className="w-3.5 h-3.5 text-orange-500" />
        <h3 className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">
          Almost There
        </h3>
      </div>

      <div className="bg-[#0f172a]/80 border border-white/10 rounded-3xl p-4 relative flex flex-col gap-3 shadow-[0_0_40px_rgba(0,0,0,0.3)] backdrop-blur-md">
        {visibleQuests.map((q) => {
          const style = CATEGORY_STYLES[q.category] || CATEGORY_STYLES.Club;

          return (
            <div
              key={q.id}
              onClick={() => handleQuestClick(q)}
              className="group hover:bg-white/[0.04] rounded-xl p-2 -mx-1 transition-all cursor-pointer"
            >
              {/* Title row: dot + title + category badge + percentage */}
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${style.dot} shrink-0`} />
                <span className="text-white font-bold text-[11px] leading-tight truncate flex-1 min-w-0">
                  {q.title}
                </span>
                <span className={`px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest shrink-0 ${style.bg} ${style.text}`}>
                  {q.category}
                </span>
                <span className={`text-[10px] font-black ${style.text} whitespace-nowrap shrink-0`}>
                  {q.progress}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${style.bar} rounded-full transition-all duration-700`}
                  style={{
                    width: `${q.progress}%`,
                    boxShadow: `0 0 8px currentColor`,
                  }}
                />
              </div>
            </div>
          );
        })}

        {/* View More / View Less */}
        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-1.5 pt-2 border-t border-white/5 text-gray-500 hover:text-white transition-colors group"
          >
            <span className="text-[9px] font-black uppercase tracking-[0.15em]">
              {expanded ? "Show less" : "View more"}
            </span>
            <ChevronDown
              className={`w-3 h-3 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        )}

        {/* Summary footer */}
        {!hasMore && (
          <div className="border-t border-white/5 pt-2 flex items-center justify-center gap-2">
            <Trophy className="w-3 h-3 text-yellow-500/60" />
            <span className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">
              {quests.length} quest{quests.length > 1 ? "s" : ""} near completion
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopQuestsWidget;
