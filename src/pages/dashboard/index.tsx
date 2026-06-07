import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { authFetch } from '../../services/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { DollarSign, Percent, MessageSquare, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.FC<any>;
  trend?: string;
  accentColor: string;
  glowColor: string;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, accentColor, glowColor, isLoading }) => (
  <div
    className="relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-white/20 hover:bg-white/8 group"
    style={{ boxShadow: `0 0 30px -12px ${glowColor}` }}
  >
    {/* Subtle background glow */}
    <div
      className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity"
      style={{ backgroundColor: glowColor }}
    />
    <div className="relative flex items-start justify-between">
      <div className="w-full mr-4">
        <p className="text-sm font-medium text-slate-400">{title}</p>
        {isLoading ? (
          <div className="h-9 w-24 bg-white/10 rounded animate-pulse mt-2" />
        ) : (
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
        )}
        {trend && !isLoading && (
          <p className="mt-2 text-xs font-medium flex items-center gap-1" style={{ color: accentColor }}>
            <TrendingUp className="h-3 w-3" />
            {trend}
          </p>
        )}
      </div>
      <div
        className="p-2.5 rounded-xl border flex-shrink-0"
        style={{
          backgroundColor: `${glowColor}20`,
          borderColor: `${glowColor}40`,
        }}
      >
        <Icon className="h-5 w-5" style={{ color: accentColor }} />
      </div>
    </div>
  </div>
);

const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<{
    total_sessions: number;
    total_deals: number;
    total_volume: number;
    average_price: number;
  } | null>(null);

  // Fetch summary analytics
  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authFetch('/analytics/summary');
        const data = await response.json();
        setAnalyticsData(data);
      } catch (err: any) {
        console.error("Failed to load analytics summary:", err);
        setError(err.message || "Failed to load summary statistics.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const [chartData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Deals Closed',
        data: [0, 0, 0, 0, 0, 0, 0],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#10b981',
        pointRadius: 4,
      },
      {
        label: 'Total Chats',
        data: [0, 0, 0, 0, 0, 0, 0],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#3b82f6',
        pointRadius: 4,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#94a3b8',
          font: { size: 12 },
          boxWidth: 12,
          padding: 16,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15,23,42,0.9)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#e2e8f0',
        bodyColor: '#94a3b8',
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#64748b' },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#64748b' },
      },
    },
  };

  // Live metrics calculations
  const totalSessions = analyticsData?.total_sessions ?? 0;
  const totalDeals = analyticsData?.total_deals ?? 0;
  const totalVolume = analyticsData?.total_volume ?? 0;
  const conversionRate = totalSessions > 0 ? (totalDeals / totalSessions) * 100 : 0;

  const stats = [
    { 
      title: 'Total Chats', 
      value: totalSessions.toLocaleString(), 
      icon: MessageSquare, 
      trend: totalSessions > 0 ? 'Live monitoring active' : '', 
      accentColor: '#60a5fa', 
      glowColor: '#3b82f6' 
    },
    { 
      title: 'Deals Closed', 
      value: totalDeals.toLocaleString(), 
      icon: CheckCircle, 
      trend: totalDeals > 0 ? 'Negotiation success' : '', 
      accentColor: '#34d399', 
      glowColor: '#10b981' 
    },
    { 
      title: 'Volume Processed', 
      value: `₨${totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
      icon: DollarSign, 
      trend: totalVolume > 0 ? 'Commerce throughput' : '', 
      accentColor: '#6ee7b7', 
      glowColor: '#059669' 
    },
    { 
      title: 'Conversion Rate', 
      value: `${conversionRate.toFixed(1)}%`, 
      icon: Percent, 
      trend: conversionRate > 0 ? 'Deal generation efficiency' : '', 
      accentColor: '#c084fc', 
      glowColor: '#9333ea' 
    },
  ];

  return (
    <DashboardLayout pageTitle="Analytics Overview">
      <div className="space-y-6">
        
        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} isLoading={isLoading} />
          ))}
        </div>

        {/* Chart Container */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Negotiation Performance</h3>
              <p className="text-sm text-slate-500 mt-0.5">Weekly chat volume vs. deals closed</p>
            </div>
            <span className="px-3 py-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full">
              Live
            </span>
          </div>
          <div className="h-80">
            <Line data={chartData} options={chartOptions as any} />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Analytics;