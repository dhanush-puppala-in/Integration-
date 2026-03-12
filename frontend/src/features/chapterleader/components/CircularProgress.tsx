import React from "react";
import { IoIosLock } from "react-icons/io";

import Lottie from "lottie-react";

interface CircularProgressProps {
  value: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  imageSrc?: string;
  lottieData?: any;
  locked?: boolean;
  isCompleted?: boolean;
  strokeColor?: string;
  glowColor?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  total,
  size = 120,
  strokeWidth = 10,
  imageSrc,
  lottieData,
  locked = false,
  isCompleted = false,
  strokeColor,
  glowColor,
}) => {
  const percentage = locked ? 0 : total === 0 ? 0 : (value / total) * 100;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="relative group transition-all duration-300"
      style={{ width: size, height: size }}
    >
      {/* Glow Effect */}
      {!locked && (
        <div
          className={`absolute inset-0 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500
            ${glowColor ? glowColor : isCompleted ? "bg-green-500" : "bg-blue-500"}`}
        />
      )}

      <svg
        width={size}
        height={size}
        className="transform -rotate-90 relative z-10"
      >
        {/* Background Circle */}
        <circle
          stroke="rgba(255, 255, 255, 0.05)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />

        {/* Progress Circle */}
        <circle
          stroke={
            locked
              ? "rgba(255, 255, 255, 0.1)"
              : strokeColor
                ? strokeColor
                : isCompleted
                  ? "#4CAF50"
                  : "#3B82F6"
          }
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </svg>

      {/* Center Content */}
      <div
        className={`absolute inset-0 flex items-center justify-center overflow-hidden rounded-full z-20 
          ${locked ? "grayscale opacity-50" : ""}`}
        style={{ margin: strokeWidth + 1 }}
      >
        {lottieData ? (
          <div className="w-full h-full scale-[1.1]">
            <Lottie
              animationData={lottieData}
              loop={true}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        ) : imageSrc ? (
          <img
            src={imageSrc}
            alt="Planet"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span className="text-white font-bold">
            {Math.round(percentage)}%
          </span>
        )}

        {/* Lock Overlay */}
        {locked && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
            <IoIosLock className="text-white text-3xl md:text-5xl drop-shadow-lg" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CircularProgress;
