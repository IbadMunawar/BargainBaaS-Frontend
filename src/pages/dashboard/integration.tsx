import Head from 'next/head';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Clipboard } from 'lucide-react';

const IntegrationPage: React.FC = () => {
    // UI-ONLY: Placeholder API Key
    const apiKey = 'sk_bargain_d3v_xxxxxxxxxxxxxxxxxxxxxx'; 

  return (
    <>
      <Head>
        <title>API Integration | BargainBaaS Dashboard</title>
      </Head>
      
      <p className="text-gray-700 mb-6">
        Use the key below to authenticate your eCommerce platform when calling the Bargaining BaaS API.
      </p>

      <div className="bg-gray-100 p-6 rounded-xl border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Live API Key</label>
        <div className="flex space-x-3">
          <input
            type="text"
            readOnly
            value={apiKey}
            className="flex-1 p-3 font-mono text-sm bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
          />
          <button
            onClick={() => { console.log('Copied to clipboard (UI ONLY)'); }}
            className="p-3 bg-primary-800 text-white rounded-lg hover:bg-primary-900 transition duration-150"
            title="Copy API Key"
          >
            <Clipboard className="h-5 w-5" />
          </button>
        </div>
        <button className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-800 transition duration-150">
            Regenerate Key
        </button>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Integration Steps</h2>
      <p className="text-gray-700">
          Refer to the Documentation page for detailed setup instructions and endpoint specifications.
      </p>

    </>
  );
};

// Wrap the page in the layout
(IntegrationPage as any).getLayout = (page: React.ReactNode) => (
    <DashboardLayout pageTitle="API Integration">{page}</DashboardLayout>
);

export default IntegrationPage;