import Head from 'next/head';
import DashboardLayout from '../../components/layout/DashboardLayout';

const AnalyticsPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Analytics | BargainBaaS Dashboard</title>
      </Head>
      
      <p className="text-gray-500 italic">
        This page will contain conversion charts, negotiation success rates, and API usage statistics.
      </p>
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {/* Placeholder Cards */}
        <div className="p-4 border border-gray-200 rounded-lg h-32 flex items-center justify-center bg-gray-50">
            <span className="text-gray-700">Total Sessions: 0</span>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg h-32 flex items-center justify-center bg-gray-50">
            <span className="text-gray-700">Conversion Rate: 0%</span>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg h-32 flex items-center justify-center bg-gray-50">
            <span className="text-gray-700">Avg Discount: $0</span>
        </div>
      </div>
    </>
  );
};

// Wrap the page in the layout
(AnalyticsPage as any).getLayout = (page: React.ReactNode) => (
    <DashboardLayout pageTitle="Dashboard Analytics">{page}</DashboardLayout>
);

export default AnalyticsPage;
