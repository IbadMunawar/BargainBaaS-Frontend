import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Check, X, Code, DollarSign, TrendingUp } from 'lucide-react';

// Define the pricing structure
const plans = [
  {
    name: 'Basic',
    price: '$99',
    unit: '/month',
    description: 'Perfect for small shops just starting with AI interaction.',
    features: [
      { text: 'Up to 5,000 Negotiated Sessions', included: true },
      { text: 'Standard NLP Engine', included: true },
      { text: 'Email Support', included: true },
      { text: 'Custom Rule-Based Engine (RBE)', included: false },
      { text: 'API Integration & Webhooks', included: false },
      { text: 'Dedicated Account Manager', included: false },
    ],
    cta: 'Start 7-Day Free Trial',
    primary: false,
  },
  {
    name: 'Pro',
    price: '$499',
    unit: '/month',
    description: 'Designed for growing businesses focused on maximizing conversion.',
    features: [
      { text: 'Up to 50,000 Negotiated Sessions', included: true },
      { text: 'Advanced Hybrid Brain (NLU + RBE)', included: true },
      { text: 'Dedicated Email & Chat Support', included: true },
      { text: 'Custom Rule-Based Engine (RBE)', included: true },
      { text: 'API Integration & Webhooks', included: true },
      { text: 'Advanced Analytics Dashboard', included: false },
    ],
    cta: 'Choose Pro',
    primary: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    unit: '',
    description: 'Volume discounts and dedicated infrastructure for high-traffic platforms.',
    features: [
      { text: 'Unlimited Negotiated Sessions', included: true },
      { text: 'Advanced Hybrid Brain (NLU + RBE)', included: true },
      { text: '24/7 Priority Phone Support', included: true },
      { text: 'Custom Rule-Based Engine (RBE)', included: true },
      { text: 'API Integration & Webhooks', included: true },
      { text: 'Dedicated Account Manager', included: true },
    ],
    cta: 'Contact Sales',
    primary: false,
  },
];

const PricingPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Pricing | BargainBaaS - Flexible AI Plans</title>
        <meta name="description" content="Find the perfect pricing plan for integrating the AI Bargaining Chatbot, from Basic to Enterprise." />
      </Head>

      <Navbar />

      <main className="py-20 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <DollarSign className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Simple, Transparent Pricing</h1>
            <p className="text-xl text-gray-600">Scale your conversion rates without compromising your margins.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`flex flex-col p-8 bg-white rounded-xl shadow-2xl transition duration-300 hover:scale-[1.02] 
                  ${plan.primary ? 'border-4 border-primary-800 ring-4 ring-primary-200' : 'border border-gray-200'}`}
              >
                
                {/* Header */}
                <h2 className={`text-3xl font-bold mb-2 ${plan.primary ? 'text-primary-800' : 'text-gray-900'}`}>
                  {plan.name}
                </h2>
                <p className="text-gray-500 mb-6 flex-grow">{plan.description}</p>

                {/* Price */}
                <div className="mb-8">
                  <span className={`text-5xl font-extrabold ${plan.primary ? 'text-primary-800' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  <span className="text-xl font-medium text-gray-600">{plan.unit}</span>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                      )}
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-400 line-through'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  href={plan.name === 'Enterprise' ? '#' : '/auth/signup'}
                  className={`w-full text-center py-3 rounded-lg font-semibold transition duration-300 
                    ${plan.primary 
                      ? 'bg-primary-800 text-white hover:bg-primary-900 shadow-lg' 
                      : 'bg-primary-100 text-primary-800 hover:bg-primary-200'
                    }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center text-gray-600">
            <TrendingUp className="h-6 w-6 inline-block mr-2 text-primary-600" />
            <span className="font-semibold">Need high-volume support?</span> Contact us for custom enterprise solutions.
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
};

export default PricingPage;