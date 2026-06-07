import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { authFetch } from '../../services/api';
import {
  Globe,
  Trash2,
  AlertTriangle,
  Plus,
  Loader2,
  CheckCircle,
  X,
  ShieldCheck,
  Clock
} from 'lucide-react';

interface DomainRecord {
  id: number;
  domain: string;
  created_at: string;
}

interface Toast {
  message: string;
  type: 'success' | 'error' | 'warning';
  id: number;
}

const DomainsDashboard = () => {
  const [domains, setDomains] = useState<DomainRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Input states
  const [newDomain, setNewDomain] = useState('');
  const [wildcardWarning, setWildcardWarning] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Toast notifications state
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Add toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { message, type, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch whitelisted origin domains
  const fetchDomains = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await authFetch('/api/saas/domains/');
      const data = await response.json();
      setDomains(data);
    } catch (err: any) {
      console.error("Error fetching domains:", err);
      setApiError(err.message || "Failed to load whitelisted origin domains.");
      showToast(err.message || "Failed to load whitelisted domains.", "error");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchDomains();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen to input changes for wildcard asterisk
  const handleDomainChange = (val: string) => {
    setNewDomain(val);
    if (val.includes('*')) {
      setWildcardWarning(true);
    } else {
      setWildcardWarning(false);
    }
  };

  // Whitelist a new domain
  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdding) return;

    const domainInput = newDomain.trim();
    if (!domainInput) {
      showToast("Please enter a domain name.", "warning");
      return;
    }

    if (domainInput.includes('*')) {
      showToast("Wildcard characters are not supported.", "error");
      return;
    }

    setIsAdding(true);
    try {
      const response = await authFetch('/api/saas/domains/', 'POST', {
        domain: domainInput
      });
      const data: DomainRecord = await response.json();

      // Update local state list (ordered by domain name is handled on backend, but let's append and trigger fetch or sort)
      setDomains((prev) => {
        const updated = [...prev, data];
        return updated.sort((a, b) => a.domain.localeCompare(b.domain));
      });

      setNewDomain('');
      setWildcardWarning(false);
      showToast(`Domain "${data.domain}" whitelisted successfully!`, "success");
    } catch (err: any) {
      console.error("Failed to whitelist domain:", err);
      // Capture FastAPI 409 Conflict/duplicate constraint or other HTTP status error string
      if (err.message.includes('409') || err.message.toLowerCase().includes('already registered') || err.message.toLowerCase().includes('conflict')) {
        showToast("This domain is already whitelisted.", "error");
      } else {
        showToast(err.message || "Failed to add domain origin.", "error");
      }
    } finally {
      setIsAdding(false);
    }
  };

  // Delete domain whitelist record
  const handleDeleteDomain = async (domainId: number, domainName: string) => {
    if (deletingId !== null) return;
    setDeletingId(domainId);

    try {
      await authFetch(`/api/saas/domains/${domainId}`, 'DELETE');

      // Remove dynamically from state list on success
      setDomains((prev) => prev.filter((d) => d.id !== domainId));
      showToast(`Domain "${domainName}" deleted successfully.`, "success");
    } catch (err: any) {
      console.error("Delete domain failed:", err);
      showToast(err.message || "Failed to remove whitelisted domain.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // Helper to format timestamps nicely
  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <DashboardLayout pageTitle="Allowed Whitelisted Domains">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Introduction & Security Info Card */}
        <div className="p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm flex items-start gap-4">
          <div className="p-3 bg-violet-600/10 border border-violet-500/25 rounded-xl mt-0.5">
            <Globe className="h-5 w-5 text-violet-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-white">Domain Origin Whitelisting (CORS Security)</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Whitelisting authorized origin domains prevents unauthorized third-party sites from embedding your bargaining chatbot.
              Only incoming negotiation requests originating from the whitelisted domains configured below will be allowed to initialize bargaining sessions.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-blue-500/20 bg-blue-500/5 mb-6">
          <h3 className="text-sm font-semibold text-white mb-1">Why add multiple domains?</h3>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
            <li><span className="text-slate-300">Staging vs Production:</span> Add both <code className="text-blue-300">staging.yourshop.com</code> and <code className="text-blue-300">yourshop.com</code> so the widget works during development.</li>
            <li><span className="text-slate-300">Local development:</span> Add <code className="text-blue-300">localhost</code> to test on your machine. All ports (3000, 8080, etc.) are covered by this single entry.</li>
            <li><span className="text-slate-300">Multi-region storefronts:</span> Add each country subdomain separately (e.g., <code className="text-blue-300">pk.yourshop.com</code>, <code className="text-blue-300">ae.yourshop.com</code>).</li>
            <li><span className="text-slate-300">Security:</span> Widget session initialisation requests from any domain NOT in this list are rejected with a 403. Protect your negotiation sessions.</li>
          </ul>
        </div>

        {/* General page errors */}
        {apiError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {apiError}
          </div>
        )}

        {/* Section A - Domain Addition Panel */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

          <h3 className="text-base font-semibold text-white mb-4">Add Whitelisted Domain</h3>

          <form onSubmit={handleAddDomain} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="e.g., shop.my-store.com"
                  value={newDomain}
                  onChange={(e) => handleDomainChange(e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-900/60 border rounded-xl text-slate-300 placeholder-slate-600 text-sm font-mono focus:outline-none focus:ring-1 transition ${wildcardWarning
                      ? 'border-amber-500/50 focus:border-amber-500 focus:ring-amber-500/20'
                      : 'border-white/10 focus:border-violet-500/50 focus:ring-violet-500/20'
                    }`}
                  disabled={isAdding}
                />
              </div>
              <button
                type="submit"
                disabled={isAdding || wildcardWarning || !newDomain.trim()}
                className="px-6 py-3 rounded-xl text-sm font-semibold bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-40 disabled:hover:bg-violet-600 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-lg shadow-violet-600/10"
              >
                {isAdding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Whitelist Domain
              </button>
            </div>

            {/* Critical UX Validation: Wildcard warning banner */}
            {wildcardWarning && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-sm flex items-start gap-2.5 animate-fadeIn">
                <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-200">Wildcards (e.g., *.example.com) are not supported in V1.</p>
                  <p className="text-xs text-amber-400/80 mt-1">
                    Please add subdomains like <code className="px-1 py-0.5 rounded bg-slate-950/60 font-mono">shop.example.com</code> and <code className="px-1 py-0.5 rounded bg-slate-950/60 font-mono">www.example.com</code> separately.
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Section B - Active Domains Grid List */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Active Whitelist origins</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              {domains.length} Domain{domains.length !== 1 ? 's' : ''} Secured
            </span>
          </div>

          {isLoading ? (
            <div className="p-12 text-center flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 text-violet-400 animate-spin" />
              <p className="text-xs text-slate-500">Retrieving secure origins...</p>
            </div>
          ) : domains.length === 0 ? (
            <div className="p-12 rounded-xl border border-dashed border-white/10 text-center text-slate-500 text-sm">
              No origin domains currently whitelisted. Your negotiation widget will block all client connections until an origin is whitelisted.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {domains.map((record) => (
                <div
                  key={record.id}
                  className="p-4 rounded-xl border border-white/5 bg-slate-900/40 hover:border-white/10 hover:bg-slate-900/60 transition duration-150 flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-4 space-y-1">
                    <p className="text-sm font-semibold text-slate-200 font-mono truncate">{record.domain}</p>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Added {formatDate(record.created_at)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteDomain(record.id, record.domain)}
                    disabled={deletingId !== null}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Remove domain whitelist"
                  >
                    {deletingId === record.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-red-400" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Floating Toast Notification Area */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-xl border shadow-xl flex items-start gap-3 pointer-events-auto animate-slideIn ${toast.type === 'success'
                ? 'bg-slate-900/95 border-emerald-500/30 text-emerald-400'
                : toast.type === 'warning'
                  ? 'bg-slate-900/95 border-amber-500/30 text-amber-400'
                  : 'bg-slate-900/95 border-red-500/30 text-red-400'
              }`}
          >
            {toast.type === 'success' && <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />}
            {toast.type !== 'success' && <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />}

            <div className="flex-1 text-sm text-slate-300 font-medium">
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-500 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default DomainsDashboard;
