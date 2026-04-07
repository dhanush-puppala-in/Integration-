import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip } from "chart.js";
import Button from "../../UI/Button";
import {
  todaySessionDonut, lastWeekSessionDonut, lastMonthSessionDonut,
  todaySessionsByTimeOfDayDonut, lastWeekSessionsByTimeOfDayDonut, lastMonthSessionsByTimeOfDayDonut
} from "./charts_api";

Chart.register(ArcElement, Tooltip);

const FILTERS = ["Today", "Last Week", "Last Month"] as const;
type FilterType = typeof FILTERS[number];

type DonutType = "SESSION_DURATION" | "TIME_OF_DAY";

interface DoughnutCardProps {
  title: string;
  type: DonutType;
}

/* -------------------------------------------------------------------------- */
/*                         SKELETON SHIMMER                                   */
/* -------------------------------------------------------------------------- */

const DonutSkeleton: React.FC = () => (
  <div className="flex flex-col items-center gap-4 w-full animate-pulse">
    {/* Fake donut ring */}
    <div className="w-44 h-44 rounded-full border-[24px] border-white/8 bg-transparent" />
    {/* Fake legend rows */}
    <div className="flex gap-3 flex-wrap justify-center">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <div className="h-2.5 w-14 rounded-full bg-white/10" />
        </div>
      ))}
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                         DOUGHNUT CARD                                      */
/* -------------------------------------------------------------------------- */

const DoughnutCard: React.FC<DoughnutCardProps> = ({ title, type }) => {
  const [filter, setFilter] = useState<FilterType>("Today");
  const [chartDataState, setChartDataState] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        let res: any;
        if (type === "SESSION_DURATION") {
          if (filter === "Today") res = await todaySessionDonut();
          else if (filter === "Last Week") res = await lastWeekSessionDonut();
          else if (filter === "Last Month") res = await lastMonthSessionDonut();

          if (mounted && res) {
            setChartDataState([
              res.lte_1_min || 0,
              res.between_1_and_2_5_min || 0,
              res.between_2_5_and_5_min || 0,
              res.gt_5_min || 0
            ]);
          }
        } else {
          if (filter === "Today") res = await todaySessionsByTimeOfDayDonut();
          else if (filter === "Last Week") res = await lastWeekSessionsByTimeOfDayDonut();
          else if (filter === "Last Month") res = await lastMonthSessionsByTimeOfDayDonut();

          if (mounted && res) {
            setChartDataState([
              res.morning || 0,
              res.afternoon || 0,
              res.evening || 0,
              res.night || 0
            ]);
          }
        }
      } catch (err) {
        console.error("Error loading doughnut data:", err);
        if (mounted) setChartDataState([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();
    return () => { mounted = false; };
  }, [filter, type]);

  /* -------------------------------------------------------------------------- */
  /*                              CHART CONFIG                                  */
  /* -------------------------------------------------------------------------- */

  const chartConfig =
    type === "TIME_OF_DAY"
      ? {
        labels: ["Morning", "Afternoon", "Evening", "Night"],
        colors: [
          "rgba(251, 191, 36, 0.9)",   // amber
          "rgba(59, 130, 246, 0.9)",    // blue
          "rgba(236, 72, 153, 0.9)",    // pink
          "rgba(99, 102, 241, 0.9)",    // indigo
        ],
        hexColors: ["#FBBF24", "#3B82F6", "#EC4899", "#6366F1"],
      }
      : {
        labels: ["≤ 1 min", "1–2.5 min", "2.5–5 min", "> 5 min"],
        colors: [
          "rgba(239, 68, 68, 0.9)",     // red
          "rgba(59, 130, 246, 0.9)",    // blue
          "rgba(251, 191, 36, 0.9)",    // amber
          "rgba(16, 185, 129, 0.9)",    // emerald
        ],
        hexColors: ["#EF4444", "#3B82F6", "#FBBF24", "#10B981"],
      };

  const data = {
    labels: chartConfig.labels,
    datasets: [
      {
        data: chartDataState,
        backgroundColor: chartConfig.colors,
        borderWidth: 0,           // no white borders between segments
        hoverOffset: 6,
      },
    ],
  };

  const isEmpty = chartDataState.every((v) => v === 0);
  const total = chartDataState.reduce((acc, v) => acc + v, 0);

  /* -------------------------------------------------------------------------- */
  /*                                   UI                                      */
  /* -------------------------------------------------------------------------- */

  return (
    <div
      className="
        bg-[#0D0D1A] border border-white/8 rounded-2xl p-6 shadow-lg
        hover:-translate-y-1 hover:shadow-2xl hover:border-white/15
        transition-all duration-300 relative z-0
      "
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-0.5 h-5 rounded-full bg-violet-500 shrink-0" />
        <h2 className="text-base font-semibold text-white">{title}</h2>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex gap-2 justify-center mb-5">
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
      <div className="flex justify-center items-center h-52 w-full relative">
        {loading ? (
          <DonutSkeleton />
        ) : isEmpty ? (
          <div className="flex flex-col items-center gap-2 text-white/30">
            <span className="text-4xl">◎</span>
            <p className="text-sm">No data for this period</p>
          </div>
        ) : (
          <Doughnut
            data={data}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              cutout: "68%",
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (ctx) => {
                      const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : "0";
                      return `  ${ctx.label}: ${ctx.parsed} (${pct}%)`;
                    },
                  },
                },
              },
            }}
          />
        )}
      </div>

      {/* INLINE LEGEND */}
      {!loading && !isEmpty && (
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-4">
          {chartConfig.labels.map((lbl, i) => {
            const val = chartDataState[i] ?? 0;
            const pct = total > 0 ? ((val / total) * 100).toFixed(0) : "0";
            return (
              <div key={lbl} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ backgroundColor: chartConfig.hexColors[i] }}
                />
                <span className="text-white/55 text-xs">{lbl}</span>
                <span className="text-white/80 text-xs font-semibold">{pct}%</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DoughnutCard;