import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Check, Copy, Terminal, ShoppingCart, Shield, ChevronRight } from 'lucide-react';

const CodeBlock = ({ code, lang = 'bash' }: { code: string; lang?: string }) => {
  const [copied, setCopied] = useState(false);
  const doCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="relative rounded-xl bg-slate-950 border border-white/10 overflow-hidden my-3">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
        <span className="text-xs text-slate-500 font-mono">{lang}</span>
        <button onClick={doCopy} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition">
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 text-xs text-slate-300 font-mono overflow-x-auto whitespace-pre leading-relaxed">
        {code.trimStart()}
      </pre>
    </div>
  );
};

const STEP_1_VANILLA = `<script\n  src="https://ina-backend-fyp.onrender.com/widget/loader.js"\n  data-ina-tenant="YOUR_PUBLIC_API_KEY"\n  data-ina-product-route="/product/:id"\n  async\n></script>`;
const STEP_1_NEXT = `// pages/_app.tsx (or app/layout.tsx)\nimport Script from 'next/script';\n\nexport default function App({ Component, pageProps }) {\n  return (\n    <>\n      <Script\n        src="https://ina-backend-fyp.onrender.com/widget/loader.js"\n        data-ina-tenant={process.env.NEXT_PUBLIC_INA_TENANT_KEY}\n        data-ina-product-route="/product/:id"\n        strategy="afterInteractive"\n      />\n      <Component {...pageProps} />\n    </>\n  );\n}`;
const STEP_1_SHOPIFY = `{%- comment -%} Add to theme.liquid, just before </head> {%- endcomment -%}\n<script\n  src="https://ina-backend-fyp.onrender.com/widget/loader.js"\n  data-ina-tenant="{{ shop.metafields.bargainbaas.public_key }}"\n  data-ina-product-route="/products/:id"\n  async\n></script>`;

const STEP_2_CART_ITEM = `export interface CartItem {\n  id: string;\n  name: string;\n  imageUrl: string;\n  originalPrice: number;\n  finalPrice: number; // originalPrice for retail; deal price for negotiated\n  quantity: number;\n  currency: string;\n  sessionId?: string; // present ONLY for negotiated items\n}`;

const STEP_2_LISTENER = `useEffect(() => {\n  function onMessage(e: MessageEvent) {\n    if (e.data?.type !== 'BARGAIN_BAAS_SUCCESS') return;\n    const { sessionId, productId, finalPrice, currency } = e.data;\n    if (productId !== currentProductId) return;\n    \n    cartStore.addNegotiatedItem(\n      { id: productId, name, imageUrl, originalPrice, currency },\n      finalPrice,\n      sessionId\n    );\n  }\n  window.addEventListener('message', onMessage);\n  return () => window.removeEventListener('message', onMessage);\n}, [currentProductId]);`;

const STEP_3_ENV = `INA_WEBHOOK_SECRET=whsec_your_secret_from_dashboard\nINA_TENANT_ID=42\nINA_BACKEND_URL=https://ina-backend-fyp.onrender.com`;

const STEP_3_API_ROUTE = `import type { NextApiRequest, NextApiResponse } from 'next';\nimport crypto from 'crypto';\n\nexport default async function handler(req: NextApiRequest, res: NextApiResponse) {\n  if (req.method !== 'POST') return res.status(405).end();\n  const { sessionId, productId, finalPrice } = req.body;\n  const body = JSON.stringify({ session_id: sessionId, final_price: finalPrice });\n  const timestamp = Date.now().toString();\n  const signature = crypto\n    .createHmac('sha256', process.env.INA_WEBHOOK_SECRET!)\n    .update(\`\${timestamp}.\${body}\`)\n    .digest('hex');\n\n  const inaRes = await fetch(\`\${process.env.INA_BACKEND_URL}/api/saas/session/verify\`, {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json',\n      'X-INA-Tenant': process.env.INA_TENANT_ID!,\n      'X-INA-Timestamp': timestamp,\n      'X-INA-Signature': signature,\n    },\n    body\n  });\n  const data = await inaRes.json().catch(() => ({}));\n  return res.status(inaRes.status).json({ valid: inaRes.ok && data.valid === true });\n}`;

const STEP_3_CHECKOUT = `async function handleCheckout() {\n  const negotiatedItems = items.filter((item) => item.sessionId);\n  const results = await Promise.all(\n    negotiatedItems.map(async (item) => {\n      const res = await fetch('/api/verify-deal', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({ sessionId: item.sessionId, productId: item.id, finalPrice: item.finalPrice })\n      });\n      const data = await res.json();\n      return { item, valid: res.ok && data.valid === true };\n    })\n  );\n  const failed = results.filter((r) => !r.valid);\n  if (failed.length > 0) {\n    setError(\`Price validation failed for: \${failed.map(r => r.item.name).join(', ')}\`);\n    return;\n  }\n  router.push('/checkout');\n}`;

const steps = [
  { number: '01', title: 'Add the Script Tag', icon: Terminal, color: 'violet' },
  { number: '02', title: 'Update Your Cart Schema', icon: ShoppingCart, color: 'blue' },
  { number: '03', title: 'Backend Deal Verification', icon: Shield, color: 'emerald' }
];

const colorMap: Record<string, string> = {
  violet: 'border-violet-500 bg-violet-500/10 text-violet-400',
  blue: 'border-blue-500 bg-blue-500/10 text-blue-400',
  emerald: 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
};

const Documentation = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [platformTab, setPlatformTab] = useState<'next' | 'vanilla' | 'shopify'>('next');

  return (
    <DashboardLayout pageTitle="Integration Guide">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = activeStep === i;
            const isDone = activeStep > i;
            return (
              <React.Fragment key={i}>
                <button
                  onClick={() => setActiveStep(i)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all text-sm font-medium ${
                    isActive ? colorMap[step.color] : isDone ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400' : 'border-white/10 bg-white/5 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border ${isActive ? 'border-current bg-current/20' : 'border-white/25'}`}>
                    {step.number}
                  </div>
                  <Icon className="h-4 w-4" />
                  <span>{step.title}</span>
                </button>
                {i < steps.length - 1 && <ChevronRight className="h-4 w-4 text-slate-700 mx-1 hidden md:block" />}
              </React.Fragment>
            );
          })}
        </div>

        {activeStep === 0 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Step 1 - Add the Loader Script</h2>
              <p className="text-sm text-slate-400">Paste this script tag once into your storefront footer layout layers. The loader is lightweight, non-blocking, and automatically handles SPA path injection.</p>
            </div>
            <div className="flex gap-2">
              {(['next', 'vanilla', 'shopify'] as const).map((p) => (
                <button key={p} onClick={() => setPlatformTab(p)} className={`px-4 py-1.5 rounded-lg text-xs font-medium border transition ${platformTab === p ? 'border-violet-500 bg-violet-500/10 text-violet-300' : 'border-white/10 bg-white/5 text-slate-400'}`}>
                  {p === 'next' ? 'Next.js' : p === 'vanilla' ? 'Vanilla / HTML' : 'Shopify Liquid'}
                </button>
              ))}
            </div>
            {platformTab === 'vanilla' && <CodeBlock code={STEP_1_VANILLA} lang="html" />}
            {platformTab === 'next' && <CodeBlock code={STEP_1_NEXT} lang="tsx" />}
            {platformTab === 'shopify' && <CodeBlock code={STEP_1_SHOPIFY} lang="liquid" />}
          </div>
        )}

        {activeStep === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Step 2 - Update Your Cart Schema</h2>
              <p className="text-sm text-slate-400">Your cart line elements must bind a conditional tracking token identifier.</p>
            </div>
            <CodeBlock code={STEP_2_CART_ITEM} lang="typescript" />
            <h3 className="text-sm font-semibold text-slate-300 mt-4">Listening for Success Handshakes</h3>
            <CodeBlock code={STEP_2_LISTENER} lang="tsx" />
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Step 3 - Backend Deal Validation</h2>
              <p className="text-sm text-slate-400">Before allowing standard secure checkout processing payment arrays, enforce cryptographic server signature assertions.</p>
            </div>
            <CodeBlock code={STEP_3_ENV} lang="bash" />
            <h3 className="text-sm font-semibold text-slate-300 mt-4">Verify Route Blueprint</h3>
            <CodeBlock code={STEP_3_API_ROUTE} lang="typescript" />
            <h3 className="text-sm font-semibold text-slate-300 mt-4">Parallel Verification Loop</h3>
            <CodeBlock code={STEP_3_CHECKOUT} lang="tsx" />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Documentation;