import Head from 'next/head';
import Link from 'next/link';
import { Mail, Lock, User, UserPlus, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { useRouter } from 'next/router';

const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch('https://ina-backend-fyp.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('jwt_token', data.access_token);
        localStorage.setItem('user_email', email);
        localStorage.setItem('user_name', name);
        router.push('/dashboard');
      } else {
        setError(data.detail || 'Registration failed. That email may already be in use.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Sign Up Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Shared input style helpers
  const inputClass =
    'w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none transition-all duration-200';
  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.border = '1px solid rgba(99,102,241,0.6)';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)';
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <>
      <Head>
        <title>Sign Up | BargainBaaS Dashboard</title>
        <meta name="description" content="Create your BargainBaaS account and start integrating AI-powered price negotiation into your store." />
      </Head>

      <div
        className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden"
        style={{ background: '#09091a' }}
      >
        {/* Ambient blobs */}
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 65%)' }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full pointer-events-none opacity-15"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent 65%)' }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Glass card */}
        <div
          className="relative z-10 w-full max-w-md rounded-2xl p-8 sm:p-10"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.09)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          }}
        >
          {/* Top glow line */}
          <div
            className="absolute top-0 left-8 right-8 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), rgba(167,139,250,0.6), transparent)',
            }}
          />

          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
            >
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">
              Bargain
              <span
                style={{
                  background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                BaaS
              </span>
            </span>
          </Link>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-white">Create your account</h1>
            <p className="text-slate-400 text-sm mt-1">Start your free 7-day trial today</p>
          </div>

          {/* Error alert */}
          {error && (
            <div
              className="mb-6 px-4 py-3 rounded-xl text-sm text-red-300 flex items-start gap-2"
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.25)',
              }}
              role="alert"
            >
              <span className="mt-0.5 flex-shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div>
              <label htmlFor="full-name" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                <input
                  id="full-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Jane Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email-address" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-300 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: isLoading
                  ? 'rgba(99,102,241,0.5)'
                  : 'linear-gradient(135deg, #3b82f6, #6366f1)',
                boxShadow: isLoading ? 'none' : '0 0 22px rgba(99,102,241,0.45)',
              }}
              onMouseEnter={(e) => {
                if (!isLoading)
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 0 36px rgba(99,102,241,0.7)';
              }}
              onMouseLeave={(e) => {
                if (!isLoading)
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 0 22px rgba(99,102,241,0.45)';
              }}
            >
              <UserPlus className="h-4 w-4" />
              {isLoading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          {/* Terms note */}
          <p className="text-center text-xs text-slate-600 mt-5">
            By signing up you agree to our{' '}
            <Link href="#" className="text-slate-500 hover:text-slate-400 underline underline-offset-2">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="text-slate-500 hover:text-slate-400 underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </p>

          {/* Footer link */}
          <p className="text-center text-sm text-slate-500 mt-4">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-150"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;