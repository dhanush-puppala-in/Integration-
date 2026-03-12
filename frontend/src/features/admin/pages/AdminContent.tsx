import React from "react";
import StarfieldScene2D from "../components/animation/StarfieldScene2D";

const AdminContent: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden">
      
      {/* 🌌 STARFIELD BACKGROUND */}
      <StarfieldScene2D />

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
              Content Manager Page
            </h1>

            <p className="text-white/70 text-center mt-2 text-lg">
              Coming Soon...
            </p>
          </div>
        </div>
      </div>

      {/* PAGE-LOCAL ANIMATION */}
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

export default AdminContent;