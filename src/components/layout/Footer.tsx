import Link from 'next/link';
import { Zap, Github, Twitter, Linkedin, ArrowRight } from 'lucide-react';

// ── Link columns ──────────────────────────────────────────────────────
const footerLinks = [
  {
    heading: 'Product',
    links: [
      { name: 'Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Documentation', href: '#' },
      { name: 'Changelog', href: '#' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { name: 'About Us', href: '#' },
      { name: 'Contact', href: '#' },
      { name: 'Blog', href: '#' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
    ],
  },
];

const socialLinks = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

// ── Component ──────────────────────────────────────────────────────────
const Footer: React.FC = () => {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: 'rgba(7, 8, 20, 1)',
        borderTop: '1px solid rgba(99,102,241,0.18)',
      }}
    >
      {/* Glow accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), rgba(167,139,250,0.6), transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">

        {/* ── Top row: brand + newsletter ─────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 mb-14">

          {/* Brand block */}
          <div className="max-w-xs space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
              >
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
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

            <p className="text-sm text-slate-500 leading-relaxed">
              LangGraph-powered AI negotiation as a service. Drop in a{' '}
              <code className="text-indigo-400 text-xs">&lt;script&gt;</code> tag and start
              converting browsers into buyers.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 pt-1">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white transition-all duration-200"
                  style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      'rgba(99,102,241,0.5)';
                    (e.currentTarget as HTMLElement).style.background =
                      'rgba(99,102,241,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      'rgba(255,255,255,0.08)';
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter block */}
          <div
            className="rounded-2xl p-6 max-w-md w-full"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2">
              Stay in the Loop
            </p>
            <h3 className="text-base font-bold text-white mb-1">
              Product updates & early access
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              No spam. Unsubscribe anytime.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="you@company.com"
                className="flex-1 px-4 py-2.5 text-sm rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              />
              <button
                className="px-4 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center gap-1 transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  boxShadow: '0 0 16px rgba(99,102,241,0.35)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 0 28px rgba(99,102,241,0.6)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 0 16px rgba(99,102,241,0.35)';
                }}
              >
                Subscribe <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Link columns ─────────────────────────────────────── */}
        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-8 py-10"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {footerLinks.map((col) => (
            <div key={col.heading}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ───────────────────────────────────────── */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} BargainBaaS. All rights reserved.
          </p>
          <p className="text-xs text-slate-700">
            Powered by{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              LangGraph · Redis · Next.js
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;