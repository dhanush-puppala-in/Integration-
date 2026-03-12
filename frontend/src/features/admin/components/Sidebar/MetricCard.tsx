import React, { useEffect, useState } from "react";
import type { IconType } from "react-icons";

interface MetricCardProps {
  icon: IconType;
  leftValue?: number;
  leftLabel?: string;
  rightValue?: number;
  rightLabel?: string;
  singleValue?: number;
  singleLabel?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  leftValue,
  leftLabel,
  rightValue,
  rightLabel,
  singleValue,
  singleLabel,
}) => {
  const [animatedLeft, setAnimatedLeft] = useState<number>(0);
  const [animatedRight, setAnimatedRight] = useState<number>(0);
  const [animatedSingle, setAnimatedSingle] = useState<number>(0);

  const animateValue = (
    target: number,
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    let start = 0;
    const duration = 1200;
    const stepTime = 10;

    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;

      if (start >= target) {
        start = target;
        clearInterval(timer);
      }

      setter(Math.floor(start));
    }, stepTime);

    return () => clearInterval(timer);
  };

  useEffect(() => {
    const cleanups: (() => void)[] = [];

    if (typeof leftValue === "number")
      cleanups.push(animateValue(leftValue, setAnimatedLeft));

    if (typeof rightValue === "number")
      cleanups.push(animateValue(rightValue, setAnimatedRight));

    if (typeof singleValue === "number")
      cleanups.push(animateValue(singleValue, setAnimatedSingle));

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [leftValue, rightValue, singleValue]);

  const showTwo = typeof leftValue === "number" && typeof rightValue === "number";
  const showSingle = typeof singleValue === "number";

  return (
    <div className="w-full p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl flex items-center gap-4">
      <div className="p-4 rounded-xl bg-blue-600 text-white shadow-lg">
        <Icon size={26} />
      </div>

      <div className="flex-1 text-center">
        {showTwo && (
          <div className="flex justify-between gap-4">
            <div className="flex-1">
              <div className="py-2 rounded-xl bg-blue-600 text-white font-bold shadow-md">
                {animatedLeft}
              </div>
              <p className="text-sm text-white/80 mt-1">{leftLabel}</p>
            </div>

            <div className="flex-1">
              <div className="py-2 rounded-xl bg-purple-600 text-white font-bold shadow-md">
                {animatedRight}
              </div>
              <p className="text-sm text-white/80 mt-1">{rightLabel}</p>
            </div>
          </div>
        )}

        {!showTwo && showSingle && (
          <div className="flex flex-col items-center">
            <div className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold shadow-md">
              {animatedSingle}
            </div>
            <p className="text-sm text-white/80 mt-1">{singleLabel}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;