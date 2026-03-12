import React from "react";
import ProfileWidget from "./ProfileWidget";
import StatisticWidget from "./StatisticWidget";
import DailyQuestWidget from "./DailyQuestWidget";
import ViewMoreWidget from "./ViewMoreWidget";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/constants";

const RightSidebar: React.FC = () => {
  const { user } = useAuth();

  // Checking if the user is a Chapter Leader
  const isChapterLeader = user?.role === ROLES.CHAPTER;

  return (
    <aside className="hidden lg:flex w-[20%] flex-col gap-6 p-6 h-screen sticky top-0 overflow-y-auto no-scrollbar lg:mr-4 lg:mt-3 flex-shrink-0">
      {/* Global Profile/Status Bar */}
      <ProfileWidget className="w-full" />

      <div className="flex flex-col gap-8">
        {/* Statistics - Always visible */}
        <StatisticWidget />

        {/* Quests and View More - Only for Chapter Leader Role */}
        {isChapterLeader && (
          <div className="flex flex-col gap-4">
            <DailyQuestWidget />
            <ViewMoreWidget />
          </div>
        )}
      </div>
    </aside>
  );
};

export default RightSidebar;
