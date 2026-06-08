import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import {
  BrainCircuit,
  Zap,
  ShieldCheck,
  TrendingUp,
  Code2,
  Lock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

// ======================================================================
// MAIN FEATURES PAGE
// ======================================================================

const FeaturesPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Features | BargainBaaS — Enterprise AI Negotiation Platform</title>
        <meta
          name="description"
          content="Discover how BargainBaaS transforms eCommerce conversions with an autonomous AI negotiation engine, enterprise-grade margin protection, and effortless low-code integration."
        />
      </Head>

      <Navbar />

      <main className="bg-[#09091a] text-white overflow-x-hidden">
        <HeroSection />
        <PillarOneSection />
        <PillarTwoSection />
        <PillarThreeSection />
        <CtaSection />
      </main>

      <Footer />
    </>
  );
};

export default FeaturesPage;


// ======================================================================
// SHARED UTILITIES
// ======================================================================

/** Thin gradient top-line on a glass card */
const GlowLine = ({ from, to }: { from: string; to: string }) => (
  <div
    className="absolute top-0 left-6 right-6 h-px rounded-full"
    style={{ background: `linear-gradient(90deg, transparent, ${from}, ${to}, transparent)` }}
  />
);

/** Pill-shaped section label */
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span
    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
    style={{
      background: 'rgba(99,102,241,0.1)',
      border: '1px solid rgba(99,102,241,0.25)',
      color: '#818cf8',
    }}
  >
    {children}
  </span>
);

/** Bullet list item with a check icon */
const BulletItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-3 text-sm text-slate-400 leading-relaxed">
    <CheckCircle2 className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
    <span>{children}</span>
  </li>
);


// ======================================================================
// 1. HERO / HEADER SECTION
// ======================================================================

const HeroSection: React.FC = () => (
  <section className="relative pt-28 pb-24 overflow-hidden">
    {/* Background blobs */}
    <div
      className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
      style={{ background: 'radial-gradient(circle, #6366f1, transparent 65%)' }}
    />
    <div
      className="absolute top-10 right-0 w-[350px] h-[350px] rounded-full pointer-events-none opacity-15"
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

    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <SectionLabel>Platform Architecture</SectionLabel>

      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
        The Technology Behind{' '}
        <span
          style={{
            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #818cf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Smart Negotiation
        </span>
      </h1>

      <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
        Three precision-engineered pillars — an autonomous negotiation engine, an airtight
        margin protection layer, and effortless low-code integration — working together to close
        deals without sacrificing profitability.
      </p>

      {/* Pillar anchor pills */}
      <div className="flex flex-wrap justify-center gap-3 mt-10">
        {[
          { label: '01 · Autonomous Negotiator', href: '#pillar-1' },
          { label: '02 · Margin Shield Matrix', href: '#pillar-2' },
          { label: '03 · Low-Code Integration', href: '#pillar-3' },
        ].map(({ label, href }) => (
          <a
            key={href}
            href={href}
            className="px-5 py-2 text-sm font-medium rounded-xl text-slate-300 hover:text-white transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
            }}
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  </section>
);


// ======================================================================
// 2. PILLAR 1 — AUTONOMOUS NEGOTIATOR
// ======================================================================

const PillarOneSection: React.FC = () => (
  <section id="pillar-1" className="py-24 relative overflow-hidden">
    <div
      className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-10"
      style={{ background: 'radial-gradient(circle, #3b82f6, transparent 65%)' }}
    />

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-12">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
        >
          <BrainCircuit className="h-6 w-6 text-white" />
        </div>
        <div>
          <SectionLabel>Pillar 01</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            The Autonomous Negotiator
          </h2>
        </div>
      </div>

      {/* Main glass card */}
      <div
        className="relative rounded-3xl p-8 md:p-12 overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <GlowLine from="#3b82f6" to="#6366f1" />

        <div className="grid md:grid-cols-2 gap-10">
          {/* Feature A */}
          <FeatureBlock
            icon={<BrainCircuit className="h-5 w-5 text-blue-400" />}
            iconBg="rgba(59,130,246,0.15)"
            iconBorder="rgba(59,130,246,0.3)"
            tag="Core Engine"
            title="Context-Aware Negotiation Engine"
            description="Our AI doesn't rely on keyword matching or decision trees. It mimics expert human bargaining instincts — recognizing consumer intent, adapting counter-offer strategies dynamically, and closing deals natively without ever losing conversational context."
            bullets={[
              'Handles complex multi-turn negotiation flows with full context awareness.',
              'Distinguishes initial bids, counter-offers, bluffs, and acceptance signals in real time.',
              'Extracts exact monetary offers from free-form, unstructured text automatically.',
            ]}
            accentColor="#3b82f6"
          />

          {/* Feature B */}
          <FeatureBlock
            icon={<Zap className="h-5 w-5 text-indigo-400" />}
            iconBg="rgba(99,102,241,0.15)"
            iconBorder="rgba(99,102,241,0.3)"
            tag="Session Performance"
            title="Instantaneous Session Hydration"
            description="Conversations stay snappy and responsive at every interaction. Sessions survive accidental page refreshes and retain full negotiation state dynamically — delivering sub-millisecond response times with zero perceptible latency."
            bullets={[
              'Near-instant session rehydration keeps conversations feeling native and alive.',
              'Strict offer-count limits enforced server-side — impossible to circumvent from the client.',
              'Full conversational context persists seamlessly within the active session window.',
            ]}
            accentColor="#6366f1"
          />
        </div>
      </div>
    </div>
  </section>
);


// ======================================================================
// 3. PILLAR 2 — MARGIN SHIELD MATRIX
// ======================================================================

const PillarTwoSection: React.FC = () => (
  <section id="pillar-2" className="py-24 relative overflow-hidden">
    <div
      className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-10"
      style={{ background: 'radial-gradient(circle, #a78bfa, transparent 65%)' }}
    />

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-12">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
        >
          <ShieldCheck className="h-6 w-6 text-white" />
        </div>
        <div>
          <SectionLabel>Pillar 02</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            Margin Shield Matrix
          </h2>
        </div>
      </div>

      {/* Two glassy cards in a responsive grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Card: Enterprise Security */}
        <SecurityCard
          icon={<ShieldCheck className="h-6 w-6 text-white" />}
          iconGradient="linear-gradient(135deg, #6366f1, #8b5cf6)"
          iconGlow="rgba(99,102,241,0.4)"
          borderAccent="rgba(99,102,241,0.25)"
          tag="Zero-Exposure Security"
          title="Enterprise Security Perimeter"
          description="Your tenant access keys live strictly inside secure, isolated server environments — completely hidden from browser DevTools, network inspectors, and client-side code. Key interception is architecturally impossible."
          bullets={[
            'API credentials are stored exclusively in secure server-side environments.',
            'All widget-to-backend communication is authenticated through an isolated server relay.',
            'Zero attack surface exposed to browser DevTools, proxies, or network sniffing tools.',
          ]}
          hoverBorder="rgba(99,102,241,0.5)"
          hoverGlow="rgba(99,102,241,0.15)"
        />

        {/* Card: Margin Enforcement */}
        <SecurityCard
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          iconGradient="linear-gradient(135deg, #a78bfa, #ec4899)"
          iconGlow="rgba(167,139,250,0.4)"
          borderAccent="rgba(167,139,250,0.2)"
          tag="Margin Protection"
          title="Dynamic Margin Enforcement"
          description="Merchants set a secret floor price baseline that is processed exclusively server-side. The negotiating user never sees the limit. When the boundary is reached, an automatic take-it-or-leave-it trigger fires instantly — guaranteeing profitability on every deal."
          bullets={[
            'Secret price floor is stored and enforced entirely server-side — never leaked to the user.',
            'Every AI counter-offer is validated against the merchant\'s baseline before delivery.',
            'Automatic final-offer lockdown triggers the instant the floor boundary is reached.',
          ]}
          hoverBorder="rgba(167,139,250,0.5)"
          hoverGlow="rgba(167,139,250,0.12)"
        />
      </div>
    </div>
  </section>
);


// ======================================================================
// 4. PILLAR 3 — LOW-CODE INTEGRATION
// ======================================================================

const PillarThreeSection: React.FC = () => (
  <section id="pillar-3" className="py-24 relative overflow-hidden">
    <div
      className="absolute bottom-0 right-1/3 w-[400px] h-[400px] rounded-full pointer-events-none opacity-10"
      style={{ background: 'radial-gradient(circle, #22d3ee, transparent 65%)' }}
    />

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-12">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #0ea5e9, #22d3ee)' }}
        >
          <Code2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <SectionLabel>Pillar 03</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            Low-Code Integration
          </h2>
        </div>
      </div>

      <div
        className="relative rounded-3xl p-8 md:p-12 overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <GlowLine from="#0ea5e9" to="#22d3ee" />

        <div className="grid md:grid-cols-2 gap-10">
          {/* Feature A: Zero-overhead injection */}
          <FeatureBlock
            icon={<Code2 className="h-5 w-5 text-cyan-400" />}
            iconBg="rgba(14,165,233,0.15)"
            iconBorder="rgba(14,165,233,0.3)"
            tag="Instant Integration"
            title="Zero-Overhead Injection"
            description="Works seamlessly across web storefronts with zero framework dependencies. Drop our lightweight payload script straight into your product view template to initialize the runtime engine instantly."
            bullets={[
              'Lightweight widget payload with zero framework dependencies.',
              'Widget auto-initialises and mounts with zero manual DOM manipulation.',
            ]}
            accentColor="#0ea5e9"
          />

          {/* Feature B: Cryptographic verification */}
          <FeatureBlock
            icon={<Lock className="h-5 w-5 text-emerald-400" />}
            iconBg="rgba(16,185,129,0.15)"
            iconBorder="rgba(16,185,129,0.3)"
            tag="Deal Verification"
            title="Cryptographic Deal Verification"
            description="Before any negotiated item reaches the cart, the agreed price is cryptographically cross-verified against our backend — automatically rejecting any client-side price tampering or replay attacks before checkout."
            bullets={[
              'Signed deal tokens are verified server-side before cart insertion.',
              'Mismatched or tampered prices are rejected instantly and automatically.',
              'Verification layer is rate-limited and scoped per tenant session.',
            ]}
            accentColor="#10b981"
          />
        </div>

        {/* Gated integration payload — replaces exposed code snippet */}
        <div
          className="mt-10 rounded-2xl overflow-hidden relative"
          style={{
            border: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(255,255,255,0.02)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div className="px-8 py-12 flex flex-col items-center justify-center text-center gap-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(34,211,238,0.15))',
                border: '1px solid rgba(34,211,238,0.25)',
              }}
            >
              <Lock className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-white mb-1">
                Your Custom Integration Payload
              </p>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Sign up to unlock your personalised widget configuration, tenant API key, and
                deployment instructions tailored to your storefront.
              </p>
            </div>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-7 py-3 text-sm font-bold rounded-xl text-white transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #0ea5e9, #22d3ee)',
                boxShadow: '0 0 20px rgba(34,211,238,0.3)',
              }}
            >
              Unlock Integration <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);


// ======================================================================
// 5. BOTTOM CTA SECTION
// ======================================================================

const CtaSection: React.FC = () => (
  <section className="py-24 relative overflow-hidden">
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.1), transparent)',
      }}
    />

    <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4">
        Ready to Ship
      </p>
      <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
        Integrate Smart Bargaining{' '}
        <span
          style={{
            background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Today
        </span>
      </h2>
      <p className="text-slate-400 text-lg mb-10">
        Get your API key, deploy the widget, and watch negotiation-driven conversions
        climb — all without touching your existing checkout flow.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/auth/signup"
          className="inline-flex items-center gap-2 px-9 py-4 text-base font-bold rounded-xl text-white w-full sm:w-auto justify-center"
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            boxShadow: '0 0 24px rgba(99,102,241,0.45)',
          }}
        >
          Start Free Trial <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <p className="mt-5 text-sm text-slate-600">
        No credit card required · Start building instantly
      </p>
    </div>
  </section>
);


// ======================================================================
// REUSABLE SUB-COMPONENTS
// ======================================================================

interface FeatureBlockProps {
  icon: React.ReactNode;
  iconBg: string;
  iconBorder: string;
  tag: string;
  title: React.ReactNode;
  description: string;
  bullets: string[];
  accentColor: string;
}

const FeatureBlock: React.FC<FeatureBlockProps> = ({
  icon,
  iconBg,
  iconBorder,
  tag,
  title,
  description,
  bullets,
  accentColor,
}) => (
  <div className="flex flex-col gap-5">
    {/* Icon + tag row */}
    <div className="flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: iconBg, border: `1px solid ${iconBorder}` }}
      >
        {icon}
      </div>
      <span
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: accentColor }}
      >
        {tag}
      </span>
    </div>

    <h3 className="text-xl font-bold text-white leading-snug">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>

    <ul className="space-y-2.5 mt-1">
      {bullets.map((b, i) => (
        <BulletItem key={i}>{b}</BulletItem>
      ))}
    </ul>
  </div>
);

interface SecurityCardProps {
  icon: React.ReactNode;
  iconGradient: string;
  iconGlow: string;
  borderAccent: string;
  tag: string;
  title: string;
  description: string;
  bullets: string[];
  hoverBorder: string;
  hoverGlow: string;
}

const SecurityCard: React.FC<SecurityCardProps> = ({
  icon,
  iconGradient,
  iconGlow,
  borderAccent,
  tag,
  title,
  description,
  bullets,
  hoverBorder,
  hoverGlow,
}) => (
  <div
    className="relative rounded-2xl p-8 flex flex-col gap-5 transition-all duration-300 cursor-default group overflow-hidden"
    style={{
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${borderAccent}`,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}
    onMouseEnter={(e) => {
      const el = e.currentTarget as HTMLElement;
      el.style.borderColor = hoverBorder;
      el.style.boxShadow = `0 16px 48px ${hoverGlow}`;
      el.style.transform = 'translateY(-5px)';
    }}
    onMouseLeave={(e) => {
      const el = e.currentTarget as HTMLElement;
      el.style.borderColor = borderAccent;
      el.style.boxShadow = 'none';
      el.style.transform = 'translateY(0)';
    }}
  >
    {/* Icon */}
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{
        background: iconGradient,
        boxShadow: `0 8px 24px ${iconGlow}`,
      }}
    >
      {icon}
    </div>

    <div>
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-1"
        style={{ color: '#818cf8' }}
      >
        {tag}
      </p>
      <h3 className="text-xl font-bold text-white leading-snug">{title}</h3>
    </div>

    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>

    <ul className="space-y-2.5">
      {bullets.map((b, i) => (
        <BulletItem key={i}>{b}</BulletItem>
      ))}
    </ul>
  </div>
);
