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

    return () => {
      mounted = false;
    };
  }, [filter, type]);

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
        data: chartDataState,
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
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
          </div>
        ) : (
          <Doughnut
            data={data}
            options={{
              maintainAspectRatio: false,
              responsive: true,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DoughnutCard;