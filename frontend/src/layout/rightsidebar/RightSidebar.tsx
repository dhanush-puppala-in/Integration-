import React from "react";
import ProfileWidget from "./ProfileWidget";
import StatisticWidget from "./StatisticWidget";
import DailyQuestWidget from "./DailyQuestWidget";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/constants";

interface RightSidebarProps {
  className?: string;
  hideProfile?: boolean;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ 
  className = "hidden lg:flex w-[24%] flex-col gap-6 px-2 py-4 h-screen sticky top-0 overflow-y-auto no-scrollbar lg:mr-4 lg:mt-3 flex-shrink-0",
  hideProfile = false
}) => {
  const { user } = useAuth();

  // Checking if the user is a Chapter Leader
  const isChapterLeader = user?.role === ROLES.CHAPTER;

  return (
    <aside className={`${className}`}>
      {/* Global Profile/Status Bar */}
      {!hideProfile && <ProfileWidget className="w-full" />}

      <div className="flex flex-col gap-8">
        {/* Statistics - Only for Admin Role */}
        {!isChapterLeader && <StatisticWidget />}

        {/* Quests and View More - Only for Chapter Leader Role
        {isChapterLeader && (
            <DailyQuestWidget />
        )} */}
      </div>
    </aside>
  );
};

export default RightSidebar;
