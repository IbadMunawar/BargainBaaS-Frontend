import Link from 'next/link';
import { Zap } from 'lucide-react';

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
        
        {/* Main Grid: Brand block + FYDP details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-14">
          
          {/* Left: Brand block */}
          <div className="lg:col-span-5 max-w-md space-y-4">
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
              LangGraph-powered AI negotiation as a service. Integrate our dynamic widget components directly into your storefront views to securely convert anonymous browsers into immediate buyers.
            </p>
          </div>

          {/* Right: Columns */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
            
            {/* Column 1: Team Members */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
                Team Members
              </h4>
              <ul className="space-y-3">
                {[
                  'ASHNA IQBAL SHAIKH',
                  'AHMED ALI KHAN',
                  'MUHAMMAD SAIM NOMANI',
                  'IBAD MUNAWAR',
                ].map((name) => (
                  <li key={name}>
                    <a
                      href="#"
                      className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      {name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Academic Project */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
                Academic Project
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Developed as a Final Year Project (FYDP) at NED University of Engineering and Technology.
              </p>
              <div className="pt-3 border-t border-white/10">
                <span className="text-xs text-slate-500 uppercase tracking-widest block mb-1">
                  Under the supervision of:
                </span>
                <span className="text-sm font-semibold text-slate-300">
                  Dr. Shariq Mahmood Khan
                </span>
              </div>
            </div>

          </div>
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
