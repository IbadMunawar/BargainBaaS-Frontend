import React from 'react'; 
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Info, Link as LinkIcon, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const Configuration: React.FC = () => {
    
    // In the new "Push Model," configuration is done via a single API call 
    // before the chat starts, not via the dashboard form.
    
    return (
        <DashboardLayout pageTitle="Policy Engine Configuration">
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Information Card for the Push Model */}
                <div className="flex items-start p-6 mb-6 bg-primary-50 border-l-4 border-primary-500 rounded-lg shadow-md">
                    <Info className="h-6 w-6 mt-0.5 text-primary-600 flex-shrink-0" />
                    <div className="ml-4 text-sm text-gray-800">
                        <h3 className="text-lg font-semibold text-primary-900">
                            Action Required: The New "Push" Model
                        </h3>
                        <p className="mt-2">
                            To ensure high performance and security, BargainBaaS now uses a **Push Model** architecture. You no longer save a permanent endpoint URL here.
                        </p>
                        <p className="mt-2 font-medium">
                            Instead, your backend must send the negotiation rules (MAM, Asking Price) directly to our system immediately before starting a chat session.
                        </p>
                    </div>
                </div>

                {/* Redirect Link to the new essential page */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <LinkIcon className="h-6 w-6 text-gray-500" />
                        <h2 className="text-xl font-semibold text-gray-800">
                            View Integration Details
                        </h2>
                    </div>
                    <Link
                        href="/dashboard/integration"
                        className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition duration-150"
                    >
                        Go to Integration
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );
};

// Set the layout for Next.js to use DashboardLayout
(Configuration as any).getLayout = (page: React.ReactNode) => (
    <DashboardLayout pageTitle="Architecture Update">{page}</DashboardLayout>
);

export default Configuration;