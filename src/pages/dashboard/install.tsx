import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { authFetch } from '../../services/api';
import { 
  Code, 
  Copy, 
  Check, 
  Terminal, 
  Info, 
  ShieldAlert, 
  FileCode, 
  ShoppingBag, 
  Cpu, 
  ExternalLink,
  Loader2,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';

interface ConfigurationData {
  client_api_key?: string;
  tenant_id?: string;
  webhook_secret?: string;
}

const InstallDashboard = () => {
  const [clientApiKey, setClientApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Platform tab switcher state
  const [activeTab, setActiveTab] = useState<'shopify' | 'woocommerce' | 'html'>('html');
  const [copied, setCopied] = useState(false);
  const [copiedHmac, setCopiedHmac] = useState(false);

  const [webhookSecret, setWebhookSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [secretCopied, setSecretCopied] = useState(false);

  // Fetch client API key
  useEffect(() => {
    const loadConfiguration = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authFetch('/configuration');
        const data: ConfigurationData = await response.json();
        setClientApiKey(data.client_api_key || '');
        setWebhookSecret(data.webhook_secret || 'whsec_test_fallback_secret_key_from_db');
      } catch (err: any) {
        console.error("Error loading configuration:", err);
        setError(err.message || "Failed to load API configuration.");
      } finally {
        setIsLoading(false);
      }
    };
    
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      window.location.href = '/auth/login';
    } else {
      loadConfiguration();
    }
  }, []);

  // Embed script snippet
  const embedCode = `<script src="https://YOUR-CDN-URL/widget/v1/loader.js" data-ina-tenant="${clientApiKey || '[DYNAMIC_TENANT_PUBLIC_KEY]'}" data-ina-product="" async></script>`;

  // Copy helper
  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Copy HMAC helper
  const handleCopyHmac = () => {
    navigator.clipboard.writeText(hmacVerificationCode).then(() => {
      setCopiedHmac(true);
      setTimeout(() => setCopiedHmac(false), 2000);
    });
  };

  // Node.js HMAC price verification code block
  const hmacVerificationCode = `const crypto = require('crypto');

/**
 * Validates that the negotiated price returned by the client-side session is authentic
 * and has not been tampered with.
 *
 * @param {string} sessionId - The BargainBaaS session ID
 * @param {number} askingPrice - The original listing price of the product
 * @param {number} finalPrice - The final negotiated price from the chat session
 * @param {string} signature - The HMAC-SHA256 signature returned by success protocols
 * @param {string} clientSecretKey - Your secure Private Client Secret Key
 * @returns {boolean} True if the negotiation price is authentic
 */
function verifyNegotiatedPrice(sessionId, askingPrice, finalPrice, signature, clientSecretKey) {
  // Re-build the verification message block as signed by BargainBaaS
  // Format: [sessionId]:[askingPrice]:[finalPrice]
  const message = \`\${sessionId}:\${askingPrice}:\${finalPrice}\`;

  // Compute the expected HMAC signature using your private client API secret
  const computedSignature = crypto
    .createHmac('sha256', clientSecretKey)
    .update(message)
    .digest('hex');

  // Verify signatures using timing-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(computedSignature, 'hex')
    );
  } catch (e) {
    return false;
  }
}`;

  return (
    <DashboardLayout pageTitle="Storefront Widget Installation">
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        
        {/* Intro */}
        <div className="space-y-1">
          <p className="text-slate-400 text-sm">
            Embed your AI negotiation agent into your ecommerce storefront in minutes. Follow the guides below to get started.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Section A - Code Copy Block Component */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Terminal className="h-4.5 w-4.5 text-violet-400" />
              Embed Loader Script
            </h2>
            <span className="text-[11px] text-slate-500 font-mono">CDN Loader V1</span>
          </div>

          <p className="text-xs text-slate-400">
            This tag must be placed in your global layout. Your public Tenant Client Key has been dynamically injected into the <code className="text-violet-400 font-mono">data-ina-tenant</code> attribute.
          </p>

          <div className="rounded-xl border border-white/10 bg-slate-950/85 overflow-hidden">
            {/* Header bar containing Copy Code to prevent overlapping */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/40 border-b border-white/5">
              <span className="text-[11px] font-semibold text-slate-400 font-mono uppercase">html</span>
              <button
                onClick={handleCopyCode}
                disabled={isLoading}
                className={`p-1.5 px-3 rounded-lg border text-[11px] font-medium transition flex items-center gap-1.5 ${
                  copied
                    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-40'
                }`}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>

            {isLoading ? (
              <div className="p-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
                Loading your Tenant Credentials...
              </div>
            ) : (
              <pre className="p-4 overflow-x-auto text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap select-all">
                {embedCode}
              </pre>
            )}
          </div>
        </div>

        {/* Webhook Secret Block */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <span>🔐 Your Secure Private Webhook Secret</span>
            </h2>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            This is your private server-side key used to compute HMAC-SHA256 signatures for order verification. <strong className="text-red-400 font-medium">NEVER</strong> expose this in client-side repositories or frontend code layouts.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative flex items-center rounded-xl border border-white/10 bg-slate-950/85 overflow-hidden">
              <input
                type="text"
                value={isLoading ? "••••••••••••••••" : (showSecret ? webhookSecret : '••••••••••••••••')}
                readOnly
                className="w-full bg-transparent px-4 py-3 text-xs font-mono text-slate-300 border-none focus:outline-none focus:ring-0 select-all"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-white transition"
                title={showSecret ? "Hide secret" : "Show secret"}
              >
                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(webhookSecret).then(() => {
                  setSecretCopied(true);
                  setTimeout(() => setSecretCopied(false), 2000);
                });
              }}
              disabled={isLoading || !webhookSecret}
              className={`p-3 px-5 rounded-xl border text-xs font-medium transition flex items-center justify-center gap-1.5 min-w-[120px] ${
                secretCopied
                  ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-40'
              }`}
            >
              {secretCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {secretCopied ? 'Copied!' : 'Copy Key'}
            </button>
          </div>
        </div>

        {/* Section B - Platform Tab Switcher */}
        <div className="space-y-4">
          <div className="border-b border-white/10">
            <nav className="flex space-x-4" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('html')}
                className={`py-3.5 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none flex items-center gap-2 ${
                  activeTab === 'html'
                    ? 'border-violet-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-300/20'
                }`}
              >
                <Code className="h-4 w-4" />
                Generic HTML
              </button>
              
              <button
                onClick={() => setActiveTab('shopify')}
                className={`py-3.5 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none flex items-center gap-2 ${
                  activeTab === 'shopify'
                    ? 'border-violet-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-300/20'
                }`}
              >
                <ShoppingBag className="h-4 w-4" />
                Shopify Theme
              </button>

              <button
                onClick={() => setActiveTab('woocommerce')}
                className={`py-3.5 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none flex items-center gap-2 ${
                  activeTab === 'woocommerce'
                    ? 'border-violet-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-300/20'
                }`}
              >
                <Cpu className="h-4 w-4" />
                WooCommerce (WP)
              </button>
            </nav>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm min-h-[220px]">
            {activeTab === 'html' && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-sm font-semibold text-white">Custom Web & Generic HTML Setup</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  For custom builds, Single Page Applications, or custom-built CMS systems, paste the loader script tag near the footer layout.
                </p>
                <ol className="list-decimal list-inside text-xs text-slate-400 space-y-2">
                  <li>Copy the loader code block from Section A.</li>
                  <li>Paste the script snippet before the closing <code className="text-slate-300 font-mono">{'</body>'}</code> tag of your global document layout template.</li>
                  <li>
                    Identify products dynamically by setting the <code className="text-violet-400 font-mono">data-ina-product</code> attribute dynamically on target product details templates (e.g. <code className="text-slate-300 font-mono">{"data-ina-product=\"SKU-2415\""}</code>).
                  </li>
                  <li>Deploy your storefront changes. The widget will automatically load and attach to eligible products.</li>
                </ol>
              </div>
            )}

            {activeTab === 'shopify' && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  Shopify Liquid theme Integration
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Inject the bargaining agent directly into your Liquid themes code editor:
                </p>
                <ol className="list-decimal list-inside text-xs text-slate-400 space-y-2">
                  <li>Navigate to your Shopify Dashboard, and select **Online Store** &rarr; **Themes**.</li>
                  <li>Click the **three dots** (Actions) on your live theme, and click **Edit Code**.</li>
                  <li>Open the layout file: <code className="text-slate-300 font-mono">layout/theme.liquid</code>.</li>
                  <li>
                    Scroll to the bottom of the file, and paste the code block snippet right before the closing Liquid markup tag <code className="text-slate-300 font-mono">{'</body>'}</code>.
                  </li>
                  <li>
                    Configure dynamic products by modifying the product variable field:
                    <div className="mt-2 p-3 rounded bg-slate-950/80 border border-white/5 font-mono text-[11px] text-violet-400 whitespace-pre-wrap select-all">
                      {`<script src="https://YOUR-CDN-URL/widget/v1/loader.js" data-ina-tenant="${clientApiKey || '[DYNAMIC_TENANT_PUBLIC_KEY]'}" data-ina-product="{{ product.id }}" async></script>`}
                    </div>
                  </li>
                </ol>
              </div>
            )}

            {activeTab === 'woocommerce' && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-sm font-semibold text-white">WooCommerce & WordPress Setup</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Integrate BargainBaaS into your WordPress active templates footer structure:
                </p>
                <ol className="list-decimal list-inside text-xs text-slate-400 space-y-2">
                  <li>Connect to your server directory or use a WordPress footer code injection plugin (e.g. *WPCode*).</li>
                  <li>If writing directly to file, open your active theme template path: <code className="text-slate-300 font-mono">wp-content/themes/your-theme/footer.php</code>.</li>
                  <li>
                    Insert the script tag near the bottom, before the standard <code className="text-slate-300 font-mono">wp_footer();</code> declaration call.
                  </li>
                  <li>
                    Bind product IDs dynamically using the global PHP template hook:
                    <div className="mt-2 p-3 rounded bg-slate-950/80 border border-white/5 font-mono text-[11px] text-violet-400 whitespace-pre-wrap select-all">
                      {`<script src="https://YOUR-CDN-URL/widget/v1/loader.js" data-ina-tenant="${clientApiKey || '[DYNAMIC_TENANT_PUBLIC_KEY]'}" data-ina-product="<?php echo get_the_ID(); ?>" async></script>`}
                    </div>
                  </li>
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Section C - Server-Side Document Block */}
        <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-sm space-y-4 relative overflow-hidden">
          {/* Subtle security lock watermark or glow */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-2.5">
            <ShieldAlert className="h-5 w-5 text-red-400" />
            <h2 className="text-base font-semibold text-white">
              Server-Side Order Price Verification Docs
            </h2>
          </div>

          {/* Secure Notice */}
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 leading-relaxed space-y-1.5">
            <p className="font-semibold text-white">⚠️ CRITICAL SECURITY WARNING: NEVER TRUST CLIENT DATA</p>
            <p>
              Front-end message triggers (e.g. <code className="text-white font-mono">postMessage</code> events or window variables) are display hints only and can be intercepted or manipulated by end-users. 
              Before charging orders, your backend checkout handler **must explicitly verify** the authenticity of the final price using the secure cryptographic HMAC-SHA256 signature provided by the success protocol payload.
            </p>
          </div>

          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Node.js HMAC Signature Verification Blueprint</h3>

          <div className="rounded-xl border border-white/10 bg-slate-950/90 overflow-hidden">
            {/* Header bar containing Copy Code to prevent overlapping */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/40 border-b border-white/5">
              <span className="text-[11px] font-semibold text-slate-400 font-mono uppercase">javascript / node</span>
              <button
                onClick={handleCopyHmac}
                className={`p-1.5 px-3 rounded-lg border text-[11px] font-medium transition flex items-center gap-1.5 ${
                  copiedHmac
                    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {copiedHmac ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedHmac ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            
            <pre className="p-4 overflow-x-auto text-[11px] text-slate-400 font-mono leading-relaxed select-all max-h-[350px]">
              {hmacVerificationCode}
            </pre>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default InstallDashboard;
