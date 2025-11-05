import Head from 'next/head';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Zap, Code, LayoutDashboard, Settings } from 'lucide-react';
import Link from 'next/link';

// Helper component for feature blocks
const FeatureBlock: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300">
    <div className="text-primary-600 mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const FeaturesPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Features & Technology | BargainBaaS</title>
      </Head>

      <Navbar />
      <main className="pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <header className="text-center mb-16">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
              Intelligent Negotiation, API-First Design
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              BargainBaaS is engineered for high performance, enterprise-grade scalability, and guaranteed profit protection. It&apos;s the future of dynamic pricing.
            </p>
          </header>

          {/* 1. Hybrid Brain Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-primary-800 text-center mb-10">
              1. The Hybrid Negotiation Brain
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-gray-700 mb-4">
                  Our core engine combines the flexibility of **Natural Language Processing (NLP)** with the safety of **Rule-Based Logic**. This means the chatbot can understand a customer&apos;s unstructured message ("Can I get 10% off if I buy two?") while strictly adhering to your pre-set profit floor.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>**Intent Detection:** Accurately identifies negotiation intent, aggression levels, and specific price requests.</li>
                  <li>**Dynamic Response:** Generates human-like, custom counter-offers, not just static replies.</li>
                  <li>**Learning Loop:** Interaction logs feed back into optimization, continually refining response strategies.</li>
                </ul>
              </div>
              <div className="bg-gray-100 p-8 rounded-xl shadow-inner">
                <p className="text-gray-500 text-center">
                  [Diagram Placeholder: NLP & Rule Engine Flow]
                </p>
              </div>
            </div>
          </section>

          {/* 2. API-First Model Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-primary-800 text-center mb-10">
              2. The API-First Model (BaaS)
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureBlock
                icon={<Code className="w-8 h-8"/>}
                title="Universal Integration"
                description="Use secure RESTful endpoints to integrate with any eCommerce platform, irrespective of language or niche. It&apos;s a true plug-and-play solution."
              />
              <FeatureBlock
                icon={<Zap className="w-8 h-8"/>}
                title="Real-Time Performance"
                description="Low-latency API calls ensure the chatbot responds instantly, mimicking the speed required for successful human-to-human bargaining."
              />
              <FeatureBlock
                icon={<LayoutDashboard className="w-8 h-8"/>}
                title="Managed Service"
                description="We handle all the computational heavy lifting. You manage pricing rules and monitor analytics from your dedicated developer dashboard."
              />
            </div>
          </section>

          {/* 3. Success Protocol Section */}
          <section>
            <h2 className="text-3xl font-bold text-primary-800 text-center mb-10">
              3. The Success Protocol
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <FeatureBlock
                icon={<Settings className="w-8 h-8"/>}
                title="Configuration Control"
                description="You maintain full control over the bottom line. Set your minimum acceptable price and maximum discount percentage for every product category."
              />
              <FeatureBlock
                icon={<Settings className="w-8 h-8"/>}
                title="Seamless Deal Closure"
                description="Once a final price is agreed upon, the chatbot uses your provided webhook to pass the price back to your checkout cart instantly."
              />
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
};

export default FeaturesPage;