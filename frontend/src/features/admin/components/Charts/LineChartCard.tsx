import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Filler,
} from "chart.js";
import type { ChartData, ChartOptions, Plugin } from "chart.js";

import Button from "../../UI/Button";
import {
  fetchHourlyTraffic, fetchWeeklyTraffic, fetchMonthlyTraffic,
  fetchHourlySignups, fetchWeeklySignups, fetchMonthlySignups
} from "./charts_api";

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler);

const FILTERS = ["Today", "Last Week", "Last Month"] as const;
type FilterType = typeof FILTERS[number];
type LineChartType = "Traffic" | "Signups";

interface LineChartCardProps {
  title: LineChartType;
}

/* -------------------------------------------------------------------------- */
/*                         SKELETON SHIMMER                                   */
/* -------------------------------------------------------------------------- */

const LineSkeleton: React.FC = () => (
  <div className="w-full h-full flex flex-col justify-end gap-1 animate-pulse px-2">
    {/* Fake axes */}
    <div className="flex items-end gap-2 h-40">
      {[35, 55, 40, 70, 50, 80, 60, 90, 65, 75, 45, 85].map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-white/8 rounded-t"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
    <div className="h-px bg-white/10 w-full" />
    {/* Fake x-labels */}
    <div className="flex gap-2 mt-1">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-2 flex-1 rounded-full bg-white/8" />
      ))}
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                       GRADIENT PLUGIN FACTORY                              */
/* -------------------------------------------------------------------------- */

function buildGradient(ctx: CanvasRenderingContext2D, chartArea: any, color: string) {
  const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
  gradient.addColorStop(0, color.replace(")", ", 0.35)").replace("rgb(", "rgba("));
  gradient.addColorStop(1, color.replace(")", ", 0)").replace("rgb(", "rgba("));
  return gradient;
}

/* -------------------------------------------------------------------------- */
/*                         LINE CHART CARD                                    */
/* -------------------------------------------------------------------------- */

const LineChartCard: React.FC<LineChartCardProps> = ({ title }) => {
  const [filter, setFilter] = useState<FilterType>("Today");
  const [chartDataState, setChartDataState] = useState<{ labels: string[]; data: number[] }>({ labels: [], data: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const chartRef = useRef<any>(null);

  /* Accent colours */
  const lineColor = title === "Traffic" ? "#C084FC" : "#4ADE80"; // purple or green
  const lineColorRgb = title === "Traffic" ? "rgb(192,132,252)" : "rgb(74,222,128)";

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        let res: any;
        if (title === "Traffic") {
          if (filter === "Today") res = await fetchHourlyTraffic();
          else if (filter === "Last Week") res = await fetchWeeklyTraffic();
          else res = await fetchMonthlyTraffic();
        } else {
          if (filter === "Today") res = await fetchHourlySignups();
          else if (filter === "Last Week") res = await fetchWeeklySignups();
          else res = await fetchMonthlySignups();
        }
        if (!mounted) return;
        const dataArr = res.data ?? res.counts ?? [];
        setChartDataState({ labels: res.labels ?? [], data: dataArr });
      } catch (err) {
        console.error("Error loading line chart data:", err);
        if (mounted) setChartDataState({ labels: [], data: [] });
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, [filter, title]);

  /* Build gradient fill dynamically */
  const chartData: ChartData<"line"> = {
    labels: chartDataState.labels,
    datasets: [
      {
        label: title,
        data: chartDataState.data,
        tension: 0.45,
        borderWidth: 2.5,
        borderColor: lineColor,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: lineColor,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: true,
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return "transparent";
          return buildGradient(c, chartArea, lineColorRgb);
        },
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0D0D1A",
        borderColor: "rgba(255,255,255,0.12)",
        borderWidth: 1,
        titleColor: "#ffffff",
        bodyColor: "rgba(255,255,255,0.6)",
        padding: 10,
      },
    },
    scales: {
      x: {
        ticks: { color: "rgba(255,255,255,0.45)", font: { size: 11 } },
        grid: { color: "rgba(255,255,255,0.06)" },
        border: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        ticks: { color: "rgba(255,255,255,0.45)", font: { size: 11 } },
        grid: { color: "rgba(255,255,255,0.06)" },
        border: { color: "rgba(255,255,255,0.1)" },
      },
    },
    interaction: { mode: "index", intersect: false },
  };

  const isEmpty = chartDataState.data.length === 0;

  return (
    <div
      className="
        bg-[#0D0D1A] border border-white/8 rounded-2xl
        p-4 md:p-6 shadow-lg
        hover:-translate-y-1 hover:shadow-2xl hover:border-white/15
        transition-all duration-300 w-full
      "
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className="w-0.5 h-5 rounded-full shrink-0"
          style={{ backgroundColor: lineColor }}
        />
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

      {/* CHART AREA */}
      <div className="relative min-h-[250px] w-full flex justify-center items-center">
        {loading ? (
          <LineSkeleton />
        ) : isEmpty ? (
          <div className="flex flex-col items-center gap-2 text-white/30">
            <span className="text-4xl">📉</span>
            <p className="text-sm">No data for this period</p>
          </div>
        ) : (
          <div className="w-full h-[250px]">
            <Line ref={chartRef} data={chartData} options={options} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LineChartCard;