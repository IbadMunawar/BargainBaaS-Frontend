import Head from 'next/head';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Link from 'next/link';

const DocumentationPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Documentation | BargainBaaS Dashboard</title>
      </Head>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Getting Started</h2>
      <p className="text-gray-700 mb-6">
        Welcome to the Bargaining BaaS API Documentation! Follow these steps to integrate the chatbot into your store.
      </p>

      <ol className="list-decimal list-inside ml-4 space-y-3 text-gray-700">
        <li>Obtain your API Key from the <Link href="/dashboard/integration" className="text-primary-600 hover:underline">API Integration</Link> page.</li>
        <li>Set up your minimum price floor and callback URL on the <Link href="/dashboard/configuration" className="text-primary-600 hover:underline">Configuration</Link> page.</li>
        <li>Implement the API call on your product page to initiate the bargaining session.</li>
      </ol>

      <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 border-t pt-4">2. Core Endpoints</h2>
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
            <span className="font-bold text-green-600">POST</span> /api/v1/bargain/start 
            <p className="font-normal text-gray-700 mt-1">Initiates a new bargaining session for a product.</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
            <span className="font-bold text-blue-600">POST</span> /api/v1/bargain/submit
            <p className="font-normal text-gray-700 mt-1">Submits a user message or offer to the chatbot.</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
            <span className="font-bold text-red-600">GET</span> /api/v1/bargain/status/<span className="text-primary-600">{' {sessionId}'}</span> {/* <-- FIXED HERE */}
            <p className="font-normal text-gray-700 mt-1">Retrieves the current state and last response of the negotiation.</p>
        </div>
      </div>

    </>
  );
};

// Wrap the page in the layout
(DocumentationPage as any).getLayout = (page: React.ReactNode) => (
    <DashboardLayout pageTitle="API Documentation">{page}</DashboardLayout>
);

export default DocumentationPage;
