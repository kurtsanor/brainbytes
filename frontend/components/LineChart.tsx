"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const lastNDates = (n: number) => {
  const days: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
};

const generateMockSeries = (n: number, min = 10, max = 200) => {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    out.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return out;
};

type TimeSeries = {
  labels: string[];
  messages: number[];
  sessions: number[];
  avgMsgsPerSession: number[];
};

type Props = {
  days?: number;
  chartData?: TimeSeries;
};

export default function LineChart({ days = 7, chartData }: Props) {
  const labels = chartData?.labels ?? lastNDates(days);

  // use server-provided series when available, otherwise mock
  const messages = chartData?.messages ?? generateMockSeries(days, 40, 220);
  const sessions = chartData?.sessions ?? generateMockSeries(days, 5, 40);

  const avgMsgsPerSession =
    chartData?.avgMsgsPerSession ??
    messages.map((m: number, i: number) => {
      const s = Math.max(sessions[i], 1);
      return Number((m / s).toFixed(1));
    });

  const data = {
    labels,
    datasets: [
      {
        label: "Messages",
        data: messages,
        borderColor: "#111827",
        pointBackgroundColor: "#111827",
        backgroundColor: "rgba(17,24,39,0.08)",
        tension: 0,
        pointStyle: "circle",
        yAxisID: "y",
      },
      {
        label: "Sessions",
        data: sessions,
        borderColor: "#2563EB",
        pointBackgroundColor: "#2563EB",
        backgroundColor: "rgba(37,99,235,0.08)",
        tension: 0,
        pointStyle: "circle",
        yAxisID: "y",
      },
      {
        label: "Avg msgs/session",
        data: avgMsgsPerSession,
        borderColor: "#059669",
        pointBackgroundColor: "#059669",
        backgroundColor: "rgba(5,150,105,0.08)",
        tension: 0,
        pointStyle: "circle",
        yAxisID: "y1",
      },
    ],
  };

  const options: any = {
    maintainAspectRatio: false,
    responsive: true,
    elements: {
      point: {
        radius: 0,
        hoverRadius: 4,
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { usePointStyle: true },
      },
      title: { display: false },
    },
    scales: {
      x: {
        grid: { color: "rgba(15,23,42,0.04)", borderDash: [2, 2] },
      },
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        grid: { color: "rgba(15,23,42,0.04)", borderDash: [2, 2] },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
          color: "rgba(15,23,42,0.04)",
          borderDash: [2, 2],
        },
      },
    },
  };

  return (
    <div className="border border-neutral-200 p-4 bg-white relative h-64">
      <h3 className="text-lg font-semibold mb-3">
        Activity (last {days} days)
      </h3>
      <div className="h-full pb-10">
        <Line options={options} data={data} />
      </div>
    </div>
  );
}
