import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Bot, Zap, Network, ShieldCheck, Cpu, Code, BarChart3, TrendingUp } from 'lucide-react';

const FeaturesPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Features | BargainBaaS - AI Negotiation Technology</title>
        <meta name="description" content="Discover the core technology and protocols that power our AI-Based Bargaining Chatbot as a Service." />
      </Head>

      <Navbar />

      <main className="min-h-screen">
        <HeaderSection />
        <HybridBrainSection />
        <ApiFirstSection />
        <SuccessProtocolSection />
      </main>

      <Footer />
    </>
  );
};

export default FeaturesPage;

// ======================================================================
// Helper Components for Features Page
// ======================================================================

const HeaderSection: React.FC = () => (
    <section className="bg-primary-800 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                The Technology Behind Smart Negotiation
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
                Our AI-Based Bargaining Chatbot uses a three-pillar structure to deliver high conversion and guaranteed profit margin protection.
            </p>
        </div>
    </section>
);

// --- 1. Hybrid Brain Section ---
const HybridBrainSection: React.FC = () => (
    <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <Cpu className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900">1. The Hybrid Negotiation Brain</h2>
                <p className="text-lg text-gray-600 mt-2">Combining the best of rules and intelligence for flexible, safe bargaining.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
                <div>
                    <h3 className="text-2xl font-semibold text-primary-800 mb-4 flex items-center">
                        <Bot className="h-6 w-6 mr-3" /> Natural Language Understanding (NLU)
                    </h3>
                    <p className="text-gray-700 mb-4">
                        We leverage sophisticated NLP/NLU models to parse unstructured user input. This means the chatbot doesnt just look for keywords; it understands sentiment, intent (I want a lower price), and the exact monetary offer.
                    </p>
                    <ul className="space-y-2 text-gray-700 list-disc list-inside ml-4">
                        <li>Intent Detection: Recognizing negotiation type (e.g., initial bid, counter-offer acceptance).</li>
                        <li>Entity Extraction: Precisely pulling the numerical price requested by the buyer.</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-2xl font-semibold text-primary-800 mb-4 flex items-center">
                        <Zap className="h-6 w-6 mr-3" /> Rule-Based Engine (RBE)
                    </h3>
                    <p className="text-gray-700 mb-4">
                        The RBE is the non-negotiable component that protects your margins. Every single AI counter-offer is filtered and validated against pre-set rules defined by your business before it reaches the customer.
                    </p>
                    <ul className="space-y-2 text-gray-700 list-disc list-inside ml-4">
                        <li>Minimum Price Floor: Guarantees the product never sells below a specified profit threshold.</li>
                        <li>Negotiation Steps: Defines the number of rounds and discount increments/decrements.</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
);

// --- 2. API-First Model Section ---
const ApiFirstSection: React.FC = () => (
    <section className="py-20 bg-gray-50 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <Code className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900">2. The API-First Service Model</h2>
                <p className="text-lg text-gray-600 mt-2">BaaS is designed for universal integration and ultimate scalability across any domain.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-primary-500">
                    <Network className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">RESTful Integration</h3>
                    <p className="text-gray-600 text-sm">
                        Seamlessly connect your existing eCommerce platform (Shopify, WooCommerce, custom) via secure, documented RESTful endpoints.
                    </p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-primary-500">
                    <ShieldCheck className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Key Management</h3>
                    <p className="text-gray-600 text-sm">
                        Access is managed through unique API keys. This ensures usage monitoring, controlled billing, and data privacy for every client.
                    </p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-lg border-t-4 border-primary-500">
                    <BarChart3 className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Domain Agnostic</h3>
                    <p className="text-gray-600 text-sm">
                        Works for any product category—electronics, fashion, or home goods. Rules are customized per client, not constrained by niche.
                    </p>
                </div>
            </div>
        </div>
    </section>
);

// --- 3. Success Protocol Section ---
const SuccessProtocolSection: React.FC = () => (
    <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <TrendingUp className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900">3. The Conversion Success Protocol</h2>
                <p className="text-lg text-gray-600 mt-2">Our final step: converting the negotiation into a guaranteed sale.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="p-6 bg-primary-50 rounded-xl border-l-4 border-primary-400">
                    <h3 className="text-2xl font-semibold text-primary-800 mb-4">Deal Closure & Checkout</h3>
                    <p className="text-gray-700 mb-4">
                        Once the chatbot and the user reach an agreed-upon price (meeting the RBE minimum), the final discounted price is immediately sent back to the clients eCommerce platform via a single API callback.
                    </p>
                    <p className="text-gray-700 font-medium">
                        This minimizes cart abandonment by ensuring a smooth, instant transition from bargaining to the secure checkout process.
                    </p>
                </div>
                <div className="p-6 bg-gray-100 rounded-xl border-l-4 border-gray-400">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">Continuous Optimization</h3>
                    <p className="text-gray-700 mb-4">
                        Every negotiation log is captured and analyzed in the Database Layer. Over time, this data can be used to inform and refine the RBE and the AIs counter-offer strategies, maximizing profitability and customer satisfaction.
                    </p>
                </div>
            </div>
            
            <div className="mt-20 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to Integrate Smart Bargaining?</h3>
                <Link
                    href="/auth/signup"
                    className="inline-block px-10 py-3 text-lg font-bold rounded-xl text-white bg-primary-800 hover:bg-primary-900 transition duration-300 shadow-xl shadow-primary-300/50"
                >
                    Start Your Free Trial
                </Link>
            </div>
        </div>
    </section>
);
