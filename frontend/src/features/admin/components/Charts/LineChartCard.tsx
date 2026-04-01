import React, { useState, useEffect } from "react";
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
import { 
  fetchHourlyTraffic, fetchWeeklyTraffic, fetchMonthlyTraffic,
  fetchHourlySignups, fetchWeeklySignups, fetchMonthlySignups
} from "./charts_api";

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip);

const FILTERS = ["Today", "Last Week", "Last Month"] as const;
type FilterType = typeof FILTERS[number];

type LineChartType = "Traffic" | "Signups";

interface LineChartCardProps {
  title: LineChartType;
}

const LineChartCard: React.FC<LineChartCardProps> = ({ title }) => {
  const [filter, setFilter] = useState<FilterType>("Today");
  const [chartDataState, setChartDataState] = useState<{ labels: string[], data: number[] }>({ labels: [], data: [] });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        let res: any;
        if (title === "Traffic") {
          if (filter === "Today") res = await fetchHourlyTraffic();
          else if (filter === "Last Week") res = await fetchWeeklyTraffic();
          else if (filter === "Last Month") res = await fetchMonthlyTraffic();
        } else {
          if (filter === "Today") res = await fetchHourlySignups();
          else if (filter === "Last Week") res = await fetchWeeklySignups();
          else if (filter === "Last Month") res = await fetchMonthlySignups();
        }
        
        if (!mounted) return;
        
        // Backend returns `data` for traffic, and `counts` for signups
        const dataArr = res.data ? res.data : (res.counts ? res.counts : []);
        setChartDataState({ labels: res.labels || [], data: dataArr });
      } catch (err) {
        console.error("Error loading line chart data:", err);
        if (mounted) setChartDataState({ labels: [], data: [] });
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    loadData();
    
    return () => {
      mounted = false;
    };
  }, [filter, title]);

  const chartData: ChartData<"line"> = {
    labels: chartDataState.labels,
    datasets: [
      {
        label: title,
        data: chartDataState.data,
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
      <div className="relative min-h-[250px] w-full flex justify-center items-center">
        {loading ? (
             <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
        ) : (
            <div className="w-full h-full">
              <Line data={chartData} options={options} />
            </div>
        )}
      </div>
    </div>
  );
};

export default LineChartCard;