// src/pages/dashboard/index.tsx — COMPLETE FILE

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
import {
  DollarSign,
  Percent,
  MessageSquare,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// ── Stat card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.FC<any>;
  trend?: string;
  accentColor: string;
  glowColor: string;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title, value, icon: Icon, trend, accentColor, glowColor, isLoading,
}) => (
  <div
    className="relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm
               overflow-hidden transition-all duration-300 hover:border-white/20 group"
    style={{ boxShadow: `0 0 30px -12px ${glowColor}` }}
  >
    <div
      className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-2xl
                 group-hover:opacity-20 transition-opacity"
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
        style={{ backgroundColor: `${glowColor}20`, borderColor: `${glowColor}40` }}
      >
        <Icon className="h-5 w-5" style={{ color: accentColor }} />
      </div>
    </div>
  </div>
);

// ── Chart config ──────────────────────────────────────────────────────────────

const buildChartData = (
  labels: string[],
  dealData: number[],
  totalData: number[],
) => ({
  labels,
  datasets: [
    {
      label: 'Deals Closed',
      data: dealData,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.08)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#10b981',
      pointRadius: 4,
    },
    {
      label: 'Total Chats',
      data: totalData,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.08)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#3b82f6',
      pointRadius: 4,
    },
  ],
});

const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: { color: '#94a3b8', font: { size: 12 }, boxWidth: 12, padding: 16 },
    },
    title: { display: false },
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
    x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } },
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(255,255,255,0.05)' },
      ticks: { color: '#64748b', precision: 0 },
    },
  },
};

// ── Page component ────────────────────────────────────────────────────────────

const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Summary stat data
  const [analyticsData, setAnalyticsData] = useState<{
    total_sessions: number;
    total_deals: number;
    total_volume: number;
    average_price: number;
  } | null>(null);

  // Chart data — initialise with empty-but-valid structure
  const [chartData, setChartData] = useState(() =>
    buildChartData(
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    )
  );

  // ── Fetch 1: summary stat cards ─────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await authFetch('/api/v1/analytics/');
        const data = await res.json();
        setAnalyticsData(data);
      } catch (err: any) {
        console.error('Analytics summary fetch failed:', err);
        setError(err.message || 'Failed to load summary statistics.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // ── Fetch 2: daily chart breakdown ──────────────────────────────────────────
  useEffect(() => {
    (async () => {
      setIsChartLoading(true);
      try {
        const res = await authFetch('/api/v1/analytics/daily');
        const days: { label: string; total: number; deals: number }[] = await res.json();

        setChartData(
          buildChartData(
            days.map((d) => d.label),
            days.map((d) => d.deals),
            days.map((d) => d.total),
          )
        );
      } catch (err) {
        console.error('Daily analytics fetch failed:', err);
        // Chart stays at zeros — not a blocking error, don't set error state
      } finally {
        setIsChartLoading(false);
      }
    })();
  }, []);

  // ── Derived values ──────────────────────────────────────────────────────────
  const totalSessions = analyticsData?.total_sessions ?? 0;
  const totalDeals = analyticsData?.total_deals ?? 0;
  const totalVolume = analyticsData?.total_volume ?? 0;
  const conversionRate = totalSessions > 0
    ? (totalDeals / totalSessions) * 100
    : 0;

  const stats = [
    {
      title: 'Total Chats',
      value: totalSessions.toLocaleString(),
      icon: MessageSquare,
      trend: totalSessions > 0 ? 'Live monitoring active' : '',
      accentColor: '#60a5fa',
      glowColor: '#3b82f6',
    },
    {
      title: 'Deals Closed',
      value: totalDeals.toLocaleString(),
      icon: CheckCircle,
      trend: totalDeals > 0 ? 'Negotiation success' : '',
      accentColor: '#34d399',
      glowColor: '#10b981',
    },
    {
      title: 'Volume Processed',
      value: `₨${totalVolume.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      trend: totalVolume > 0 ? 'Commerce throughput' : '',
      accentColor: '#6ee7b7',
      glowColor: '#059669',
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate.toFixed(1)}%`,
      icon: Percent,
      trend: conversionRate > 0 ? 'Deal generation efficiency' : '',
      accentColor: '#c084fc',
      glowColor: '#9333ea',
    },
  ];

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout pageTitle="Analytics Overview">
      <div className="space-y-6">

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20
                          text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} isLoading={isLoading} />
          ))}
        </div>

        {/* Chart */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Negotiation Performance</h3>
              <p className="text-sm text-slate-500 mt-0.5">Weekly chat volume vs. deals closed</p>
            </div>
            <span className="px-3 py-1 text-xs font-medium text-emerald-400
                             bg-emerald-400/10 border border-emerald-400/20 rounded-full">
              Live
            </span>
          </div>

          {isChartLoading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <span className="animate-spin h-4 w-4 border-2 border-slate-500
                                 border-t-violet-400 rounded-full" />
                Loading chart data…
              </div>
            </div>
          ) : (
            <div className="h-80">
              <Line data={chartData} options={CHART_OPTIONS as any} />
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Analytics;