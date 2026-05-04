import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
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
import { DollarSign, Percent, MessageSquare, CheckCircle, TrendingUp, Loader2 } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface StatCardProps {
  title: string;
  value: string;
  icon: React.FC<any>;
  trend?: string;
  accentColor: string;
  glowColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, accentColor, glowColor }) => (
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
      <div>
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <p className="mt-2 text-3xl font-bold text-white">{value}</p>
        {trend && (
          <p className="mt-2 text-xs font-medium flex items-center gap-1" style={{ color: accentColor }}>
            <TrendingUp className="h-3 w-3" />
            {trend}
          </p>
        )}
      </div>
      <div
        className="p-2.5 rounded-xl border"
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

  const [stats, setStats] = useState([
    { title: 'Total Chats', value: '—', icon: MessageSquare, trend: '', accentColor: '#60a5fa', glowColor: '#3b82f6' },
    { title: 'Deals Closed', value: '—', icon: CheckCircle, trend: '', accentColor: '#34d399', glowColor: '#10b981' },
    { title: 'Volume Processed', value: '—', icon: DollarSign, trend: '', accentColor: '#6ee7b7', glowColor: '#059669' },
    { title: 'Conversion Rate', value: '—', icon: Percent, trend: '', accentColor: '#c084fc', glowColor: '#9333ea' },
  ]);

  const [chartData, setChartData] = useState({
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

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Step 1: get the tenant's API key from the configuration endpoint
        const inaBaseUrl = process.env.NEXT_PUBLIC_INA_BASE_URL || 'https://ina-backend-fyp.onrender.com';
        const jwtToken = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null;

        if (!jwtToken) throw new Error('Unauthorized: No session token found.');

        // First, fetch the configuration to get the tenant's client API key
        const configRes = await fetch(`${inaBaseUrl}/api/v1/tenant/configuration`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        if (!configRes.ok) throw new Error(`Config fetch failed: ${configRes.status}`);
        const configData = await configRes.json();
        const tenantApiKey = configData.client_api_key;

        if (!tenantApiKey) throw new Error('Tenant API key not found in configuration.');

        // Step 2: fetch live analytics using the tenant API key
        const analyticsRes = await fetch(`${inaBaseUrl}/api/v1/analytics/`, {
          headers: { Authorization: `Bearer ${tenantApiKey}` },
        });
        if (!analyticsRes.ok) throw new Error(`Analytics fetch failed: ${analyticsRes.status}`);
        const data = await analyticsRes.json();

        setStats([
          {
            title: 'Total Chats',
            value: data.total_negotiations?.toString() ?? '0',
            icon: MessageSquare,
            trend: 'Live sessions',
            accentColor: '#60a5fa',
            glowColor: '#3b82f6',
          },
          {
            title: 'Deals Closed',
            value: data.total_deals_closed?.toString() ?? '0',
            icon: CheckCircle,
            trend: 'Accepted offers',
            accentColor: '#34d399',
            glowColor: '#10b981',
          },
          {
            title: 'Volume Processed',
            value: `$${(data.total_volume ?? 0).toLocaleString()}`,
            icon: DollarSign,
            trend: 'Total deal value',
            accentColor: '#6ee7b7',
            glowColor: '#059669',
          },
          {
            title: 'Conversion Rate',
            value: `${((data.conversion_rate ?? 0) * 100).toFixed(1)}%`,
            icon: Percent,
            trend: 'Success / Total',
            accentColor: '#c084fc',
            glowColor: '#9333ea',
          },
        ]);

        if (data.chart_data) {
          setChartData({
            labels: data.chart_data.map((d: any) => d.date),
            datasets: [
              {
                label: 'Deals Closed',
                data: data.chart_data.map((d: any) => d.deals),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#10b981',
                pointRadius: 4,
              },
              {
                label: 'Total Chats',
                data: data.chart_data.map((d: any) => d.chats),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#3b82f6',
                pointRadius: 4,
              },
            ],
          });
        }
      } catch (err: any) {
        console.error('Failed to load analytics:', err);
        setError(err?.message ?? 'Failed to load analytics data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

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

  return (
    <DashboardLayout pageTitle="Analytics Overview">
      <div className="space-y-6">

        {/* Error Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            ⚠ {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
            Fetching live analytics from INA backend…
          </div>
        )}

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
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
          {!isLoading && (
            <p className="mt-4 text-xs text-slate-600">
              Real-time data from the INA LangGraph orchestrator. Deals are counted on final_price resolution.
            </p>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Analytics;