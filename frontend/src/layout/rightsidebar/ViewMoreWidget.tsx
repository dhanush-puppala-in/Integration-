import React from "react";
import { ChevronRight } from "lucide-react";

const ViewMoreWidget: React.FC = () => {
  return (
    <button className="w-full mt-4 flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group text-left">
      <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">
        View More
      </span>
      <div className="text-gray-500 group-hover:translate-x-1 transition-transform">
        <ChevronRight size={18} strokeWidth={3} />
      </div>
    </button>
  );
};

export default ViewMoreWidget;
