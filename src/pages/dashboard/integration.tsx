import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Key, Copy, Check, AlertTriangle, Hash, Shield, Eye, EyeOff } from 'lucide-react';
import { authFetch } from '../../services/api';

const Integration = () => {
  const [apiKey, setApiKey] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const VERIFY_URL = 'https://ina-backend-fyp.onrender.com/api/saas/session/verify';
  const WIDGET_URL = 'https://bargain-widget.vercel.app/loader.js';

  const decodeJwt = (token: string): Record<string, any> | null => {
    try {
      const b = token.split('.')[1];
      return JSON.parse(atob(b.replace(/-/g, '+').replace(/_/g, '/')));
    } catch { return null; }
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await authFetch('/configuration');
        const data = await res.json();
        setApiKey(data.client_api_key || '');
        setWebhookSecret(data.webhook_secret || '');
        
        const token = localStorage.getItem('jwt_token');
        const payload = token ? decodeJwt(token) : null;
        setTenantId(String(data.tenant_id || payload?.tenant_id || payload?.sub || ''));
      } catch (err: any) {
        setError(err.message || 'Failed to load configuration.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const copy = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const CopyBtn = ({ value, field }: { value: string; field: string }) => (
    <button
      onClick={() => copy(value, field)}
      disabled={!value}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white transition disabled:opacity-40"
    >
      {copied === field ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      {copied === field ? 'Copied' : 'Copy'}
    </button>
  );

  return (
    <DashboardLayout pageTitle="API Keys & Integration">
      <div className="max-w-3xl mx-auto space-y-5">
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
          <div className="flex items-center gap-2 mb-3">
            <Hash className="h-4 w-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-white">Tenant ID</h2>
            <span className="ml-auto text-xs text-slate-500">Used as <code className="text-slate-300">X-INA-Tenant</code> header (numeric integer)</span>
          </div>
          <div className="flex items-center gap-2">
            <input readOnly value={isLoading ? 'Loading...' : tenantId || '-'} className="flex-1 px-3 py-2 bg-slate-900/60 border border-white/10 rounded-lg text-slate-300 font-mono text-sm focus:outline-none" />
            <CopyBtn value={tenantId} field="tenantId" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-violet-500/30 bg-violet-500/5" style={{ boxShadow: '0 0 30px -10px rgba(139,92,246,0.3)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Key className="h-4 w-4 text-violet-400" />
            <h2 className="text-sm font-semibold text-white">Public API Key</h2>
            <span className="ml-auto text-xs text-slate-500">Used in <code className="text-slate-300">data-ina-tenant</code> script attribute</span>
          </div>
          <div className="flex items-center gap-2">
            <input readOnly value={isLoading ? 'Loading...' : apiKey || '-'} className="flex-1 px-3 py-2 bg-slate-900/60 border border-violet-500/20 rounded-lg text-slate-300 font-mono text-sm focus:outline-none" />
            <CopyBtn value={apiKey} field="apiKey" />
          </div>
          <p className="mt-2 text-xs text-slate-500">Safe to embed in your storefront&apos;s HTML - this key identifies your tenant publicly.</p>
        </div>

        {/* Live Widget CDN Loader URL Reference */}
        <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Key className="h-4 w-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-white">Widget Loader Script URL</h2>
            <span className="ml-auto text-xs text-slate-500">Used as the global <code className="text-slate-300">src</code> target path</span>
          </div>
          <div className="flex items-center gap-2">
            <input readOnly value={WIDGET_URL} className="flex-1 px-3 py-2 bg-slate-900/60 border border-blue-500/20 rounded-lg text-slate-300 font-mono text-sm focus:outline-none" />
            <CopyBtn value={WIDGET_URL} field="widgetUrl" />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Provide this direct distribution script path link inside your storefront integrations so the bargaining module initializes seamlessly on runtime shifts.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white">Webhook Secret</h2>
            <span className="ml-auto text-xs text-slate-500">Used to sign <code className="text-slate-300">X-INA-Signature</code> server-side</span>
          </div>
          <div className="flex items-center gap-2">
            <input readOnly type={showSecret ? 'text' : 'password'} value={isLoading ? 'Loading...' : webhookSecret || '-'} className="flex-1 px-3 py-2 bg-slate-900/60 border border-amber-500/20 rounded-lg text-slate-300 font-mono text-sm focus:outline-none" />
            <button onClick={() => setShowSecret((v) => !v)} className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition">
              {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <CopyBtn value={webhookSecret} field="secret" />
          </div>
          <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-xs text-red-400 flex items-start gap-2">
              <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Never expose this secret in client-side code or version control.</strong> Store it in your server&apos;s environment variables only (e.g., <code className="font-mono">INA_WEBHOOK_SECRET</code>). All deal verification calls using this secret must originate from your backend server.
              </span>
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">Deal Verification Endpoint</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs font-bold bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded font-mono">POST</span>
            <input readOnly value={VERIFY_URL} className="flex-1 px-3 py-2 bg-slate-900/60 border border-white/10 rounded-lg text-slate-300 font-mono text-xs focus:outline-none" />
            <CopyBtn value={VERIFY_URL} field="verifyUrl" />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Your backend calls this endpoint with <code className="text-slate-300">X-INA-Tenant</code>, <code className="text-slate-300">X-INA-Timestamp</code>, and <code className="text-slate-300">X-INA-Signature</code> headers to validate a negotiated price before checkout. See the Documentation page for the full implementation.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Integration;