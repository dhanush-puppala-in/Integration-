import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip } from "chart.js";
import Button from "../../UI/Button";

Chart.register(ArcElement, Tooltip);

const FILTERS = ["Today", "Last Week", "Last Month"] as const;
type FilterType = typeof FILTERS[number];

type DonutType = "SESSION_DURATION" | "TIME_OF_DAY";

interface DoughnutCardProps {
  title: string;
  type: DonutType;
}

/* -------------------------------------------------------------------------- */
/*                               STATIC DATA                                  */
/* -------------------------------------------------------------------------- */

const STATIC_DATA = {
  SESSION_DURATION: {
    Today: [20, 35, 15, 10],
    "Last Week": [120, 90, 70, 40],
    "Last Month": [300, 240, 180, 120],
  },
  TIME_OF_DAY: {
    Today: [30, 40, 20, 10],
    "Last Week": [140, 160, 100, 60],
    "Last Month": [420, 380, 260, 200],
  },
};

const DoughnutCard: React.FC<DoughnutCardProps> = ({ title, type }) => {
  const [filter, setFilter] = useState<FilterType>("Today");

  const values = STATIC_DATA[type][filter];

  /* -------------------------------------------------------------------------- */
  /*                              CHART CONFIG                                  */
  /* -------------------------------------------------------------------------- */

  const chartConfig =
    type === "TIME_OF_DAY"
      ? {
          labels: ["Morning", "Afternoon", "Evening", "Night"],
          colors: [
            "rgba(255, 206, 86, 0.9)",
            "rgba(54, 162, 235, 0.9)",
            "rgba(255, 99, 132, 0.9)",
            "rgba(75, 192, 192, 0.9)",
          ],
        }
      : {
          labels: ["≤ 1 min", "1–2.5 min", "2.5–5 min", "> 5 min"],
          colors: [
            "rgba(255, 99, 132, 0.9)",
            "rgba(54, 162, 235, 0.9)",
            "rgba(255, 206, 86, 0.9)",
            "rgba(75, 192, 192, 0.9)",
          ],
        };

  const data = {
    labels: chartConfig.labels,
    datasets: [
      {
        data: values,
        backgroundColor: chartConfig.colors,
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  /* -------------------------------------------------------------------------- */
  /*                                   UI                                      */
  /* -------------------------------------------------------------------------- */

  return (
    <div
      className="
      bg-white/10 backdrop-blur-xl
      border border-white/20
      rounded-2xl p-6 shadow-lg
      hover:-translate-y-1 hover:shadow-2xl transition
      relative z-0
      "
    >
      <h2 className="text-xl font-semibold text-center text-white mb-4">
        {title}
      </h2>

      {/* FILTER BUTTONS */}
      <div className="flex gap-3 justify-center mb-6">
        {FILTERS.map((f) => (
          <Button
            key={f}
            label={f}
            active={filter === f}
            onClick={() => setFilter(f)}
          />
        ))}
      </div>

      {/* DONUT */}
      <div className="flex justify-center items-center h-64 w-full relative">
        <Doughnut
          data={data}
          options={{
            maintainAspectRatio: false,
            responsive: true,
          }}
        />
      </div>
    </div>
  );
};

export default DoughnutCard;