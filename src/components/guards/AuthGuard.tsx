import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Loader2 } from 'lucide-react';

/**
 * AuthGuard — Client-side defense-in-depth route protection
 * ==========================================================
 * Wraps protected pages and checks localStorage for `jwt_token`.
 * While verifying, renders a full-screen loading state to prevent
 * any flash of protected content. If no token is found, redirects
 * to the login page.
 *
 * This complements the Edge Middleware (which checks the httpOnly
 * cookie). Together they form a dual-layer auth gate.
 */

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const [status, setStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');

    if (!token) {
      setStatus('unauthenticated');
      router.replace(`/auth/login?redirect=${encodeURIComponent(router.asPath)}`);
    } else {
      setStatus('authenticated');
    }
  }, [router]);

  // ── Loading state (prevents content flash) ──
  if (status === 'checking' || status === 'unauthenticated') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-950 z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-xl animate-pulse" />
            <div className="relative p-4 bg-violet-600/10 border border-violet-500/30 rounded-2xl">
              <Loader2 className="h-8 w-8 text-violet-400 animate-spin" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-300">Verifying session…</p>
            <p className="text-xs text-slate-500 mt-1">Authenticating your identity</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Authenticated: render children ──
  return <>{children}</>;
};

export default AuthGuard;
