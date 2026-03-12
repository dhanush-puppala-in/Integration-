import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";

import Button from "../../UI/Button";

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip);

const FILTERS = ["Today", "Last Week", "Last Month"] as const;
type FilterType = typeof FILTERS[number];

type LineChartType = "Traffic" | "Signups";

interface LineChartCardProps {
  title: LineChartType;
}

/* -------------------------------------------------------------------------- */
/*                                STATIC DATA                                 */
/* -------------------------------------------------------------------------- */

const STATIC_TRAFFIC = {
  Today: {
    labels: ["00", "04", "08", "12", "16", "20"],
    data: [120, 90, 200, 350, 280, 190]
  },
  "Last Week": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [800, 900, 750, 1100, 1400, 1600, 1200]
  },
  "Last Month": {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    data: [3200, 4100, 3900, 5200]
  }
};

const STATIC_SIGNUPS = {
  Today: {
    labels: ["00", "04", "08", "12", "16", "20"],
    data: [15, 12, 25, 40, 32, 21]
  },
  "Last Week": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [90, 120, 110, 150, 200, 180, 140]
  },
  "Last Month": {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    data: [400, 520, 480, 630]
  }
};

const LineChartCard: React.FC<LineChartCardProps> = ({ title }) => {
  const [filter, setFilter] = useState<FilterType>("Today");

  const dataset = title === "Traffic"
    ? STATIC_TRAFFIC[filter]
    : STATIC_SIGNUPS[filter];

  const chartData: ChartData<"line"> = {
    labels: dataset.labels,
    datasets: [
      {
        label: title,
        data: dataset.data,
        tension: 0.4,
        borderWidth: 3,
        borderColor: title === "Traffic" ? "#C084FC" : "#4ADE80",
        pointBackgroundColor: "#ffffff",
        pointBorderColor: title === "Traffic" ? "#C084FC" : "#4ADE80"
      }
    ]
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { color: "#ffffff" },
        grid: { color: "rgba(255,255,255,0.1)" }
      },
      y: {
        ticks: { color: "#ffffff" },
        grid: { color: "rgba(255,255,255,0.1)" }
      }
    }
  };

  return (
    <div
      className="
      bg-black/80 backdrop-blur-xl
      border border-white/20 rounded-2xl
      p-4 md:p-6 shadow-lg hover:-translate-y-1
      hover:shadow-2xl transition w-full
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

      {/* LINE CHART */}
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChartCard;