import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { DollarSign, Percent, BarChart, Users } from 'lucide-react';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// ADD THIS INTERFACE BLOCK: Defines the types for the StatCard component
interface StatCardProps {
    title: string;
    value: string;
    // icon: Icon is a Lucide React component, which is a React functional component type
    icon: React.FC<any>; 
    color: string;
}

// --- Component 1: Stat Card (Reusable) ---
// CHANGED: Applied the StatCardProps interface
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <Icon className={`h-6 w-6 ${color}`} />
    </div>
    <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
    {/* Placeholder for future trend line */}
    <p className="mt-2 text-xs text-gray-400">Past 30 days data</p>
  </div>
);

// --- Component 2: Chart Placeholder Data ---
const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Negotiation Success Rate',
      data: [65, 59, 80, 81, 56, 55, 60],
      borderColor: '#3b82f6', // Primary color for the line
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      pointRadius: 5,
      pointHoverRadius: 7,
      fill: true,
    },
  ],
};

const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: true,
            text: 'Success Rate Over Time',
            font: {
                size: 16,
            }
        },
    },
    scales: {
        y: {
            min: 0,
            max: 100,
            ticks: {
                callback: function(value: string | number) { // Added type for value
                    return value + '%';
                }
            }
        }
    }
};

// --- Main Component: Analytics ---
const Analytics = () => {
  // Hard-coded stat values for the shell
  const stats = [
    { title: 'Total Negotiations', value: '4,520', icon: BarChart, color: 'text-blue-600' },
    { title: 'Success Rate', value: '62.4%', icon: Percent, color: 'text-green-600' },
    { title: 'Avg. Discount Given', value: '7.5%', icon: DollarSign, color: 'text-red-600' },
    { title: 'Active Products', value: '18', icon: Users, color: 'text-purple-600' },
  ];

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
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Negotiation Performance</h2>
          <div className="h-80">
            {/* The Line component is the placeholder for the chart */}
            <Line data={chartData} options={chartOptions as any} /> {/* Added 'as any' to bypass chartOptions type issue if any */}
          </div>
          <p className="mt-4 text-sm text-gray-600">
            This graph shows the success rate of the AI chatbot in closing a deal based on the policies you have configured.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;