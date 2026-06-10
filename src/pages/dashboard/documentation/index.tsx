import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import {
  Check,
  Copy,
  Terminal,
  ShoppingCart,
  Shield,
  ChevronRight,
  BookOpen,
  Zap,
  AlertTriangle,
  Info,
} from 'lucide-react';

// ============================================================
// §A — STEP 1 CODE TEMPLATE LITERALS
// ============================================================

const STEP_1_SCRIPT = `import Script from 'next/script';

// Put this snippet inside your root app container layout file (e.g., _app.tsx or layout.tsx)
export default function Layout({ children }) {
  return (
    <>
      <Script
        src="https://ina-backend-fyp.onrender.com/widget/loader.js"
        data-ina-tenant={process.env.NEXT_PUBLIC_INA_PUBLIC_KEY}
        data-ina-product-route="/product/:id"
        strategy="afterInteractive"
      />
      {children}
    </>
  );
}
`;

const STEP_1_VANILLA = `<script 
  src="https://ina-backend-fyp.onrender.com/widget/loader.js"
  data-ina-tenant="YOUR_MERCHANT_PUBLIC_API_KEY"
  data-ina-product-route="/product/:id"
  async>
</script>
`;

// ============================================================
// §B — STEP 2 CODE TEMPLATE LITERALS
// ============================================================

const STEP_2_STORE = `import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/data/products';

export interface CartItem {
  id: string;
  name: string;
  imageUrl: string;
  originalPrice: number;
  finalPrice: number;
  quantity: number;
  // === BARGAIN_BAAS_INTEGRATION_START ===
  /** BargainBaaS negotiation session ID, present only when the price was negotiated */
  sessionId?: string;
  // === BARGAIN_BAAS_INTEGRATION_END ===
}

interface CartStore {
  items: CartItem[];
  // === BARGAIN_BAAS_INTEGRATION_START ===
  addToCart: (product: Product, negotiatedPrice?: number, sessionId?: string) => void;
  // === BARGAIN_BAAS_INTEGRATION_END ===
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product, negotiatedPrice, sessionId) => {
        const finalPrice = negotiatedPrice ?? product.originalPrice;
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1, finalPrice }
                  : item
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                id: product.id,
                name: product.name,
                imageUrl: product.imageUrl,
                originalPrice: product.originalPrice,
                finalPrice,
                quantity: 1,
                // === BARGAIN_BAAS_INTEGRATION_START ===
                // Store the session ID to forward to checkout verification proxy
                ...(sessionId !== undefined && { sessionId }),
                // === BARGAIN_BAAS_INTEGRATION_END ===
              },
            ],
          };
        });
      },
      removeFromCart: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      clearCart: () => set({ items: [] }),
      cartTotal: () => get().items.reduce((total, item) => total + item.finalPrice * item.quantity, 0),
      cartCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
    }),
    { name: 'techstore-cart' }
  )
);
`;

const STEP_2_BRIDGE = `// Add these lifecycle sync side-effects inside your custom product detail page component
// This handles silent handshake mappings without disrupting native storefront element layouts

const [negotiatedPrice, setNegotiatedPrice] = useState<number | null>(null);
const [negotiationSessionId, setNegotiationSessionId] = useState<string | null>(null);

// Flush stale negotiation records when moving across dynamic browser pathways
useEffect(() => {
  setNegotiatedPrice(null);
  setNegotiationSessionId(null);
}, [id]);

// Emit active state product validation maps directly to the tracking bundle script layers
useEffect(() => {
  if (!product) return;
  if (typeof window !== 'undefined' && typeof window.INA === 'function') {
    window.INA('product-change', { productId: product?.id });
  }
}, [product?.id]);

// Event Bridge: Listen for valid bargain state responses securely out of frame space
useEffect(() => {
  if (!product) return;
  function handleINAMessage(event: MessageEvent) {
    if (event.origin !== window.location.origin) return;
    const data = event.data;
    if (!data || data.source !== 'ina-widget' || data.type !== 'BARGAIN_BAAS_SUCCESS') return;
    if (data.productId !== product?.id) return;

    const agreedPrice = data.finalPrice ?? data.price;
    if (!agreedPrice || !data.sessionId) return;

    setNegotiatedPrice(agreedPrice);
    setNegotiationSessionId(data.sessionId);
  }
  window.addEventListener('message', handleINAMessage);
  return () => window.removeEventListener('message', handleINAMessage);
}, [product]);
`;

// ============================================================
// §C — STEP 3 CODE TEMPLATE LITERALS
// ============================================================

const STEP_3_CHECKOUT = `// Intercept your checkout button handler routing processes to prevent client storage spoofing attacks
const [isVerifying, setIsVerifying] = useState(false);
const [verifyError, setVerifyError] = useState<string | null>(null);

async function handleCheckout() {
  setVerifyError(null);
  setIsVerifying(true);
  const negotiatedItems = items.filter((item) => item.sessionId);

  for (const item of negotiatedItems) {
    try {
      const res = await fetch('/api/verify-deal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: item.sessionId,
          productId: item.id,
          finalPrice: item.finalPrice,
        }),
      });
      const data = await res.json();
      if (!data.verified) {
        setVerifyError(\`Price validation failed for "\${item.name}". Please renegotiate.\`);
        setIsVerifying(false);
        return;
      }
    } catch {
      setVerifyError(\`Network synchronization error tracking validation parameters.\`);
      setIsVerifying(false);
      return;
    }
  }
  setIsVerifying(false);
  router.push('/checkout');
}
`;

const STEP_3_PROXY = `import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { sessionId, productId, finalPrice } = req.body ?? {};
  
  const webhookSecret = process.env.INA_WEBHOOK_SECRET;
  const tenantId = process.env.INA_TENANT_ID;
  const verifyUrl = process.env.INA_VERIFY_URL || 'https://ina-backend-fyp.onrender.com/api/saas/session/verify';

  if (!webhookSecret || !tenantId) return res.status(500).json({ verified: false, error: 'Merchant context configurations missing' });

  const body = JSON.stringify({ session_id: sessionId, final_price: Number(finalPrice) });
  const timestamp = Date.now().toString();
  const signature = crypto.createHmac('sha256', webhookSecret).update(\`\${timestamp}.\${body}\`).digest('hex');

  try {
    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-INA-Tenant': tenantId,
        'X-INA-Timestamp': timestamp,
        'X-INA-Signature': signature,
      },
      body,
    });
    const data = await response.json();
    return res.status(200).json({ verified: response.ok && data?.valid });
  } catch {
    return res.status(502).json({ verified: false, error: 'Central auth clusters unreachable.' });
  }
}
`;

// ============================================================
// CodeBlock Component
// ============================================================

interface CodeBlockProps {
  code: string;
  lang?: string;
  label?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, lang = 'typescript', label }) => {
  const [copied, setCopied] = useState(false);

  const doCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative rounded-xl bg-slate-950 border border-white/10 overflow-hidden my-4 shadow-xl shadow-black/30">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-slate-900/80">
        <div className="flex items-center gap-3">
          {/* Traffic light dots */}
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {label ? `${label} · ` : ''}{lang}
          </span>
        </div>
        <button
          onClick={doCopy}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1 rounded-md border border-white/10 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-200"
        >
          {copied
            ? <Check className="h-3.5 w-3.5 text-emerald-400" />
            : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      {/* Code content */}
      <pre className="bg-slate-900 text-slate-100 p-5 rounded-b-xl overflow-x-auto text-sm font-mono border border-slate-800 leading-relaxed">
        {code.trimStart()}
      </pre>
    </div>
  );
};

// ============================================================
// StepPill Component
// ============================================================

const stepConfig = [
  {
    number: '01',
    title: 'Add the Script Tag',
    icon: Terminal,
    accentClass: 'border-violet-500 bg-violet-500/10 text-violet-300',
    badgeClass: 'bg-violet-600 text-white',
    dotClass: 'bg-violet-400',
  },
  {
    number: '02',
    title: 'Update Your Cart Schema',
    icon: ShoppingCart,
    accentClass: 'border-blue-500 bg-blue-500/10 text-blue-300',
    badgeClass: 'bg-blue-600 text-white',
    dotClass: 'bg-blue-400',
  },
  {
    number: '03',
    title: 'Backend Deal Verification',
    icon: Shield,
    accentClass: 'border-emerald-500 bg-emerald-500/10 text-emerald-300',
    badgeClass: 'bg-emerald-600 text-white',
    dotClass: 'bg-emerald-400',
  },
];

// ============================================================
// SubTab Button helper
// ============================================================

interface SubTabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const SubTab: React.FC<SubTabProps> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all duration-200 ${
      active
        ? 'border-violet-500 bg-violet-500/15 text-violet-200 shadow-sm shadow-violet-500/20'
        : 'border-white/10 bg-white/5 text-slate-400 hover:text-slate-200 hover:border-white/20'
    }`}
  >
    {label}
  </button>
);

// ============================================================
// Info/Warning callout blocks
// ============================================================

const InfoBox: React.FC<{ children: React.ReactNode; variant?: 'info' | 'warning' }> = ({
  children,
  variant = 'info',
}) => {
  const styles =
    variant === 'warning'
      ? 'border-amber-500/30 bg-amber-500/5 text-amber-300'
      : 'border-blue-500/30 bg-blue-500/5 text-blue-300';
  const Icon = variant === 'warning' ? AlertTriangle : Info;
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${styles}`}>
      <Icon className="h-4 w-4 mt-0.5 shrink-0" />
      <div className="leading-relaxed">{children}</div>
    </div>
  );
};

// ============================================================
// Step Panel Components
// ============================================================

const Step1Panel: React.FC = () => {
  const [tab, setTab] = useState<'next' | 'vanilla'>('next');

  return (
    <div className="space-y-5">
      {/* Section header */}
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-violet-600/15 border border-violet-500/30 shrink-0">
          <Terminal className="h-5 w-5 text-violet-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Add the Loader Script</h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
            Paste this script tag once into your storefront root layout. The BargainBaaS loader
            is lightweight, non-blocking, and automatically handles SPA route injection.
            It detects the active product page and mounts the negotiation widget autonomously.
          </p>
        </div>
      </div>

      <InfoBox>
        Set your <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded">NEXT_PUBLIC_INA_PUBLIC_KEY</code> (or the equivalent
        plain-text attribute) to your Merchant Public API Key found in the{' '}
        <strong className="text-white">API Integration</strong> tab of this dashboard.
      </InfoBox>

      {/* Platform sub-tabs */}
      <div className="flex gap-2 pt-1">
        <SubTab label="Next.js" active={tab === 'next'} onClick={() => setTab('next')} />
        <SubTab label="Vanilla / HTML" active={tab === 'vanilla'} onClick={() => setTab('vanilla')} />
      </div>

      {tab === 'next' && (
        <div className="space-y-3">
          <p className="text-sm text-slate-400">
            Use Next.js&apos;s built-in{' '}
            <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded text-violet-300">
              {'<Script>'}
            </code>{' '}
            component with <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded text-violet-300">strategy="afterInteractive"</code>{' '}
            to guarantee the widget loads after hydration without blocking your critical render path.
            Place this in your root layout file (<code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded">_app.tsx</code> or{' '}
            <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded">layout.tsx</code>).
          </p>
          <CodeBlock code={STEP_1_SCRIPT} lang="tsx" label="layout.tsx" />
        </div>
      )}

      {tab === 'vanilla' && (
        <div className="space-y-3">
          <p className="text-sm text-slate-400">
            For plain HTML storefronts, drop this{' '}
            <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded text-violet-300">{'<script>'}</code>{' '}
            tag before the closing{' '}
            <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded text-violet-300">{'</body>'}</code>{' '}
            tag of your base template. Replace the{' '}
            <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded">
              YOUR_MERCHANT_PUBLIC_API_KEY
            </code>{' '}
            placeholder with your actual key.
          </p>
          <CodeBlock code={STEP_1_VANILLA} lang="html" label="index.html" />
        </div>
      )}

      <InfoBox variant="warning">
        The <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded">data-ina-product-route</code> attribute
        must match the URL pattern of your product detail pages exactly (e.g.{' '}
        <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded">/product/:id</code>
        ). Mismatch will prevent widget injection.
      </InfoBox>
    </div>
  );
};

// ---------------------------------------------------------------

const Step2Panel: React.FC = () => (
  <div className="space-y-6">
    {/* Section header */}
    <div className="flex items-start gap-4">
      <div className="p-2.5 rounded-xl bg-blue-600/15 border border-blue-500/30 shrink-0">
        <ShoppingCart className="h-5 w-5 text-blue-400" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Update Your Cart Schema</h2>
        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
          BargainBaaS needs two lightweight schema additions to your cart state layer. These
          changes are backwards-compatible — retail (non-negotiated) cart items are completely
          unaffected. The{' '}
          <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded text-blue-300">
            sessionId
          </code>{' '}
          field is the cryptographic anchor that links a cart line to a verified negotiation
          session on the backend.
        </p>
      </div>
    </div>

    <InfoBox>
      Lines marked with{' '}
      <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded">
        // === BARGAIN_BAAS_INTEGRATION_START ===
      </code>{' '}
      and{' '}
      <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded">
        // === BARGAIN_BAAS_INTEGRATION_END ===
      </code>{' '}
      mark every integration touchpoint for easy auditing and rollback.
    </InfoBox>

    {/* Part A */}
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold shrink-0">
          A
        </span>
        <h3 className="text-sm font-semibold text-slate-200">
          Extended Cart Store Declaration
        </h3>
      </div>
      <p className="text-sm text-slate-400 mb-2 leading-relaxed">
        Replace your existing cart store definition with this extended version. It adds the optional{' '}
        <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded text-blue-300">sessionId</code>{' '}
        field to{' '}
        <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded text-blue-300">CartItem</code>{' '}
        and accepts optional negotiation parameters in{' '}
        <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded text-blue-300">addToCart</code>.
      </p>
      <CodeBlock code={STEP_2_STORE} lang="typescript" label="store/cart.ts" />
    </div>

    {/* Part B */}
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold shrink-0">
          B
        </span>
        <h3 className="text-sm font-semibold text-slate-200">
          PostMessage Event Bridge
        </h3>
      </div>
      <p className="text-sm text-slate-400 mb-2 leading-relaxed">
        Drop these lifecycle hooks into your product detail page component. The bridge listens
        for the{' '}
        <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded text-blue-300">
          BARGAIN_BAAS_SUCCESS
        </code>{' '}
        postMessage emitted by the negotiation iframe and safely forwards the agreed price and
        session token into your local React state — ready for cart insertion.
      </p>
      <CodeBlock code={STEP_2_BRIDGE} lang="tsx" label="pages/product/[id].tsx" />
    </div>

    <InfoBox variant="warning">
      Always validate <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded">event.origin</code> before
      consuming a postMessage payload. The bridge above enforces same-origin checks to prevent
      cross-origin injection attacks.
    </InfoBox>
  </div>
);

// ---------------------------------------------------------------

const Step3Panel: React.FC = () => {
  const [tab, setTab] = useState<'checkout' | 'proxy'>('checkout');

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-emerald-600/15 border border-emerald-500/30 shrink-0">
          <Shield className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Backend Deal Verification</h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
            Client-side state is inherently untrusted. Before processing payment, your server
            must cryptographically assert with the BargainBaaS backend that each negotiated
            price is authentic and still valid. This two-part implementation closes the attack
            surface against client storage spoofing and replay attacks.
          </p>
        </div>
      </div>

      <InfoBox variant="warning">
        <strong className="text-white">Never skip server-side verification.</strong> A malicious
        user can freely modify{' '}
        <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded">localStorage</code>{' '}
        or intercept XHR requests to inject an arbitrary{' '}
        <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded">finalPrice</code>.
        The HMAC-SHA256 signature scheme below makes server forgery computationally infeasible.
      </InfoBox>

      {/* Sub-tabs */}
      <div className="flex gap-2 pt-1">
        <SubTab
          label="Checkout Interceptor Loop"
          active={tab === 'checkout'}
          onClick={() => setTab('checkout')}
        />
        <SubTab
          label="Secure API Proxy Gateway"
          active={tab === 'proxy'}
          onClick={() => setTab('proxy')}
        />
      </div>

      {tab === 'checkout' && (
        <div className="space-y-3">
          <p className="text-sm text-slate-400 leading-relaxed">
            Replace your existing checkout handler with this interceptor. It isolates all cart
            items that carry a{' '}
            <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded text-emerald-300">
              sessionId
            </code>
            , sequentially verifies each against the proxy gateway, and only proceeds to{' '}
            <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded text-emerald-300">
              /checkout
            </code>{' '}
            when every deal is confirmed valid. Standard (non-negotiated) items pass through
            without any additional round-trip.
          </p>
          <CodeBlock code={STEP_3_CHECKOUT} lang="tsx" label="components/Cart.tsx" />
        </div>
      )}

      {tab === 'proxy' && (
        <div className="space-y-3">
          <p className="text-sm text-slate-400 leading-relaxed">
            Create this file at{' '}
            <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded text-emerald-300">
              pages/api/verify-deal.ts
            </code>
            . It acts as a secure server-side proxy: it receives the session token and claimed
            price from your checkout UI, constructs a timestamped HMAC-SHA256 signature using
            your{' '}
            <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded">
              INA_WEBHOOK_SECRET
            </code>
            , and forwards the request to the BargainBaaS verification endpoint. The secret
            never leaves your server.
          </p>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'INA_WEBHOOK_SECRET', hint: 'From your API Integration tab' },
              { key: 'INA_TENANT_ID', hint: 'Your numeric tenant ID' },
              { key: 'INA_VERIFY_URL', hint: 'Optional — defaults to production endpoint' },
            ].map(({ key, hint }) => (
              <div
                key={key}
                className="flex-1 min-w-[200px] flex items-start gap-2 px-3 py-2.5 rounded-lg bg-slate-800/60 border border-white/10"
              >
                <span className="w-2 h-2 mt-1.5 rounded-full bg-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-mono text-emerald-300">{key}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{hint}</p>
                </div>
              </div>
            ))}
          </div>
          <CodeBlock code={STEP_3_PROXY} lang="typescript" label="pages/api/verify-deal.ts" />
        </div>
      )}
    </div>
  );
};

// ============================================================
// Main Documentation Page
// ============================================================

const Documentation = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <DashboardLayout pageTitle="Integration Guide">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ── Page Hero ── */}
        <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-violet-900/20 px-6 py-8 overflow-hidden">
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-violet-600/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 w-48 h-48 rounded-full bg-blue-600/8 blur-2xl" />

          <div className="relative flex items-start gap-4">
            <div className="p-3 rounded-xl bg-violet-600/20 border border-violet-500/30 shrink-0">
              <BookOpen className="h-6 w-6 text-violet-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-3.5 w-3.5 text-violet-400" />
                <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest">
                  Developer Integration Guide
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-white mb-2 tracking-tight">
                Embed the BargainBaaS Negotiation Widget
              </h1>
              <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                This walkthrough outlines embedding an autonomous, zero-trust negotiation
                interface directly within your tenant storefront. Follow the three steps below
                to go from zero to a fully verified, cryptographically secure bargaining
                integration — with no changes to your existing product catalogue or checkout
                infrastructure.
              </p>
            </div>
          </div>
        </div>

        {/* ── Step Navigation Pipeline ── */}
        <div className="flex flex-wrap items-center gap-2">
          {stepConfig.map((step, i) => {
            const Icon = step.icon;
            const isActive = activeStep === i;
            const isDone = activeStep > i;

            return (
              <React.Fragment key={i}>
                <button
                  id={`doc-step-${step.number}`}
                  onClick={() => setActiveStep(i)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all duration-200 text-sm font-semibold shadow-sm ${
                    isActive
                      ? `${step.accentClass} shadow-md`
                      : isDone
                      ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400'
                      : 'border-white/10 bg-white/5 text-slate-500 hover:text-slate-300 hover:border-white/20'
                  }`}
                >
                  {/* Step number badge */}
                  <span
                    className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-extrabold shrink-0 transition-colors ${
                      isActive
                        ? step.badgeClass
                        : isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {isDone ? <Check className="h-3.5 w-3.5" /> : step.number}
                  </span>
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{step.title}</span>
                </button>

                {i < stepConfig.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-slate-700 mx-1 hidden md:block shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ── Active Step Panel ── */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 md:p-8 shadow-xl shadow-black/20 backdrop-blur">
          {activeStep === 0 && <Step1Panel />}
          {activeStep === 1 && <Step2Panel />}
          {activeStep === 2 && <Step3Panel />}
        </div>

        {/* ── Bottom Navigation Controls ── */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
            disabled={activeStep === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            ← Previous
          </button>

          <span className="text-xs text-slate-600 font-mono">
            Step {activeStep + 1} of {stepConfig.length}
          </span>

          <button
            onClick={() => setActiveStep((s) => Math.min(stepConfig.length - 1, s + 1))}
            disabled={activeStep === stepConfig.length - 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-violet-500/40 bg-violet-600/10 text-sm font-medium text-violet-300 hover:bg-violet-600/20 hover:border-violet-400/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            Next Step →
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Documentation;