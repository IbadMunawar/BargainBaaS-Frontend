import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Key, Copy, Check, AlertTriangle, Zap, Hash, Globe } from 'lucide-react';
import { authFetch } from '../../services/api';

const Integration = () => {
  const [apiKey, setApiKey] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isTenantIdCopied, setIsTenantIdCopied] = useState(false);

  const SESSION_INIT_ENDPOINT = 'https://ina-backend-fyp.onrender.com/api/v1/session/init';

  const decodeJwt = (token: string): Record<string, any> | null => {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(payloadJson);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const loadApiKey = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authFetch('/configuration');
        const data = await response.json();

        setApiKey(data.client_api_key || '');

        if (data.tenant_id) {
          setTenantId(data.tenant_id);
        } else {
          const token = localStorage.getItem('jwt_token');
          const payload = token ? decodeJwt(token) : null;
          const idFromToken = payload?.tenant_id || payload?.sub || payload?.user_id || null;
          setTenantId(idFromToken ?? '');
        }
      } catch (err) {
        const errorMessage =
          err && typeof err === 'object' && 'message' in err
            ? (err as Error).message
            : 'Failed to connect to the API server.';
        setError(errorMessage as string);
      } finally {
        setIsLoading(false);
      }
    };
    loadApiKey();
  }, []);

  const copyToClipboard = (text: string, setCallback: (v: boolean) => void) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setCallback(true);
        setTimeout(() => setCallback(false), 2000);
      });
    } else {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCallback(true);
      setTimeout(() => setCallback(false), 2000);
    }
  };

  const isKeyReady = !isLoading && !error && apiKey.length > 0;

  return (
    <DashboardLayout pageTitle="API Integration & Keys">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Error Banner */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Tenant ID Card */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Hash className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Your Tenant ID</h2>
              <p className="text-xs text-slate-500">Required in the session init request body</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={isLoading ? 'Loading…' : tenantId || 'Not available'}
              className="flex-1 px-4 py-3 bg-slate-900/60 border border-white/10 rounded-xl text-slate-300 font-mono text-sm focus:outline-none select-all"
              aria-label="Tenant ID"
            />
            <button
              onClick={() => copyToClipboard(tenantId, setIsTenantIdCopied)}
              disabled={!tenantId}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isTenantIdCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {isTenantIdCopied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* API Key Card — Glowing border */}
        <div
          className="relative p-6 rounded-2xl border bg-white/5 backdrop-blur-sm overflow-hidden"
          style={{
            borderColor: 'rgba(139, 92, 246, 0.4)',
            boxShadow: '0 0 40px -12px rgba(139,92,246,0.4), inset 0 0 40px -24px rgba(139,92,246,0.08)',
          }}
        >
          {/* Glow pulse behind card */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/30">
              <Key className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Your Tenant API Key</h2>
              <p className="text-xs text-slate-500">Use this in the <code className="text-violet-400">Authorization: Bearer</code> header for all INA API calls</p>
            </div>
          </div>

          <div className="relative flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={isLoading ? 'Loading API Key…' : apiKey || 'Key not found'}
              className="flex-1 px-4 py-3 bg-slate-900/60 border border-violet-500/20 rounded-xl text-slate-300 font-mono text-sm focus:outline-none select-all"
              aria-label="Tenant API Key"
            />
            <button
              onClick={() => copyToClipboard(apiKey, setIsCopied)}
              disabled={!isKeyReady}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border transition disabled:opacity-40 disabled:cursor-not-allowed ${
                isCopied
                  ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                  : 'bg-violet-600/20 border-violet-500/30 text-violet-400 hover:bg-violet-600/30'
              }`}
            >
              {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div className="relative mt-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <p className="text-xs text-amber-400/80 flex items-start gap-2">
              <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              Never expose this key in client-side code. All calls using this key must originate from your secure backend server.
            </p>
          </div>
        </div>

        {/* Session Init Endpoint Card */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Globe className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Session Initialization Endpoint</h2>
              <p className="text-xs text-slate-500">Your backend must call this before rendering the chat widget</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 text-xs font-bold bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-md font-mono">
              POST
            </span>
            <input
              type="text"
              readOnly
              value={SESSION_INIT_ENDPOINT}
              className="flex-1 px-4 py-3 bg-slate-900/60 border border-white/10 rounded-xl text-slate-300 font-mono text-sm focus:outline-none select-all"
              aria-label="Session Init Endpoint"
            />
          </div>

          <p className="text-xs text-slate-500">
            Send <code className="text-slate-300">api_key</code>, <code className="text-slate-300">tenant_id</code>, <code className="text-slate-300">mam</code>, and <code className="text-slate-300">asking_price</code> in the JSON body. The returned <code className="text-slate-300">session_id</code> is passed to the chat widget.
          </p>
        </div>

        {/* Next Steps */}
        <div className="flex items-start gap-4 p-5 rounded-2xl border border-violet-500/20 bg-violet-500/5">
          <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 mt-0.5">
            <Zap className="h-4 w-4 text-violet-400" />
          </div>
          <div className="text-sm">
            <h3 className="font-semibold text-white mb-1">Next Steps: Integration Guide</h3>
            <p className="text-slate-400">
              Read the{' '}
              <a href="/dashboard/documentation/session-init" className="text-violet-400 underline hover:text-violet-300 transition">
                Session Initialization
              </a>{' '}
              and{' '}
              <a href="/dashboard/documentation/success-protocol" className="text-violet-400 underline hover:text-violet-300 transition">
                Success Protocol
              </a>{' '}
              documentation to complete your server-to-server integration.
            </p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Integration;