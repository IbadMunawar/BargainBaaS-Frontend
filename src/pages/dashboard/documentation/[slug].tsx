import React from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DocsLayout from '@/components/layout/DocsLayout';
import Link from 'next/link';
import { Info, CheckCircle, ShieldCheck, Server, GitMerge, Lock, ArrowRight } from 'lucide-react';

type PageWithLayout = React.FC & {
    getLayout?: (page: React.ReactElement) => React.ReactNode;
};

// --------------------------------------------------------------------------
// Shared dark-themed prose helpers
// --------------------------------------------------------------------------

const ProseText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className="text-slate-400 leading-relaxed">{children}</p>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-lg font-semibold text-white mt-6 mb-2">{children}</h3>
);

const CodeBlock: React.FC<{ children: React.ReactNode; language?: string }> = ({ children, language }) => (
    <div className="rounded-xl border border-white/10 bg-slate-900/70 overflow-hidden">
        {language && (
            <div className="px-4 py-1.5 border-b border-white/10 bg-white/5 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <span className="ml-2 text-xs text-slate-500 font-mono">{language}</span>
            </div>
        )}
        <pre className="p-4 text-sm text-slate-300 font-mono overflow-x-auto whitespace-pre">{children}</pre>
    </div>
);

const InfoBox: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; accent?: string }> = ({
    icon, title, children, accent = 'violet',
}) => {
    const colors: Record<string, string> = {
        violet: 'border-violet-500/30 bg-violet-500/5',
        blue: 'border-blue-500/30 bg-blue-500/5',
        emerald: 'border-emerald-500/30 bg-emerald-500/5',
        amber: 'border-amber-500/30 bg-amber-500/5',
    };
    const iconColors: Record<string, string> = {
        violet: 'text-violet-400',
        blue: 'text-blue-400',
        emerald: 'text-emerald-400',
        amber: 'text-amber-400',
    };
    return (
        <div className={`p-4 rounded-xl border ${colors[accent]}`}>
            <h4 className={`font-semibold flex items-center gap-2 mb-1 text-sm ${iconColors[accent]}`}>
                <span className="flex-shrink-0">{icon}</span>
                {title}
            </h4>
            <p className="text-sm text-slate-400">{children}</p>
        </div>
    );
};

const StepRow: React.FC<{ step: string; label: string; children: React.ReactNode }> = ({ step, label, children }) => (
    <div className="flex gap-4">
        <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 text-xs font-bold flex-shrink-0">
                {step}
            </div>
            <div className="w-px flex-1 bg-white/5 mt-1" />
        </div>
        <div className="pb-5 min-w-0">
            <p className="text-sm font-semibold text-white mb-1">{label}</p>
            <p className="text-sm text-slate-400">{children}</p>
        </div>
    </div>
);

// --------------------------------------------------------------------------
// Document Content Definitions
// --------------------------------------------------------------------------

const DOCS_CONTENT: Record<string, { title: string; content: React.ReactNode }> = {
    // ------------------------------------------------------------------ //
    'introduction': {
        title: 'Introduction & Core Concepts',
        content: (
            <div className="space-y-5">
                <ProseText>
                    Welcome to the BargainBaaS developer guide. BargainBaaS is an AI-powered negotiation engine
                    built on <strong className="text-white">LangGraph</strong>, giving your e-commerce storefront
                    a real-time, context-aware AI negotiator your customers can haggle with directly in the browser.
                </ProseText>

                <InfoBox icon={<GitMerge className="h-4 w-4" />} title="LangGraph-Powered Orchestrator" accent="violet">
                    The INA (Intelligent Negotiation Agent) backend is a stateful LangGraph agent. Each negotiation
                    flows through a directed acyclic graph of nodes — offer evaluation, counter-offer generation,
                    rule enforcement — with state persisted in Redis between turns.
                </InfoBox>

                <InfoBox icon={<ShieldCheck className="h-4 w-4" />} title="Server-to-Server Security Model" accent="blue">
                    BargainBaaS uses a strict <strong className="text-blue-300">Server-to-Server</strong> architecture.
                    Your Tenant API Key is <em>never</em> exposed to the browser. All authorised calls (session init,
                    deal verification) originate from your own backend, keeping negotiation rules and deal prices
                    tamper-proof.
                </InfoBox>

                <SectionTitle>Integration at a Glance</SectionTitle>
                <ol className="space-y-0">
                    <StepRow step="1" label="Obtain your credentials">
                        Copy your <strong className="text-white">Tenant ID</strong> and <strong className="text-white">Tenant API Key</strong> from the{' '}
                        <Link href="/dashboard/integration" className="text-violet-400 hover:underline">API Integration</Link> page.
                    </StepRow>
                    <StepRow step="2" label="Initialize the session (server-side)">
                        Before rendering the chat widget, your backend calls <code className="text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">POST /api/v1/session/init</code>{' '}
                        with the product&apos;s negotiation rules. The returned <code className="text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">session_id</code> is forwarded to your frontend.
                    </StepRow>
                    <StepRow step="3" label="Embed the chat widget">
                        Pass the <code className="text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">session_id</code> to the BargainBaaS widget on your product page. The widget is the only client-side component.
                    </StepRow>
                    <StepRow step="4" label="Verify and close the deal (server-side)">
                        When the widget signals a deal, your frontend calls your own backend. Your backend
                        then securely calls <code className="text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">GET /api/v1/session/{'{session_id}'}/final_price</code> to
                        cryptographically verify the agreed price before updating the cart.
                    </StepRow>
                </ol>
            </div>
        ),
    },

    // ------------------------------------------------------------------ //
    'authentication': {
        title: 'Authentication & Keys',
        content: (
            <div className="space-y-5">
                <ProseText>
                    All server-to-server communication with BargainBaaS is authenticated using your unique
                    Tenant API Key. This key is found on the{' '}
                    <Link href="/dashboard/integration" className="text-violet-400 hover:underline">API Integration</Link> page.
                </ProseText>

                <SectionTitle>Your Credentials</SectionTitle>
                <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden divide-y divide-white/5">
                    <div className="px-4 py-3 grid grid-cols-3 gap-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Credential</span>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</span>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Usage</span>
                    </div>
                    <div className="px-4 py-3 grid grid-cols-3 gap-2 text-sm">
                        <span className="text-white font-medium">Tenant ID</span>
                        <span className="text-slate-400">API Integration page</span>
                        <span className="text-slate-400">Request body of session init</span>
                    </div>
                    <div className="px-4 py-3 grid grid-cols-3 gap-2 text-sm">
                        <span className="text-white font-medium">Tenant API Key</span>
                        <span className="text-slate-400">API Integration page</span>
                        <span className="text-slate-400">Authorization header (server only)</span>
                    </div>
                </div>

                <SectionTitle>Authorization Header</SectionTitle>
                <ProseText>Include this header in every server-side request to the INA backend:</ProseText>
                <CodeBlock language="http">Authorization: Bearer {'<YOUR_TENANT_API_KEY>'}</CodeBlock>

                <InfoBox icon={<Lock className="h-4 w-4" />} title="Never expose this key client-side" accent="amber">
                    Your Tenant API Key must only ever be used from your backend server. Embedding it in
                    browser JavaScript defeats the entire security model and allows price manipulation.
                </InfoBox>
            </div>
        ),
    },

    // ------------------------------------------------------------------ //
    'session-init': {
        title: 'Session Initialization',
        content: (
            <div className="space-y-5">
                <ProseText>
                    Before the chat widget is rendered, your backend must initialize a negotiation session.
                    This call securely loads the product&apos;s negotiation rules (MAM and asking price) into
                    our Redis cache, so the LangGraph agent can enforce them in real time — with zero
                    client-side latency.
                </ProseText>

                <InfoBox icon={<Server className="h-4 w-4" />} title="This is a server-side call" accent="blue">
                    Call this endpoint from your backend (Node.js, Python, etc.) — not from the browser.
                    Never expose your API key in frontend code.
                </InfoBox>

                <SectionTitle>Endpoint</SectionTitle>
                <CodeBlock language="http">POST https://ina-backend-fyp.onrender.com/api/v1/session/init</CodeBlock>

                <SectionTitle>Request Headers</SectionTitle>
                <CodeBlock language="http">{`Authorization: Bearer <YOUR_TENANT_API_KEY>
Content-Type: application/json`}</CodeBlock>

                <SectionTitle>Request Body (JSON)</SectionTitle>
                <ProseText>All four fields are required:</ProseText>
                <CodeBlock language="json">{`{
  "api_key":      "<YOUR_TENANT_API_KEY>",
  "tenant_id":    "<YOUR_TENANT_ID>",
  "mam":          420.00,
  "asking_price": 500.00
}`}</CodeBlock>

                <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden divide-y divide-white/5">
                    <div className="px-4 py-2 grid grid-cols-3 gap-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Field</span>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</span>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</span>
                    </div>
                    {[
                        ['api_key', 'string', 'Your Tenant API Key (server secret)'],
                        ['tenant_id', 'string', 'Your unique tenant identifier'],
                        ['mam', 'float', 'Minimum Acceptable Margin — floor price the AI will never go below'],
                        ['asking_price', 'float', 'The displayed product price (the starting negotiation anchor)'],
                    ].map(([field, type, desc]) => (
                        <div key={field} className="px-4 py-2.5 grid grid-cols-3 gap-2 text-sm">
                            <code className="text-violet-400">{field}</code>
                            <span className="text-slate-500">{type}</span>
                            <span className="text-slate-400">{desc}</span>
                        </div>
                    ))}
                </div>

                <SectionTitle>Success Response</SectionTitle>
                <CodeBlock language="json">{`{
  "session_id": "uuid-12345-abcde",
  "status":     "initialized"
}`}</CodeBlock>
                <ProseText>
                    Forward the <code className="text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded text-xs">session_id</code> to your
                    frontend and pass it as a prop to the chat widget.
                </ProseText>

                <SectionTitle>cURL Example</SectionTitle>
                <CodeBlock language="bash">{`curl -X POST "https://ina-backend-fyp.onrender.com/api/v1/session/init" \\
  -H "Authorization: Bearer ina_key_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "api_key":      "ina_key_...",
    "tenant_id":    "tenant-456",
    "mam":          420.00,
    "asking_price": 500.00
  }'`}</CodeBlock>
            </div>
        ),
    },

    // ------------------------------------------------------------------ //
    'success-protocol': {
        title: 'Success Protocol — Cryptographic Deal Verification',
        content: (
            <div className="space-y-5">
                <ProseText>
                    When the LangGraph agent reaches a final negotiated price, the deal is <em>not</em> confirmed
                    via a server-side callback or webhook. Instead, BargainBaaS uses a
                    <strong className="text-white"> Cryptographic Deal Verification</strong> flow:
                    your backend pulls the verified final price directly from our API, eliminating
                    any risk of client-side price tampering.
                </ProseText>

                <InfoBox icon={<ShieldCheck className="h-4 w-4" />} title="Why not webhooks?" accent="violet">
                    Webhooks add infrastructure complexity and introduce race conditions. Our verification
                    endpoint lets you retrieve the authoritative final price on demand, from your backend,
                    without any inbound network configuration.
                </InfoBox>

                <SectionTitle>The 4-Step Verification Flow</SectionTitle>
                <ol className="space-y-0">
                    <StepRow step="A" label="Widget signals deal complete">
                        The chat widget&apos;s negotiation graph reaches a terminal node. The widget emits
                        an event (or sets UI state) indicating a deal has been reached and exposes the
                        active <code className="text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded text-xs">session_id</code>.
                    </StepRow>
                    <StepRow step="B" label="Frontend calls your own backend">
                        Your frontend sends an authenticated request to{' '}
                        <strong className="text-white">your own backend endpoint</strong> (e.g.,
                        <code className="text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded text-xs">POST /api/checkout/verify</code>)
                        passing the <code className="text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded text-xs">session_id</code>.
                        No INA credentials leave your server.
                    </StepRow>
                    <StepRow step="C" label="Your backend verifies with INA">
                        Your backend makes a secure, authenticated call to the INA verification endpoint:
                    </StepRow>
                </ol>

                <CodeBlock language="http">{`GET https://ina-backend-fyp.onrender.com/api/v1/session/{session_id}/final_price
Authorization: Bearer <YOUR_TENANT_API_KEY>`}</CodeBlock>

                <ProseText>The INA backend returns the cryptographically locked final price:</ProseText>
                <CodeBlock language="json">{`{
  "session_id":          "uuid-12345-abcde",
  "tenant_id":           "tenant-456",
  "negotiation_status":  "deal_accepted",
  "final_price":         455.00
}`}</CodeBlock>

                <ol className="space-y-0 mt-2">
                    <StepRow step="D" label="Backend adds item to cart">
                        If <code className="text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded text-xs">negotiation_status === &quot;deal_accepted&quot;</code>,
                        your backend updates the product price to{' '}
                        <code className="text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded text-xs">final_price</code> in
                        your cart or order system and returns a success response to the frontend.
                        The user never sees or can manipulate the raw price value.
                    </StepRow>
                </ol>

                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                    <h4 className="text-sm font-semibold text-emerald-400 flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4" />
                        Why this is secure
                    </h4>
                    <ul className="text-sm text-slate-400 space-y-1 ml-6 list-disc">
                        <li>The final price is sourced from our backend — never from client-side state.</li>
                        <li>Your Tenant API Key never touches the browser.</li>
                        <li>The <code className="text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded text-xs">session_id</code> alone cannot produce an unauthorized price — the INA backend validates the session state.</li>
                    </ul>
                </div>
            </div>
        ),
    },

    // ------------------------------------------------------------------ //
    'calling-the-bot': {
        title: 'Calling the Chatbot (Widget)',
        content: (
            <div className="space-y-5">
                <ProseText>
                    After your backend has initialized the session and returned the{' '}
                    <code className="text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded text-xs">session_id</code> to
                    your frontend, you can mount the BargainBaaS chat widget.
                </ProseText>

                <InfoBox icon={<Info className="h-4 w-4" />} title="Order matters" accent="blue">
                    The session <strong className="text-blue-300">must</strong> be initialized server-side
                    before the widget is rendered. The widget uses the <code>session_id</code> to look up
                    the negotiation rules from Redis — if no session exists, the widget will error.
                </InfoBox>

                <SectionTitle>Widget Embedding</SectionTitle>
                <ProseText>
                    Place the snippet below on your product page. Substitute{' '}
                    <code className="text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded text-xs">SESSION_ID</code> with
                    the value returned from your backend&apos;s session init call.
                </ProseText>
                <CodeBlock language="html">{`<!-- Place this where you want the chat button to appear -->
<div
  id="bargainbaas-chat-widget"
  data-session-id="[SESSION_ID_FROM_YOUR_BACKEND]">
</div>
<script src="https://widget.ina.com/v1/loader.js"></script>`}</CodeBlock>

                <SectionTitle>React / Next.js Integration</SectionTitle>
                <CodeBlock language="tsx">{`// pages/products/[slug].tsx

export async function getServerSideProps({ params }) {
  // Server-side: initialize the session safely
  const res = await fetch('https://ina-backend-fyp.onrender.com/api/v1/session/init', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.INA_API_KEY}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key:      process.env.INA_API_KEY,
      tenant_id:    process.env.INA_TENANT_ID,
      mam:          product.mam,
      asking_price: product.price,
    }),
  });
  const { session_id } = await res.json();

  return { props: { session_id, product } };
}

// In your component, pass session_id to the ChatWidget
<ChatWidget sessionId={session_id} askingPrice={product.price} />`}</CodeBlock>

                <SectionTitle>Post-Deal Flow (Link to Success Protocol)</SectionTitle>
                <ProseText>
                    When the widget calls your callback signalling a deal, proceed with the{' '}
                    <Link href="/dashboard/documentation/success-protocol" className="text-violet-400 hover:underline">
                        Cryptographic Deal Verification
                    </Link>{' '}
                    flow to securely finalize the price. Never trust a price value that came from the browser.
                </ProseText>
            </div>
        ),
    },
};

// --- MAIN DYNAMIC COMPONENT ---
const DocumentationContent: PageWithLayout = () => {
    const router = useRouter();
    const slug = (router.query.slug as string) || 'introduction';
    const content = DOCS_CONTENT[slug];

    if (!content) {
        return (
            <DocsLayout pageTitle="Page Not Found">
                <p className="text-red-400 text-base">
                    404: Documentation page not found for slug: <strong>{slug}</strong>
                </p>
                <p className="mt-3 text-slate-400">Please use the sidebar to navigate to a valid page.</p>
            </DocsLayout>
        );
    }

    return (
        <DocsLayout pageTitle={content.title}>
            {content.content}
        </DocsLayout>
    );
};

DocumentationContent.getLayout = (page: React.ReactElement) => (
    <DashboardLayout pageTitle="Developer Guide">{page}</DashboardLayout>
);

export default DocumentationContent;