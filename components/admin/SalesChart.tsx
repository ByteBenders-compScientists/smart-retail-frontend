/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface SalesChartProps {
  type: 'bar' | 'line' | 'doughnut';
  title: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string;
      borderWidth?: number;
    }[];
  };
}

export default function SalesChart({ type, title, data }: SalesChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
    },
    scales: type !== 'doughnut' ? {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return 'KSh ' + value.toLocaleString();
          },
        },
      },
    } : undefined,
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="h-80">
        {type === 'bar' && <Bar data={data} options={options} />}
        {type === 'line' && <Line data={data} options={options} />}
        {type === 'doughnut' && <Doughnut data={data} options={options} />}
      </div>
    </div>
  );
}