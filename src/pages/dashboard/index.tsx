import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { DollarSign, Percent, MessageSquare, CheckCircle, BarChart, Users } from 'lucide-react';
import { authFetch } from '../../services/api'; // ADDED: Import for API calls

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Interface for StatCard Props
interface StatCardProps {
  title: string;
  value: string;
  icon: React.FC<any>;
  color: string;
  trend?: string;
}

// --- Component 1: Stat Card (Reusable) ---
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <Icon className={`h-6 w-6 ${color}`} />
    </div>
    <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
    {trend && <p className="mt-2 text-xs text-green-600 font-medium">{trend}</p>}
  </div>
);

// --- Main Component: Analytics ---
const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true);

  // STATS STATE
  const [stats, setStats] = useState([
    { title: 'Total Chats', value: '-', icon: MessageSquare, color: 'text-blue-600', trend: '' },
    { title: 'Deals Closed', value: '-', icon: CheckCircle, color: 'text-green-600', trend: '' },
    { title: 'Volume Processed', value: '-', icon: DollarSign, color: 'text-emerald-600', trend: '' },
    { title: 'Conversion Rate', value: '-', icon: Percent, color: 'text-purple-600', trend: '' },
  ]);

  // CHART DATA STATE
  const [chartData, setChartData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Deals Closed',
        data: [0, 0, 0, 0, 0, 0, 0],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Total Chats',
        data: [0, 0, 0, 0, 0, 0, 0],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ],
  });

  // NEW CODE: Fetch Real Analytics Data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await authFetch('/analytics'); // Calls GET /api/v1/tenant/analytics (or similar)
        const data = await response.json();

        // 1. Update Stats Cards with Real Data
        setStats([
          {
            title: 'Total Chats',
            value: data.total_negotiations?.toString() || '0',
            icon: MessageSquare,
            color: 'text-blue-600',
            trend: 'Live Data'
          },
          {
            title: 'Deals Closed',
            value: data.total_deals_closed?.toString() || '0',
            icon: CheckCircle,
            color: 'text-green-600',
            trend: 'Accepted Offers'
          },
          {
            title: 'Volume Processed',
            value: `$${data.total_volume?.toLocaleString() || '0'}`,
            icon: DollarSign,
            color: 'text-emerald-600',
            trend: 'Total Deal Value'
          },
          {
            title: 'Conversion Rate',
            value: `${(data.conversion_rate * 100).toFixed(1)}%` || '0%',
            icon: Percent,
            color: 'text-purple-600',
            trend: 'Success / Total'
          },
        ]);

        // 2. Update Chart Data (If backend provides chart_data array)
        if (data.chart_data) {
          setChartData({
            labels: data.chart_data.map((d: any) => d.date), // Assumes backend returns { date: '...', chats: 5, deals: 2 }
            datasets: [
              {
                label: 'Deals Closed',
                data: data.chart_data.map((d: any) => d.deals),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
              },
              {
                label: 'Total Chats',
                data: data.chart_data.map((d: any) => d.chats),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
              }
            ]
          });
        }

      } catch (err) {
        console.error('Failed to load analytics:', err);
        // Optional: Set some error state here if you want to show a message
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Negotiation Performance (Live)',
        font: { size: 16 }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  };

  return (
    <DashboardLayout pageTitle="Analytics Overview">
      <div className="space-y-8">

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Chart Component Shell */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="h-96">
            {/* Added 'as any' to prevent strict TypeScript build errors with Chart.js */}
            <Line data={chartData} options={chartOptions as any} />
          </div>
          <p className="mt-4 text-sm text-gray-600">
            {isLoading
              ? "Loading real-time data from the Push Model..."
              : "Real-time data showing the volume of chats vs. successful deals closed."}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;