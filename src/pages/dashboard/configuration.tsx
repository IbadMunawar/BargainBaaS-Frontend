import Head from 'next/head';
import DashboardLayout from '../../components/layout/DashboardLayout';
import React, { useState } from 'react';

const ConfigurationPage: React.FC = () => {
    // UI-ONLY: State for form
    const [endpointUrl, setEndpointUrl] = useState('https://your-shop.com/api/bargain/callback');
    const [minPriceFloor, setMinPriceFloor] = useState(70);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Configuration saved (UI ONLY):', { endpointUrl, minPriceFloor });
    };

  return (
    <>
      <Head>
        <title>Configuration | BargainBaaS Dashboard</title>
      </Head>
      
      <p className="text-gray-500 mb-8">
        Manage your service endpoint and define the core rules for the bargaining engine.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
        
        {/* Endpoint URL Configuration */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b pb-2">API Callback Settings</h2>
          <label htmlFor="endpoint" className="block text-sm font-medium text-gray-700 mb-1">
            Negotiated Price Callback URL
          </label>
          <input
            id="endpoint"
            type="url"
            value={endpointUrl}
            onChange={(e) => setEndpointUrl(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., https://your-shop.com/api/bargain/callback"
          />
          <p className="mt-2 text-xs text-gray-500">
            This is where BargainBaaS sends the final, negotiated price after a deal is closed.
          </p>
        </div>

        {/* Negotiation Rules Configuration */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b pb-2">Profit Protection Rules (RBE)</h2>
          
          <label htmlFor="min-floor" className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Price Floor (%)
          </label>
          <input
            id="min-floor"
            type="number"
            min="1"
            max="99"
            value={minPriceFloor}
            onChange={(e) => setMinPriceFloor(parseInt(e.target.value))}
            required
            className="w-full md:w-1/3 p-3 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
          />
          <p className="mt-2 text-xs text-gray-500">
            Guaranteed minimum price, expressed as a percentage of the original price (e.g., 70% means max 30% discount).
          </p>

            {/* Other rule placeholders */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-200">
                <p>Rule Placeholder: Define Max Negotiation Rounds (Future feature)</p>
                <p>Rule Placeholder: Discount Step Increment (Future feature)</p>
            </div>

        </div>

        <button
          type="submit"
          className="px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-800 hover:bg-primary-900 transition duration-300 shadow-md"
        >
          Save Configuration
        </button>
      </form>
    </>
  );
};

// Wrap the page in the layout
(ConfigurationPage as any).getLayout = (page: React.ReactNode) => (
    <DashboardLayout pageTitle="Configuration">{page}</DashboardLayout>
);

export default ConfigurationPage;
