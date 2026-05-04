import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Check, X, Zap, Sparkles, Building2, ArrowRight } from 'lucide-react';

// ======================================================================
// PRICING DATA
// ======================================================================

const plans = [
  {
    name: 'Basic',
    price: '$99',
    unit: '/month',
    description: 'Perfect for small shops just starting with AI-powered negotiation.',
    icon: Zap,
    iconGradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    iconGlow: 'rgba(99,102,241,0.35)',
    accentColor: '#60a5fa',
    features: [
      { text: 'Up to 5,000 Negotiated Sessions', included: true },
      { text: 'Standard NLP Engine', included: true },
      { text: 'Basic MAM Protection', included: true },
      { text: 'Email Support', included: true },
      { text: 'Redis Session Memory', included: false },
      { text: 'Cryptographic Deal Locking', included: false },
      { text: 'API Webhooks', included: false },
      { text: 'Dedicated Proxy Node', included: false },
    ],
    cta: 'Start 7-Day Free Trial',
    ctaHref: '/auth/signup',
    primary: false,
    badge: null,
  },
  {
    name: 'Pro',
    price: '$499',
    unit: '/month',
    description: 'For growing businesses that need the full AI stack and enterprise security.',
    icon: Sparkles,
    iconGradient: 'linear-gradient(135deg, #6366f1, #a78bfa)',
    iconGlow: 'rgba(167,139,250,0.5)',
    accentColor: '#a78bfa',
    features: [
      { text: 'Up to 50,000 Negotiated Sessions', included: true },
      { text: 'LangGraph AI Orchestrator', included: true },
      { text: 'Redis Session Memory', included: true },
      { text: 'Dynamic MAM Protection', included: true },
      { text: 'Cryptographic Deal Locking', included: true },
      { text: 'API Webhooks', included: true },
      { text: 'Priority Email & Chat Support', included: true },
      { text: 'Dedicated Proxy Node', included: false },
    ],
    cta: 'Choose Pro',
    ctaHref: '/auth/signup',
    primary: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    unit: '',
    description: 'Dedicated infrastructure, custom deal rules, and volume discounts at scale.',
    icon: Building2,
    iconGradient: 'linear-gradient(135deg, #0ea5e9, #22d3ee)',
    iconGlow: 'rgba(14,165,233,0.35)',
    accentColor: '#22d3ee',
    features: [
      { text: 'Unlimited Negotiated Sessions', included: true },
      { text: 'LangGraph AI Orchestrator', included: true },
      { text: 'Redis Session Memory', included: true },
      { text: 'Dynamic MAM Protection', included: true },
      { text: 'Cryptographic Deal Locking', included: true },
      { text: 'Dedicated Next.js Proxy Node', included: true },
      { text: 'Custom Deal Rules', included: true },
      { text: '24/7 Priority Support', included: true },
    ],
    cta: 'Contact Sales',
    ctaHref: '#',
    primary: false,
    badge: null,
  },
];

// ======================================================================
// PAGE COMPONENT
// ======================================================================

const PricingPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Pricing | BargainBaaS — Flexible AI Negotiation Plans</title>
        <meta
          name="description"
          content="Choose from Basic, Pro, or Enterprise plans. Get LangGraph-powered AI negotiation, Redis session memory, and cryptographic deal locking for your eCommerce store."
        />
      </Head>

      <Navbar />

      <main className="bg-[#09091a] text-white overflow-x-hidden min-h-screen">
        {/* ── Hero / Header ────────────────────────────────── */}
        <section className="relative pt-28 pb-20 overflow-hidden">
          {/* Background blobs */}
          <div
            className="absolute -top-24 left-1/3 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
            style={{ background: 'radial-gradient(circle, #6366f1, transparent 65%)' }}
          />
          <div
            className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full pointer-events-none opacity-15"
            style={{ background: 'radial-gradient(circle, #3b82f6, transparent 65%)' }}
          />

          {/* Grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-5"
              style={{
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.25)',
                color: '#818cf8',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Simple, Transparent Pricing
            </span>

            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5">
              Scale Your Conversions,{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #818cf8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Not Your Costs
              </span>
            </h1>

            <p className="text-xl text-slate-400 leading-relaxed">
              Every plan includes our core AI negotiation engine. Upgrade for the full
              LangGraph stack, Redis memory, and cryptographic checkout security.
            </p>
          </div>
        </section>

        {/* ── Pricing Cards ────────────────────────────────── */}
        <section className="pb-28 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8 items-stretch">
              {plans.map((plan) => (
                <PricingCard key={plan.name} plan={plan} />
              ))}
            </div>

            {/* Bottom note */}
            <p className="mt-10 text-center text-sm text-slate-600">
              All plans include a 7-day free trial · No credit card required to start
            </p>
          </div>
        </section>

        {/* ── FAQ teaser / enterprise nudge ────────────────── */}
        <section className="pb-24 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.07), transparent)',
            }}
          />
          <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
            <p className="text-slate-500 text-sm mb-2">Need high-volume support?</p>
            <h2 className="text-2xl font-bold text-white mb-4">
              Talk to us about a custom Enterprise plan
            </h2>
            <p className="text-slate-400 text-sm mb-8">
              Dedicated proxy nodes, SLA guarantees, custom deal rules, and white-glove
              onboarding — tailored to your traffic.
            </p>
            <Link
              href="#"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-xl text-white"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                boxShadow: '0 0 20px rgba(99,102,241,0.4)',
              }}
            >
              Contact Sales <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default PricingPage;


// ======================================================================
// PRICING CARD SUB-COMPONENT
// ======================================================================

interface PlanFeature { text: string; included: boolean; }

interface Plan {
  name: string;
  price: string;
  unit: string;
  description: string;
  icon: React.ElementType;
  iconGradient: string;
  iconGlow: string;
  accentColor: string;
  features: PlanFeature[];
  cta: string;
  ctaHref: string;
  primary: boolean;
  badge: string | null;
}

const PricingCard: React.FC<{ plan: Plan }> = ({ plan }) => {
  const Icon = plan.icon;

  const cardStyle: React.CSSProperties = plan.primary
    ? {
        background: 'rgba(99,102,241,0.08)',
        border: '1px solid rgba(167,139,250,0.45)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 0 40px rgba(99,102,241,0.2), 0 0 0 1px rgba(167,139,250,0.15)',
      }
    : {
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      };

  return (
    <div
      className="relative flex flex-col rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
      style={cardStyle}
      onMouseEnter={(e) => {
        if (!plan.primary) {
          (e.currentTarget as HTMLElement).style.borderColor = `${plan.accentColor}44`;
          (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 48px ${plan.iconGlow}`;
        }
      }}
      onMouseLeave={(e) => {
        if (!plan.primary) {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        }
      }}
    >
      {/* "Most Popular" badge */}
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span
            className="px-4 py-1 text-xs font-bold rounded-full text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}
          >
            {plan.badge}
          </span>
        </div>
      )}

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
        style={{
          background: plan.iconGradient,
          boxShadow: `0 8px 24px ${plan.iconGlow}`,
        }}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>

      {/* Name + description */}
      <h2
        className="text-2xl font-extrabold mb-1"
        style={{ color: plan.accentColor }}
      >
        {plan.name}
      </h2>
      <p className="text-slate-400 text-sm leading-relaxed mb-6">{plan.description}</p>

      {/* Price */}
      <div className="mb-8 flex items-end gap-1">
        <span className="text-5xl font-extrabold text-white">{plan.price}</span>
        {plan.unit && (
          <span className="text-slate-500 font-medium pb-1">{plan.unit}</span>
        )}
      </div>

      {/* Divider */}
      <div
        className="h-px w-full mb-6"
        style={{
          background: `linear-gradient(90deg, transparent, ${plan.accentColor}44, transparent)`,
        }}
      />

      {/* Feature list */}
      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-3">
            {f.included ? (
              <Check
                className="h-4 w-4 flex-shrink-0 mt-0.5"
                style={{ color: plan.accentColor }}
              />
            ) : (
              <X className="h-4 w-4 text-slate-700 flex-shrink-0 mt-0.5" />
            )}
            <span
              className={`text-sm leading-relaxed ${
                f.included ? 'text-slate-300' : 'text-slate-600 line-through'
              }`}
            >
              {f.text}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href={plan.ctaHref}
        className="block w-full text-center py-3.5 rounded-xl font-bold text-sm transition-all duration-300"
        style={
          plan.primary
            ? {
                background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
                boxShadow: '0 0 24px rgba(99,102,241,0.45)',
                color: '#fff',
              }
            : {
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${plan.accentColor}44`,
                color: plan.accentColor,
              }
        }
        onMouseEnter={(e) => {
          if (plan.primary) {
            (e.currentTarget as HTMLElement).style.boxShadow =
              '0 0 36px rgba(99,102,241,0.65)';
          }
        }}
        onMouseLeave={(e) => {
          if (plan.primary) {
            (e.currentTarget as HTMLElement).style.boxShadow =
              '0 0 24px rgba(99,102,241,0.45)';
          }
        }}
      >
        {plan.cta}
      </Link>
    </div>
  );
};