import React from "react";
import StarfieldScene2D from "../components/animation/StarfieldScene2D";

const AdminEvent: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#0B0F17] text-white overflow-hidden">
      {/* 🌌 STARFIELD BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <StarfieldScene2D />
      </div>

      {/* 🌟 FOREGROUND CONTENT */}
      <div className="relative z-10">
        <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center">
          <div
            className="
              px-10 py-6 rounded-2xl
              bg-white/10 backdrop-blur-2xl
              border border-white/20
              shadow-2xl
              animate-fadeIn
            "
          >
            <h1 className="text-4xl font-bold text-center">
              Event Manager Page
            </h1>

            <p className="text-white/70 text-center mt-2 text-lg">
              Coming Soon...
            </p>
          </div>
        </div>
      </div>

      {/* PAGE ANIMATION */}
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default AdminEvent;
