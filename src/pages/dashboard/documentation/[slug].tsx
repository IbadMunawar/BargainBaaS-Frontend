import React from 'react';
import { useRouter } from 'next/router';
// CHANGED: Used '@' alias to fix path resolution issues
import DashboardLayout from '@/components/layout/DashboardLayout';
import DocsLayout from '@/components/layout/DocsLayout';
import Link from 'next/link';
import { Info, CheckCircle, Zap } from 'lucide-react';

// Define a type for the page component that includes the getLayout property
type PageWithLayout = React.FC & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

// --- CONTENT DEFINITIONS ---
const DOCS_CONTENT: Record<string, { title: string; content: React.ReactNode }> = {
    'introduction': {
        title: 'Introduction & Core Concepts',
        content: (
            <div className="space-y-6 text-gray-700">
                <p>Welcome to the BargainBaaS developer guide! Our system allows you to implement real-time, AI-powered price negotiation on your e-commerce platform.</p>
                <div className="p-4 bg-primary-50 rounded-lg border-l-4 border-primary-500">
                    <h4 className="font-semibold text-primary-900 flex items-center mb-1"><Info className="h-4 w-4 mr-2" /> The Push Model Architecture</h4>
                    <p className="text-sm text-primary-800">
                        For maximum performance and security, we use a **Push Model**. Instead of our system calling your endpoint for rules, **your backend must call our Session Init endpoint** before a user starts a chat. This pre-loads the negotiation rules (MAM, Asking Price) into our Redis cache, ensuring zero-latency decision-making during the chat.
                    </p>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mt-4">Integration Steps</h3>
                <ol className="list-decimal list-inside ml-4 space-y-3">
                    <li>Generate and use your API Key and Tenant ID (see Authentication).</li>
                    <li>Call the Session Init endpoint from your server before displaying the chat widget.</li>
                    <li>Embed the chat widget on your product page.</li>
                    <li>Listen for the final status (Success Protocol) to complete the sale.</li>
                </ol>
            </div>
        ),
    },
    'authentication': {
        title: 'Authentication & Keys',
        content: (
            <div className="space-y-6 text-gray-700">
                <p>All server-to-server communication with BargainBaaS requires authorization using your unique Tenant API Key.</p>
                <h3 className="text-xl font-bold text-gray-900 mt-4">Your Credentials</h3>
                <p>Find these required credentials on the <Link href="/dashboard/integration" className="text-primary-600 hover:underline">API Integration</Link> page:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                    <li><strong>Tenant ID:</strong> Your unique identifier (used in the request body).</li>
                    <li><strong>Client API Key:</strong> The authorization token (used in the header).</li>
                </ul>
                <h3 className="text-xl font-bold text-gray-900 mt-4">API Key Usage</h3>
                <p>The API Key must be sent in the <code>Authorization</code> header for ALL API calls you make to our system.</p>
                <div className="bg-gray-100 text-gray-900 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-gray-200">
                    Authorization: Bearer [YOUR_CLIENT_API_KEY]
                </div>
            </div>
        ),
    },
    'session-init': {
        title: 'Session Initialization (The Push)',
        content: (
            <div className="space-y-6 text-gray-700">
                <p>This is the most critical step. Your backend must call this endpoint to load negotiation rules into our system **before** the user starts chatting.</p>
                <h3 className="text-xl font-bold text-gray-900 mt-4">Endpoint</h3>
                <div className="bg-gray-100 text-gray-900 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-gray-200">
                    <span className="font-bold text-blue-600">POST</span> https://web-production-d88ec.up.railway.app/api/v1/session/init
                </div>

                <h3 className="text-xl font-bold text-gray-900 mt-4">Required Request Body (JSON)</h3>
                <p>The body must be JSON, containing the following fields:</p>
                <div className="bg-gray-100 text-gray-900 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-gray-200">
                    <pre>
{`{
  "api_key": "[Your Client API Key]",
  "tenant_id": "[Your Tenant ID]",
  "context_id": "product_sku_1234",
  "mam": 420.00,
  "asking_price": 500.00
}`}
                    </pre>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mt-4">cURL Example</h3>
                <div className="bg-gray-100 text-gray-900 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-gray-200">
                    <pre>
{`curl -X POST "https://web-production-d88ec.up.railway.app/api/v1/session/init" \\
  -H "Authorization: Bearer [YOUR_CLIENT_API_KEY]" \\
  -H "Content-Type: application/json" \\
  -d '{
    "api_key": "ina_key_...",
    "tenant_id": "tenant-456",
    "context_id": "product-A101",
    "mam": 420.00,
    "asking_price": 500.00
  }'`}
                    </pre>
                </div>
            </div>
        ),
    },
    'success-protocol': {
        title: 'Success Protocol (Closing the Deal)',
        content: (
            <div className="space-y-6 text-gray-700">
                <p>When the AI reaches a final agreement, our system pushes a final confirmation JSON to your chosen callback URL (set during initial onboarding).</p>
                <h3 className="text-xl font-bold text-gray-900 mt-4">The Final Callback</h3>
                <p>After a successful deal, our system sends a <code>POST</code> request to the **Callback URL** you provided.</p>
                
                <h3 className="text-xl font-bold text-gray-900 mt-4">Expected Callback JSON</h3>
                <div className="bg-green-50 text-green-900 p-4 rounded-lg border-l-4 border-green-500 font-mono text-sm overflow-x-auto">
                    <pre>
{`{
  "tenant_id": "tenant-456",
  "context_id": "product-A101",
  "negotiation_status": "deal_accepted",
  "final_price": 450.00,
  "session_id": "uuid-12345"
}`}
                    </pre>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mt-4">Action on Your End</h3>
                <p className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-green-600" /> Once you receive deal_accepted, you must update the price for the user in your cart/checkout system to the final_price provided.</p>
            </div>
        ),
    },
    'calling-the-bot': {
        title: 'Calling the Chatbot (Widget)',
        content: (
            <div className="space-y-6 text-gray-700">
                <p>Once you have initialized the session (see Session Initialization), you can launch the client-side chat interface.</p>
                <h3 className="text-xl font-bold text-gray-900 mt-4">Widget Embedding</h3>
                <p>We provide a simple JavaScript snippet to embed the chat widget on your page. **Ensure the session is initialized BEFORE this is loaded.**</p>
                <div className="bg-gray-100 text-gray-900 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-gray-200">
                    <pre>
{`<!-- Place this where you want the chat button to appear -->
<div id="bargainbaas-chat-widget" 
     data-session-id="[THE SESSION ID RETURNED FROM /session/init]">
</div>
<script src="https://widget.ina.com/v1/loader.js"></script>`}
                    </pre>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mt-4">Status Tracking</h3>
                <p className="flex items-center"><Zap className="h-5 w-5 mr-2 text-yellow-600" /> Use the <code>data-session-id</code> attribute to link the widget to the active negotiation state. This is how the chatbot knows which rules to use from Redis.</p>
            </div>
        ),
    },
};
// --- END CONTENT DEFINITIONS ---

// --- MAIN DYNAMIC COMPONENT ---
const DocumentationContent: PageWithLayout = () => {
    const router = useRouter();
    const slug = (router.query.slug as string) || 'introduction'; 

    const content = DOCS_CONTENT[slug];

    if (!content) {
        return (
            <DocsLayout pageTitle="Page Not Found">
                 <p className="text-red-500 text-lg">404 Error: Documentation page not found for slug: <strong>{slug}</strong></p>
                 <p className="mt-4">Please check the sidebar links.</p>
            </DocsLayout>
        );
    }

    return (
        <DocsLayout pageTitle={content.title}>
            {content.content}
        </DocsLayout>
    );
};

// Next.js specific function to apply the DashboardLayout wrapping
DocumentationContent.getLayout = (page: React.ReactElement) => (
    <DashboardLayout pageTitle="Developer Guide">{page}</DashboardLayout>
);

export default DocumentationContent;