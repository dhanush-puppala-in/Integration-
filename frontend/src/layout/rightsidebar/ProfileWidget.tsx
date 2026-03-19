import React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { setDetails, type ChapterLeaderDetails } from "../../store/slices/chapterLeaderSlice";

interface ProfileWidgetProps {
  className?: string;
}

export const ProfileWidget: React.FC<ProfileWidgetProps> = ({ className }) => {
  const { user, logout } = useAuth();
  const { details } = useSelector((state: RootState) => state.chapterLeader);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    dispatch(setDetails(null as any));
    navigate("/login");
  };
  console.log("Raw Details from Redux:", details);
  
  // Robustly extract the data whether it's wrapped in a child object or not
  const anyDetails = details as any
  const actualData = anyDetails?.leader as any;

  // Use Redux data mapping with fallbacks explicitly mapped from "actualData"
  const leaderName = actualData?.name || user?.name || "Chapter Leader";
  const universityName = actualData?.universeMetaData?.name || "Cosmic University";
  const ipPoints = actualData?.totalIpEarned ?? 0;

  return (
    <div
      className={`flex items-center gap-4 bg-[#0f172a]/80 backdrop-blur-md border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-5 relative z-[3000] shadow-xl ${className}`}
    >
      {/* College Image Section */}
      <div className="w-14 h-14 shrink-0 rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden border-2 border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-300">
        <img
          src="https://api.dicebear.com/7.x/initials/svg?seed=CU&backgroundColor=3b82f6"
          alt="University Logo"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Details Container */}
      <div className="flex flex-col flex-1 justify-center min-w-0 text-left">
        <h2 className="text-white font-black text-sm md:text-base tracking-tight leading-tight truncate">
          {leaderName}
        </h2>
        <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-0.5 truncate">
          {universityName}
        </p>
        <span className="text-yellow-400 font-extrabold text-[10px] md:text-[11px] tracking-widest uppercase mt-1">
          IP Points : {ipPoints}
        </span>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-10 h-10 shrink-0 rounded-full bg-red-500/10 hover:bg-red-500/20 active:scale-95 border border-red-500/20 text-red-500 flex items-center justify-center transition-all shadow-lg ml-auto"
        title="Logout"
      >
        <LogOut size={16} className="-ml-0.5 stroke-[2.5px]" />
      </button>
    </div>
  );
};

export default ProfileWidget;
