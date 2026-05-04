import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import {
  BrainCircuit,
  ShieldCheck,
  Plug,
  TrendingUp,
  Bot,
  User,
  Lock,
} from 'lucide-react';

// ======================================================================
// MAIN LANDING PAGE COMPONENT
// ======================================================================

const LandingPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>BargainBaaS | AI-Powered Price Negotiation as a Service</title>
        <meta
          name="description"
          content="LangGraph-powered AI orchestrator for real-time price negotiation. Plug-and-play chatbot API with enterprise-grade security and dynamic margin enforcement."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Navbar />

      <main className="bg-[#09091a] text-white overflow-x-hidden">
        <HeroSection />
        <FeaturesSummarySection />
        <HowItWorksSection />
      </main>

      <Footer />
    </>
  );
};

export default LandingPage;


// ======================================================================
// HELPER COMPONENTS (Sections)
// ======================================================================

// ----------------------------------------------------------------------
// 1. Hero Section 🚀
// ----------------------------------------------------------------------
const HeroSection: React.FC = () => (
  <section className="relative min-h-screen flex items-center justify-center py-24 overflow-hidden">

    {/* ── Background blobs ────────────────────────────────────── */}
    <div
      className="blob-animate absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
      style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }}
    />
    <div
      className="blob-animate-slow absolute top-1/3 -right-60 w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none"
      style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
    />
    <div
      className="blob-animate-delay absolute -bottom-20 left-1/4 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
      style={{ background: 'radial-gradient(circle, #a78bfa, transparent 70%)' }}
    />

    {/* ── Subtle grid overlay ──────────────────────────────────── */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }}
    />

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">

      {/* ── Left: Copy ──────────────────────────────────────────── */}
      <div className="flex-1 text-center lg:text-left">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6 glass-card text-blue-300 border border-blue-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Bargaining as a Service (BaaS)
        </span>

        <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
          Boost Conversions
          <br />
          with{' '}
          <span className="gradient-text">
            AI-Powered
            <br className="hidden sm:inline" />
            Price Negotiation
          </span>
        </h1>

        <p className="max-w-xl mx-auto lg:mx-0 text-lg text-slate-400 leading-relaxed mb-10">
          Our LangGraph-powered orchestrator brings real-time, human-like bargaining to any
          eCommerce store — with enterprise-grade security and dynamic margin enforcement
          built in from day one.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
          <Link
            href="/auth/signup"
            className="btn-glow inline-block px-8 py-3.5 text-base font-bold rounded-xl text-white w-full sm:w-auto text-center"
          >
            Get Your API Key →
          </Link>
          <Link
            href="/pricing"
            className="inline-block px-8 py-3.5 text-base font-semibold rounded-xl text-blue-300 border border-blue-500/40 hover:border-blue-400 hover:bg-blue-500/10 transition-all duration-300 w-full sm:w-auto text-center"
          >
            View Pricing
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-green-400" /> Server-to-server auth</span>
          <span className="flex items-center gap-1.5"><Lock className="h-4 w-4 text-purple-400" /> Cryptographic deal lock</span>
          <span className="flex items-center gap-1.5"><Plug className="h-4 w-4 text-blue-400" /> &lt;script&gt; tag integration</span>
        </div>
      </div>

      {/* ── Right: Mock Chat Widget ──────────────────────────────── */}
      <div className="flex-shrink-0 w-full max-w-sm">
        <MockChatWidget />
      </div>
    </div>
  </section>
);

// ----------------------------------------------------------------------
// Mock Chat Widget (pure CSS / static JSX — no state)
// ----------------------------------------------------------------------
const MockChatWidget: React.FC = () => (
  <div
    className="relative w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl"
    style={{
      background: 'rgba(15, 20, 45, 0.85)',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      boxShadow: '0 25px 80px rgba(99, 102, 241, 0.25), 0 0 0 1px rgba(255,255,255,0.05)',
      backdropFilter: 'blur(20px)',
    }}
  >
    {/* Header bar */}
    <div
      className="flex items-center gap-3 px-4 py-3.5"
      style={{ background: 'linear-gradient(135deg, #1e40af22, #6366f122)' }}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/30">
        <Bot className="h-4 w-4 text-blue-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white leading-none">BargainBot</p>
        <p className="text-[10px] text-green-400 mt-0.5 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
          Online · Negotiating
        </p>
      </div>
      <div className="ml-auto flex gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
      </div>
    </div>

    {/* Chat messages */}
    <div className="px-4 py-4 space-y-3 min-h-[280px]">
      {/* Product context */}
      <div className="glass-card rounded-xl px-3 py-2.5 text-center bubble-in" style={{ animationDelay: '0s' }}>
        <p className="text-[11px] text-slate-400">Negotiating for</p>
        <p className="text-sm font-semibold text-white">Sony WH-1000XM5</p>
        <p className="text-xs text-blue-400 font-medium">Listed at $349</p>
      </div>

      {/* Bot message */}
      <div className="flex items-end gap-2 bubble-in" style={{ animationDelay: '0.2s' }}>
        <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center flex-shrink-0">
          <Bot className="h-3 w-3 text-blue-400" />
        </div>
        <div
          className="rounded-2xl rounded-bl-none px-3.5 py-2.5 text-sm text-slate-200 max-w-[75%]"
          style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)' }}
        >
          Hi! I'm here to negotiate the best deal for you. What's your offer for these headphones?
        </div>
      </div>

      {/* User message */}
      <div className="flex items-end gap-2 justify-end bubble-in" style={{ animationDelay: '0.4s' }}>
        <div
          className="rounded-2xl rounded-br-none px-3.5 py-2.5 text-sm text-white max-w-[75%]"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
        >
          How about $290?
        </div>
        <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
          <User className="h-3 w-3 text-slate-300" />
        </div>
      </div>

      {/* Bot counter-offer */}
      <div className="flex items-end gap-2 bubble-in" style={{ animationDelay: '0.6s' }}>
        <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center flex-shrink-0">
          <Bot className="h-3 w-3 text-blue-400" />
        </div>
        <div
          className="rounded-2xl rounded-bl-none px-3.5 py-2.5 text-sm text-slate-200 max-w-[80%]"
          style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)' }}
        >
          That's a stretch! I can do <strong className="text-blue-300">$318</strong> — still $31 off. Deal?
        </div>
      </div>

      {/* Typing indicator */}
      <div className="flex items-end gap-2 bubble-in" style={{ animationDelay: '0.8s' }}>
        <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center flex-shrink-0">
          <Bot className="h-3 w-3 text-blue-400" />
        </div>
        <div
          className="rounded-2xl rounded-bl-none px-3.5 py-2.5 flex gap-1 items-center"
          style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}
        >
          <span className="typing-dot w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
          <span className="typing-dot w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
          <span className="typing-dot w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
        </div>
      </div>
    </div>

    {/* Input bar */}
    <div
      className="px-4 py-3 flex items-center gap-2"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div
        className="flex-1 rounded-xl px-3.5 py-2.5 text-sm text-slate-500 select-none"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        Type your offer…
      </div>
      <button
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 btn-glow text-white text-lg font-bold"
        aria-label="Send"
        tabIndex={-1}
      >
        ↑
      </button>
    </div>

    {/* Offer counter */}
    <div
      className="px-4 py-2 text-center text-[10px] text-slate-500"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      Offer 2 of 5 · Secured by BargainBaaS API
    </div>
  </div>
);


// ----------------------------------------------------------------------
// 2. Features Summary Section ✨
// ----------------------------------------------------------------------
const features = [
  {
    title: 'LangGraph-Powered AI',
    description:
      'Uses an advanced AI orchestrator to handle unstructured negotiations and maintain dynamic state memory across the full conversation.',
    icon: BrainCircuit,
    gradient: 'from-blue-500 to-indigo-500',
    glow: 'rgba(99,102,241,0.3)',
  },
  {
    title: 'Enterprise-Grade Security',
    description:
      'API keys are never exposed to the browser. We use secure server-to-server proxying and a dedicated Verification API to cryptographically lock deals.',
    icon: ShieldCheck,
    gradient: 'from-emerald-500 to-teal-500',
    glow: 'rgba(16,185,129,0.3)',
  },
  {
    title: 'Seamless Integration',
    description:
      'Inject our lightweight <script> tag into any Next.js or React e-commerce site instantly — zero backend changes, no complex SDK setup.',
    icon: Plug,
    gradient: 'from-purple-500 to-pink-500',
    glow: 'rgba(168,85,247,0.3)',
  },
  {
    title: 'Dynamic MAM Enforcement',
    description:
      'Configure a Minimum Acceptable Margin (MAM) per product; the AI strictly defends your baseline profit while maximising deal conversion.',
    icon: TrendingUp,
    gradient: 'from-amber-500 to-orange-500',
    glow: 'rgba(245,158,11,0.3)',
  },
];

const FeaturesSummarySection: React.FC = () => (
  <section className="py-28 relative overflow-hidden">
    {/* subtle background glow */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.08), transparent)',
      }}
    />

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400 mb-3">
          Why BargainBaaS
        </p>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
          Built for the{' '}
          <span className="gradient-text">Modern Stack</span>
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-slate-400 text-lg">
          Every layer of our platform is purpose-built — from the AI orchestrator down to the
          cryptographic checkout handshake.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="feature-card glass-card rounded-2xl p-6 flex flex-col gap-4"
          >
            {/* Icon with gradient bg */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${feature.gradient} shadow-lg`}
              style={{ boxShadow: `0 8px 24px ${feature.glow}` }}
            >
              <feature.icon className="h-6 w-6 text-white" />
            </div>

            <h3 className="text-lg font-bold text-white">{feature.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed flex-1">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);


// ----------------------------------------------------------------------
// 3. How It Works — Connected Timeline Section 🧠
// ----------------------------------------------------------------------
const steps = [
  {
    number: '01',
    title: 'Tenant Configuration',
    description:
      'Register your domain and configure product base prices along with secret Minimum Acceptable Margins (MAMs) via your secure dashboard.',
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.4)',
  },
  {
    number: '02',
    title: 'Real-time Orchestration',
    description:
      'The user negotiates live with our AI. A Redis-backed session tracks the 5-offer limit and enforces strict business rules in real time.',
    color: '#6366f1',
    glow: 'rgba(99,102,241,0.4)',
  },
  {
    number: '03',
    title: 'Cryptographic Deal Locking',
    description:
      "Once a price is agreed, the frontend cart securely verifies the final deal against our backend Verification API before checkout completes.",
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.4)',
  },
];

const HowItWorksSection: React.FC = () => (
  <section className="py-28 relative overflow-hidden">
    {/* Background glow */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(99,102,241,0.07), transparent)',
      }}
    />

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400 mb-3">
          How it Works
        </p>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
          The Hybrid{' '}
          <span className="gradient-text">Negotiation Brain</span>
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-slate-400 text-lg">
          Three precision-engineered stages — from merchant setup to cryptographically
          secured checkout.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Horizontal connector line (desktop) */}
        <div className="hidden lg:block absolute top-[2.75rem] left-[15%] right-[15%] h-0.5 step-line opacity-30 rounded-full" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center lg:items-center">
              {/* Step circle */}
              <div
                className="relative w-[5.5rem] h-[5.5rem] rounded-full flex items-center justify-center mb-6 glass-card flex-shrink-0"
                style={{
                  border: `2px solid ${step.color}55`,
                  boxShadow: `0 0 30px ${step.glow}, inset 0 0 20px ${step.color}15`,
                }}
              >
                <span
                  className="text-2xl font-black"
                  style={{ color: step.color }}
                >
                  {step.number}
                </span>
              </div>

              {/* Content card */}
              <div
                className="glass-card rounded-2xl p-6 w-full feature-card"
                style={{ borderColor: `${step.color}22` }}
              >
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: step.color }}
                >
                  {step.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <Link
          href="/features"
          className="inline-block px-10 py-4 font-semibold rounded-xl text-white btn-glow text-base"
        >
          Explore the Full Architecture →
        </Link>
        <p className="mt-4 text-sm text-slate-600">
          No credit card required · Free tier available
        </p>
      </div>
    </div>
  </section>
);
